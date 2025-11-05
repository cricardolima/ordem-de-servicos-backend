/*
  Warnings:

  - A unique constraint covering the columns `[street,number,neighborhood,zip_code]` on the table `client_address` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "client_address_street_number_neighborhood_zip_code_key" ON "client_address"("street", "number", "neighborhood", "zip_code");
