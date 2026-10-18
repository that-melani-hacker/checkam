import type { Verdict } from '@/lib/types';

type Props = { verdict: Verdict };

/** Owner: Melani. Confirm with a pharmacist, worded per verdict. */
export function PharmacistNote({ verdict }: Props) {
  // TODO(Melani): build from Figma
  return <div data-todo="PharmacistNote" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">PharmacistNote</div>;
}
