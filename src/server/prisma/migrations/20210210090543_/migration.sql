/*
  Warnings:

  - You are about to alter the column `organization_id` on the `project` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL
);
INSERT INTO "new_project" ("id", "name", "organization_id") SELECT "id", "name", "organization_id" FROM "project";
DROP TABLE "project";
ALTER TABLE "new_project" RENAME TO "project";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
