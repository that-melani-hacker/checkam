'use client';

import Link from 'next/link';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import { HowItWorksStrip } from '@/components/home/HowItWorksStrip';
import { PageShell } from '@/components/ui/PageShell';
import { OfflineBanner } from '@/components/home/OfflineBanner';

/** Owner: Albert. Home, built from the Figma mobile frames (English + Pidgin), responsive up to laptop. */

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
    // PageShell gives the shared sticky header, the responsive page column and the footer.
    <PageShell>
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
        <OfflineBanner />

        {/* ── Hero ──
            Phone/tablet: one column in this order: intro, illustration, button.
            Laptop: two columns. Intro + button on the left, illustration on the right. */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-16 lg:gap-y-8">
          {/* 1. Intro */}
          <section className="flex flex-col gap-3.5 md:gap-4 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="text-[13px] font-bold tracking-wide text-brand md:text-sm">{t('homeEyebrow', lang)}</p>
            <h1 className="text-[32px] font-bold leading-[1.12] tracking-tight text-ink min-[360px]:text-[36px] md:text-5xl md:leading-[1.08] lg:text-6xl">
              {t('homeTitleLine1', lang)}
              <br />
              {t('homeTitleLine2', lang)}
              <span className="text-brand">{t('homeTitleAccent', lang)}</span>
            </h1>
            <p className="text-[17px] leading-relaxed text-muted md:max-w-xl md:text-lg lg:text-xl">
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
              className="flex min-h-15 w-full items-center justify-center gap-2.5 rounded-2xl border border-primary bg-primary px-5 text-lg font-semibold text-white shadow-[0_10px_24px_-10px_rgba(7,92,69,0.7)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.99]"
            >
              <ScanLine className="size-6" />
              {t('scanCta', lang)}
            </Link>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted md:text-[15px] lg:justify-start">
              <ImageIcon className="size-4" />
              {t('homeScanHint', lang)}
            </p>
          </div>
        </div>

        {/* ── How it works + reminder ──
            Phone/tablet: stacked. Laptop: steps on the left, reminder card on the right. */}
        <div className="flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-16">
          <section className="card flex flex-col gap-5 p-5 md:gap-6 md:p-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="text-xl font-bold text-ink md:text-2xl">
              {t('homeStepsTitle', lang)}
            </h2>
            <HowItWorksStrip />
          </section>

          <section className="card flex items-start gap-3.5 p-5 md:p-8">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-success-tint text-brand">
              <ShieldCheck className="size-6" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
              <h2 className="text-base font-semibold text-ink md:text-lg">{t('homeGuidanceTitle', lang)}</h2>
              <p className="text-[15px] leading-relaxed text-muted md:text-base">
                {t('homeGuidanceBody', lang)}
              </p>
            </div>
          </section>
        </div>
      </div>

    </PageShell>
  );
}
