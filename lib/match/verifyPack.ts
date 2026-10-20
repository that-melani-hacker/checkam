import type { Extracted, RegistryRecord, VerifyResponse } from "@/lib/types";
import { REGISTRY, findRecord } from "@/lib/match/registry";
import { buildChecks } from "@/lib/match/compare";
import { decideVerdict } from "@/lib/match/verdict";
import { buildExplanation } from "@/lib/match/explain";

/** Owner: Fortunatus. Lookup, checks, verdict, explanation. Pure: no network, no database, no AI. Tests: A1-A15
 *  `today` and `records` are optional so tests can fix the date and pass fixture data. */
export function verifyPack(
  extracted: Extracted,
  today: Date = new Date(),
  records: RegistryRecord[] = REGISTRY,
): VerifyResponse {
  const record = extracted.nafdac_no
    ? findRecord(extracted.nafdac_no, records)
    : null;
  const checks = buildChecks(extracted, record, today);
  const verdict = decideVerdict(extracted, record, checks);
  return {
    verdict,
    extracted,
    registry: verdict === "unreadable" ? null : record,
    checks,
    explanation: buildExplanation(verdict, checks),
  };
}
