import type { ClientErrorCode, Lang } from '@/lib/types';

/** Owner: Albert. Error and offline copy in English and Pidgin. Titles follow the contract's "Frontend shows" column. */
type Copy = Record<Lang, string>;

export const errorUi = {
  eyebrow: { en: 'CHECK DIDN’T FINISH', pcm: 'THE CHECK NO FINISH' },
  tryAgain: { en: 'Try again', pcm: 'Try again' },
  choosePhoto: { en: 'Choose another photo', pcm: 'Choose another photo' },
  backToPhotos: { en: 'Back to my photos', pcm: 'Go back to my photos' },
  offlineBanner: {
    en: 'You’re offline. Connect to the internet to check a pack.',
    pcm: 'Network no dey. Connect to internet to check the pack.',
  },
} satisfies Record<string, Copy>;

export const errorCopy: Record<ClientErrorCode, { title: Copy; body: Copy }> = {
  no_image: {
    title: { en: 'Add a photo first', pcm: 'Add photo first' },
    body: { en: 'We didn’t get a photo. Take or upload a photo of the pack.', pcm: 'We no see any photo. Snap or upload the pack photo.' },
  },
  bad_file_type: {
    title: { en: 'Use a photo of the pack', pcm: 'Use photo of the pack' },
    body: {
      en: 'That file isn’t a photo we can read. Use a JPEG, PNG or WebP photo.',
      pcm: 'We no fit read that file. Use JPEG, PNG or WebP photo.',
    },
  },
  file_too_large: {
    title: { en: 'Photo too large, try again', pcm: 'The photo too big, try again' },
    body: {
      en: 'The photos are too big to send together. Remove one, or take a new photo.',
      pcm: 'The photos too big to send together. Comot one, or snap new one.',
    },
  },
  rate_limited: {
    title: { en: 'Busy, try again in a minute', pcm: 'E dey busy, try again in one minute' },
    body: {
      en: 'Lots of people are checking right now. Wait a minute and try again.',
      pcm: 'Plenty people dey check now. Wait small, then try again.',
    },
  },
  ai_unavailable: {
    title: { en: 'We couldn’t read the pack right now', pcm: 'We no fit read the pack now' },
    body: {
      en: 'Our pack reader isn’t answering at the moment. Your photos weren’t checked. Try again shortly.',
      pcm: 'The thing wey dey read the pack no dey answer now. We never check your photos. Try again small time.',
    },
  },
  server_error: {
    title: { en: 'Something went wrong', pcm: 'Something no work' },
    body: { en: 'Your photos weren’t checked. Try again.', pcm: 'We never check your photos. Try again.' },
  },
  timeout: {
    title: { en: 'This is taking too long', pcm: 'E dey take too long' },
    body: {
      en: 'We didn’t get an answer in 20 seconds. Check your connection and try again.',
      pcm: 'We no get answer for 20 seconds. Check your network and try again.',
    },
  },
  offline: {
    title: { en: 'You’re offline', pcm: 'Network no dey' },
    body: {
      en: 'Connect to the internet to check the pack. Your photos are still here.',
      pcm: 'Connect to internet to check the pack. Your photos still dey here.',
    },
  },
};
