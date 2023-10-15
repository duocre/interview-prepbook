ALTER TABLE questions ADD `explanation` text;--> statement-breakpoint
ALTER TABLE questions ADD `options` text;--> statement-breakpoint
ALTER TABLE questions ADD `answer` text;--> statement-breakpoint
ALTER TABLE questions ADD `answer_explanation` text;--> statement-breakpoint
ALTER TABLE `questions` DROP COLUMN `done`;