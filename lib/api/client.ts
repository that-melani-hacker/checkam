import type { ClientErrorCode, ErrorCode, Nullable, VerifyResponse } from '@/lib/types';

/** Owner: Vivian */
export class ClientError extends Error {
  constructor(public code: ClientErrorCode) {
    super(code);
  }
}

const TIMEOUT_MS = 20_000; // contract: timeout error after 20 seconds (test D10)
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // contract: uploads stay under 4 MB
const SERVER_CODES: ErrorCode[] = ['no_image', 'bad_file_type', 'file_too_large', 'rate_limited', 'ai_unavailable', 'server_error'];

/** Owner: Vivian. Reads ?test=T07 or ?test=demo from the page link. */
export function getTestTag(): Nullable<string> {
  if (typeof window === 'undefined') return null;
  const tag = new URLSearchParams(window.location.search).get('test');
  if (!tag) return null;
  // Only T01–T20 or demo; anything else is ignored, same as the server
  return /^T(0[1-9]|1\d|20)$/.test(tag) || tag === 'demo' ? tag : null;
}

/** Decodes the photo the right way up (phone photos store rotation in EXIF). */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // fall through to <img>, which some older Safari versions need
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', quality),
  );
}

/** Owner: Vivian. Shrinks the photo to a 1600px-wide JPEG before upload.
 *  Re-encoding as JPEG also turns iPhone HEIC photos into a type the server accepts. */
export async function resizeImage(file: File, maxWidth = 1600): Promise<Blob> {
  let image: ImageBitmap | HTMLImageElement;
  try {
    image = await decode(file);
  } catch {
    throw new ClientError('bad_file_type'); // the browser can't read it, so it isn't a usable photo
  }

  const scale = Math.min(1, maxWidth / image.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ClientError('server_error');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  if ('close' in image) image.close();

  let blob = await toJpeg(canvas, 0.85);
  if (blob.size > MAX_UPLOAD_BYTES) blob = await toJpeg(canvas, 0.6); // rare, but try once more smaller
  if (blob.size > MAX_UPLOAD_BYTES) throw new ClientError('file_too_large');
  return blob;
}

/** Owner: Vivian. Tests: D8-D10. POST to /api/verify; throw ClientError on error codes, after 20 seconds, or when offline. */
export async function verifyPhoto(photos: Blob | Blob[], tag: Nullable<string>): Promise<VerifyResponse> {
  if (!navigator.onLine) throw new ClientError('offline');

  // One `image` field per photo: different sides of the same pack.
  const body = new FormData();
  (Array.isArray(photos) ? photos : [photos]).forEach((photo, i) => body.append('image', photo, `pack-${i + 1}.jpg`));
  if (tag) body.append('tag', tag);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    // No Content-Type header: the browser adds the multipart boundary itself
    res = await fetch('/api/verify', { method: 'POST', body, signal: controller.signal });
  } catch {
    if (controller.signal.aborted) throw new ClientError('timeout');
    throw new ClientError(navigator.onLine ? 'server_error' : 'offline');
  } finally {
    clearTimeout(timer);
  }

  if (res.ok) {
    try {
      return (await res.json()) as VerifyResponse;
    } catch {
      throw new ClientError('server_error');
    }
  }

  // Non-200: { error: { code, message } }
  let code: ErrorCode = 'server_error';
  try {
    const data = await res.json();
    if (SERVER_CODES.includes(data?.error?.code)) code = data.error.code;
  } catch {
    // body wasn't JSON: keep server_error
  }
  throw new ClientError(code);
}