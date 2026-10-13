-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "relationWithChild" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';
