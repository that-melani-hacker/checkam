import type { Field, Lang } from '@/lib/types';

/** Owner: Melani. Report-screen copy in English and Pidgin, from the Figma frames. */
type Copy = Record<Lang, string>;

export const reportUi = {
  back: { en: 'Back to result', pcm: 'Go back to result' },
  eyebrow: { en: 'REPORT TO NAFDAC', pcm: 'REPORT AM TO NAFDAC' },
  title: { en: 'Help flag a concern.', pcm: 'Help us flag am.' },
  intro: {
    en: 'Your summary is ready. Open NAFDAC’s Med Safety app to report officially, or share and copy the details.',
    pcm: 'Your summary don ready. Open NAFDAC Med Safety app to report am officially, or share and copy the details.',
  },
  draft: { en: 'Draft only · Not submitted', pcm: 'Na draft · We never submit am' },
  summary: { en: 'Report summary', pcm: 'Report summary' },
  photo: { en: 'Photo of the pack, attached to this report', pcm: 'The pack photo dey inside this report' },
  nafdacOnPack: { en: 'NAFDAC number on pack', pcm: 'NAFDAC number for pack' },
  expiryOnPack: { en: 'Expiry read from pack', pcm: 'Expiry wey we read for pack' },
  checkedOn: { en: 'Checked on', pcm: 'Date wey we check' },
  inDateOn: { en: 'In date on', pcm: 'E never expire as of' },
  expiredBy: { en: 'Expired by', pcm: 'E don expire as of' },
  couldntRead: { en: 'Couldn’t read', pcm: 'We no fit read' },
  unknownMedicine: { en: 'Medicine name not readable', pcm: 'We no fit read the drug name' },
  openMedSafety: { en: 'Open NAFDAC Med Safety app', pcm: 'Open NAFDAC Med Safety app' },
  share: { en: 'Share report', pcm: 'Share the report' },
  copy: { en: 'Copy summary', pcm: 'Copy the summary' },
  copied: { en: 'Summary copied', pcm: 'Summary don copy' },
  copyFailed: { en: 'Couldn’t copy. Select the text and copy it instead.', pcm: 'E no copy. Select the text and copy am yourself.' },
  notSubmitted1: { en: 'Sharing or copying doesn’t submit a report.', pcm: 'If you share or copy am, e no mean say you don report.' },
  notSubmitted2: { en: 'Use NAFDAC’s Med Safety app to report officially.', pcm: 'Use NAFDAC Med Safety app to report am officially.' },
  keepTitle: { en: 'Keep the pack and receipt', pcm: 'Keep the pack and receipt' },
  keepBody: {
    en: 'For a real concern, include clear photos and where you bought the medicine. Ask a pharmacist before using it.',
    pcm: 'If e really dey worry you, add clear photos and where you buy the drug. Ask pharmacist before you use am.',
  },
  concernNote: { en: 'This is a concern, not proof of counterfeiting.', pcm: 'E dey worry, but e no prove say the drug na fake.' },
  othersMatch: { en: 'The other fields match.', pcm: 'The other details match.' },
} satisfies Record<string, Copy>;

export const fieldWord: Record<Field, Copy> = {
  name: { en: 'name', pcm: 'name' },
  strength: { en: 'strength', pcm: 'strength' },
  manufacturer: { en: 'manufacturer', pcm: 'manufacturer' },
  nafdac_no: { en: 'NAFDAC number', pcm: 'NAFDAC number' },
  registration_status: { en: 'registration status', pcm: 'registration status' },
  expiry: { en: 'expiry date', pcm: 'expiry date' },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function onPackLabel(field: Field, lang: Lang) {
  return lang === 'en' ? `${cap(fieldWord[field].en)} on pack` : `${cap(fieldWord[field].pcm)} for pack`;
}

export function inRecordLabel(field: Field, lang: Lang) {
  return lang === 'en' ? `${cap(fieldWord[field].en)} in NAFDAC record` : `${cap(fieldWord[field].pcm)} for NAFDAC record`;
}

export function concernLabel(failed: Field[], verdict: string, lang: Lang): string {
  if (verdict === 'mismatch') {
    if (failed.length === 1) return lang === 'en' ? `${cap(fieldWord[failed[0]].en)} mismatch` : `${cap(fieldWord[failed[0]].pcm)} no match`;
    return lang === 'en' ? `${failed.length} details don’t match` : `${failed.length} details no match`;
  }
  const labels: Record<string, Copy> = {
    not_found: { en: 'Record not found', pcm: 'We no see the record' },
    expired: { en: 'Pack expired', pcm: 'The drug don expire' },
    unreadable: { en: 'Couldn’t read the pack', pcm: 'We no fit read the pack' },
    no_red_flags: { en: 'No red flags found', pcm: 'No red flag' },
  };
  return labels[verdict][lang];
}

export function mismatchSentence(failed: Field[], anyMatched: boolean, lang: Lang): string {
  const names = failed.map((f) => fieldWord[f][lang]);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  const first =
    lang === 'en'
      ? `The ${list} on this pack ${failed.length > 1 ? 'differ' : 'differs'} from NAFDAC’s record.`
      : `The ${list} for this pack no match NAFDAC record.`;
  return [first, anyMatched ? reportUi.othersMatch[lang] : '', reportUi.concernNote[lang]].filter(Boolean).join(' ');
}