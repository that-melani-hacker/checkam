import type { Field, Lang, Verdict } from '@/lib/types';

/** Owner: Melani. Result-screen copy in English and Pidgin, from the Figma frames. */
type Copy = Record<Lang, string>;

export const resultUi = {
  back: { en: 'Your check', pcm: 'Your check' },
  noResult: { en: 'No result yet. Scan a drug first.', pcm: 'No result yet. Scan drug first.' },
  retake: { en: 'Try a clearer photo', pcm: 'Try snap am clear' },
  heading: { en: 'Pack & record', pcm: 'Pack & record' },
  checked: { en: 'Checked', pcm: 'We check am' },
  notFoundNote: {
    en: '× No comparison means the record is missing, not that the values differ.',
    pcm: '× “No comparison” mean say record no dey, e no mean say the details different.',
  },
  unreadableNote: {
    en: '× Not assessed means unreadable, not a mismatch.',
    pcm: '× “Not assessed” mean say we no fit read am, e no mean say e no match.',
  },
  colPack: { en: 'On your pack', pcm: 'For your pack' },
  colRecord: { en: 'NAFDAC record', pcm: 'NAFDAC record' },

  // Row status labels
  matches: { en: 'Matches', pcm: 'E match' },
  noMatch: { en: 'Does not match', pcm: 'E no match' },
  active: { en: 'Active', pcm: 'Active' },
  inactive: { en: 'Inactive', pcm: 'E no dey active' },
  inDateStatus: { en: 'Date check: in date', pcm: 'Date check: e never expire' },
  expiredStatus: { en: 'Date check: expired', pcm: 'Date check: e don expire' },
  noComparison: { en: 'No comparison', pcm: 'No comparison' },
  notAssessed: { en: 'Not assessed', pcm: 'Not assessed' },

  // Cell values
  notPrinted: { en: 'Not printed on pack', pcm: 'E no dey for pack' },
  unreadable: { en: 'Unreadable', pcm: 'We no fit read' },
  noRecord: { en: 'No record found', pcm: 'No record' },
  notChecked: { en: 'Not checked', pcm: 'We no check' },
  notInRecord: { en: 'Not in NAFDAC record', pcm: 'E no dey NAFDAC record' },
  inDate: { en: 'In date', pcm: 'E never expire' },
  expired: { en: 'Expired', pcm: 'E don expire' },

  expiryNote: {
    en: "Expiry is read from the pack. NAFDAC's record doesn't include batch expiry.",
    pcm: 'Na from the pack we read the expiry date. NAFDAC record no get batch expiry.',
  },
  expiryNoteUnread: {
    en: "Expiry couldn't be read from the pack. NAFDAC's record doesn't include batch expiry.",
    pcm: 'We no fit read the expiry date for the pack. NAFDAC record no get batch expiry.',
  },
  pharmacistTitle: { en: 'Confirm with a pharmacist', pcm: 'Ask pharmacist first' },

  // "About this medicine" card (not in Figma: get the Pidgin checked in the review)
  aboutTitle: { en: 'About this medicine', pcm: 'Wetin this medicine dey do' },
  aboutLoading: { en: 'Finding information about this medicine…', pcm: 'We dey find information about this medicine…' },
  aboutUses: { en: 'Commonly used for', pcm: 'People dey use am for' },
  aboutTips: { en: 'Good to know', pcm: 'Wetin you suppose know' },
  aboutDisclaimer: {
    en: 'General information about this type of medicine, not medical advice. Follow the leaflet and ask a pharmacist.',
    pcm: 'Na general information about this kind medicine, e no be doctor advice. Follow the paper wey dey inside and ask pharmacist.',
  },
} satisfies Record<string, Copy>;

/** Row names, the same words in both languages on the Figma frames. */
export const fieldLabel: Record<Field, Copy> = {
  name: { en: 'Name', pcm: 'Name' },
  strength: { en: 'Strength', pcm: 'Strength' },
  manufacturer: { en: 'Manufacturer', pcm: 'Manufacturer' },
  nafdac_no: { en: 'NAFDAC number', pcm: 'NAFDAC number' },
  registration_status: { en: 'Registration status', pcm: 'Registration status' },
  expiry: { en: 'Expiry', pcm: 'Expiry' },
};

export const verdictUi: Record<Verdict, { status: Copy; title: Copy; pharmacist: Copy }> = {
  no_red_flags: {
    status: { en: 'DETAILS MATCH', pcm: 'DETAILS MATCH' },
    title: { en: 'No red flags', pcm: 'No red flag' },
    pharmacist: {
      en: 'Confirm with a pharmacist before use if you’re unsure. A matching pack can still be copied.',
      pcm: 'If you no sure, ask pharmacist before you use am. Pack wey match fit still be copy.',
    },
  },
  mismatch: {
    status: { en: 'MISMATCH FOUND', pcm: 'SOMETHING NO MATCH' },
    title: { en: 'Details don’t match', pcm: 'The details no match' },
    pharmacist: {
      en: 'Do not use this medicine until a pharmacist has checked the mismatch. Keep the pack and your receipt.',
      pcm: 'No use this drug until pharmacist check wetin no match. Keep the pack and your receipt.',
    },
  },
  not_found: {
    status: { en: 'NO RECORD TO COMPARE', pcm: 'NO RECORD TO COMPARE' },
    title: { en: 'Record not found', pcm: 'We no see the record' },
    pharmacist: {
      en: 'Ask a pharmacist to check the number and pack before use. A missing record needs further checking.',
      pcm: 'Make pharmacist check the number and pack before you use am. If record no dey, e need more checking.',
    },
  },
  expired: {
    status: { en: 'EXPIRY DATE HAS PASSED', pcm: 'EXPIRY DATE DON PASS' },
    title: { en: 'This pack is expired', pcm: 'This drug don expire' },
    pharmacist: {
      en: 'Do not use expired medicine. Ask a pharmacist about a replacement and safe disposal.',
      pcm: 'No use drug wey don expire. Ask pharmacist for another one and how to throw am away safely.',
    },
  },
  unreadable: {
    status: { en: 'PHOTO NEEDS A RETRY', pcm: 'SNAP THE PHOTO AGAIN' },
    title: { en: 'Couldn’t read the pack', pcm: 'We no fit read the pack' },
    pharmacist: {
      en: 'If another photo still won’t read, take the pack to a pharmacist. An unreadable photo is not a counterfeit finding.',
      pcm: 'If another photo still no read, carry the pack go meet pharmacist. Photo wey no clear no mean say the drug dey fake.',
    },
  },
};

/** "expired" also covers an in-date pack whose registration is inactive; it gets its own heading. */
export const inactiveUi = {
  status: { en: 'REGISTRATION NOT ACTIVE', pcm: 'REGISTRATION NO DEY ACTIVE' },
  title: { en: 'Registration not active', pcm: 'The registration no dey active' },
} satisfies Record<string, Copy>;

export function mismatchCount(n: number, lang: Lang): string {
  if (lang === 'pcm') return `${n} detail no match NAFDAC record:`;
  return n === 1 ? "1 detail doesn't match NAFDAC's record:" : `${n} details don't match NAFDAC's record:`;
}

export function mismatchIssue(field: Field, pack: string, record: string, lang: Lang): string {
  const label = fieldLabel[field][lang];
  return lang === 'pcm'
    ? `${label}: pack talk ${pack}, NAFDAC record talk ${record}`
    : `${label}: pack says ${pack}, NAFDAC record says ${record}`;
}

export function formatCheckDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}
