'use client';

import Link from 'next/link';
import { Info, ShieldCheck } from 'lucide-react';
import type { Lang } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'pcm', label: 'Pidgin' },
];

/**
 * Owner: Melani. App header and footer disclosure for the Result and Report screens, matching Home.
 * TODO: once Vivian's LanguageToggle is done, the team can share one header across every screen.
 */
export function ScreenFrame({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useVerify();

  return (
    <div className="flex min-h-dvh flex-col">
      {/* -mx-6 cancels the layout's px-6 so the borders run edge to edge like Figma */}
      <header className="-mx-6 flex h-20 shrink-0 items-center justify-between gap-3 border-b border-border px-6">
        <Link href="/" className="flex items-center gap-[7px]" aria-label="CheckAm home">
          <span className="flex h-[34px] w-[30px] items-center justify-center rounded-[10px] bg-primary text-white">
            <ShieldCheck size={21} aria-hidden />
          </span>
          <span className="text-[22px] font-bold text-primary-strong">CheckAm</span>
        </Link>
        <div className="flex items-center gap-2">
          <div
            role="radiogroup"
            aria-label="Language"
            className="flex h-11 items-center gap-px rounded-full border border-border bg-subtle p-[3px]"
          >
            {LANG_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={lang === o.value}
                onClick={() => setLang(o.value)}
                className={`h-9 rounded-full px-2.5 text-xs focus-visible:outline-2 focus-visible:outline-brand ${
                  lang === o.value ? 'bg-primary text-white' : 'text-muted'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="-mx-6 flex gap-[7px] border-t border-border px-6 py-5">
        <Info size={15} className="mt-0.5 shrink-0 text-muted" aria-hidden />
        <p className="text-[11px] leading-normal text-muted">{t('footerDisclosure', lang)}</p>
      </footer>
    </div>
  );
}
