'use client';

import { Layers, Sun } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { Card } from '@/components/ui/Card';

/**
 * Owner: Vivian. Tells people exactly what their photo must show: the 5 details the check reads,
 * each with what it looks like on a pack. (User testing: "tell me what I'm looking for".)
 */
export function PhotoTips() {
  const { lang } = useVerify();
  const items = [
    { label: scanUi.lookName[lang], hint: scanUi.lookNameHint[lang] },
    { label: scanUi.lookStrength[lang], hint: scanUi.lookStrengthHint[lang] },
    { label: scanUi.lookNafdac[lang], hint: scanUi.lookNafdacHint[lang] },
    { label: scanUi.lookMaker[lang], hint: scanUi.lookMakerHint[lang] },
    { label: scanUi.lookExpiry[lang], hint: scanUi.lookExpiryHint[lang] },
  ];

  return (
    <Card>
      <h2 className="text-lg font-bold text-ink md:text-xl">{scanUi.lookTitle[lang]}</h2>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{scanUi.lookIntro[lang]}</p>

      <ol className="mt-4 flex flex-col gap-3.5">
        {items.map(({ label, hint }, i) => (
          <li key={label} className="flex items-start gap-3.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-highlight text-[15px] font-bold text-[#161b33]">
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-base font-semibold text-ink">{label}</p>
              <p className="text-[15px] leading-snug text-muted">{hint}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
        <p className="flex items-start gap-3 text-[15px] leading-snug text-ink">
          <Layers size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          {scanUi.lookSides[lang]}
        </p>
        <p className="flex items-start gap-3 text-[15px] leading-snug text-muted">
          <Sun size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />
          {scanUi.lookPhotoTip[lang]}
        </p>
      </div>
    </Card>
  );
}
