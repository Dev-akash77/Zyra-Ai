ALTER TABLE "profile_table" ALTER COLUMN "gender" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profile_table" ALTER COLUMN "gender" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "register_table" ALTER COLUMN "phone_number" DROP NOT NULL;