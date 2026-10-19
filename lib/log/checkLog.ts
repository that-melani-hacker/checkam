import type { Nullable, VerifyResponse } from "@/lib/types";

/** Owner: Fortunatus. Writes the anonymous row to Supabase and catches its own errors. Tests: F1-F5
 *  Stores only: verdict, NAFDAC number and name as read, failed fields, test tag. Never the photo. */
export async function saveCheckLog(
  response: VerifyResponse,
  tag: Nullable<string>,
): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return; // Logging is optional; skip quietly when not configured.

  try {
    const res = await fetch(`${url}/rest/v1/check_logs`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      signal: AbortSignal.timeout(3_000),
      body: JSON.stringify({
        verdict: response.verdict,
        nafdac_no: response.extracted.nafdac_no,
        product_name: response.extracted.name,
        failed_fields: response.checks
          .filter((c) => c.ok === false)
          .map((c) => c.field),
        tag,
      }),
    });
    if (!res.ok)
      console.warn(
        "[check-log] insert failed",
        res.status,
        await res.text().catch(() => ""),
      );
  } catch (err) {
    console.warn("[check-log] insert error", err);
  }
}
