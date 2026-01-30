CREATE TYPE "public"."order_item_status" AS ENUM('PENDING', 'PACKED', 'SHIPPED');--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "status" "order_item_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;