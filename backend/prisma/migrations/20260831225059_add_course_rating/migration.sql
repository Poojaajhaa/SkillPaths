-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "bestseller" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Course" ("category", "courseName", "description", "duration", "id", "level", "price") SELECT "category", "courseName", "description", "duration", "id", "level", "price" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_courseName_key" ON "Course"("courseName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
