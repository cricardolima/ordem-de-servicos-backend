-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services_invoice" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "root_cause" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "service_type_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "services_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ProfessionalsToServicesInvoice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfessionalsToServicesInvoice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "services_invoice_service_type_id_idx" ON "public"."services_invoice"("service_type_id");

-- CreateIndex
CREATE INDEX "services_invoice_client_id_idx" ON "public"."services_invoice"("client_id");

-- CreateIndex
CREATE INDEX "_ProfessionalsToServicesInvoice_B_index" ON "public"."_ProfessionalsToServicesInvoice"("B");

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services_invoice" ADD CONSTRAINT "services_invoice_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "public"."services_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services_invoice" ADD CONSTRAINT "services_invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services_invoice" ADD CONSTRAINT "services_invoice_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services_invoice" ADD CONSTRAINT "services_invoice_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services_invoice" ADD CONSTRAINT "services_invoice_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProfessionalsToServicesInvoice" ADD CONSTRAINT "_ProfessionalsToServicesInvoice_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProfessionalsToServicesInvoice" ADD CONSTRAINT "_ProfessionalsToServicesInvoice_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."services_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
