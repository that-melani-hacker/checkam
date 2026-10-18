import type { Check, Extracted, Nullable, RegistryRecord } from '@/lib/types';

/** Owner: Fortunatus. Tests: A13 */
export function fuzzyMatch(a: Nullable<string>, b: Nullable<string>): boolean {
  // TODO(Fortunatus): true when two names match despite small reading errors (Fuse.js or similar)
  throw new Error('Not implemented: fuzzyMatch');
}

/** Owner: Fortunatus. Tests: A7, A15 */
export function isPackExpired(expiry: Nullable<string>, today: Date): Nullable<boolean> {
  // TODO(Fortunatus): parse 'MM/YYYY'; null when unreadable
  throw new Error('Not implemented: isPackExpired');
}

/** Owner: Fortunatus. Tests: A1-A9 */
export function buildChecks(extracted: Extracted, record: Nullable<RegistryRecord>, today: Date): Check[] {
  // TODO(Fortunatus): always six rows, in FIELD_ORDER
  throw new Error('Not implemented: buildChecks');
}
