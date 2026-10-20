import type {
  Check,
  Extracted,
  Nullable,
  RegistryRecord,
  Verdict,
} from "@/lib/types";
import { normalizeNafdacNo } from "@/lib/match/normalize";

const COMPARED = new Set(["name", "strength", "manufacturer"]);

/** Owner: Fortunatus. Verdict order: unreadable -> not_found -> expired -> mismatch -> no_red_flags. Tests: A1-A11 */
export function decideVerdict(
  extracted: Extracted,
  record: Nullable<RegistryRecord>,
  checks: Check[],
): Verdict {
  const readable = [
    extracted.name,
    extracted.strength,
    extracted.manufacturer,
    extracted.nafdac_no,
    extracted.expiry,
  ].filter(Boolean).length;
  if (!normalizeNafdacNo(extracted.nafdac_no) || readable < 2)
    return "unreadable";
  if (!record) return "not_found";
  const byField = (f: string) => checks.find((c) => c.field === f);
  if (
    byField("expiry")?.ok === false ||
    byField("registration_status")?.ok === false
  )
    return "expired";
  if (checks.some((c) => COMPARED.has(c.field) && c.ok === false))
    return "mismatch";
  return "no_red_flags";
}
