-- AlterTable
ALTER TABLE "Game" ADD COLUMN "puzzleDate" TEXT;
ALTER TABLE "Game" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Game_userId_puzzleDate_key" ON "Game"("userId", "puzzleDate");
