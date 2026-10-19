'use client';

import Link from 'next/link';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import type { Lang } from '@/lib/types';
import { HowItWorksStrip } from '@/components/home/HowItWorksStrip';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { OfflineBanner } from '@/components/home/OfflineBanner';

/** Owner: Albert. Home, built from the Figma mobile frames (English + Pidgin). */

// ───────── Icons (Lucide paths, inline so no extra package is needed) ─────────
// Wrapper: pass a size class (e.g. "size-5") and the paths as children.
function Svg({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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

const ShieldCheck = ({ className }: { className: string }) => (
  <Svg className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

const ScanLine = ({ className }: { className: string }) => (
  <Svg className={className}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </Svg>
);

const ImageIcon = ({ className }: { className: string }) => (
  <Svg className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </Svg>
);

const InfoIcon = ({ className }: { className: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </Svg>
);

// ───────── Header: logo + English/Pidgin pill ─────────
// TODO: when Vivian finishes components/ui/LanguageToggle.tsx, swap the pill for <LanguageToggle />.
const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'pcm', label: 'Pidgin' },
];

function Header() {
  const { lang, setLang } = useVerify();

  return (
    // -mx-6 cancels the layout's px-6 so the bottom border runs edge to edge like Figma
    <header className="-mx-6 flex h-20 items-center justify-between gap-3 border-b border-border px-6">
      <Link href="/" className="flex items-center gap-1.75" aria-label="CheckAm home">
        <span className="flex h-8.5 w-7.5 items-center justify-center rounded-[10px] bg-primary">
          <ShieldCheck className="size-5.25 text-white" />
        </span>
        <span className="text-[22px] font-bold text-primary-strong">CheckAm</span>
      </Link>

      <div className="flex items-center gap-2">
        {/* The selected language is the filled green pill */}
        <div
          role="group"
          aria-label="Language"
          className="flex h-11 items-center gap-px rounded-full border border-border bg-subtle p-0.75"
        >
          {LANG_OPTIONS.map(({ value, label }) => {
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
        <ThemeToggle />
      </div>
    </header>
  );
}

// ───────── Hero illustration: a FICTIONAL pack (decorative, so its text isn't translated) ─────────
function MedicineIllustration({ cue }: { cue: string }) {
  return (
    <div aria-hidden="true" className="relative h-57.5 w-full overflow-hidden rounded-[20px] bg-success-tint">
      {/* Soft circle, top right (approximation of the Figma backdrop) */}
      <div className="absolute -top-7.5 left-30.75 size-65 rounded-full bg-primary/6" />

      {/* The pack. Shrinks on very small phones instead of overflowing.
          It's a picture of a printed pack, so it keeps its light colours in dark mode. */}
      <div className="absolute left-7.5 top-5.5 h-42.5 w-[calc(100%-62px)] max-w-70 overflow-hidden rounded-[7px] border border-[#dae4dd] bg-white shadow-[0_12px_24px_rgba(18,58,37,0.13)]">
        <div className="flex h-7.25 items-center justify-between bg-[#075c45] px-3.75 text-white">
          <span className="text-[11px]">wellora</span>
          <span className="text-[8px]">20 TABLETS</span>
        </div>
        <div className="flex flex-col gap-1.25 px-3.75 pt-3.25">
          <p className="text-[21px] font-bold text-[#063d31]">Paracetamol</p>
          <p className="text-[15px] font-semibold text-[#075c45]">500 mg</p>
          <div className="h-px w-full bg-[#dae4dd]" />
          <p className="whitespace-pre text-[9px] text-[#5b6d66]">{'A4-5821  ·  EXP 12/2027'}</p>
          <p className="text-[8px] text-[#5b6d66]">Wellora Pharma Ltd</p>
        </div>
      </div>

      {/* White pill overlapping the bottom-left of the pack */}
      <div className="absolute left-7.25 top-46.25 flex max-w-[calc(100%-40px)] items-center gap-1.5 rounded-full bg-white px-2.5 py-1.75">
        <ScanLine className="size-3.75 shrink-0 text-[#075c45]" />
        <span className="text-[11px] font-semibold text-[#075c45]">{cue}</span>
      </div>
    </div>
  );
}

// ───────── The page ─────────
export default function Page() {
  const { lang } = useVerify();

  return (
    // lang attr helps screen readers; flex-col + mt-auto on the footer pins it to the bottom on tall screens
    <div lang={lang === 'pcm' ? 'pcm' : 'en'} className="flex min-h-dvh flex-col">
      <Header />

      <div className="flex flex-col gap-6 py-6">
        <OfflineBanner />

        {/* 1. Intro */}
        <section className="flex flex-col gap-3.5">
          <p className="text-[11px] font-bold text-primary">{t('homeEyebrow', lang)}</p>
          <h1 className="text-[30px] font-bold leading-[1.16] text-ink min-[360px]:text-[34px]">
            {t('homeTitleLine1', lang)}
            <br />
            {t('homeTitleLine2', lang)}
            <span className="text-primary">{t('homeTitleAccent', lang)}</span>
          </h1>
          <p className="text-base leading-[1.55] text-muted">{t('homeIntro', lang)}</p>
        </section>

        {/* 2. Illustration */}
        <MedicineIllustration cue={t('homeScanCue', lang)} />

        {/* 3. Main action -> Vivian's /scan page */}
        <div className="flex flex-col gap-2.5">
          <Link
            href="/scan"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] border border-primary bg-primary px-4 text-base font-semibold text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ScanLine className="size-5.25" />
            {t('scanCta', lang)}
          </Link>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <ImageIcon className="size-3.75" />
            {t('homeScanHint', lang)}
          </p>
        </div>

        {/* 4. How it works */}
        <section className="flex flex-col gap-4" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-xl font-bold text-ink">
            {t('homeStepsTitle', lang)}
          </h2>
          <HowItWorksStrip />
        </section>

        {/* 5. Reminder card */}
        <section className="flex items-start gap-2.75 rounded-[14px] bg-subtle p-4">
          <ShieldCheck className="mt-px size-5.25 shrink-0 text-primary" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.25">
            <h2 className="text-sm font-semibold text-ink">{t('homeGuidanceTitle', lang)}</h2>
            <p className="text-[13px] leading-normal text-muted">{t('homeGuidanceBody', lang)}</p>
          </div>
        </section>
      </div>

      {/* Footer note: -mx-6 so the top border runs edge to edge */}
      <footer className="-mx-6 mt-auto flex items-start gap-1.75 border-t border-border px-6 py-5">
        <InfoIcon className="mt-px size-3.75 shrink-0 text-muted" />
        <p className="flex-1 text-[11px] leading-normal text-muted">{t('footerDisclosure', lang)}</p>
      </footer>
    </div>
  );
}