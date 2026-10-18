'use client';


type Props = { onPhoto: (file: File) => void };

/** Owner: Vivian. input accept="image/*" capture="environment". Test D11. */
export function CameraUpload({ onPhoto }: Props) {
  // TODO(Vivian): build from Figma
  return <div data-todo="CameraUpload" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">CameraUpload</div>;
}
