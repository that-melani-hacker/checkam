import type { VerifyResponse } from '@/lib/types';

/** Owner: Melani. Tests: D6 */
export function buildReportText(result: VerifyResponse): string {
  // TODO(Melani): plain-text summary for the report
  throw new Error('Not implemented: buildReportText');
}

/** Owner: Melani. Tests: D6 */
export async function copyReport(text: string): Promise<boolean> {
  // TODO(Melani): navigator.clipboard.writeText
  throw new Error('Not implemented: copyReport');
}

/** Owner: Melani. Tests: D6 */
export async function shareReport(text: string, photo?: Blob): Promise<boolean> {
  // TODO(Melani): navigator.share with fallback to copyReport
  throw new Error('Not implemented: shareReport');
}
