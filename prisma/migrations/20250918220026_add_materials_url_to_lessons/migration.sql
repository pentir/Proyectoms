/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `productId` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `active` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `grantedAt` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `revokedAt` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `entitlements` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `durationSec` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product_maps` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `product_maps` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product_maps` table. All the data in the column will be lost.
  - You are about to alter the column `productId` on the `product_maps` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `completedAt` on the `progress` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `progress` table. All the data in the column will be lost.
  - You are about to drop the column `lastPositionSec` on the `progress` table. All the data in the column will be lost.
  - You are about to drop the column `secondsWatched` on the `progress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `progress` table. All the data in the column will be lost.
  - Made the column `description` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `entitlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleId` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `product_maps` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_clerkId_key";

-- DropIndex
DROP INDEX "users_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER,
    "sku" TEXT,
    "heroUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_courses" ("createdAt", "description", "heroUrl", "id", "isPublished", "productId", "sku", "slug", "title", "updatedAt") SELECT "createdAt", "description", "heroUrl", "id", "isPublished", "productId", "sku", "slug", "title", "updatedAt" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");
CREATE TABLE "new_entitlements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "entitlements_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_entitlements" ("courseId", "id") SELECT "courseId", "id" FROM "entitlements";
DROP TABLE "entitlements";
ALTER TABLE "new_entitlements" RENAME TO "entitlements";
CREATE UNIQUE INDEX "entitlements_courseId_userId_key" ON "entitlements"("courseId", "userId");
CREATE TABLE "new_lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "bunnyPath" TEXT NOT NULL,
    "materialsUrl" TEXT,
    "order" INTEGER NOT NULL,
    "isFreePreview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lessons" ("bunnyPath", "createdAt", "id", "isFreePreview", "order", "slug", "title", "updatedAt") SELECT "bunnyPath", "createdAt", "id", "isFreePreview", "order", "slug", "title", "updatedAt" FROM "lessons";
DROP TABLE "lessons";
ALTER TABLE "new_lessons" RENAME TO "lessons";
CREATE TABLE "new_product_maps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "product_maps_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_product_maps" ("courseId", "id", "productId") SELECT "courseId", "id", "productId" FROM "product_maps";
DROP TABLE "product_maps";
ALTER TABLE "new_product_maps" RENAME TO "product_maps";
CREATE UNIQUE INDEX "product_maps_courseId_productId_key" ON "product_maps"("courseId", "productId");
CREATE TABLE "new_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_progress" ("id", "lessonId", "userId") SELECT "id", "lessonId", "userId" FROM "progress";
DROP TABLE "progress";
ALTER TABLE "new_progress" RENAME TO "progress";
CREATE UNIQUE INDEX "progress_lessonId_userId_key" ON "progress"("lessonId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
