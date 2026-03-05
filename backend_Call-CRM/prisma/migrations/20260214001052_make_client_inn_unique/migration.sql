/*
  Warnings:

  - A unique constraint covering the columns `[inn]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_inn_key" ON "Client"("inn");
