'use client';

import { CalendarX, CircleX, ScanLine, SearchX, ShieldCheck, ShieldX, type LucideIcon } from 'lucide-react';
import type { Check, Explanation, Field, Verdict } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { inactiveUi, mismatchCount, mismatchIssue, verdictUi } from '@/lib/i18n/result';

type Props = { verdict: Verdict; checks: Check[]; explanation: Explanation };

const icon: Record<Verdict, LucideIcon> = {
  no_red_flags: ShieldCheck,
  mismatch: CircleX,
  not_found: SearchX,
  expired: CalendarX,
  unreadable: ScanLine,
};

const tint: Record<Verdict, string> = {
  no_red_flags: 'bg-success-tint',
  mismatch: 'bg-danger-tint',
  not_found: 'bg-danger-tint',
  expired: 'bg-danger-tint',
  unreadable: 'bg-neutral-tint',
};

// Unreadable is grey with a dark title; every other verdict colours its label and title.
const label: Record<Verdict, string> = {
  no_red_flags: 'text-success',
  mismatch: 'text-danger',
  not_found: 'text-danger',
  expired: 'text-danger',
  unreadable: 'text-neutral',
};
const title: Record<Verdict, string> = { ...label, unreadable: 'text-ink' };

const COMPARED: Field[] = ['name', 'strength', 'manufacturer'];

/** Owner: Melani. Color + icon + words for each of the 5 verdicts. Tests D1-D5. */
export function VerdictBanner({ verdict, checks, explanation }: Props) {
  const { lang } = useVerify();
  const failed = checks.filter((c) => c.ok === false && COMPARED.includes(c.field));

  // "expired" also covers an in-date pack whose registration is inactive.
  const inactiveOnly = verdict === 'expired' && !checks.some((c) => c.field === 'expiry' && c.ok === false);
  const copy = inactiveOnly ? inactiveUi : verdictUi[verdict];
  const Icon = inactiveOnly ? ShieldX : icon[verdict];

  return (
    <section className={`flex flex-col gap-3 rounded-3xl p-6 md:p-8 ${tint[verdict]}`}>
      <p className={`flex items-center gap-2 text-[13px] font-bold tracking-wide ${label[verdict]}`}>
        <Icon size={24} aria-hidden />
        {copy.status[lang]}
      </p>
      <h1 className={`text-[30px] leading-[1.12] font-bold tracking-tight md:text-4xl ${title[verdict]}`}>{copy.title[lang]}</h1>
      {verdict === 'mismatch' && failed.length > 0 ? (
        <>
          <p className="text-base leading-relaxed text-ink md:text-[17px]">{mismatchCount(failed.length, lang)}</p>
          <ul>
            {failed.map((c) => (
              <li key={c.field} className="text-base leading-relaxed font-semibold text-ink md:text-[17px]">
                • {mismatchIssue(c.field, c.pack ?? '—', c.registry ?? '—', lang)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-base leading-relaxed text-ink md:text-[17px]">{explanation[lang]}</p>
      )}
    </section>
  );
}
