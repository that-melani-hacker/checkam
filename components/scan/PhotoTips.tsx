'use client';

import { Focus, Scan, Sun } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { Card } from '@/components/ui/Card';

/** Owner: Vivian. Good light, full pack, hold steady. */
export function PhotoTips() {
  const { lang } = useVerify();
  const tips = [
    { icon: Sun, text: scanUi.tipLight[lang] },
    { icon: Scan, text: scanUi.tipFull[lang] },
    { icon: Focus, text: scanUi.tipSteady[lang] },
  ];

  return (
    <Card>
      <h2 className="text-base font-semibold text-ink md:text-lg">{scanUi.tipsTitle[lang]}</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {tips.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-[15px] leading-snug text-muted">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success-tint text-brand">
              <Icon size={18} aria-hidden />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </Card>
  );
}