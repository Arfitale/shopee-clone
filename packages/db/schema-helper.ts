import { timestamp } from "drizzle-orm/pg-core";

export const createdAtNow = timestamp("created_at", {
  withTimezone: true,
  mode: "date",
})
  .defaultNow()
  .notNull();
export const updatedAtNow = timestamp("updated_at", {
  withTimezone: true,
  mode: "date",
})
  .defaultNow()
  .notNull();
