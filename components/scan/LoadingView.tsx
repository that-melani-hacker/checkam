'use client';

import { ScanLine, ShieldCheck } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { Card } from '@/components/ui/Card';
import { CheckingSteps } from '@/components/scan/CheckingSteps';

type Props = { step: number };

/** Owner: Vivian. Step 2 of 2: the Loading frame in Figma. */
export function LoadingView({ step }: Props) {
  const { lang } = useVerify();

  return (
    <section className="flex flex-col gap-6 py-6" aria-busy="true" aria-live="polite">
      <p className="text-[11px] font-bold text-primary">{scanUi.loadingEyebrow[lang]}</p>

      {/* Ring: a light track with a 3/4 green arc that spins slowly */}
      <div className="relative mx-auto size-35">
        <svg viewBox="0 0 140 140" className="size-full animate-[spin_1.6s_linear_infinite] motion-reduce:animate-none" aria-hidden>
          <circle cx="70" cy="70" r="64" fill="none" strokeWidth="8" className="stroke-success-tint" />
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
        <div className="absolute inset-0 m-auto flex size-19 items-center justify-center rounded-[20px] bg-success-tint">
          <ScanLine size={30} className="text-primary" aria-hidden />
        </div>
      </div>

      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-[28px] font-bold leading-[1.2] text-ink">{scanUi.loadingTitle[lang]}</h1>
        <p className="text-base leading-normal text-muted">{scanUi.loadingIntro[lang]}</p>
      </div>

      <CheckingSteps step={step} />

      <Card icon={<ShieldCheck size={21} aria-hidden />} title={scanUi.guidanceTitle[lang]}>
        {scanUi.guidanceBody[lang]}
      </Card>
    </section>
  );
}