/** Owner: Albert. Three steps: snap, compare, take care. */
'use client';

import { useVerify } from '@/lib/state/VerifyContext';
import { t, type StringKey } from '@/lib/i18n/strings';

/** Owner: Albert. Three steps: snap, compare, take care. */

// Shared wrapper for the 3 icons below (Lucide paths, 24x24 grid, drawn as outlines).
function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5.25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// One entry per step: its icon + the two string keys (title, text) from lib/i18n/strings.ts.
const STEPS: { icon: React.ReactNode; title: StringKey; text: StringKey }[] = [
  {
    // camera
    icon: (
      <StepIcon>
        <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
        <circle cx="12" cy="13" r="3" />
      </StepIcon>
    ),
    title: 'homeStep1Title',
    text: 'homeStep1Text',
  },
  {
    // list-checks
    icon: (
      <StepIcon>
        <path d="M13 5h8" />
        <path d="M13 12h8" />
        <path d="M13 19h8" />
        <path d="m3 17 2 2 4-4" />
        <path d="m3 7 2 2 4-4" />
      </StepIcon>
    ),
    title: 'homeStep2Title',
    text: 'homeStep2Text',
  },
  {
    // message-circle
    icon: (
      <StepIcon>
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      </StepIcon>
    ),
    title: 'homeStep3Title',
    text: 'homeStep3Text',
  },
];

export function HowItWorksStrip() {
  const { lang } = useVerify(); // 'en' | 'pcm'

  return (
    // 3 equal columns. min-w-0 lets long Pidgin words wrap instead of stretching a column.
    <ol className="flex items-start gap-3">
      {STEPS.map(({ icon, title, text }) => (
        <li key={title} className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-success-tint text-primary">
            {icon}
          </span>
          <p className="text-[13px] font-bold text-ink">{t(title, lang)}</p>
          <p className="text-xs leading-normal text-muted">{t(text, lang)}</p>
        </li>
      ))}
    </ol>
  );
}