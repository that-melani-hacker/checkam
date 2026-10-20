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
      <h2 className="text-sm font-semibold text-ink">{scanUi.tipsTitle[lang]}</h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {tips.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-[13px] leading-normal text-muted">
            <Icon size={18} className="mt-px shrink-0 text-ink" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </Card>
  );
}