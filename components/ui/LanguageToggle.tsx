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
      className="flex h-11 items-center gap-0.5 rounded-full border border-border bg-subtle p-1"
    >
      {OPTIONS.map(({ value, label }) => {
        const selected = lang === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => setLang(value)}
            className={`h-9 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand md:px-4 md:text-sm ${
              selected ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}