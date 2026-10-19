import type { Check, Extracted, Nullable, RegistryRecord } from "@/lib/types";
import {
  normalizeCompany,
  normalizeName,
  normalizeStrength,
} from "@/lib/match/normalize";

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diag = tmp;
    }
  }
  return 1 - prev[b.length] / Math.max(a.length, b.length);
}

function closeEnough(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  // Every word of the shorter name appears (or nearly appears) in the longer one.
  const longWords = long.split(" ");
  const allWords = short
    .split(" ")
    .every((w) =>
      longWords.some(
        (lw) => lw === w || (w.length >= 5 && similarity(w, lw) >= 0.8),
      ),
    );
  if (short.length >= 4 && allWords) return true;
  return similarity(a, b) >= 0.85;
}

/** Owner: Fortunatus. True when two names match despite small reading errors. Test: A13 */
export function fuzzyMatch(a: Nullable<string>, b: Nullable<string>): boolean {
  const x = normalizeName(a);
  const y = normalizeName(b);
  if (!x || !y) return false;
  return closeEnough(x, y);
}

function companyMatch(a: Nullable<string>, b: Nullable<string>): boolean {
  const x = normalizeCompany(a);
  const y = normalizeCompany(b);
  if (!x || !y) return false;
  return closeEnough(x, y);
}

/** Owner: Fortunatus. Parses 'MM/YYYY' (also MM/YY, MM-YYYY, YYYY-MM). Null when unreadable. Tests: A7, A15 */
export function isPackExpired(
  expiry: Nullable<string>,
  today: Date,
): Nullable<boolean> {
  if (!expiry) return null;
  const s = expiry.trim();
  let month: number | null = null;
  let year: number | null = null;
  let m = s.match(/^(\d{1,2})\s*[/\-.]\s*(\d{2}|\d{4})$/);
  if (m) {
    month = Number(m[1]);
    year = m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2]);
  } else if ((m = s.match(/^(\d{4})\s*[/\-.]\s*(\d{1,2})$/))) {
    year = Number(m[1]);
    month = Number(m[2]);
  }
  if (!month || !year || month < 1 || month > 12) return null;
  // A pack is good until the end of its expiry month.
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth < today;
}

/** Owner: Fortunatus. Always returns six rows, in table order. Tests: A1-A9 */
export function buildChecks(
  extracted: Extracted,
  record: Nullable<RegistryRecord>,
  today: Date,
): Check[] {
  const compare = (
    pack: Nullable<string>,
    reg: Nullable<string>,
    match: (a: string, b: string) => boolean,
  ) => (record && pack ? match(pack, reg ?? "") : null);
  const expired = isPackExpired(extracted.expiry, today);

  return [
    {
      field: "name",
      pack: extracted.name,
      registry: record?.name ?? null,
      ok: compare(extracted.name, record?.name ?? null, fuzzyMatch),
    },
    {
      field: "strength",
      pack: extracted.strength,
      registry: record?.strength ?? null,
      ok: compare(
        extracted.strength,
        record?.strength ?? null,
        (a, b) => normalizeStrength(a) === normalizeStrength(b),
      ),
    },
    {
      field: "manufacturer",
      pack: extracted.manufacturer,
      registry: record?.manufacturer ?? null,
      ok: compare(
        extracted.manufacturer,
        record?.manufacturer ?? null,
        companyMatch,
      ),
    },
    {
      field: "nafdac_no",
      pack: extracted.nafdac_no,
      registry: record?.nafdac_no ?? null,
      ok: record ? true : null,
    },
    {
      field: "registration_status",
      pack: null,
      registry: record?.status ?? null,
      ok: record ? record.status === "active" : null,
    },
    {
      field: "expiry",
      pack: extracted.expiry,
      registry: null,
      ok: expired === null ? null : !expired,
    },
  ];
}
