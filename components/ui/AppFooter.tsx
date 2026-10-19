'use client';

import { Info } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { t } from '@/lib/i18n/strings';

/** Owner: Vivian. The disclosure line at the bottom of every screen. */
export function AppFooter() {
  const { lang } = useVerify();
  return (
    // -mx-6 so the top border runs edge to edge; mt-auto pins it to the bottom on tall screens
    <footer className="-mx-6 mt-auto flex items-start gap-1.75 border-t border-border px-6 py-5">
      <Info size={15} className="mt-px shrink-0 text-muted" aria-hidden />
      <p className="flex-1 text-[11px] leading-normal text-muted">{t('footerDisclosure', lang)}</p>
    </footer>
  );
}