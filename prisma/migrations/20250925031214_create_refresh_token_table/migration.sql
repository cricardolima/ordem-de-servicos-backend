/*
  Warnings:

  - A unique constraint covering the columns `[registration]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_registration_key" ON "public"."professionals"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "users_registration_key" ON "public"."users"("registration");

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
