import type { Lang } from '@/lib/types';

/** Owner: Albert (everyone adds their own keys). Copy the text from the Figma English and Pidgin frames. */
export const strings = {
  scanCta: { en: 'Scan a drug', pcm: 'Scan drug' },
  checkAnother: { en: 'Check another drug', pcm: 'Check another drug' },
  reportCta: { en: 'Report to NAFDAC', pcm: 'Report am to NAFDAC' },

  homeEyebrow: { en: 'SMALL CHECK. IMPORTANT PEACE OF MIND.', pcm: 'SMALL CHECK. BIG PEACE OF MIND.' },
  homeTitleLine1: { en: 'Is your drug', pcm: 'Your drug dey' },
  homeTitleLine2: { en: 'original? ', pcm: 'original? ' },
  homeTitleAccent: { en: 'CheckAm.', pcm: 'CheckAm.' }, // the app's name
  homeIntro: {
    en: 'Take a photo of the pack. Understand what matches, what doesn’t, and what to do next.',
    pcm: 'Snap the pack. See wetin match, wetin no match, and wetin you go do next.',
  },
  homeScanCue: { en: 'A clearer picture. A safer next step.', pcm: 'See am clear. Take the safer step.' },
  homeScanHint: { en: 'Use your camera or upload a photo', pcm: 'Use your camera or upload photo' },
  homeStepsTitle: { en: 'Three simple steps', pcm: 'Na three easy steps' },
  homeStep1Title: { en: '1. Snap it', pcm: '1. Snap am' },
  homeStep1Text: { en: 'Get the pack in focus.', pcm: 'Make the pack clear for camera.' },
  homeStep2Title: { en: '2. Compare', pcm: '2. Compare am' },
  homeStep2Text: { en: 'See the details side by side.', pcm: 'See the details one beside the other.' },
  homeStep3Title: { en: '3. Take care', pcm: '3. Shine your eye' },
  homeStep3Text: { en: 'Ask a pharmacist if unsure.', pcm: 'Ask pharmacist if you no sure.' },
  homeGuidanceTitle: { en: 'A check, not a guarantee', pcm: 'Na check, e no be guarantee' },
  homeGuidanceBody: {
    en: 'A matching pack cannot prove a medicine is genuine. A pharmacist can help you decide safely.',
    pcm: 'Even if the pack match, e no mean say the drug dey original. Pharmacist fit help you decide well.',
  },
  footerDisclosure: {
    en: "CheckAm checks pack details against NAFDAC's records. It can't prove a pack is genuine.",
    pcm: 'CheckAm dey compare the pack details with NAFDAC record. E no fit prove say the pack dey original.',
  },

} satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Lang): string {
  return strings[key][lang];
}
