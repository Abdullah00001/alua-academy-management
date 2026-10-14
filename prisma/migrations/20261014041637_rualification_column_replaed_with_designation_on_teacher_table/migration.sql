/*
  Warnings:

  - You are about to drop the column `qualification` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "qualification",
ADD COLUMN     "designation" TEXT;
