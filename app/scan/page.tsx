'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { ClientError, getTestTag, resizeImage, verifyPhoto } from '@/lib/api/client';
import { MAX_PHOTOS, type ClientErrorCode } from '@/lib/types';
import { PageShell } from '@/components/ui/PageShell';
import { NARROW } from '@/lib/ui/layout';
import { PhotoPreview, type PickedPhoto } from '@/components/scan/PhotoPreview';
import { PhotoTips } from '@/components/scan/PhotoTips';
import { CameraUpload } from '@/components/scan/CameraUpload';
import { LoadingView } from '@/components/scan/LoadingView';
import { ErrorScreen } from '@/components/home/ErrorScreen';
import { OfflineBanner } from '@/components/home/OfflineBanner';

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

  // Every visit to Scan is a new check. Next.js keeps left pages alive in the background (Activity, with
  // cacheComponents), so when this page is hidden we start it fresh: back to step 1, no photos.
  // The preview URLs are freed, except the first one if it was handed to the Result screen.
  const photosRef = useRef<PickedPhoto[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  const handedOff = useRef<string | null>(null);
  useLayoutEffect(
    () => () => {
      photosRef.current.forEach((p) => p.url !== handedOff.current && URL.revokeObjectURL(p.url));
      photosRef.current = [];
      handedOff.current = null;
      setPhotos([]);
      setPhase('choose');
      setStep(0);
      setFileError(false);
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
    <PageShell>
      {phase === 'checking' && <LoadingView step={step} />}

      {phase === 'error' && (
        <div className={NARROW}>
          {/* The photos are kept: Try again sends them again, or go back to change them */}
          <ErrorScreen code={errorCode} onRetry={handleCheck} onChoosePhoto={() => setPhase('choose')} />
        </div>
      )}

      {phase === 'choose' && (
        <div className="flex flex-col gap-6 md:gap-8">
          <Link href="/" className="flex min-h-12 items-center gap-2 self-start text-[15px] font-semibold text-brand">
            <ArrowLeft size={20} aria-hidden />
            {scanUi.back[lang]}
          </Link>

          <OfflineBanner />

          <section className="flex flex-col gap-3 md:max-w-2xl">
            <p className="text-[13px] font-bold tracking-wide text-brand">{scanUi.eyebrow[lang]}</p>
            <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight text-ink md:text-5xl">{scanUi.title[lang]}</h1>
            <p className="text-[17px] leading-relaxed text-muted md:text-lg">{scanUi.intro[lang]}</p>
          </section>

          {/* Phones: one column. Laptops: the photo on the left, tips and buttons on the right. */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-10">
            <div className="flex flex-col gap-3">
              <PhotoPreview photos={photos} onRemove={handleRemove} />
              {fileError && (
                <p role="alert" className="text-[15px] font-semibold text-danger">
                  {scanUi.notAnImage[lang]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <PhotoTips />
              <CameraUpload
                onPhoto={handlePhoto}
                photoCount={photos.length}
                full={photos.length >= MAX_PHOTOS}
                onCheck={handleCheck}
              />
              <p className="text-center text-sm leading-relaxed text-muted">{scanUi.privacy[lang]}</p>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}