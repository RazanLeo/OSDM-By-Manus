CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`bidId` int NOT NULL,
	`employerId` int NOT NULL,
	`freelancerId` int NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`deliveryTime` int NOT NULL,
	`deliveryTimeUnit` enum('hours','days','weeks') NOT NULL DEFAULT 'days',
	`status` enum('active','in_progress','delivered','completed','cancelled','disputed') NOT NULL DEFAULT 'active',
	`transactionId` varchar(255),
	`startDate` timestamp,
	`deliveryDate` timestamp,
	`completedDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`freelancerId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`deliveryTime` int NOT NULL,
	`deliveryTimeUnit` enum('hours','days','weeks') NOT NULL DEFAULT 'days',
	`proposalAr` text NOT NULL,
	`proposalEn` text NOT NULL,
	`attachments` text,
	`status` enum('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_bids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`icon` varchar(255),
	`parentId` int,
	`order` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employerId` int NOT NULL,
	`categoryId` int NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`budget` int NOT NULL,
	`budgetType` enum('fixed','hourly') NOT NULL DEFAULT 'fixed',
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`duration` int,
	`durationUnit` enum('hours','days','weeks','months') NOT NULL DEFAULT 'days',
	`experienceLevel` enum('beginner','intermediate','expert') NOT NULL DEFAULT 'intermediate',
	`skills` text,
	`attachments` text,
	`views` int NOT NULL DEFAULT 0,
	`bidsCount` int NOT NULL DEFAULT 0,
	`status` enum('draft','open','in_progress','completed','cancelled','closed') NOT NULL DEFAULT 'draft',
	`isActive` boolean NOT NULL DEFAULT true,
	`deadline` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`receiverId` int NOT NULL,
	`subject` varchar(500),
	`body` text NOT NULL,
	`attachments` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`bodyAr` text,
	`bodyEn` text,
	`type` enum('info','success','warning','error') NOT NULL DEFAULT 'info',
	`link` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`icon` varchar(255),
	`parentId` int,
	`order` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`transactionId` varchar(255),
	`status` enum('pending','completed','refunded','cancelled') NOT NULL DEFAULT 'pending',
	`downloadCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`categoryId` int NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`coverImage` text NOT NULL,
	`images` text,
	`demoUrl` text,
	`tags` text,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`fileType` varchar(100),
	`downloads` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`rating` int NOT NULL DEFAULT 0,
	`reviewsCount` int NOT NULL DEFAULT 0,
	`status` enum('draft','pending','active','rejected','suspended') NOT NULL DEFAULT 'draft',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`avatar` text,
	`bio` text,
	`phone` varchar(20),
	`country` varchar(100),
	`city` varchar(100),
	`address` text,
	`website` varchar(255),
	`facebook` varchar(255),
	`twitter` varchar(255),
	`linkedin` varchar(255),
	`instagram` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewerId` int NOT NULL,
	`revieweeId` int NOT NULL,
	`itemId` int NOT NULL,
	`itemType` enum('product','service','job') NOT NULL,
	`rating` int NOT NULL,
	`commentAr` text,
	`commentEn` text,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seller_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` text,
	`companyLogo` text,
	`companyDescription` text,
	`taxNumber` varchar(50),
	`commercialRegister` varchar(50),
	`bankName` varchar(100),
	`bankAccountNumber` varchar(50),
	`iban` varchar(50),
	`isVerified` boolean NOT NULL DEFAULT false,
	`rating` int NOT NULL DEFAULT 0,
	`totalSales` int NOT NULL DEFAULT 0,
	`totalEarnings` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seller_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `seller_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `service_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`icon` varchar(255),
	`parentId` int,
	`order` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`amount` int NOT NULL,
	`dueDate` timestamp,
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`packageId` int,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`deliveryTime` int NOT NULL,
	`deliveryTimeUnit` enum('hours','days','weeks') NOT NULL DEFAULT 'days',
	`status` enum('pending','in_progress','delivered','revision','completed','cancelled','disputed') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`startDate` timestamp,
	`deliveryDate` timestamp,
	`completedDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`price` int NOT NULL,
	`deliveryTime` int NOT NULL,
	`deliveryTimeUnit` enum('hours','days','weeks') NOT NULL DEFAULT 'days',
	`features` text,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`categoryId` int NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`startingPrice` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`deliveryTime` int NOT NULL,
	`deliveryTimeUnit` enum('hours','days','weeks') NOT NULL DEFAULT 'days',
	`coverImage` text NOT NULL,
	`images` text,
	`tags` text,
	`views` int NOT NULL DEFAULT 0,
	`ordersCount` int NOT NULL DEFAULT 0,
	`rating` int NOT NULL DEFAULT 0,
	`reviewsCount` int NOT NULL DEFAULT 0,
	`status` enum('draft','pending','active','rejected','suspended') NOT NULL DEFAULT 'draft',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdrawal','purchase','sale','refund','commission') NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`balanceBefore` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`referenceId` varchar(255),
	`referenceType` varchar(50),
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`pendingBalance` int NOT NULL DEFAULT 0,
	`totalEarnings` int NOT NULL DEFAULT 0,
	`totalWithdrawals` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `withdrawals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`method` enum('bank_transfer','paypal','stripe') NOT NULL,
	`bankName` varchar(100),
	`bankAccountNumber` varchar(50),
	`iban` varchar(50),
	`paypalEmail` varchar(320),
	`status` enum('pending','processing','completed','rejected','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `withdrawals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('individual','company') DEFAULT 'individual' NOT NULL;