-- AlterTable
ALTER TABLE `User` ADD COLUMN `layout` ENUM('row', 'col') NOT NULL DEFAULT 'row';
