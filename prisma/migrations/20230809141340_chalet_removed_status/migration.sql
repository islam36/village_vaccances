/*
  Warnings:

  - You are about to drop the column `status` on the `Chalet` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chalet" (
    "numero" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "cout" REAL NOT NULL
);
INSERT INTO "new_Chalet" ("cout", "numero", "type") SELECT "cout", "numero", "type" FROM "Chalet";
DROP TABLE "Chalet";
ALTER TABLE "new_Chalet" RENAME TO "Chalet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
