import { createHash } from "node:crypto";
import type { Nullable, VerifyResponse } from "@/lib/types";
import saved from "@/data/demo-responses.json";

const responses = saved as Record<string, VerifyResponse>;

export function hashImage(image: Buffer): string {
  return createHash("sha256").update(image).digest("hex");
}

/** Owner: Fortunatus. Returns the saved answer for a known demo photo, only when DEMO_MODE=true. Test: C6
 *  Only matches the exact same file. Save answers with: npm run demo:save -- path/to/photo.jpg */
export function getDemoResponse(image: Buffer): Nullable<VerifyResponse> {
  if (process.env.DEMO_MODE !== "true") return null;
  return responses[hashImage(image)] ?? null;
}
