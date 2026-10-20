import type { Verdict } from '@/lib/types';

type Props = {
  /** Tints the card by verdict. Leave it out for the plain white raised card. */
  tone?: Verdict;
  /** White card with a border instead of a fill, like the pack & record table. */
  outlined?: boolean;
  /** Optional icon + title give the Figma info-card layout (photo tips, guidance, pharmacist note). */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const tones: Record<Verdict, string> = {
  no_red_flags: 'bg-success-tint',
  mismatch: 'bg-danger-tint',
  not_found: 'bg-danger-tint',
  expired: 'bg-danger-tint',
  unreadable: 'bg-neutral-tint',
};

/** Owner: Vivian. Tinted by verdict. */
export function Card({ tone, outlined = false, icon, title, className = '', children }: Props) {
  const surface = outlined || !tone ? 'card' : `rounded-3xl ${tones[tone]}`;
  const classes = `p-5 md:p-6 ${surface} ${className}`;

  // Plain card: whatever you put inside
  if (!icon && !title) return <div className={classes}>{children}</div>;

  // Info card: icon on the left, title and body on the right
  return (
    <div className={`flex items-start gap-3.5 ${classes}`}>
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">{icon}</span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
        <div className="text-[15px] leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}