/*
  Warnings:

  - A unique constraint covering the columns `[sequence]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rooms_sequence_key" ON "rooms"("sequence");
