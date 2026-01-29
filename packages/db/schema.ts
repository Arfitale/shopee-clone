import {
  pgTable,
  uuid,
  text,
  pgEnum,
  timestamp,
  uniqueIndex,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createdAtNow } from "./schema-helper";

/* ENUMS */
export const userRoleEnum = pgEnum("user_role", ["USER", "SELLER"]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
]);
export const oauthProviderEnum = pgEnum("oauth_provider", [
  "GOOGLE",
  "GITHUB",
  "FACEBOOK",
]);

/* USERS */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("USER"),
  createdAt: createdAtNow,
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // Lucia uses string IDs for sessions
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const authProviders = pgTable(
  "auth_providers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    provider: text("provider").notNull(), // google, github, etc
    providerUserId: text("provider_user_id").notNull(),

    createdAt: createdAtNow,
  },
  (t) => [
    // Prevent same provider account from being linked twice
    uniqueIndex("auth_providers_provider_user_unique").on(
      t.provider,
      t.providerUserId,
    ),

    // Optional: prevent user from linking same provider twice
    uniqueIndex("auth_providers_user_provider_unique").on(t.userId, t.provider),
  ],
);

// /* PRODUCTS */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: createdAtNow,
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: createdAtNow,
  },
  (table) => [
    uniqueIndex("cart_user_product_unique").on(table.userId, table.productId),
  ],
);

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
export type AuthProvider = typeof authProviders.$inferSelect;
export type NewAuthProvider = typeof authProviders.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
