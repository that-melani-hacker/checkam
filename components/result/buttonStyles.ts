// Owner: Melani. Button looks for the Result and Report screens, from Figma.
// TODO: swap for <Button> once Vivian's components/ui/Button.tsx is done.
const base =
  'flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] border px-4 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export const primaryButton = `${base} border-primary bg-primary text-white active:opacity-90`;
export const secondaryButton = `${base} border-border bg-surface text-brand active:bg-subtle`;
