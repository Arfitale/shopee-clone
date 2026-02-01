ALTER TYPE "public"."order_status" ADD VALUE 'PROCESSING' BEFORE 'CANCELLED';--> statement-breakpoint
ALTER TYPE "public"."order_status" ADD VALUE 'SHIPPED' BEFORE 'CANCELLED';