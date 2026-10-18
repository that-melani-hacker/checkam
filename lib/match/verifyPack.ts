import type { Extracted, VerifyResponse } from '@/lib/types';

/** Owner: Fortunatus. Tests: A1-A15 */
export function verifyPack(extracted: Extracted, today: Date = new Date()): VerifyResponse {
  // TODO(Fortunatus): findRecord -> buildChecks -> decideVerdict -> buildExplanation. Pure: no network, no database, no AI.
  throw new Error('Not implemented: verifyPack');
}
