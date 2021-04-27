-- CreateTable
CREATE TABLE "apiKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    FOREIGN KEY ("projectID") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
