'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { ClientError, getTestTag, resizeImage, verifyPhoto } from '@/lib/api/client';
import { MAX_PHOTOS, type ClientErrorCode } from '@/lib/types';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppFooter } from '@/components/ui/AppFooter';
import { PhotoPreview, type PickedPhoto } from '@/components/scan/PhotoPreview';
import { PhotoTips } from '@/components/scan/PhotoTips';
import { CameraUpload } from '@/components/scan/CameraUpload';
import { LoadingView } from '@/components/scan/LoadingView';
import { ErrorScreen } from '@/components/home/ErrorScreen';

type Phase = 'choose' | 'checking' | 'error';

const READING_STEP_MS = 2500; // the API gives one answer, so step 1 -> 2 is timed
// Several photos must fit in one upload together, so they're shrunk a little more.
const WIDTH_ONE_PHOTO = 1600;
const WIDTH_SEVERAL_PHOTOS = 1280;

/** Owner: Vivian. Step 1 (Camera and upload) and step 2 (Loading) from the Figma frames. */
export default function ScanPage() {
  const router = useRouter();
  const { lang, setResult } = useVerify();

  const [phase, setPhase] = useState<Phase>('choose');
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [step, setStep] = useState(0);
  const [errorCode, setErrorCode] = useState<ClientErrorCode>('server_error');
  const [fileError, setFileError] = useState(false);

  // Free the preview URLs when we leave, except the first one if it was handed to the Result screen
  const photosRef = useRef<PickedPhoto[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  const handedOff = useRef<string | null>(null);
  useEffect(
    () => () => {
      photosRef.current.forEach((p) => p.url !== handedOff.current && URL.revokeObjectURL(p.url));
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
    setPhotos((current) => {
      if (current.length >= MAX_PHOTOS) return current;
      return [...current, { file: next, url: URL.createObjectURL(next) }];
    });
  }

  function handleRemove(index: number) {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].url);
      return current.filter((_, i) => i !== index);
    });
  }

  async function handleCheck() {
    if (photos.length === 0) return;
    setPhase('checking');
    setStep(0);
    const timer = setTimeout(() => setStep(1), READING_STEP_MS);

    try {
      const width = photos.length === 1 ? WIDTH_ONE_PHOTO : WIDTH_SEVERAL_PHOTOS;
      const resized = await Promise.all(photos.map((p) => resizeImage(p.file, width)));
      const response = await verifyPhoto(resized, getTestTag());
      // The Result and Report screens show the first photo.
      handedOff.current = photos[0].url;
      setResult(response, photos[0].url);
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

          <PhotoPreview photos={photos} onRemove={handleRemove} />
          {fileError && (
            <p role="alert" className="text-sm font-semibold text-danger">
              {scanUi.notAnImage[lang]}
            </p>
          )}

          <PhotoTips />

          <CameraUpload
            onPhoto={handlePhoto}
            photoCount={photos.length}
            full={photos.length >= MAX_PHOTOS}
            onCheck={handleCheck}
          />

          <p className="text-center text-xs leading-normal text-muted">{scanUi.privacy[lang]}</p>
        </div>
      )}

      <AppFooter />
    </div>
  );
}