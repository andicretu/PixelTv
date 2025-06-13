-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "vimeoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "ageRecommendation" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_vimeoId_key" ON "Video"("vimeoId");
