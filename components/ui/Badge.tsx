import type { Nullable } from '@/lib/types';

type Props = { ok: Nullable<boolean>; label: string };

/** Owner: Vivian. Tick, cross or neutral, always with a word. */
export function Badge({ label }: Props) {
  // TODO(Vivian): build from Figma
  return <div data-todo="Badge" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">Badge</div>;
}
