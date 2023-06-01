/*
  Warnings:

  - Added the required column `room_id` to the `room_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_messages" ADD COLUMN     "room_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "room_messages" ADD CONSTRAINT "room_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
