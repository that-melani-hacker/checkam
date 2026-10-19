'use client';

import { Camera, ImageIcon } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { scanUi } from '@/lib/i18n/scan';

type Props = { file: File | null; previewUrl: string | null };

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Owner: Vivian. The photo the user picked, or an empty frame before they pick one. */
export function PhotoPreview({ file, previewUrl }: Props) {
  const { lang } = useVerify();

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex aspect-[342/278] w-full items-center justify-center overflow-hidden rounded-[20px] bg-success-tint p-5">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URL, next/image can't optimise it
          <img
            src={previewUrl}
            alt=""
            className="size-full rounded-[14px] border border-primary object-contain"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-primary/40 text-primary">
            <Camera size={28} aria-hidden />
            <p className="text-sm font-semibold">{scanUi.emptyPreview[lang]}</p>
          </div>
        )}
      </div>

      {file && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <p className="flex min-w-0 items-center gap-1.5">
            <ImageIcon size={15} className="shrink-0 text-ink" aria-hidden />
            <span className="truncate">{file.name}</span>
            <span className="shrink-0">· {formatSize(file.size)}</span>
          </p>
          <p className="shrink-0">{scanUi.photoCount[lang]}</p>
        </div>
      )}
    </div>
  );
}