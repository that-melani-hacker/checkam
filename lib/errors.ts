import type { ErrorCode } from '@/lib/types';

/** Owner: Fortunatus. Tests: C1-C5 */
export class VerifyError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
    // TODO(Fortunatus): add the HTTP status for each code (see the contract's error table)
  }
}

/** Owner: Fortunatus. Tests: C1-C5 */
export function errorResponse(err: unknown): Response {
  // TODO(Fortunatus): VerifyError -> { error: { code, message } } with its status; anything else -> 500 server_error
  throw new Error('Not implemented: errorResponse');
}
