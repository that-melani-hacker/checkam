'use client';

import { CircleX, ScanLine, ShieldCheck } from 'lucide-react';
import type { Field, VerifyResponse } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { concernLabel, inRecordLabel, mismatchSentence, onPackLabel, reportUi } from '@/lib/i18n/report';

type Props = { result: VerifyResponse; photoUrl: string };

const compared: Field[] = ['name', 'strength', 'manufacturer'];

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm leading-[1.4] break-words text-ink">{value}</p>
    </div>
  );
}

/** Owner: Melani. The prefilled report card: photo, concern, details. Test: D6 */
export function ReportSummary({ result, photoUrl }: Props) {
  const { lang } = useVerify();
  const { verdict, extracted: e, checks, explanation } = result;
  const failed = checks.filter((c) => c.ok === false && compared.includes(c.field)).map((c) => c.field);
  const anyMatched = checks.some((c) => c.ok === true && compared.includes(c.field));
  const expiryCheck = checks.find((c) => c.field === 'expiry');
  const red = verdict === 'mismatch' || verdict === 'not_found' || verdict === 'expired';
  const ConcernIcon = red ? CircleX : verdict === 'no_red_flags' ? ShieldCheck : ScanLine;
  const concernColor = red ? 'text-danger' : verdict === 'no_red_flags' ? 'text-success' : 'text-neutral';
  const dateShort = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  const dateLong = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date());

  const expiryValue = !e.expiry
    ? reportUi.couldntRead[lang]
    : expiryCheck?.ok === false
      ? `${e.expiry} · ${reportUi.expiredBy[lang]} ${dateShort}`
      : `${e.expiry} · ${reportUi.inDateOn[lang]} ${dateShort}`;

  const closing =
    verdict === 'mismatch' && failed.length
      ? mismatchSentence(failed, anyMatched, lang)
      : red
        ? `${explanation[lang]} ${reportUi.concernNote[lang]}`
        : explanation[lang];

  return (
    <section className="overflow-hidden rounded-[14px] border border-border">
      <h2 className="bg-subtle p-4 text-base font-bold text-ink">{reportUi.summary[lang]}</h2>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL from the user's camera */}
          <img src={photoUrl} alt="" className="size-14 shrink-0 rounded-[10px] bg-success-tint object-cover" />
          <p className="text-xs text-muted">{reportUi.photo[lang]}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className={`flex items-center gap-1.5 text-xs ${concernColor}`}>
            <ConcernIcon size={17} aria-hidden />
            {concernLabel(failed, verdict, lang)}
          </p>
          <p className="text-lg leading-[1.3] font-bold text-ink">
            {e.name ?? reportUi.unknownMedicine[lang]}
            {e.strength && (
              <>
                <br />
                {e.strength}
              </>
            )}
          </p>
        </div>

        <hr className="border-border" />

        <Detail label={reportUi.nafdacOnPack[lang]} value={e.nafdac_no ?? reportUi.couldntRead[lang]} />
        {verdict === 'mismatch' && failed.length
          ? failed.flatMap((f) => {
              const c = checks.find((x) => x.field === f)!;
              return [
                <Detail key={`${f}-pack`} label={onPackLabel(f, lang)} value={c.pack ?? reportUi.couldntRead[lang]} />,
                <Detail key={`${f}-record`} label={inRecordLabel(f, lang)} value={c.registry ?? '—'} />,
              ];
            })
          : e.manufacturer && <Detail label={onPackLabel('manufacturer', lang)} value={e.manufacturer} />}
        <Detail label={reportUi.expiryOnPack[lang]} value={expiryValue} />
        <Detail label={reportUi.checkedOn[lang]} value={dateLong} />

        <p className="text-xs leading-normal text-muted">{closing}</p>
      </div>
    </section>
  );
}