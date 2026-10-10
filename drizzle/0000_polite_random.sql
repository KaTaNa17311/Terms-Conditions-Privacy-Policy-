CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`step` integer DEFAULT 1 NOT NULL,
	`category` text,
	`details` text DEFAULT '{}' NOT NULL,
	`plan_id` text,
	`cycle` text,
	`status` text DEFAULT 'setup' NOT NULL,
	`trial_start` text,
	`trial_end` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `consents` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`terms_version` text NOT NULL,
	`privacy_version` text NOT NULL,
	`accepted_at` text NOT NULL,
	`terms_accepted` integer NOT NULL,
	`privacy_acknowledged` integer NOT NULL,
	`notice_version` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `accounts`(`user_id`) ON UPDATE no action ON DELETE no action
);
