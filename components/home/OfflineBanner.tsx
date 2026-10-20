'use client';

import { WifiOff } from 'lucide-react';
import { useOnline } from '@/lib/hooks/useOnline';
import { useVerify } from '@/lib/state/VerifyContext';
import { errorUi } from '@/lib/i18n/errors';

/** Owner: Albert. Shows only while the phone is offline; disappears when the connection is back. Test D9. */
export function OfflineBanner() {
  const online = useOnline();
  const { lang } = useVerify();
  if (online) return null;

  return (
    <p role="status" className="flex items-center gap-3 rounded-2xl bg-neutral-tint px-4 py-3.5 text-[15px] font-semibold text-neutral">
      <WifiOff size={20} className="shrink-0" aria-hidden />
      {errorUi.offlineBanner[lang]}
    </p>
  );
}
