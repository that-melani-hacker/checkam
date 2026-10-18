'use client';

import { useVerify } from '@/lib/state/VerifyContext';
import { ReportSummary } from '@/components/report/ReportSummary';

/** Owner: Melani. Try /report?mock=mismatch */
export default function ReportPage() {
  const { result, photoUrl } = useVerify();
  if (!result || !photoUrl) return <p className="py-6">Nothing to report yet.</p>;
  return (
    <div className="space-y-6 py-6">
      <ReportSummary result={result} photoUrl={photoUrl} />
    </div>
  );
}
