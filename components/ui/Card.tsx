import type { Verdict } from '@/lib/types';

type Props = { tone?: Verdict; children: React.ReactNode };

/** Owner: Vivian. Tinted by verdict. */
export function Card({ children }: Props) {
  // TODO(Vivian): build from Figma
  return <div data-todo="Card" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">Card</div>;
}
