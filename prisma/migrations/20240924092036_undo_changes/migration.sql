/*
  Warnings:

  - You are about to drop the `MovieProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieProgress" DROP CONSTRAINT "MovieProgress_movieId_fkey";

-- DropForeignKey
ALTER TABLE "MovieProgress" DROP CONSTRAINT "MovieProgress_userId_fkey";

-- DropTable
DROP TABLE "MovieProgress";
