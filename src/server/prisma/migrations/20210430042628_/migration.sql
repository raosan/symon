/*
  Warnings:

  - You are about to drop the column `monika_id` on the `monika` table. All the data in the column will be lost.
  - You are about to drop the column `monika_ip_address` on the `monika` table. All the data in the column will be lost.
  - Added the required column `instance_id` to the `monika` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip_address` to the `monika` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monika_id" INTEGER NOT NULL,
    "config_version" TEXT NOT NULL,
    "monika_instance_id" TEXT NOT NULL,
    FOREIGN KEY ("monika_id") REFERENCES "monika" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reportData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "probe_id" TEXT NOT NULL,
    "request_method" TEXT NOT NULL,
    "request_url" TEXT NOT NULL,
    "request_header" TEXT,
    "request_body" TEXT,
    "response_status" INTEGER NOT NULL,
    "response_header" TEXT,
    "response_body" TEXT,
    "response_time" INTEGER NOT NULL,
    "response_size" INTEGER,
    FOREIGN KEY ("report_id") REFERENCES "report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_monika" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "config" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "instance_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL
);

INSERT INTO "new_monika" ("id", "config", "version", "instance_id", "ip_address")
    SELECT "id", "config", "version", "monika_id", "monika_ip_address"
    FROM "monika";
DROP TABLE "monika";
ALTER TABLE "new_monika" RENAME TO "monika";
CREATE UNIQUE INDEX "monika.version_unique" ON "monika"("version");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
