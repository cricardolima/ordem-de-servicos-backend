-- CreateTable
CREATE TABLE "public"."client_address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "zip_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "client_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ClientAddress" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientAddress_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "client_address_neighborhood_idx" ON "public"."client_address"("neighborhood");

-- CreateIndex
CREATE INDEX "client_address_street_idx" ON "public"."client_address"("street");

-- CreateIndex
CREATE INDEX "_ClientAddress_B_index" ON "public"."_ClientAddress"("B");

-- AddForeignKey
ALTER TABLE "public"."_ClientAddress" ADD CONSTRAINT "_ClientAddress_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientAddress" ADD CONSTRAINT "_ClientAddress_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."client_address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
