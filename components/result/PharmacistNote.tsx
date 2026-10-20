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
    <aside className="flex items-start gap-[11px] rounded-[14px] bg-subtle p-4">
      <MessageCircle size={21} className="shrink-0 text-brand" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <p className="text-sm font-semibold text-ink">{resultUi.pharmacistTitle[lang]}</p>
        <p className="text-[13px] leading-normal text-muted">{verdictUi[verdict].pharmacist[lang]}</p>
      </div>
    </aside>
  );
}
