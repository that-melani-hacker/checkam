'use client';

import { CircleCheck, LoaderCircle } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';

type Props = { step: number };

/** Owner: Vivian. Reading pack, then checking NAFDAC records.
 *  step 0 = still reading the pack, step 1 = reading done, checking records. */
export function CheckingSteps({ step }: Props) {
  const { lang } = useVerify();
  const readingDone = step >= 1;

  return (
    <ol className="card flex flex-col px-5 md:px-6">
      <li className="flex items-start gap-3 border-b border-border py-5">
        {readingDone ? (
          <CircleCheck size={22} className="mt-px shrink-0 text-brand" aria-hidden />
        ) : (
          <LoaderCircle size={22} className="mt-px shrink-0 animate-spin text-brand motion-reduce:animate-none" aria-hidden />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className={`text-[17px] ${readingDone ? 'text-ink' : 'font-semibold text-brand'}`}>{scanUi.stepReading[lang]}</p>
          <p className="text-sm text-muted">{readingDone ? scanUi.stepReadingDone[lang] : scanUi.stepReadingActive[lang]}</p>
        </div>
        {readingDone && <p className="shrink-0 pt-1 text-sm font-semibold text-brand">{scanUi.stepDone[lang]}</p>}
      </li>

      <li className="flex items-start gap-3 py-5">
        <LoaderCircle
          size={22}
          className={`mt-px shrink-0 ${readingDone ? 'animate-spin text-brand motion-reduce:animate-none' : 'text-border'}`}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className={`text-[17px] ${readingDone ? 'font-semibold text-brand' : 'text-muted'}`}>{scanUi.stepChecking[lang]}</p>
          <p className="text-sm text-muted">{scanUi.stepCheckingStatus[lang]}</p>
        </div>
      </li>
    </ol>
  );
}