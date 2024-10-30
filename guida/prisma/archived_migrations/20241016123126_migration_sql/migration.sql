-- CreateTable
CREATE TABLE "_UserReadingList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserReadingList_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserReadingList_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserReadingList_AB_unique" ON "_UserReadingList"("A", "B");

-- CreateIndex
CREATE INDEX "_UserReadingList_B_index" ON "_UserReadingList"("B");
