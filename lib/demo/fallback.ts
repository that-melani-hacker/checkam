import type { Nullable, VerifyResponse } from '@/lib/types';

/** Owner: Fortunatus. Tests: C6 */
export function getDemoResponse(image: Buffer): Nullable<VerifyResponse> {
  // TODO(Fortunatus): when process.env.DEMO_MODE === 'true', hash the image and return the saved answer for our demo photos; otherwise return null
  throw new Error('Not implemented: getDemoResponse');
}
