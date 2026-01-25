import {
  pgTable,
  uuid,
  text,
  integer,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { createdAtNow } from "./schema-helper";

/* ENUMS */
export const userRoleEnum = pgEnum("user_role", ["USER", "SELLER"]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
]);

/* USERS */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("USER"),
  createdAt: createdAtNow,
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// /* PRODUCTS */
// export const products = pgTable("products", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   sellerId: uuid("seller_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   name: text("name").notNull(),
//   description: text("description"),
//   price: integer("price").notNull(),
//   stock: integer("stock").notNull(),
//   isActive: integer("is_active").default(1).notNull(),
//   createdAt: createdAtNow,
// });

// /* ORDERS */
// export const orders = pgTable("orders", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   buyerId: uuid("buyer_id")
//     .notNull()
//     .references(() => users.id),
//   totalAmount: integer("total_amount").notNull(),
//   status: orderStatusEnum("status").notNull(),
//   createdAt: createdAtNow,
// });

// /* ORDER ITEMS */
// export const orderItems = pgTable("order_items", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   orderId: uuid("order_id")
//     .notNull()
//     .references(() => orders.id, { onDelete: "cascade" }),
//   productId: uuid("product_id")
//     .notNull()
//     .references(() => products.id),
//   productName: text("product_name").notNull(),
//   price: integer("price").notNull(),
//   quantity: integer("quantity").notNull(),
// });

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
