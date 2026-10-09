/*
  Warnings:

  - The `recommendations` column on the `Analysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `learningRoadmap` column on the `Analysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "recommendations",
ADD COLUMN     "recommendations" JSONB NOT NULL DEFAULT '[]',
DROP COLUMN "learningRoadmap",
ADD COLUMN     "learningRoadmap" JSONB NOT NULL DEFAULT '{}';
