import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .csv, .xls, .xlsx format allowed!"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
