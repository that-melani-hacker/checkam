import type { Check, Explanation, Verdict } from '@/lib/types';

type Props = { verdict: Verdict; checks: Check[]; explanation: Explanation };

/** Owner: Melani. Color + icon + words for each of the 5 verdicts. Tests D1-D5. */
export function VerdictBanner({ verdict }: Props) {
  // TODO(Melani): build from Figma
  return <div data-todo="VerdictBanner" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">VerdictBanner</div>;
}
