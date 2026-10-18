import type { ClientErrorCode, Nullable, VerifyResponse } from '@/lib/types';

/** Owner: Vivian */
export class ClientError extends Error {
  constructor(public code: ClientErrorCode) {
    super(code);
  }
}

/** Owner: Vivian. Reads ?test=T07 or ?test=demo from the page link. */
export function getTestTag(): Nullable<string> {
  // TODO(Vivian)
  throw new Error('Not implemented: getTestTag');
}

/** Owner: Vivian. Shrinks the photo to a 1600px-wide JPEG before upload. */
export async function resizeImage(file: File, maxWidth = 1600): Promise<Blob> {
  // TODO(Vivian)
  throw new Error('Not implemented: resizeImage');
}

/** Owner: Vivian. Tests: D8-D10. POST to /api/verify; throw ClientError on error codes, after 20 seconds, or when offline. */
export async function verifyPhoto(photo: Blob, tag: Nullable<string>): Promise<VerifyResponse> {
  // TODO(Vivian)
  throw new Error('Not implemented: verifyPhoto');
}
