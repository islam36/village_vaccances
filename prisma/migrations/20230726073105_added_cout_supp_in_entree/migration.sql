/*
  Warnings:

  - Added the required column `cout_supp` to the `Entree` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entree" (
    "entree_code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_code" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "quantite" REAL NOT NULL,
    "prix_unitaire" REAL NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "remarque" TEXT NOT NULL DEFAULT '',
    "cout_supp" REAL NOT NULL,
    "prix_total" REAL NOT NULL,
    CONSTRAINT "Entree_article_code_fkey" FOREIGN KEY ("article_code") REFERENCES "Article" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Entree" ("article_code", "date", "entree_code", "fournisseur", "prix_total", "prix_unitaire", "quantite", "remarque") SELECT "article_code", "date", "entree_code", "fournisseur", "prix_total", "prix_unitaire", "quantite", "remarque" FROM "Entree";
DROP TABLE "Entree";
ALTER TABLE "new_Entree" RENAME TO "Entree";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
