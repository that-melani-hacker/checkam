import type { Nullable } from "@/lib/types";

const toDigits = (s: string) =>
  s.replace(/[OQ]/g, "0").replace(/[IL]/g, "1").replace(/S/g, "5");

/** Owner: Fortunatus. Fixes spaces, dashes and letter O for zero, e.g. "a4 - 582l" -> "A4-5821". Test: A12 */
export function normalizeNafdacNo(raw: Nullable<string>): Nullable<string> {
  if (!raw) return null;
  const s = raw
    .toUpperCase()
    .replace(/NAFDAC|REG(ISTRATION)?|NO\.?|NRN|[:#]/g, "")
    .replace(/\s+/g, "")
    .replace(/[‐‑‒–—_./]/g, "-");
  if (!s) return null;
  // Optional prefix letter (not O), 1-3 digit group, dash, 3-6 digit group.
  const m = s.match(/^([A-NP-Z]?)([0-9OQIL]{1,3})-*([0-9OQILS]{3,6})$/);
  if (!m) return s;
  return `${m[1]}${toDigits(m[2])}-${toDigits(m[3])}`;
}

/** Owner: Fortunatus. Turns "500 mg" and "500MG" into "500mg". Test: A14 */
export function normalizeStrength(raw: Nullable<string>): Nullable<string> {
  if (!raw) return null;
  const s = raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/milligrams?|mgs/g, "mg")
    .replace(/micrograms?|µg/g, "mcg")
    .replace(/(\d),(\d)/g, "$1.$2");
  return s || null;
}

const FORM_WORDS =
  /\b(tablets?|tabs?|caplets?|capsules?|caps|syrup|suspension|injection|cream|ointment|gel|drops|film[- ]?coated|dispersible|b\.?p\.?|u\.?s\.?p\.?)\b/g;
const COMPANY_WORDS =
  /\b(ltd|limited|plc|inc|co|company|nig|nigeria|industries|industry|pharmaceuticals?|pharma|laboratories|labs?|healthcare|group)\b/g;

/** Lowercases and strips strengths, dosage-form words and punctuation, for name comparison. */
export function normalizeName(raw: Nullable<string>): Nullable<string> {
  if (!raw) return null;
  const s = raw
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(mg|g|mcg|ml|iu|%)(\s*\/\s*\d*\s*(ml|g))?/g, " ")
    .replace(FORM_WORDS, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s || null;
}

/** Lowercases and strips company suffixes like Ltd, Plc and Pharmaceuticals, for manufacturer comparison. */
export function normalizeCompany(raw: Nullable<string>): Nullable<string> {
  const s = normalizeName(raw);
  if (!s) return null;
  const out = s.replace(COMPANY_WORDS, " ").replace(/\s+/g, " ").trim();
  return out || s;
}
