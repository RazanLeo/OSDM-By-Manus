ALTER TABLE `disputes` MODIFY COLUMN `disputeType` enum('service_order','contract','product_order') NOT NULL;--> statement-breakpoint
ALTER TABLE `disputes` ADD `counterpartyReply` text;--> statement-breakpoint
ALTER TABLE `wallets` ADD `escrowHeld` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wallets` ADD `pendingWithdrawal` int DEFAULT 0 NOT NULL;