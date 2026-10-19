'use client';

import { useRef } from 'react';
import { ArrowRight, Camera, Upload } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';
import { Button } from '@/components/ui/Button';

type Props = {
  onPhoto: (file: File) => void;
  hasPhoto: boolean;
  onCheck: () => void;
};

/** Owner: Vivian. input accept="image/*" capture="environment". Test D11.
 *  Two hidden inputs: one opens the rear camera, the other opens the gallery. */
export function CameraUpload({ onPhoto, hasPhoto, onCheck }: Props) {
  const { lang } = useVerify();
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // so picking the same photo again still fires onChange
    if (file) onPhoto(file);
  }

  const openCamera = () => cameraInput.current?.click();
  const openGallery = () => galleryInput.current?.click();

  return (
    <div className="flex flex-col gap-2.5">
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      <input ref={galleryInput} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={handleChange} />

      {hasPhoto ? (
        <>
          <Button onClick={onCheck} icon={<ArrowRight size={21} aria-hidden />}>
            {scanUi.checkPhoto[lang]}
          </Button>
          <Button variant="secondary" onClick={openCamera} icon={<Camera size={21} aria-hidden />}>
            {scanUi.retake[lang]}
          </Button>
          <Button variant="link" onClick={openGallery} icon={<Upload size={18} aria-hidden />}>
            {scanUi.uploadDifferent[lang]}
          </Button>
        </>
      ) : (
        <>
          <Button onClick={openCamera} icon={<Camera size={21} aria-hidden />}>
            {scanUi.takePhoto[lang]}
          </Button>
          <Button variant="link" onClick={openGallery} icon={<Upload size={18} aria-hidden />}>
            {scanUi.uploadPhoto[lang]}
          </Button>
        </>
      )}
    </div>
  );
}