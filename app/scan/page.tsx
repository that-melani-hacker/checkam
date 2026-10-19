'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { ClientError, getTestTag, resizeImage, verifyPhoto } from '@/lib/api/client';
import type { ClientErrorCode } from '@/lib/types';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppFooter } from '@/components/ui/AppFooter';
import { PhotoPreview } from '@/components/scan/PhotoPreview';
import { PhotoTips } from '@/components/scan/PhotoTips';
import { CameraUpload } from '@/components/scan/CameraUpload';
import { LoadingView } from '@/components/scan/LoadingView';
import { ErrorScreen } from '@/components/home/ErrorScreen';

type Phase = 'choose' | 'checking' | 'error';

const READING_STEP_MS = 2500; // the API gives one answer, so step 1 -> 2 is timed

/** Owner: Vivian. Step 1 (Camera and upload) and step 2 (Loading) from the Figma frames. */
export default function ScanPage() {
  const router = useRouter();
  const { lang, setResult } = useVerify();

  const [phase, setPhase] = useState<Phase>('choose');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [errorCode, setErrorCode] = useState<ClientErrorCode>('server_error');
  const [fileError, setFileError] = useState(false);

  // Free the preview URL when we leave, unless it was handed to the Result screen
  const urlRef = useRef<string | null>(null);
  const handedOff = useRef(false);
  useEffect(
    () => () => {
      if (urlRef.current && !handedOff.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  // Each phase starts at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  function handlePhoto(next: File) {
    if (next.type && !next.type.startsWith('image/')) {
      setFileError(true);
      return;
    }
    setFileError(false);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(next);
    urlRef.current = url;
    setFile(next);
    setPreviewUrl(url);
  }

  async function handleCheck() {
    if (!file || !previewUrl) return;
    setPhase('checking');
    setStep(0);
    const timer = setTimeout(() => setStep(1), READING_STEP_MS);

    try {
      const photo = await resizeImage(file);
      const response = await verifyPhoto(photo, getTestTag());
      handedOff.current = true;
      setResult(response, previewUrl);
      router.push('/result');
    } catch (err) {
      setErrorCode(err instanceof ClientError ? err.code : 'server_error');
      setPhase('error');
    } finally {
      clearTimeout(timer);
    }
  }

  return (
    <div lang={lang === 'pcm' ? 'pcm' : 'en'} className="flex min-h-dvh flex-col">
      <AppHeader />

      {phase === 'checking' && <LoadingView step={step} />}

      {phase === 'error' && (
        <div className="py-6">
          {/* Retry keeps the photo, so the user can press Check again or retake */}
          <ErrorScreen code={errorCode} onRetry={() => setPhase('choose')} />
        </div>
      )}

      {phase === 'choose' && (
        <div className="flex flex-col gap-6 py-6">
          <Link href="/" className="flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary">
            <ArrowLeft size={18} aria-hidden />
            {scanUi.back[lang]}
          </Link>

          <section className="flex flex-col gap-3">
            <p className="text-[11px] font-bold text-primary">{scanUi.eyebrow[lang]}</p>
            <h1 className="text-[29px] font-bold leading-[1.2] text-ink">{scanUi.title[lang]}</h1>
            <p className="text-base leading-normal text-muted">{scanUi.intro[lang]}</p>
          </section>

          <PhotoPreview file={file} previewUrl={previewUrl} />
          {fileError && (
            <p role="alert" className="text-sm font-semibold text-danger">
              {scanUi.notAnImage[lang]}
            </p>
          )}

          <PhotoTips />

          <CameraUpload onPhoto={handlePhoto} hasPhoto={!!file} onCheck={handleCheck} />

          <p className="text-center text-xs leading-normal text-muted">{scanUi.privacy[lang]}</p>
        </div>
      )}

      <AppFooter />
    </div>
  );
}