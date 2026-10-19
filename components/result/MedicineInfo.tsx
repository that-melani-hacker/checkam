'use client';

import { useEffect, useState } from 'react';
import { BookOpen, LoaderCircle } from 'lucide-react';
import type { MedicineInfo as Info, Nullable } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { resultUi } from '@/lib/i18n/result';

type Props = { name: string; strength: Nullable<string> };

const TIMEOUT_MS = 20_000;

/**
 * Owner: Melani. "About this medicine": general, plain-language information about the registered product.
 * Loads after the verdict so it never slows the check down; hides itself if anything goes wrong.
 */
export function MedicineInfo({ name, strength }: Props) {
  const { lang } = useVerify();
  const [info, setInfo] = useState<Info | 'loading' | 'hidden'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, strength }),
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
  }, [name, strength]);

  if (info === 'hidden' || (info !== 'loading' && !info.known)) return null;

  if (info === 'loading') {
    return (
      <p className="flex items-center gap-2 rounded-[14px] border border-border p-4 text-[13px] text-muted" aria-live="polite">
        <LoaderCircle size={18} className="shrink-0 animate-spin text-brand" aria-hidden />
        {resultUi.aboutLoading[lang]}
      </p>
    );
  }

  const text = info[lang];
  return (
    <section className="flex flex-col gap-4 rounded-[14px] border border-border p-4" aria-live="polite">
      <h2 className="flex items-center gap-2 text-base font-bold text-ink">
        <BookOpen size={20} className="shrink-0 text-brand" aria-hidden />
        {resultUi.aboutTitle[lang]}
      </h2>
      <p className="text-sm leading-normal text-ink">{text.summary}</p>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-bold text-muted">{resultUi.aboutUses[lang]}</h3>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-normal text-ink">
          {text.uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>

      {text.tips.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-bold text-muted">{resultUi.aboutTips[lang]}</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-normal text-ink">
            {text.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="border-t border-border pt-3 text-[11px] leading-normal text-muted">{resultUi.aboutDisclaimer[lang]}</p>
    </section>
  );
}
