-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "LeadWarmth" AS ENUM ('CURIOUS', 'INTERESTED', 'READY_NOW');

-- CreateEnum
CREATE TYPE "NextStep" AS ENUM ('SEND_PRICING', 'CALL_TOMORROW', 'BOOK_MEETING', 'JUST_A_NOTE');

-- CreateEnum
CREATE TYPE "CatalogType" AS ENUM ('PRODUCT', 'SERVICE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "personName" TEXT,
    "companyName" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "nextStep" "NextStep" NOT NULL,
    "warmth" "LeadWarmth" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CatalogType" NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "expectedMarginPct" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogItem_name_type_key" ON "CatalogItem"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_leadId_key" ON "Opportunity"("leadId");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
