'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, ScanLine } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import { resultUi } from '@/lib/i18n/result';
import { ScreenFrame } from '@/components/result/ScreenFrame';
import { primaryButton } from '@/components/result/buttonStyles';
import { VerdictBanner } from '@/components/result/VerdictBanner';
import { ComparisonTable } from '@/components/result/ComparisonTable';
import { PharmacistNote } from '@/components/result/PharmacistNote';
import { ResultActions } from '@/components/result/ResultActions';

/** Owner: Melani. Try /result?mock=mismatch, ?mock=no_red_flags, ?mock=not_found, ?mock=expired, ?mock=unreadable (add &lang=pcm) */
export default function ResultPage() {
  const { result, lang, reset } = useVerify();
  const router = useRouter();

  function retake() {
    router.push('/scan');
    reset();
  }

  return (
    <ScreenFrame>
      {!result ? (
        <div className="flex flex-col gap-5 py-6">
          <p className="text-muted">{resultUi.noResult[lang]}</p>
          <Link href="/scan" className={primaryButton}>
            <ScanLine size={21} aria-hidden />
            {t('scanCta', lang)}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 py-6">
          <Link href="/" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-brand">
            <ArrowLeft size={18} aria-hidden />
            {resultUi.back[lang]}
          </Link>
          <VerdictBanner verdict={result.verdict} checks={result.checks} explanation={result.explanation} />
          {result.verdict === 'unreadable' && (
            <button type="button" onClick={retake} className={primaryButton}>
              <Camera size={21} aria-hidden />
              {resultUi.retake[lang]}
            </button>
          )}
          <ComparisonTable checks={result.checks} verdict={result.verdict} />
          <PharmacistNote verdict={result.verdict} />
          <ResultActions verdict={result.verdict} />
        </div>
      )}
    </ScreenFrame>
  );
}
