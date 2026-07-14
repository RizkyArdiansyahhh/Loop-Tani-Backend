-- CreateEnum (PostgreSQL doesn't support IF NOT EXISTS for types, use DO block)
DO $$ BEGIN
  CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable: Add avatarPublicId to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarPublicId" TEXT;

-- AlterTable: Add new columns to SellerProfile
ALTER TABLE "SellerProfile"
  ADD COLUMN IF NOT EXISTS "storeSlug"    TEXT,
  ADD COLUMN IF NOT EXISTS "province"     TEXT,
  ADD COLUMN IF NOT EXISTS "city"         TEXT,
  ADD COLUMN IF NOT EXISTS "postalCode"   TEXT,
  ADD COLUMN IF NOT EXISTS "phone"        TEXT,
  ADD COLUMN IF NOT EXISTS "logoUrl"      TEXT,
  ADD COLUMN IF NOT EXISTS "logoPublicId" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add status column separately to reference the new type
ALTER TABLE "SellerProfile" ADD COLUMN IF NOT EXISTS "status" "SellerStatus" NOT NULL DEFAULT 'PENDING';

-- Add createdAt
ALTER TABLE "SellerProfile" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Fill storeSlug with a unique value before adding constraint
UPDATE "SellerProfile" SET "storeSlug" = 'store-' || "id" WHERE "storeSlug" IS NULL;

-- AlterTable: Make storeSlug NOT NULL
ALTER TABLE "SellerProfile" ALTER COLUMN "storeSlug" SET NOT NULL;

-- CreateIndex
DO $$ BEGIN
  CREATE UNIQUE INDEX "SellerProfile_storeSlug_key" ON "SellerProfile"("storeSlug");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX "SellerProfile_storeSlug_idx" ON "SellerProfile"("storeSlug");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX "SellerProfile_status_idx" ON "SellerProfile"("status");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;
