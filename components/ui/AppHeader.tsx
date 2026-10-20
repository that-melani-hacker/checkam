import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CONTAINER } from '@/lib/ui/layout';

/** Owner: Vivian. Logo + English/Pidgin toggle + light/dark switch. Stays at the top while scrolling. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-18 items-center justify-between gap-3 md:h-20`}>
        <Link href="/" className="flex items-center gap-2" aria-label="CheckAm home">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary shadow-sm">
            <ShieldCheck size={22} className="text-white" aria-hidden />
          </span>
          {/* Very small phones show just the logo so the toggles fit; the link still says "CheckAm home" */}
          <span className="hidden text-[22px] font-bold tracking-tight text-primary-strong min-[380px]:inline md:text-2xl">CheckAm</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
