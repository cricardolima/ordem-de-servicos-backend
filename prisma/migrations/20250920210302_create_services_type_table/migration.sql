/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."services_type" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "service_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "services_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "services_type_service_code_idx" ON "public"."services_type"("service_code");

-- CreateIndex
CREATE INDEX "services_type_service_name_idx" ON "public"."services_type"("service_name");
