import type { Check, VerifyResponse } from '@/lib/types';

/** Where the report button sends people. Replace with NAFDAC's official Med Safety link once confirmed. */
export const MED_SAFETY_URL = 'https://www.nafdac.gov.ng';

const label: Record<Check['field'], string> = {
  name: 'Name',
  strength: 'Strength',
  manufacturer: 'Manufacturer',
  nafdac_no: 'NAFDAC number',
  registration_status: 'Registration status',
  expiry: 'Expiry',
};

const verdictLine: Record<VerifyResponse['verdict'], string> = {
  no_red_flags: 'No red flags found: the readable details match NAFDAC’s record.',
  mismatch: 'Details on the pack don’t match NAFDAC’s record.',
  not_found: 'The NAFDAC number on the pack isn’t in NAFDAC’s records.',
  expired: 'The pack is expired, or its registration is not active.',
  unreadable: 'The pack photo couldn’t be read.',
};

/** Owner: Melani. Plain-text summary for sharing with NAFDAC (always in English). Test: D6 */
export function buildReportText(result: VerifyResponse): string {
  const { extracted: e, checks } = result;
  const failed = checks.filter((c) => c.ok === false);
  const lines = [
    'CheckAm report: possible problem with a medicine',
    '',
    verdictLine[result.verdict],
    '',
    `Medicine: ${[e.name, e.strength].filter(Boolean).join(' ') || 'not readable'}`,
    `NAFDAC number on pack: ${e.nafdac_no ?? 'not readable'}`,
    `Manufacturer on pack: ${e.manufacturer ?? 'not readable'}`,
    `Expiry on pack: ${e.expiry ?? 'not readable'}`,
    `Batch number: ${e.batch ?? 'not readable'}`,
  ];
  if (failed.length) {
    lines.push('', 'What doesn’t match:');
    failed.forEach((c) =>
      lines.push(`- ${label[c.field]}: pack shows ${c.pack ?? 'nothing readable'}, NAFDAC record shows ${c.registry ?? 'nothing'}`),
    );
  }
  lines.push(
    '',
    `Checked on: ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date())}`,
    'This is a concern, not proof of counterfeiting. I still have the pack and receipt.',
  );
  return lines.join('\n');
}

/** Owner: Melani. Copies the summary; falls back to a hidden textarea on older phones. Test: D6 */
export async function copyReport(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Owner: Melani. Opens the phone's share sheet (with the photo when supported), or falls back to copy. Test: D6 */
export async function shareReport(text: string, photo?: Blob): Promise<boolean> {
  if (typeof navigator.share !== 'function') return copyReport(text);
  try {
    const file = photo ? new File([photo], 'drug-pack.jpg', { type: photo.type || 'image/jpeg' }) : null;
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: 'CheckAm report', text, files: [file] });
    } else {
      await navigator.share({ title: 'CheckAm report', text });
    }
    return true;
  } catch (err) {
    // The user closing the share sheet isn't an error worth falling back on.
    if (err instanceof DOMException && err.name === 'AbortError') return false;
    return copyReport(text);
  }
}