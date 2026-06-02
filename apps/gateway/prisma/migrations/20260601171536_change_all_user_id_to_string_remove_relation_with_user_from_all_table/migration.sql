/*
  Warnings:

  - The primary key for the `User_profile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Announcement` DROP FOREIGN KEY `Announcement_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `Availability` DROP FOREIGN KEY `Availability_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_uploaded_by_fkey`;

-- DropForeignKey
ALTER TABLE `Feedback` DROP FOREIGN KEY `Feedback_from_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Feedback` DROP FOREIGN KEY `Feedback_to_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Participation` DROP FOREIGN KEY `Participation_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Recognition` DROP FOREIGN KEY `Recognition_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Token` DROP FOREIGN KEY `Token_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_profile` DROP FOREIGN KEY `User_profile_user_id_fkey`;

-- AlterTable
ALTER TABLE `Announcement` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Availability` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Feedback` MODIFY `from_user_id` VARCHAR(191) NOT NULL,
    MODIFY `to_user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Message` MODIFY `sender_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notification` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Participation` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Recognition` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Token` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User_profile` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`);
