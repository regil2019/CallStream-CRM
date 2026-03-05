/*
  Warnings:

  - You are about to drop the column `customerId` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the `CallLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Script` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'UNREACHABLE');

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_clientId_fkey";

-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_projectId_fkey";

-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Script" DROP CONSTRAINT "Script_projectId_fkey";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "customerId",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "status" "ClientStatus" NOT NULL DEFAULT 'NEW';

-- DropTable
DROP TABLE "CallLog";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Script";

-- DropEnum
DROP TYPE "CustomerStatus";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
