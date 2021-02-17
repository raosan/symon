-- CreateTable
CREATE TABLE "probe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "probeName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "runMode" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    FOREIGN KEY ("projectID") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
