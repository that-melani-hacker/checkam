'use client';

import { Camera, ImageIcon, X } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';
import { photoCount, scanUi } from '@/lib/i18n/scan';

export type PickedPhoto = { file: File; url: string };

type Props = { photos: PickedPhoto[]; onRemove: (index: number) => void };

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Owner: Vivian. The photos the user picked (one per side of the pack), or an empty frame before they pick one. */
export function PhotoPreview({ photos, onRemove }: Props) {
  const { lang } = useVerify();
  const latest = photos[photos.length - 1];
  const totalBytes = photos.reduce((sum, p) => sum + p.file.size, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex aspect-[342/278] w-full items-center justify-center overflow-hidden rounded-3xl bg-brand-tint p-5 md:p-6">
        {latest ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URL, next/image can't optimise it
          <img
            src={latest.url}
            alt=""
            className="size-full rounded-2xl border border-primary object-contain"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand/40 text-brand">
            <Camera size={34} aria-hidden />
            <p className="text-base font-semibold">{scanUi.emptyPreview[lang]}</p>
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <ul className="flex flex-wrap gap-3">
          {photos.map((p, i) => (
            <li key={p.url} className="relative size-18 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL */}
              <img src={p.url} alt="" className="size-full rounded-2xl border border-border object-cover shadow-sm" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label={`${scanUi.removePhoto[lang]} ${i + 1}`}
                className="absolute -top-2.5 -right-2.5 flex size-8 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-md"
              >
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {latest && (
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <p className="flex min-w-0 items-center gap-1.5">
            <ImageIcon size={15} className="shrink-0 text-ink" aria-hidden />
            <span className="truncate">{photos.length === 1 ? latest.file.name : formatSize(totalBytes)}</span>
            {photos.length === 1 && <span className="shrink-0">· {formatSize(latest.file.size)}</span>}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <p>{photoCount(photos.length, lang)}</p>
            {photos.length === 1 && (
              <button
                type="button"
                onClick={() => onRemove(0)}
                aria-label={scanUi.removePhoto[lang]}
                className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-subtle"
              >
                <X size={14} aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
