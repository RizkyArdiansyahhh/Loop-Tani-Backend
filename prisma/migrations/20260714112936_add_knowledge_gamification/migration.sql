-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('ARTICLE', 'VIDEO');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContentCategory" AS ENUM ('limbah', 'olahan', 'alat');

-- CreateEnum
CREATE TYPE "ContentDifficulty" AS ENUM ('pemula', 'menengah');

-- CreateEnum
CREATE TYPE "PointTransactionType" AS ENUM ('EARN', 'REDEEM');

-- CreateEnum
CREATE TYPE "PointTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateTable
CREATE TABLE "KnowledgeContent" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "ContentCategory" NOT NULL,
    "difficulty" "ContentDifficulty" NOT NULL,
    "imageUrl" TEXT,
    "rewardPoint" INTEGER NOT NULL DEFAULT 20,
    "estimatedReadingMinutes" INTEGER,
    "videoDuration" INTEGER,
    "cloudinaryPublicId" TEXT,
    "secureUrl" TEXT,
    "thumbnailUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPointAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoint" INTEGER NOT NULL DEFAULT 0,
    "lifetimePoint" INTEGER NOT NULL DEFAULT 0,
    "tier" "PointTier" NOT NULL DEFAULT 'BRONZE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPointAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "PointTransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "sourceId" TEXT,
    "sourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "scrollPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activeReadingSeconds" INTEGER NOT NULL DEFAULT 0,
    "watchedPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeContent_slug_key" ON "KnowledgeContent"("slug");

-- CreateIndex
CREATE INDEX "KnowledgeContent_authorId_idx" ON "KnowledgeContent"("authorId");

-- CreateIndex
CREATE INDEX "KnowledgeContent_status_idx" ON "KnowledgeContent"("status");

-- CreateIndex
CREATE INDEX "KnowledgeContent_slug_idx" ON "KnowledgeContent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserPointAccount_userId_key" ON "UserPointAccount"("userId");

-- CreateIndex
CREATE INDEX "UserPointAccount_userId_idx" ON "UserPointAccount"("userId");

-- CreateIndex
CREATE INDEX "PointTransaction_userId_idx" ON "PointTransaction"("userId");

-- CreateIndex
CREATE INDEX "LearningProgress_userId_idx" ON "LearningProgress"("userId");

-- CreateIndex
CREATE INDEX "LearningProgress_contentId_idx" ON "LearningProgress"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_userId_contentId_key" ON "LearningProgress"("userId", "contentId");

-- AddForeignKey
ALTER TABLE "KnowledgeContent" ADD CONSTRAINT "KnowledgeContent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPointAccount" ADD CONSTRAINT "UserPointAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "KnowledgeContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
