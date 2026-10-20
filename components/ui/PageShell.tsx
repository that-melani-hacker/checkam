'use client';

import { useVerify } from '@/lib/state/VerifyContext';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppFooter } from '@/components/ui/AppFooter';
import { CONTAINER } from '@/lib/ui/layout';

/** Every screen: sticky header, the page column, and the disclosure footer pinned to the bottom. */
export function PageShell({ children }: { children: React.ReactNode }) {
  const { lang } = useVerify();
  return (
    <div lang={lang === 'pcm' ? 'pcm' : 'en'} className="flex min-h-dvh flex-col">
      <AppHeader />
      <div className={`${CONTAINER} flex-1 py-6 md:py-10 lg:py-12`}>{children}</div>
      <AppFooter />
    </div>
  );
}
