import type { Upload } from '@/lib/types';

/** Owner: Fortunatus. Tests: C1-C3 */
export async function parseUpload(req: Request): Promise<Upload> {
  // TODO(Fortunatus): read 'image' and optional 'tag' from multipart form data; throw VerifyError('no_image' | 'bad_file_type' | 'file_too_large'). Only accept tag T01-T20 or 'demo'.
  throw new Error('Not implemented: parseUpload');
}
