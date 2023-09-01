/*
  Warnings:

  - Added the required column `limite` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "categorie_code" INTEGER NOT NULL,
    "limite" REAL NOT NULL,
    "stock" REAL NOT NULL,
    CONSTRAINT "Article_categorie_code_fkey" FOREIGN KEY ("categorie_code") REFERENCES "Categorie" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("categorie_code", "code", "nom", "stock") SELECT "categorie_code", "code", "nom", "stock" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
