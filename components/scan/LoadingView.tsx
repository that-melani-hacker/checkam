'use client';

import { ScanLine, ShieldCheck } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { Card } from '@/components/ui/Card';
import { CheckingSteps } from '@/components/scan/CheckingSteps';
import { NARROW } from '@/lib/ui/layout';

type Props = { step: number };

/** Owner: Vivian. Step 2 of 2: the Loading frame in Figma. */
export function LoadingView({ step }: Props) {
  const { lang } = useVerify();

  return (
    <section className={`${NARROW} flex flex-col gap-7`} aria-busy="true" aria-live="polite">
      <p className="text-[13px] font-bold tracking-wide text-brand">{scanUi.loadingEyebrow[lang]}</p>

      {/* Ring: a light track with a 3/4 green arc that spins slowly */}
      <div className="relative mx-auto size-35">
        <svg viewBox="0 0 140 140" className="size-full animate-[spin_1.6s_linear_infinite] motion-reduce:animate-none" aria-hidden>
          <circle cx="70" cy="70" r="64" fill="none" strokeWidth="8" className="stroke-brand-tint" />
          <circle
            cx="70"
            cy="70"
            r="64"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="302 402"
            className="stroke-primary"
          />
        </svg>
        <div className="absolute inset-0 m-auto flex size-19 items-center justify-center rounded-[20px] bg-brand-tint">
          <ScanLine size={30} className="text-primary" aria-hidden />
        </div>
      </div>

      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight text-ink md:text-4xl">{scanUi.loadingTitle[lang]}</h1>
        <p className="text-[17px] leading-relaxed text-muted">{scanUi.loadingIntro[lang]}</p>
      </div>

      <CheckingSteps step={step} />

      <Card icon={<ShieldCheck size={21} aria-hidden />} title={scanUi.guidanceTitle[lang]}>
        {scanUi.guidanceBody[lang]}
      </Card>
    </section>
  );
}