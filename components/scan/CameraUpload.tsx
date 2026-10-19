'use client';

import { useRef } from 'react';
import { ArrowRight, Camera, Plus, Upload } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { checkPhotosLabel, scanUi } from '@/lib/i18n/scan';
import { Button } from '@/components/ui/Button';

type Props = {
  onPhoto: (file: File) => void;
  /** How many photos are picked so far (0 before the first). */
  photoCount: number;
  /** True once no more photos fit in one check. */
  full: boolean;
  onCheck: () => void;
};

/** Owner: Vivian. input accept="image/*" capture="environment". Test D11.
 *  Two hidden inputs: one opens the rear camera, the other opens the gallery.
 *  After the first photo, the user can add more sides of the same pack. */
export function CameraUpload({ onPhoto, photoCount, full, onCheck }: Props) {
  const { lang } = useVerify();
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // The gallery allows picking several photos at once; the page ignores any past the limit.
    Array.from(e.target.files ?? []).forEach(onPhoto);
    e.target.value = ''; // so picking the same photo again still fires onChange
  }

  const openCamera = () => cameraInput.current?.click();
  const openGallery = () => galleryInput.current?.click();

  return (
    <div className="flex flex-col gap-2.5">
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      <input
        ref={galleryInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      {photoCount > 0 ? (
        <>
          <Button onClick={onCheck} icon={<ArrowRight size={21} aria-hidden />}>
            {checkPhotosLabel(photoCount, lang)}
          </Button>
          {full ? (
            <p className="text-center text-xs text-muted">{scanUi.maxPhotos[lang]}</p>
          ) : (
            <>
              <p className="text-center text-xs leading-normal text-muted">{scanUi.sidesHint[lang]}</p>
              <Button variant="secondary" onClick={openCamera} icon={<Plus size={21} aria-hidden />}>
                {scanUi.addSide[lang]}
              </Button>
              <Button variant="link" onClick={openGallery} icon={<Upload size={18} aria-hidden />}>
                {scanUi.uploadAnother[lang]}
              </Button>
            </>
          )}
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
