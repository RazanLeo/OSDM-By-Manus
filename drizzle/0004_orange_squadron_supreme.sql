CREATE TABLE `contract_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contractId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`dueDate` timestamp,
	`order` int NOT NULL DEFAULT 0,
	`status` enum('pending','in_progress','completed','paid') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contract_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversation_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`message` text NOT NULL,
	`attachments` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversation_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`participant1` int NOT NULL,
	`participant2` int NOT NULL,
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupon_usages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`couponId` int NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`discountAmount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupon_usages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`discountType` enum('percentage','fixed') NOT NULL,
	`discountValue` int NOT NULL,
	`minPurchase` int NOT NULL DEFAULT 0,
	`maxDiscount` int,
	`usageLimit` int,
	`usedCount` int NOT NULL DEFAULT 0,
	`validFrom` timestamp NOT NULL,
	`validTo` timestamp NOT NULL,
	`applicableFor` enum('all','products','services','jobs') NOT NULL DEFAULT 'all',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int,
	`contractId` int,
	`milestoneId` int,
	`deliveryType` enum('service_order','contract','milestone') NOT NULL,
	`deliveredBy` int NOT NULL,
	`deliveredTo` int NOT NULL,
	`messageAr` text,
	`messageEn` text,
	`files` text,
	`status` enum('pending_review','revision_requested','accepted','rejected') NOT NULL DEFAULT 'pending_review',
	`revisionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disputes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int,
	`contractId` int,
	`disputeType` enum('service_order','contract') NOT NULL,
	`raisedBy` int NOT NULL,
	`againstUserId` int NOT NULL,
	`reason` text NOT NULL,
	`description` text NOT NULL,
	`evidence` text,
	`status` enum('open','under_review','resolved','closed') NOT NULL DEFAULT 'open',
	`resolution` text,
	`resolvedBy` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorite_sellers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sellerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorite_sellers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`freelancerId` int NOT NULL,
	`bidId` int,
	`coverLetterAr` text NOT NULL,
	`coverLetterEn` text NOT NULL,
	`proposedAmount` int NOT NULL,
	`proposedDeliveryTime` int NOT NULL,
	`milestones` text,
	`attachments` text,
	`status` enum('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`coverImage` text NOT NULL,
	`images` text,
	`projectUrl` text,
	`tags` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_bundles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`coverImage` text NOT NULL,
	`originalPrice` int NOT NULL,
	`bundlePrice` int NOT NULL,
	`discount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`productIds` text NOT NULL,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_bundles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`purchaseId` int NOT NULL,
	`userId` int NOT NULL,
	`licenseKey` varchar(255) NOT NULL,
	`licenseType` enum('personal','commercial','extended') NOT NULL,
	`activationLimit` int NOT NULL DEFAULT 1,
	`activationCount` int NOT NULL DEFAULT 0,
	`expiryDate` timestamp,
	`status` enum('active','suspended','expired') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_licenses_licenseKey_unique` UNIQUE(`licenseKey`)
);
--> statement-breakpoint
CREATE TABLE `product_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`planType` enum('monthly','yearly') NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`status` enum('active','cancelled','expired') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`autoRenew` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seller_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`buyerId` int NOT NULL,
	`orderId` int NOT NULL,
	`communicationRating` int NOT NULL,
	`qualityRating` int NOT NULL,
	`deliveryRating` int NOT NULL,
	`overallRating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seller_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_addons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`descriptionAr` text,
	`descriptionEn` text,
	`price` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'SAR',
	`deliveryTime` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_addons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(500) NOT NULL,
	`category` enum('technical','billing','account','general') NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`description` text NOT NULL,
	`attachments` text,
	`status` enum('open','in_progress','waiting_response','resolved','closed') NOT NULL DEFAULT 'open',
	`assignedTo` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`attachments` text,
	`isStaffReply` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_certifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`issuer` varchar(255) NOT NULL,
	`issueDate` timestamp NOT NULL,
	`expiryDate` timestamp,
	`credentialId` varchar(255),
	`credentialUrl` text,
	`certificateFile` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_certifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skillNameAr` varchar(100) NOT NULL,
	`skillNameEn` varchar(100) NOT NULL,
	`proficiencyLevel` enum('beginner','intermediate','advanced','expert') NOT NULL,
	`yearsOfExperience` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` int NOT NULL,
	`itemType` enum('product','service','bundle') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
