import { Worker, Job } from "bullmq";
import prisma from "../utils/prisma";
import fs from "fs";
import csvParser from "csv-parser";
import { isValidRussianPhone, isValidInn } from "../utils/validation";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null,
};

const detectSeparator = (filePath: string): string => {
  const buffer = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
  const firstLine = buffer.split("\n")[0].replace(/^\uFEFF/, ""); // Remove BOM if exists
  const commas = (firstLine.match(/,/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;
  return semicolons > commas ? ";" : ",";
};

const processClients = async (data: {
  filePath: string;
  projectId?: string;
}) => {
  const { filePath, projectId } = data;
  const clientsToCreate: any[] = [];
  let duplicates = 0;
  let successful = 0;
  let totalRows = 0;

  // Skip statistics
  const skips = {
    total: 0,
    invalidPhone: 0,
    invalidInn: 0,
    missingFields: 0,
  };

  const separator = detectSeparator(filePath);
  console.log(`Detected separator for ${filePath}: "${separator}"`);

  return new Promise<any>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator }))
      .on("data", (row: any) => {
        totalRows++;

        // 1️⃣ Normalização real do objeto (Garante chaves limpas e sem caracteres invisíveis)
        const normalizedRow: Record<string, string> = {};
        for (const key in row) {
          const cleanKey = key
            .replace(/\uFEFF/g, "") // Remove BOM
            .replace(/[^\x20-\x7E\u0400-\u04FF]/g, "") // Remove non-printable/control chars
            .trim()
            .toLowerCase();
          normalizedRow[cleanKey] = String(row[key] ?? "").trim();
        }

        // 2️⃣ Mapeamento FUZZY de campos (Detecta variações como "тел", "телефон", "phone")
        const findValue = (
          rowObj: Record<string, string>,
          searchTerms: string[],
        ) => {
          const keys = Object.keys(rowObj);
          const foundKey = keys.find((k) =>
            searchTerms.some((term) => k.includes(term)),
          );
          return foundKey ? rowObj[foundKey] : undefined;
        };

        const phoneValue = findValue(normalizedRow, [
          "тел",
          "phone",
          "номер",
          "tel",
        ]);
        const nameValue =
          findValue(normalizedRow, [
            "имя",
            "name",
            "фио",
            "fio",
            "nome",
            "fullname",
          ]) || "Unnamed";
        const emailValue = findValue(normalizedRow, [
          "email",
          "mail",
          "почт",
          "емейл",
        ]);
        const innValue = findValue(normalizedRow, ["инн", "inn", "tax"]);
        const companyValue = findValue(normalizedRow, [
          "комп",
          "company",
          "org",
          "empresa",
          "организац",
        ]);
        const regionValue = findValue(normalizedRow, [
          "рег",
          "city",
          "гор",
          "regi",
        ]);
        const tagsValue = findValue(normalizedRow, ["тег", "tag", "метка"]);
        const responsibleValue = findValue(normalizedRow, [
          "отв",
          "менедж",
          "resp",
          "owner",
        ]);
        const notesValue = findValue(normalizedRow, [
          "заметк",
          "note",
          "коммент",
          "descr",
        ]);

        // 🔍 LOG DE DIAGNÓSTICO (Primeiras 3 linhas para depuração)
        if (totalRows <= 3) {
          console.log(`--- [DEBUG ROW ${totalRows}] ---`);
          console.log("RAW KEYS:", Object.keys(row));
          console.log("NORMALIZED KEYS:", Object.keys(normalizedRow));
          console.log("MAP RESULT -> Phone:", phoneValue, "Name:", nameValue);
          console.log("----------------------------");
        }

        // 3️⃣ Sanitização
        let cleanPhone = phoneValue?.replace(/[^\d+]/g, "") || "";
        if (cleanPhone.length === 11 && cleanPhone.startsWith("8")) {
          cleanPhone = "+7" + cleanPhone.substring(1);
        }
        if (cleanPhone.length === 11 && cleanPhone.startsWith("7")) {
          cleanPhone = "+" + cleanPhone;
        }
        if (cleanPhone.length === 10 && cleanPhone.startsWith("9")) {
          cleanPhone = "+7" + cleanPhone;
        }

        const cleanInn = innValue?.replace(/\D/g, "") || null;

        // 4️⃣ Validação
        if (!cleanPhone) {
          skips.total++;
          skips.missingFields++;
          console.log(
            `[SKIP] Row ${totalRows}: Missing phone field. Normalized row:`,
            normalizedRow,
          );
          return;
        }

        if (!isValidRussianPhone(cleanPhone)) {
          skips.total++;
          skips.invalidPhone++;
          console.log(
            `[SKIP] Row ${totalRows}: Invalid phone format "${cleanPhone}"`,
          );
          return;
        }

        if (cleanInn && !isValidInn(cleanInn)) {
          skips.invalidInn++;
          // Non-blocking: just log and continue with null INN instead of skipping the lead
          console.log(
            `[WARN] Row ${totalRows}: Invalid INN "${cleanInn}". Field ignored, client will be imported.`,
          );
          clientsToCreate.push({
            phone: cleanPhone,
            name: nameValue.trim(),
            inn: null, // Wipe the bad INN but keep the client
            company: companyValue?.trim() || null,
            email: emailValue?.trim() || null,
            region: regionValue?.trim() || null,
            tags: tagsValue
              ? tagsValue
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [],
            responsible: responsibleValue?.trim() || null,
            notes: notesValue?.trim() || null,
            projectId,
          });
          return;
        }

        clientsToCreate.push({
          phone: cleanPhone,
          name: nameValue.trim(),
          inn: cleanInn,
          company: companyValue?.trim() || null,
          email: emailValue?.trim() || null,
          region: regionValue?.trim() || null,
          tags: tagsValue
            ? tagsValue
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          responsible: responsibleValue?.trim() || null,
          notes: notesValue?.trim() || null,
          projectId,
        });
      })
      .on("end", async () => {
        console.log(`CSV Parsing finished. Total rows: ${totalRows}`);
        console.log(
          `Valid for process: ${clientsToCreate.length}, Skips:`,
          skips,
        );

        if (totalRows > 0 && clientsToCreate.length === 0) {
          console.error(
            "CRITICAL: 100% of rows were skipped. Likely header mapping issue.",
          );
        }

        // 🔋 Inserção Otimizada (createMany)
        if (clientsToCreate.length > 0) {
          try {
            const result = await prisma.client.createMany({
              data: clientsToCreate,
              skipDuplicates: true,
            });
            successful = result.count;
            duplicates = clientsToCreate.length - successful;
          } catch (error: any) {
            console.error("Error in createMany:", error);
          }
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve({
          successful,
          duplicates,
          skipped: skips.total,
          skipDetails: skips,
          totalProcessed: totalRows,
        });
      })
      .on("error", (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
  });
};

export const uploadWorker = new Worker(
  "uploads",
  async (job: Job) => {
    console.log(`Processing job ${job.id} (${job.name})`);
    return await processClients(job.data);
  },
  { connection },
);
