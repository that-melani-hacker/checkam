'use client';

import { useVerify } from '@/lib/state/VerifyContext';
import { VerdictBanner } from '@/components/result/VerdictBanner';
import { ComparisonTable } from '@/components/result/ComparisonTable';
import { PharmacistNote } from '@/components/result/PharmacistNote';
import { ResultActions } from '@/components/result/ResultActions';

/** Owner: Melani. Try /result?mock=mismatch, ?mock=no_red_flags, ?mock=not_found, ?mock=expired, ?mock=unreadable */
export default function ResultPage() {
  const { result } = useVerify();
  if (!result) return <p className="py-6">No result yet. Scan a drug first.</p>;
  return (
    <div className="space-y-6 py-6">
      <VerdictBanner verdict={result.verdict} checks={result.checks} explanation={result.explanation} />
      <ComparisonTable checks={result.checks} />
      <PharmacistNote verdict={result.verdict} />
      <ResultActions verdict={result.verdict} />
    </div>
  );
}
