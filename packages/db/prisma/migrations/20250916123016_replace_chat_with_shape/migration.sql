/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropTable
DROP TABLE "public"."Chat";

-- CreateTable
CREATE TABLE "public"."Shape" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shapeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "strokeColor" TEXT NOT NULL DEFAULT '#000000',
    "fillColor" TEXT NOT NULL DEFAULT 'transparent',
    "strokeWidth" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "opacity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "angle" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "data" JSONB,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shape_roomId_idx" ON "public"."Shape"("roomId");

-- CreateIndex
CREATE INDEX "Shape_userId_idx" ON "public"."Shape"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Shape_roomId_shapeId_key" ON "public"."Shape"("roomId", "shapeId");

-- AddForeignKey
ALTER TABLE "public"."Shape" ADD CONSTRAINT "Shape_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
