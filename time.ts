import { headers } from "next/headers";

export function nowMs() {
  if (process.env.TEST_MODE === "1") {
    const h = headers();
    const fake = h.get("x-test-now-ms");
    if (fake) return Number(fake);
  }
  return Date.now();
}
