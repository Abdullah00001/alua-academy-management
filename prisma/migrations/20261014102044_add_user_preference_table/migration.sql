-- CreateTable
CREATE TABLE "UserPreference" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "language" "Language" NOT NULL DEFAULT 'EN',
  "notificationsPush" BOOLEAN NOT NULL DEFAULT true,
  "notificationsEmail" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- BACKFILL: copy existing user.language into UserPreference rows
INSERT INTO "UserPreference" ("id", "userId", "language", "notificationsPush", "notificationsEmail", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  id,
  language,
  true,
  true,
  now(),
  now()
FROM "User";

-- DropColumn
ALTER TABLE "User" DROP COLUMN "language";
