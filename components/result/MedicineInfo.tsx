'use client';

import { useEffect, useState } from 'react';
import { BookOpen, LoaderCircle } from 'lucide-react';
import type { MedicineInfo as Info, Nullable } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { resultUi } from '@/lib/i18n/result';

type Props = {
  name: string; // NAFDAC's registered product name
  strength: Nullable<string>;
  packName: Nullable<string>; // the name as read on the pack, which often includes the generic name
};

const TIMEOUT_MS = 20_000;

/**
 * Owner: Melani. "About this medicine": general, plain-language information about the registered product.
 * Loads after the verdict so it never slows the check down; hides itself if anything goes wrong.
 */
export function MedicineInfo({ name, strength, packName }: Props) {
  const { lang } = useVerify();
  const [info, setInfo] = useState<Info | 'loading' | 'hidden'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, strength, packName }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? (res.json() as Promise<Info>) : null))
      .then((data) => setInfo(data?.known ? data : 'hidden'))
      .catch(() => setInfo('hidden'))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [name, strength, packName]);

  if (info === 'hidden' || (info !== 'loading' && !info.known)) return null;

  if (info === 'loading') {
    return (
      <p className="card flex items-center gap-3 p-5 text-[15px] text-muted" aria-live="polite">
        <LoaderCircle size={18} className="shrink-0 animate-spin text-brand" aria-hidden />
        {resultUi.aboutLoading[lang]}
      </p>
    );
  }

  const text = info[lang];
  return (
    <section className="card flex flex-col gap-5 p-5 md:p-7" aria-live="polite">
      <h2 className="flex items-center gap-3 text-lg font-bold text-ink md:text-xl">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
          <BookOpen size={22} aria-hidden />
        </span>
        {resultUi.aboutTitle[lang]}
      </h2>
      <p className="text-base leading-relaxed text-ink md:text-[17px]">{text.summary}</p>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-muted">{resultUi.aboutUses[lang]}</h3>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed text-ink marker:text-brand">
          {text.uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>

      {text.tips.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-muted">{resultUi.aboutTips[lang]}</h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed text-ink marker:text-brand">
            {text.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="border-t border-border pt-4 text-[13px] leading-relaxed text-muted">{resultUi.aboutDisclaimer[lang]}</p>
    </section>
  );
}
