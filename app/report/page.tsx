'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, ExternalLink, FilePenLine, Package, Share2 } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { reportUi } from '@/lib/i18n/report';
import { MED_SAFETY_WEB, buildReportText, copyReport, getMedSafetyUrl, shareReport } from '@/lib/report/report';
import { ReportSummary } from '@/components/report/ReportSummary';
import { PageShell } from '@/components/ui/PageShell';
import { primaryButton as primary, secondaryButton as secondary } from '@/components/result/buttonStyles';

// The phone type never changes while the page is open, so there's nothing to subscribe to.
const noSubscribe = () => () => {};

/** Owner: Melani. Try /report?mock=mismatch (add &lang=pcm). Test: D6 */
export default function ReportPage() {
  const { result, photoUrl, lang } = useVerify();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  // The server can't see the phone, so it renders the web link; the browser swaps in the right store.
  const medSafetyUrl = useSyncExternalStore(noSubscribe, getMedSafetyUrl, () => MED_SAFETY_WEB);

  if (!result || !photoUrl) {
    return (
      <PageShell>
        <p className="mx-auto max-w-xl text-[17px] text-muted">{reportUi.nothingYet[lang]}</p>
      </PageShell>
    );
  }
  const text = buildReportText(result);

  async function onShare() {
    let photo: Blob | undefined;
    try {
      photo = await (await fetch(photoUrl!)).blob();
    } catch {
      photo = undefined;
    }
    await shareReport(text, photo);
  }

  async function onCopy() {
    const ok = await copyReport(text);
    setCopyState(ok ? 'copied' : 'failed');
    if (ok) setTimeout(() => setCopyState('idle'), 2500);
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6 md:gap-8">
        <Link href="/result" className="flex min-h-12 items-center gap-2 self-start text-[15px] font-semibold text-brand">
          <ArrowLeft size={20} aria-hidden />
          {reportUi.back[lang]}
        </Link>

        <header className="flex flex-col gap-3 md:max-w-2xl">
          <p className="text-[13px] font-bold tracking-wide text-brand">{reportUi.eyebrow[lang]}</p>
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight text-ink md:text-5xl">{reportUi.title[lang]}</h1>
          <p className="text-[17px] leading-relaxed text-muted md:text-lg">{reportUi.intro[lang]}</p>
        </header>

        {/* Phones: one column. Laptops: the summary on the left, the report buttons on the right. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-6">
            <p className="flex items-center gap-3 rounded-2xl bg-neutral-tint px-4 py-3.5 text-[15px] font-semibold text-neutral">
              <FilePenLine size={20} aria-hidden />
              {reportUi.draft[lang]}
            </p>
            <ReportSummary result={result} photoUrl={photoUrl} />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="flex flex-col gap-3">
              <a href={medSafetyUrl} target="_blank" rel="noopener noreferrer" className={primary}>
                <ExternalLink size={22} aria-hidden />
                {reportUi.openMedSafety[lang]}
              </a>
              <button type="button" className={secondary} onClick={onShare}>
                <Share2 size={22} aria-hidden />
                {reportUi.share[lang]}
              </button>
              <button type="button" className={secondary} onClick={onCopy} aria-live="polite">
                <Copy size={22} aria-hidden />
                {copyState === 'copied' ? reportUi.copied[lang] : reportUi.copy[lang]}
              </button>
              {copyState === 'failed' && <p className="text-center text-sm text-danger">{reportUi.copyFailed[lang]}</p>}
              <p className="text-center text-sm leading-relaxed text-muted">
                {reportUi.notSubmitted1[lang]}
                <br />
                {reportUi.notSubmitted2[lang]}
              </p>
            </div>

            <aside className="card flex items-start gap-3.5 p-5 md:p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                <Package size={22} aria-hidden />
              </span>
              <div className="flex flex-col gap-1.5">
                <p className="text-base font-semibold text-ink md:text-lg">{reportUi.keepTitle[lang]}</p>
                <p className="text-[15px] leading-relaxed text-muted md:text-base">{reportUi.keepBody[lang]}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageShell>
  );
}