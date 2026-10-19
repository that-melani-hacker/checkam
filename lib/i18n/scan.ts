import type { Lang } from '@/lib/types';

/** Owner: Vivian. Scan + Loading copy in English and Pidgin, from the Figma frames.
 *  Keys marked "not in Figma" were written for states Figma doesn't show: get them checked in the Pidgin review. */
type Copy = Record<Lang, string>;

export const scanUi = {
  back: { en: 'Home', pcm: 'Home' },

  // Step 1 · Camera and upload
  eyebrow: { en: 'STEP 1 OF 2 · YOUR PHOTO', pcm: 'STEP 1 OF 2 · YOUR PHOTO' },
  title: { en: 'Let’s see the pack.', pcm: 'Make we see the pack.' },
  intro: {
    en: 'Keep the name, strength and NAFDAC number clear and easy to read.',
    pcm: 'Make sure say the name, strength and NAFDAC number clear well-well.',
  },
  emptyPreview: { en: 'Your photo will show here', pcm: 'Your photo go show here' }, // not in Figma
  takePhoto: { en: 'Take a photo', pcm: 'Snap the pack' }, // not in Figma
  uploadPhoto: { en: 'Upload a photo', pcm: 'Upload photo' }, // not in Figma
  photoCount: { en: '1 photo', pcm: '1 photo' },
  tipsTitle: { en: 'For a better check', pcm: 'To check am better' },
  tipLight: { en: 'Use good light. Avoid glare and flash.', pcm: 'Use better light. No use flash make e no shine.' },
  tipFull: { en: 'Show the full pack, not loose tablets.', pcm: 'Show the full pack, no be loose tablet.' },
  tipSteady: { en: 'Hold steady so small text stays sharp.', pcm: 'Hold your hand steady make the small writing clear.' },
  checkPhoto: { en: 'Check this photo', pcm: 'Check this photo' },
  retake: { en: 'Retake photo', pcm: 'Snap am again' },
  uploadDifferent: { en: 'Upload a different photo', pcm: 'Upload another photo' },
  privacy: {
    en: 'Only the medicine pack, please. Keep faces and personal details out of your photo.',
    pcm: 'Na only the drug pack we need, abeg. No put face or your personal details for the photo.',
  },
  notAnImage: { en: 'That file isn’t a photo. Choose a photo of the pack.', pcm: 'That file no be photo. Choose photo of the pack.' }, // not in Figma

  // Step 2 · Loading
  loadingEyebrow: { en: 'STEP 2 OF 2 · CHECKING DETAILS', pcm: 'STEP 2 OF 2 · WE DEY CHECK' },
  loadingTitle: { en: 'A little check goes a long way.', pcm: 'Small check fit help well-well.' },
  loadingIntro: {
    en: 'We’re comparing the details on your pack. Stay on this screen.',
    pcm: 'We dey compare the details for your pack. No comot for this screen.',
  },
  stepReading: { en: 'Reading pack…', pcm: 'We dey read the pack…' },
  stepReadingActive: { en: 'Reading the photo details', pcm: 'We dey read the photo details' }, // not in Figma
  stepReadingDone: { en: 'Photo details extracted', pcm: 'We don read the photo details' },
  stepDone: { en: 'Done', pcm: 'E don finish' },
  stepChecking: { en: 'Checking NAFDAC records…', pcm: 'We dey check NAFDAC record…' },
  stepCheckingStatus: { en: 'Comparing with NAFDAC’s record', pcm: 'We dey compare am with NAFDAC record' },
  guidanceTitle: { en: 'The details matter', pcm: 'The details dey important' },
  guidanceBody: {
    en: 'A name or registration number alone can’t confirm authenticity. We’ll show what needs a closer look.',
    pcm: 'Only name or NAFDAC number no fit prove say drug dey original. We go show you wetin need closer look.',
  },
} satisfies Record<string, Copy>;