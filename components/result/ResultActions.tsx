'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flag, ScanLine } from 'lucide-react';
import type { Verdict } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import { primaryButton, secondaryButton } from '@/components/result/buttonStyles';

type Props = { verdict: Verdict };

const RED: Verdict[] = ['mismatch', 'not_found', 'expired'];

/**
 * Owner: Melani. Report (red states), Check another, Retake (unreadable).
 * Same order on every verdict; red verdicts make Report the filled button.
 */
export function ResultActions({ verdict }: Props) {
  const { lang, reset } = useVerify();
  const router = useRouter();
  const red = RED.includes(verdict);

  // A new check starts from Home, like the first one did.
  function checkAnother() {
    router.push('/');
    reset();
  }

  return (
    <div className="flex flex-col gap-2.5">
      <Link href="/report" className={red ? primaryButton : secondaryButton}>
        <Flag size={21} aria-hidden />
        {t('reportCta', lang)}
      </Link>
      <button type="button" onClick={checkAnother} className={red ? secondaryButton : primaryButton}>
        <ScanLine size={21} aria-hidden />
        {t('checkAnother', lang)}
      </button>
    </div>
  );
}
