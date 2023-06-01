/*
  Warnings:

  - The primary key for the `room_messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `room_messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "room_messages" DROP CONSTRAINT "room_messages_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "room_messages_pkey" PRIMARY KEY ("id");
