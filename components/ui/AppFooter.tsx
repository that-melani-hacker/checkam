'use client';

import { Info } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';
import { CONTAINER } from '@/lib/ui/layout';

/** Owner: Vivian. The disclosure line at the bottom of every screen. */
export function AppFooter() {
  const { lang } = useVerify();
  return (
    <footer className="mt-auto border-t border-border">
      <div className={`${CONTAINER} flex items-start gap-2 py-6`}>
        <Info size={16} className="mt-0.5 shrink-0 text-muted" aria-hidden />
        <p className="flex-1 text-[13px] leading-relaxed text-muted">{t('footerDisclosure', lang)}</p>
      </div>
    </footer>
  );
}
