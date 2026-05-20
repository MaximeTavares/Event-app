/*
  Warnings:

  - Added the required column `status` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Slot` ADD COLUMN `status` ENUM('OPEN', 'FULL', 'CLOSED', 'CANCELLED') NOT NULL;
