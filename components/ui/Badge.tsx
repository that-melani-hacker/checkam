import type { Nullable } from '@/lib/types';

type Props = { ok: Nullable<boolean>; label: string; className?: string };

/** Owner: Vivian. Tick, cross or neutral, always with a word (never colour alone). */
export function Badge({ ok, label, className = '' }: Props) {
  const color = ok === true ? 'text-success' : ok === false ? 'text-danger' : 'text-neutral';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color} ${className}`}>
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ok === true ? (
          <path d="m20 6-11 11-5-5" />
        ) : ok === false ? (
          <path d="m18 6-12 12M6 6l12 12" />
        ) : (
          <path d="M5 12h14" />
        )}
      </svg>
      {label}
    </span>
  );
}