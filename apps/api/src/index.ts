// apps/api/src/index.ts
import { serve } from "bun";
import { users } from "@shopee/db/schema";

console.log("API is starting...");

serve({
  port: 3001,
  fetch() {
    return new Response("API running");
  },
});
