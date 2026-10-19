'use client';

import Link from 'next/link';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import type { Lang } from '@/lib/types';
import { HowItWorksStrip } from '@/components/home/HowItWorksStrip';

/** Owner: Albert. Home, built from the Figma mobile frames (English + Pidgin), responsive up to laptop. */

// ───────── Width system (mobile first) ─────────
// The layout's <main> caps every page at a phone-width column, so Home lifts itself out of that cap
// (see the absolute wrapper in <Page>) and sets its own widths:
//   base  (<768px)   phone:  448px column, 24px side padding   (the Figma frames)
//   md    (>=768px)  tablet: 672px column, 40px padding
//   lg    (>=1024px) laptop: 1152px column, 48px padding, two-column hero
const CONTAINER = 'mx-auto w-full max-w-md px-4 min-[360px]:px-6 sm:max-w-xl sm:px-8 md:max-w-2xl md:px-10 lg:max-w-6xl lg:px-12';

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
    // Outer element = full-width border line. Inner div = the centred content column.
    <header className="border-b border-border">
      <div className={`${CONTAINER} flex h-20 items-center justify-between gap-3`}>
        <Link href="/" className="flex items-center gap-[7px]" aria-label="CheckAm home">
          <span className="flex h-[34px] w-[30px] items-center justify-center rounded-[10px] bg-primary">
            <ShieldCheck className="size-[21px] text-white" />
          </span>
          <span className="text-[22px] font-bold text-primary-strong">CheckAm</span>
        </Link>

        {/* The selected language is the filled green pill */}
        <div
          role="group"
          aria-label="Language"
          className="flex h-11 items-center gap-px rounded-full border border-border bg-subtle p-[3px]"
        >
          {LANG_OPTIONS.map(({ value, label }) => {
            const selected = lang === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setLang(value)}
                className={`h-9 rounded-full px-[10px] text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary md:px-3.5 md:text-sm ${
                  selected ? 'bg-primary text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

// ───────── Hero illustration: a FICTIONAL pack (decorative, so its text isn't translated) ─────────
// The pack is drawn at phone size, then scaled up with a transform on tablet/laptop so the
// text stays in proportion. The panel's height grows with the breakpoint to make room.
function MedicineIllustration({ cue }: { cue: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[230px] w-full items-center justify-center overflow-hidden rounded-[20px] bg-success-tint pb-5 md:h-[300px] lg:h-[400px] lg:rounded-[28px]"
    >
      {/* Soft circle, top right (approximation of the Figma backdrop) */}
      <div className="absolute -right-10 -top-[30px] size-[260px] rounded-full bg-primary/[0.06] md:-right-16 md:-top-16 md:size-80 lg:size-[420px]" />

      {/* Pack + pill share one box so they scale together. Width shrinks on tiny phones. */}
      <div className="relative h-[170px] w-[calc(100%-62px)] max-w-[280px] md:scale-125 lg:scale-[1.45]">
        <div className="absolute inset-0 overflow-hidden rounded-[7px] border border-border bg-white shadow-[0_12px_24px_rgba(18,58,37,0.13)]">
          <div className="flex h-[29px] items-center justify-between bg-primary px-[15px] text-white">
            <span className="text-[11px]">wellora</span>
            <span className="text-[8px]">20 TABLETS</span>
          </div>
          <div className="flex flex-col gap-[5px] px-[15px] pt-[13px]">
            <p className="text-[21px] font-bold text-primary-strong">Paracetamol</p>
            <p className="text-[15px] font-semibold text-primary">500 mg</p>
            <div className="h-px w-full bg-border" />
            <p className="whitespace-pre text-[9px] text-muted">{'A4-5821  ·  EXP 12/2027'}</p>
            <p className="text-[8px] text-muted">Wellora Pharma Ltd</p>
          </div>
        </div>

        {/* White pill overlapping the bottom-left of the pack */}
        <div className="absolute -left-px top-[163px] flex max-w-[calc(100%+10px)] items-center gap-1.5 rounded-full bg-white px-2.5 py-[7px]">
          <ScanLine className="size-[15px] shrink-0 text-primary" />
          <span className="text-[11px] font-semibold text-primary">{cue}</span>
        </div>
      </div>
    </div>
  );
}

// ───────── The page ─────────
export default function Page() {
  const { lang } = useVerify();

  return (
    // `absolute inset-x-0 top-0` pulls the page out of the layout's phone-width <main>
    // and stretches it across the whole viewport (without causing sideways scroll).
    // Each section then centres itself with CONTAINER. min-h-dvh + mt-auto pins the footer to the bottom.
    <div lang={lang === 'pcm' ? 'pcm' : 'en'} className="absolute inset-x-0 top-0 flex min-h-dvh flex-col">
      <Header />

      <div className={`${CONTAINER} flex flex-col gap-6 py-6 md:gap-10 md:py-10 lg:gap-16 lg:py-16`}>
        {/* ── Hero ──
            Phone/tablet: one column in this order: intro, illustration, button.
            Laptop: two columns. Intro + button on the left, illustration on the right. */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-16 lg:gap-y-8">
          {/* 1. Intro */}
          <section className="flex flex-col gap-3.5 md:gap-4 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="text-[11px] font-bold text-primary md:text-xs">{t('homeEyebrow', lang)}</p>
            <h1 className="text-[30px] font-bold leading-[1.16] text-ink min-[360px]:text-[34px] md:text-5xl md:leading-[1.1] lg:text-6xl">
              {t('homeTitleLine1', lang)}
              <br />
              {t('homeTitleLine2', lang)}
              <span className="text-primary">{t('homeTitleAccent', lang)}</span>
            </h1>
            <p className="text-base leading-[1.55] text-muted md:max-w-xl md:text-lg lg:text-xl">
              {t('homeIntro', lang)}
            </p>
          </section>

          {/* 2. Illustration (right column on laptop, spans both rows) */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <MedicineIllustration cue={t('homeScanCue', lang)} />
          </div>

          {/* 3. Main action -> Vivian's /scan page */}
          <div className="flex flex-col gap-2.5 md:mx-auto md:w-full md:max-w-sm lg:col-start-1 lg:row-start-2 lg:mx-0 lg:self-start">
            <Link
              href="/scan"
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] border border-primary bg-primary px-4 text-base font-semibold text-white transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ScanLine className="size-[21px]" />
              {t('scanCta', lang)}
            </Link>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted md:text-sm lg:justify-start">
              <ImageIcon className="size-[15px]" />
              {t('homeScanHint', lang)}
            </p>
          </div>
        </div>

        {/* ── How it works + reminder ──
            Phone/tablet: stacked. Laptop: steps on the left, reminder card on the right. */}
        <div className="flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-16">
          <section className="flex flex-col gap-4 md:gap-6" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="text-xl font-bold text-ink md:text-2xl">
              {t('homeStepsTitle', lang)}
            </h2>
            <HowItWorksStrip />
          </section>

          <section className="flex items-start gap-[11px] rounded-[14px] bg-subtle p-4 md:gap-3.5 md:p-6">
            <ShieldCheck className="mt-px size-[21px] shrink-0 text-primary md:size-6" />
            <div className="flex min-w-0 flex-1 flex-col gap-[5px] md:gap-2">
              <h2 className="text-sm font-semibold text-ink md:text-base">{t('homeGuidanceTitle', lang)}</h2>
              <p className="text-[13px] leading-normal text-muted md:text-sm md:leading-relaxed">
                {t('homeGuidanceBody', lang)}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer note: outer = full-width border, inner = centred column */}
      <footer className="mt-auto border-t border-border">
        <div className={`${CONTAINER} flex items-start gap-[7px] py-5`}>
          <InfoIcon className="mt-px size-[15px] shrink-0 text-muted" />
          <p className="flex-1 text-[11px] leading-normal text-muted md:text-xs">{t('footerDisclosure', lang)}</p>
        </div>
      </footer>
    </div>
  );
}
