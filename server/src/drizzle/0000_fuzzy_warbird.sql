CREATE TYPE "public"."profile_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."register_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "profile_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"register_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"avatar_url" text,
	"bio" text,
	"email" varchar(100) NOT NULL,
	"verified" boolean DEFAULT false,
	"suspend" boolean DEFAULT false,
	"gender" "profile_gender" DEFAULT 'male' NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profile_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "register_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"role" "register_role" DEFAULT 'user' NOT NULL,
	"otp" varchar(6),
	"phone_number" varchar(15) NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "register_table_email_unique" UNIQUE("email"),
	CONSTRAINT "register_table_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "profile_table" ADD CONSTRAINT "profile_table_register_id_register_table_id_fk" FOREIGN KEY ("register_id") REFERENCES "public"."register_table"("id") ON DELETE cascade ON UPDATE no action;