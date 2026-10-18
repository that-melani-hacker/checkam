import type { Nullable } from '@/lib/types';

/** Owner: Fortunatus. Tests: A12 */
export function normalizeNafdacNo(raw: Nullable<string>): Nullable<string> {
  // TODO(Fortunatus): fix spaces, dashes and letter O for zero
  throw new Error('Not implemented: normalizeNafdacNo');
}

/** Owner: Fortunatus. Tests: A14 */
export function normalizeStrength(raw: Nullable<string>): Nullable<string> {
  // TODO(Fortunatus): turn '500 mg' and '500MG' into '500mg'
  throw new Error('Not implemented: normalizeStrength');
}
