import type { Verdict } from '@/lib/types';

type Props = {
  /** Tints the card by verdict. Leave it out for the plain grey card. */
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
  const surface = outlined ? 'border border-border bg-white' : tone ? tones[tone] : 'bg-subtle';
  const classes = `rounded-[14px] p-4 ${surface} ${className}`;

  // Plain card: whatever you put inside
  if (!icon && !title) return <div className={classes}>{children}</div>;

  // Info card: icon on the left, title and body on the right
  return (
    <div className={`flex items-start gap-2.75 ${classes}`}>
      {icon && <span className="mt-px shrink-0 text-primary">{icon}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-1.25">
        {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
        <div className="text-[13px] leading-normal text-muted">{children}</div>
      </div>
    </div>
  );
}