'use client';

import { Check as CheckIcon, X } from 'lucide-react';
import type { Check, Lang, Verdict } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { fieldLabel, formatCheckDate, resultUi } from '@/lib/i18n/result';

type Props = { checks: Check[]; verdict: Verdict };

function statusLabel(c: Check, verdict: Verdict, lang: Lang): string {
  if (c.ok === null) return (verdict === 'not_found' ? resultUi.noComparison : resultUi.notAssessed)[lang];
  if (c.field === 'registration_status') return (c.ok ? resultUi.active : resultUi.inactive)[lang];
  if (c.field === 'expiry') return (c.ok ? resultUi.inDateStatus : resultUi.expiredStatus)[lang];
  return (c.ok ? resultUi.matches : resultUi.noMatch)[lang];
}

function packLines(c: Check, lang: Lang): string[] {
  if (c.field === 'registration_status') return [resultUi.notPrinted[lang]];
  if (!c.pack) return [resultUi.unreadable[lang]];
  if (c.field === 'expiry' && c.ok !== null) return [c.pack, (c.ok ? resultUi.inDate : resultUi.expired)[lang]];
  return [c.pack];
}

function recordValue(c: Check, verdict: Verdict, lang: Lang): string {
  if (verdict === 'unreadable') return resultUi.notChecked[lang];
  if (c.field === 'expiry') return resultUi.notInRecord[lang];
  if (verdict === 'not_found' || !c.registry) return resultUi.noRecord[lang];
  if (c.field === 'registration_status') return (c.registry === 'active' ? resultUi.active : resultUi.inactive)[lang];
  return c.registry;
}

const statusColor = { true: 'text-success', false: 'text-danger', null: 'text-neutral' } as const;

/** Owner: Melani. Six rows, pack vs NAFDAC record. Failed rows are tinted red. Test D2. */
export function ComparisonTable({ checks, verdict }: Props) {
  const { lang } = useVerify();
  const expiry = checks.find((c) => c.field === 'expiry');

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-ink">{resultUi.heading[lang]}</h2>
      <p className="text-xs text-muted">
        {resultUi.checked[lang]} {formatCheckDate(new Date())}
      </p>
      {verdict === 'not_found' && <p className="text-xs leading-normal text-neutral">{resultUi.notFoundNote[lang]}</p>}
      {verdict === 'unreadable' && <p className="text-xs leading-normal text-neutral">{resultUi.unreadableNote[lang]}</p>}

      <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-[14px] border border-border">
        <thead>
          <tr className="bg-subtle text-left text-[13px] font-bold text-ink">
            <th scope="col" className="p-3.5 pr-2">
              {resultUi.colPack[lang]}
            </th>
            <th scope="col" className="p-3.5 pl-2">
              {resultUi.colRecord[lang]}
            </th>
          </tr>
        </thead>
        {checks.map((c) => {
          const StatusIcon = c.ok === true ? CheckIcon : X;
          return (
            <tbody key={c.field} className={c.ok === false ? 'bg-danger-tint' : 'bg-surface'}>
              <tr>
                <th colSpan={2} scope="colgroup" className="border-t border-border px-3.5 pt-3.5 pb-2.5 text-left">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-muted">{fieldLabel[c.field][lang]}</span>
                    <span className={`flex shrink-0 items-center gap-1 text-[11px] font-semibold ${statusColor[`${c.ok}`]}`}>
                      <StatusIcon size={14} strokeWidth={2.5} aria-hidden />
                      {statusLabel(c, verdict, lang)}
                    </span>
                  </span>
                </th>
              </tr>
              <tr className="align-top text-sm leading-[1.45] text-ink">
                <td className="px-3.5 pr-2 pb-3.5 break-words">
                  {packLines(c, lang).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </td>
                <td className="px-3.5 pb-3.5 pl-2 break-words">{recordValue(c, verdict, lang)}</td>
              </tr>
            </tbody>
          );
        })}
      </table>

      <p className="text-[11px] leading-normal text-muted">
        {(expiry?.pack ? resultUi.expiryNote : resultUi.expiryNoteUnread)[lang]}
      </p>
    </section>
  );
}
