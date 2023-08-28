-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME NOT NULL,
    "nom" TEXT NOT NULL DEFAULT '',
    "cout" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "remarque" TEXT NOT NULL,
    "chalet_code" TEXT NOT NULL,
    CONSTRAINT "Reservation_chalet_code_fkey" FOREIGN KEY ("chalet_code") REFERENCES "Chalet" ("numero") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("chalet_code", "code", "cout", "date_debut", "date_fin", "remarque", "status") SELECT "chalet_code", "code", "cout", "date_debut", "date_fin", "remarque", "status" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
