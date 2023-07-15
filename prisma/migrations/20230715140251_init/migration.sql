-- CreateTable
CREATE TABLE "Article" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "stock" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Categorie" (
    "nom_categorie" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Entree" (
    "entree_code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_code" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "quantite" REAL NOT NULL,
    "prix_unitaire" REAL NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "remarque" TEXT NOT NULL DEFAULT '',
    "prix_total" REAL NOT NULL,
    CONSTRAINT "Entree_article_code_fkey" FOREIGN KEY ("article_code") REFERENCES "Article" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sortie" (
    "sortie_code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_code" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "quantite" REAL NOT NULL,
    "remarque" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Sortie_article_code_fkey" FOREIGN KEY ("article_code") REFERENCES "Article" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
