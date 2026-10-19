'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, ExternalLink, FilePenLine, Package, Share2 } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { reportUi } from '@/lib/i18n/report';
import { MED_SAFETY_URL, buildReportText, copyReport, shareReport } from '@/lib/report/report';
import { ReportSummary } from '@/components/report/ReportSummary';
import { ScreenFrame } from '@/components/result/ScreenFrame';
import { primaryButton as primary, secondaryButton as secondary } from '@/components/result/buttonStyles';

/** Owner: Melani. Try /report?mock=mismatch (add &lang=pcm). Test: D6 */
export default function ReportPage() {
  const { result, photoUrl, lang } = useVerify();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  if (!result || !photoUrl) {
    return (
      <ScreenFrame>
        <p className="py-6 text-muted">{reportUi.nothingYet[lang]}</p>
      </ScreenFrame>
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
    <ScreenFrame>
      <div className="flex flex-col gap-[22px] py-6">
        <Link href="/result" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-brand">
          <ArrowLeft size={18} aria-hidden />
          {reportUi.back[lang]}
        </Link>

        <header className="flex flex-col gap-3">
          <p className="text-[11px] font-bold text-brand">{reportUi.eyebrow[lang]}</p>
          <h1 className="text-[29px] font-bold text-ink">{reportUi.title[lang]}</h1>
          <p className="text-base leading-normal text-muted">{reportUi.intro[lang]}</p>
        </header>

        <p className="flex items-center gap-2 rounded-lg bg-neutral-tint px-3.5 py-3 text-[13px] font-semibold text-neutral">
          <FilePenLine size={18} aria-hidden />
          {reportUi.draft[lang]}
        </p>

        <ReportSummary result={result} photoUrl={photoUrl} />

        <div className="flex flex-col gap-2.5">
          <a href={MED_SAFETY_URL} target="_blank" rel="noopener noreferrer" className={primary}>
            <ExternalLink size={21} aria-hidden />
            {reportUi.openMedSafety[lang]}
          </a>
          <button type="button" className={secondary} onClick={onShare}>
            <Share2 size={21} aria-hidden />
            {reportUi.share[lang]}
          </button>
          <button type="button" className={secondary} onClick={onCopy} aria-live="polite">
            <Copy size={21} aria-hidden />
            {copyState === 'copied' ? reportUi.copied[lang] : reportUi.copy[lang]}
          </button>
          {copyState === 'failed' && <p className="text-center text-xs text-danger">{reportUi.copyFailed[lang]}</p>}
          <p className="text-center text-xs leading-normal text-muted">
            {reportUi.notSubmitted1[lang]}
            <br />
            {reportUi.notSubmitted2[lang]}
          </p>
        </div>

        <aside className="flex items-start gap-[11px] rounded-[14px] bg-subtle p-4">
          <Package size={21} className="shrink-0 text-brand" aria-hidden />
          <div className="flex flex-col gap-[5px]">
            <p className="text-sm font-semibold text-ink">{reportUi.keepTitle[lang]}</p>
            <p className="text-[13px] leading-normal text-muted">{reportUi.keepBody[lang]}</p>
          </div>
        </aside>
      </div>
    </ScreenFrame>
  );
}