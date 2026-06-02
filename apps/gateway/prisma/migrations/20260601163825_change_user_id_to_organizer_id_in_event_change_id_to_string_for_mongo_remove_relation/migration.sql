/*
  Warnings:

  - You are about to drop the column `user_id` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizer_id,address_id,start_date]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizer_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_user_id_fkey`;

-- DropIndex
DROP INDEX `Event_start_date_end_date_user_id_idx` ON `Event`;

-- DropIndex
DROP INDEX `Event_user_id_address_id_start_date_key` ON `Event`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `user_id`,
    ADD COLUMN `organizer_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Event_start_date_end_date_organizer_id_idx` ON `Event`(`start_date`, `end_date`, `organizer_id`);

-- CreateIndex
CREATE INDEX `Event_organizer_id_idx` ON `Event`(`organizer_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Event_organizer_id_address_id_start_date_key` ON `Event`(`organizer_id`, `address_id`, `start_date`);
