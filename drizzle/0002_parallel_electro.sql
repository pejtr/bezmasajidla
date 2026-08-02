CREATE TABLE `socialPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipeId` int NOT NULL,
	`platform` enum('facebook','instagram') NOT NULL,
	`status` enum('scheduled','publishing','published','failed') NOT NULL DEFAULT 'scheduled',
	`caption` text NOT NULL,
	`imageUrl` text,
	`linkUrl` text NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`publishedAt` timestamp,
	`externalPostId` varchar(255),
	`attempts` int NOT NULL DEFAULT 0,
	`lastError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socialPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `socialPosts_recipeId_platform_uidx` UNIQUE(`recipeId`,`platform`)
);
--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_itemType_itemSlug_uidx` UNIQUE(`userId`,`itemType`,`itemSlug`);--> statement-breakpoint
CREATE INDEX `socialPosts_status_scheduledFor_idx` ON `socialPosts` (`status`,`scheduledFor`);--> statement-breakpoint
CREATE INDEX `favorites_userId_idx` ON `favorites` (`userId`);--> statement-breakpoint
CREATE INDEX `favorites_itemSlug_idx` ON `favorites` (`itemSlug`);--> statement-breakpoint
CREATE INDEX `reviews_userId_idx` ON `reviews` (`userId`);--> statement-breakpoint
CREATE INDEX `reviews_restaurantSlug_idx` ON `reviews` (`restaurantSlug`);