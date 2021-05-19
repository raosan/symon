/*
  Warnings:

  - You are about to drop the `reportData` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE "reportRequests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "probe_id" TEXT NOT NULL,
    "probe_name" TEXT,
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

-- CreateTable
CREATE TABLE "reportRequestAlerts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_request_id" INTEGER NOT NULL,
    "alert" TEXT NOT NULL,
    FOREIGN KEY ("report_request_id") REFERENCES "reportRequests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reportNotifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "probe_id" TEXT NOT NULL,
    "probe_name" TEXT,
    "alert" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    FOREIGN KEY ("report_id") REFERENCES "report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "reportData";
PRAGMA foreign_keys=on;
