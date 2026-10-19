import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/** Owner: Vivian. Logo + English/Pidgin toggle + light/dark switch, same as the Home header. */
export function AppHeader() {
  return (
    // -mx-6 cancels the layout's px-6 so the bottom border runs edge to edge like Figma
    <header className="-mx-6 flex h-20 items-center justify-between gap-3 border-b border-border px-6">
      <Link href="/" className="flex items-center gap-1.75" aria-label="CheckAm home">
        <span className="flex h-8.5 w-7.5 items-center justify-center rounded-[10px] bg-primary">
          <ShieldCheck size={21} className="text-white" aria-hidden />
        </span>
        <span className="text-[22px] font-bold text-primary-strong">CheckAm</span>
      </Link>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}