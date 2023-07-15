/*
  Warnings:

  - You are about to drop the column `categorie` on the `Article` table. All the data in the column will be lost.
  - The primary key for the `Categorie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `categorie_code` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Categorie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "categorie_code" INTEGER NOT NULL,
    "stock" REAL NOT NULL,
    CONSTRAINT "Article_categorie_code_fkey" FOREIGN KEY ("categorie_code") REFERENCES "Categorie" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("code", "nom", "stock") SELECT "code", "nom", "stock" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE TABLE "new_Categorie" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_categorie" TEXT NOT NULL
);
INSERT INTO "new_Categorie" ("nom_categorie") SELECT "nom_categorie" FROM "Categorie";
DROP TABLE "Categorie";
ALTER TABLE "new_Categorie" RENAME TO "Categorie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
