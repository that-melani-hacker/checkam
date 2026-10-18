import type { Lang } from '@/lib/types';

/** Owner: Albert (everyone adds their own keys). Copy the text from the Figma English and Pidgin frames. */
export const strings = {
  scanCta: { en: 'Scan a drug', pcm: 'Scan drug' },
  checkAnother: { en: 'Check another drug', pcm: 'Check another drug' },
  reportCta: { en: 'Report to NAFDAC', pcm: 'Report am to NAFDAC' },
} satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Lang): string {
  return strings[key][lang];
}
