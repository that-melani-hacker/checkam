// Owner: Melani. Button looks for links on the Result and Report screens (same look as components/ui/Button).
const base =
  'flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl border px-5 py-3 text-[17px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.99]';

export const primaryButton = `${base} border-primary bg-primary text-white shadow-sm hover:brightness-110`;
export const secondaryButton = `${base} border-border bg-surface text-brand hover:bg-subtle`;
