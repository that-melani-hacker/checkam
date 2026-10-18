import type { Extracted } from '@/lib/types';

export const EXTRACTION_PROMPT = `You read medicine packaging from a photo. Copy only what is printed.
Return JSON with keys: name, strength, manufacturer, nafdac_no, expiry, batch.
Use null for anything you can't read clearly. Never guess or fill in.`;

/** Owner: Fortunatus. Tests: B1-B8, C4, C5 */
export async function extractPackDetails(image: Buffer, mimeType: string): Promise<Extracted> {
  // TODO(Fortunatus): send image + EXTRACTION_PROMPT to the vision API (key from process.env), temperature 0,
  // JSON output only; throw VerifyError('ai_unavailable') or VerifyError('rate_limited'); return parseExtraction(text)
  throw new Error('Not implemented: extractPackDetails');
}

/** Owner: Fortunatus. Tests: B3, B5 */
export function parseExtraction(raw: string): Extracted {
  // TODO(Fortunatus): strip code fences, JSON.parse, validate with zod; any invalid field becomes null
  throw new Error('Not implemented: parseExtraction');
}
