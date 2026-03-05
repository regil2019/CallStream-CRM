-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
