/*
  Warnings:

  - You are about to drop the column `registered_at` on the `Participation` table. All the data in the column will be lost.
  - Added the required column `id` to the `Participation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Participation` DROP COLUMN `registered_at`,
    ADD COLUMN `cancelled_at` DATETIME(0) NULL,
    ADD COLUMN `decision_at` DATETIME(0) NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
