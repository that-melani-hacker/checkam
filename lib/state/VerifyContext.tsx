'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang, Nullable, Verdict, VerifyResponse, VerifyState } from '@/lib/types';
import { mockResponses } from '@/lib/mock/responses';

/** Owner: Melani. Holds the one answer from /api/verify while the user moves between screens. */
const VerifyContext = createContext<Nullable<VerifyState>>(null);

export function VerifyProvider({ children }: { children: React.ReactNode }) {
  const [result, setResultState] = useState<Nullable<VerifyResponse>>(null);
  const [photoUrl, setPhotoUrl] = useState<Nullable<string>>(null);
  const [lang, setLang] = useState<Lang>('en');

  const setResult = useCallback((next: VerifyResponse, nextPhotoUrl: string) => {
    setPhotoUrl((old) => {
      if (old && old.startsWith('blob:') && old !== nextPhotoUrl) URL.revokeObjectURL(old);
      return nextPhotoUrl;
    });
    setResultState(next);
  }, []);

  const reset = useCallback(() => {
    setPhotoUrl((old) => {
      if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
      return null;
    });
    setResultState(null);
  }, []);

  // Dev helper: ?mock=mismatch (or any verdict) loads a mock answer, ?lang=pcm switches to Pidgin.
  // It reads the URL after hydration, so setting state in this effect is intended.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mock = params.get('mock') as Verdict | null;
    if (mock && mock in mockResponses) setResult(mockResponses[mock], '/mock-pack.svg');
    if (params.get('lang') === 'pcm') setLang('pcm');
  }, [setResult]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const value = useMemo<VerifyState>(
    () => ({ result, photoUrl, lang, setResult, setLang, reset }),
    [result, photoUrl, lang, setResult, reset],
  );

  return <VerifyContext.Provider value={value}>{children}</VerifyContext.Provider>;
}

export function useVerify(): VerifyState {
  const ctx = useContext(VerifyContext);
  if (!ctx) throw new Error('useVerify must be used inside <VerifyProvider>');
  return ctx;
}
