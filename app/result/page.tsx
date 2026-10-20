'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, ScanLine } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import { resultUi } from '@/lib/i18n/result';
import { PageShell } from '@/components/ui/PageShell';
import { primaryButton } from '@/components/result/buttonStyles';
import { VerdictBanner } from '@/components/result/VerdictBanner';
import { ComparisonTable } from '@/components/result/ComparisonTable';
import { PharmacistNote } from '@/components/result/PharmacistNote';
import { MedicineInfo } from '@/components/result/MedicineInfo';
import { ResultActions } from '@/components/result/ResultActions';

/** Owner: Melani. Try /result?mock=mismatch, ?mock=no_red_flags, ?mock=not_found, ?mock=expired, ?mock=unreadable (add &lang=pcm) */
export default function ResultPage() {
  const { result, lang, reset } = useVerify();
  const router = useRouter();

  function retake() {
    router.push('/scan');
    reset();
  }

  if (!result) {
    return (
      <PageShell>
        <div className="mx-auto flex max-w-xl flex-col gap-5">
          <p className="text-[17px] text-muted">{resultUi.noResult[lang]}</p>
          <Link href="/scan" className={primaryButton}>
            <ScanLine size={22} aria-hidden />
            {t('scanCta', lang)}
          </Link>
        </div>
      </PageShell>
    );
  }

  // The pharmacist note and the buttons sit under the verdict on laptops, and at the end on phones.
  const advice = (
    <>
      <PharmacistNote verdict={result.verdict} />
      <ResultActions verdict={result.verdict} />
    </>
  );

  return (
    <PageShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-10">
        {/* Left on laptops: stays in view while the table scrolls */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <Link href="/" className="flex min-h-12 items-center gap-2 self-start text-[15px] font-semibold text-brand">
            <ArrowLeft size={20} aria-hidden />
            {resultUi.back[lang]}
          </Link>
          <VerdictBanner verdict={result.verdict} checks={result.checks} explanation={result.explanation} />
          {result.verdict === 'unreadable' && (
            <button type="button" onClick={retake} className={primaryButton}>
              <Camera size={22} aria-hidden />
              {resultUi.retake[lang]}
            </button>
          )}
          <div className="hidden flex-col gap-6 lg:flex">{advice}</div>
        </div>

        <div className="flex flex-col gap-6">
          <ComparisonTable checks={result.checks} verdict={result.verdict} />
          {/* Only for a clean result: explaining a suspicious pack's medicine could nudge people to take it */}
          {result.verdict === 'no_red_flags' && result.registry && (
            <MedicineInfo
              name={result.registry.name}
              strength={result.registry.strength}
              packName={result.extracted.name}
            />
          )}
          <div className="flex flex-col gap-6 lg:hidden">{advice}</div>
        </div>
      </div>
    </PageShell>
  );
}
