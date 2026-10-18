import type { Check, Extracted, Nullable, RegistryRecord, Verdict } from '@/lib/types';

/** Owner: Fortunatus. Tests: A1-A11 */
export function decideVerdict(extracted: Extracted, record: Nullable<RegistryRecord>, checks: Check[]): Verdict {
  // TODO(Fortunatus): verdict order: unreadable -> not_found -> expired -> mismatch -> no_red_flags
  throw new Error('Not implemented: decideVerdict');
}
