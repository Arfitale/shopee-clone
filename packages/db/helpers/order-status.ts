import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { db, type OrderStatus } from "..";
import { orders, orderItems } from "..";
import { eq } from "drizzle-orm";

export async function syncOrderStatus(
  tx: Parameters<(typeof db)["transaction"]>[0] extends (arg: infer T) => any
    ? T
    : never,
  orderId: string,
) {
  const items = await tx
    .select({ status: orderItems.status })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  if (items.length === 0) return;

  const statuses = items.map((i) => i.status);
  let orderStatus: OrderStatus = "PAID";

  if (statuses.every((s) => s === "CANCELLED")) {
    orderStatus = "CANCELLED";
  } else if (statuses.every((s) => s === "SHIPPED")) {
    orderStatus = "SHIPPED";
  } else if (statuses.some((s) => s !== "PENDING")) {
    orderStatus = "PROCESSING";
  } else {
    orderStatus = "PAID";
  }

  await tx
    .update(orders)
    .set({ status: orderStatus })
    .where(eq(orders.id, orderId));
}
