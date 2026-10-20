'use client';

import { MessageCircle } from 'lucide-react';
import type { Verdict } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { resultUi, verdictUi } from '@/lib/i18n/result';

type Props = { verdict: Verdict };

/** Owner: Melani. Confirm with a pharmacist, worded per verdict. */
export function PharmacistNote({ verdict }: Props) {
  const { lang } = useVerify();
  return (
    <aside className="card flex items-start gap-3.5 p-5 md:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-success-tint text-brand">
        <MessageCircle size={22} aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-base font-semibold text-ink md:text-lg">{resultUi.pharmacistTitle[lang]}</p>
        <p className="text-[15px] leading-relaxed text-muted md:text-base">{verdictUi[verdict].pharmacist[lang]}</p>
      </div>
    </aside>
  );
}
