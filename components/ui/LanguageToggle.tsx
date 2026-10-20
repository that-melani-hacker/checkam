'use client';

import { useVerify } from '@/lib/state/VerifyContext';
import type { Lang } from '@/lib/types';

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'pcm', label: 'Pidgin' },
];

/** Owner: Vivian. English/Pidgin toggle; uses useVerify(). Same look as Albert's header pill. */
export function LanguageToggle() {
  const { lang, setLang } = useVerify();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex h-11 items-center gap-px rounded-full border border-border bg-subtle p-0.75"
    >
      {OPTIONS.map(({ value, label }) => {
        const selected = lang === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => setLang(value)}
            className={`h-9 rounded-full px-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
              selected ? 'bg-primary text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}