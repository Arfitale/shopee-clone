ALTER TABLE "auth_providers" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_providers_provider_user_unique" ON "auth_providers" USING btree ("provider","provider_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_providers_user_provider_unique" ON "auth_providers" USING btree ("user_id","provider");