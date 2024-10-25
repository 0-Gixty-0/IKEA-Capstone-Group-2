-- CreateTable
CREATE TABLE "_PostRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PostRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostRoles_AB_unique" ON "_PostRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PostRoles_B_index" ON "_PostRoles"("B");
