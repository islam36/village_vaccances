-- CreateTable
CREATE TABLE "Chalet" (
    "numero" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cout" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Reservation" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME NOT NULL,
    "cout" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "remarque" TEXT NOT NULL,
    "chalet_code" TEXT NOT NULL,
    CONSTRAINT "Reservation_chalet_code_fkey" FOREIGN KEY ("chalet_code") REFERENCES "Chalet" ("numero") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "type_piece" TEXT NOT NULL,
    "numero_piece" TEXT NOT NULL,
    "code_res" INTEGER NOT NULL,
    CONSTRAINT "Client_code_res_fkey" FOREIGN KEY ("code_res") REFERENCES "Reservation" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
