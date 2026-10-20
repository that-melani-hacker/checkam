import type { Nullable, RegistryRecord } from "@/lib/types";
import data from "@/data/greenbook-sample.json";
import { normalizeNafdacNo } from "@/lib/match/normalize";

/** Records saved from NAFDAC's Greenbook. */
export const REGISTRY: RegistryRecord[] = data as RegistryRecord[];

/** Owner: Fortunatus. Looks the number up in data/greenbook-sample.json. Tests: A6, A12
 *  `records` is optional so tests can pass their own fixture data. */
export function findRecord(
  nafdacNo: string,
  records: RegistryRecord[] = REGISTRY,
): Nullable<RegistryRecord> {
  const wanted = normalizeNafdacNo(nafdacNo);
  if (!wanted) return null;
  return records.find((r) => normalizeNafdacNo(r.nafdac_no) === wanted) ?? null;
}
