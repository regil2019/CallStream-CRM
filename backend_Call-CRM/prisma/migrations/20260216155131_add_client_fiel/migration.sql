-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ClientStatus" ADD VALUE 'KP_SENT';
ALTER TYPE "ClientStatus" ADD VALUE 'LPR_FOUND';
ALTER TYPE "ClientStatus" ADD VALUE 'CALLBACK';
ALTER TYPE "ClientStatus" ADD VALUE 'ORDER';
ALTER TYPE "ClientStatus" ADD VALUE 'BAD_NUMBER';
ALTER TYPE "ClientStatus" ADD VALUE 'NO_ANSWER';
ALTER TYPE "ClientStatus" ADD VALUE 'CLIENT';

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "responsible" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
