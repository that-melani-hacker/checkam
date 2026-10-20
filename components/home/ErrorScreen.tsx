'use client';

import { CircleAlert, Clock, Hourglass, ImageOff, RotateCcw, WifiOff, type LucideIcon } from 'lucide-react';
import type { ClientErrorCode } from '@/lib/types';
import { useVerify } from '@/lib/state/VerifyContext';
import { errorCopy, errorUi } from '@/lib/i18n/errors';
import { Button } from '@/components/ui/Button';

type Props = {
  code: ClientErrorCode;
  /** Sends the same photos again. */
  onRetry: () => void;
  /** Goes back to the photo step (to change or add photos). */
  onChoosePhoto?: () => void;
};

const icons: Record<ClientErrorCode, LucideIcon> = {
  no_image: ImageOff,
  bad_file_type: ImageOff,
  file_too_large: ImageOff,
  rate_limited: Hourglass,
  ai_unavailable: CircleAlert,
  server_error: CircleAlert,
  timeout: Clock,
  offline: WifiOff,
};

// These are about the photo itself, so retrying the same photo can't help.
const PHOTO_PROBLEMS: ClientErrorCode[] = ['no_image', 'bad_file_type', 'file_too_large'];

/** Owner: Albert. One message per error code, with retry. Test D8. */
export function ErrorScreen({ code, onRetry, onChoosePhoto }: Props) {
  const { lang } = useVerify();
  const Icon = icons[code];
  const copy = errorCopy[code];
  const photoProblem = PHOTO_PROBLEMS.includes(code);

  return (
    <div className="flex flex-col gap-5">
      <section role="alert" className="flex flex-col gap-3 rounded-3xl bg-neutral-tint p-6 md:p-8">
        <p className="flex items-center gap-2 text-[13px] font-bold tracking-wide text-neutral">
          <Icon size={24} aria-hidden />
          {errorUi.eyebrow[lang]}
        </p>
        <h1 className="text-[28px] leading-[1.15] font-bold tracking-tight text-ink md:text-4xl">{copy.title[lang]}</h1>
        <p className="text-base leading-relaxed text-ink md:text-[17px]">{copy.body[lang]}</p>
      </section>

      <div className="flex flex-col gap-2.5">
        {photoProblem ? (
          <Button onClick={onChoosePhoto ?? onRetry} icon={<ImageOff size={21} aria-hidden />}>
            {errorUi.choosePhoto[lang]}
          </Button>
        ) : (
          <>
            <Button onClick={onRetry} icon={<RotateCcw size={21} aria-hidden />}>
              {errorUi.tryAgain[lang]}
            </Button>
            {onChoosePhoto && (
              <Button variant="link" onClick={onChoosePhoto}>
                {errorUi.backToPhotos[lang]}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
