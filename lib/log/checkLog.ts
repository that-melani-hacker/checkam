import type { Nullable, VerifyResponse } from '@/lib/types';

/** Owner: Fortunatus. Tests: F1-F5 */
export async function saveCheckLog(response: VerifyResponse, tag: Nullable<string>): Promise<void> {
  // TODO(Fortunatus): insert one anonymous CheckLog row (no photo, no personal data); catch every error, never throw
  throw new Error('Not implemented: saveCheckLog');
}
