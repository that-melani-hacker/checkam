type Variant = 'primary' | 'secondary' | 'link';

type Props = {
  variant?: Variant;
  /** Internal path ('/scan') renders a Next Link; with external, a new-tab <a>. Without href it's a <button>. */
  href?: string;
  external?: boolean;
  onClick?: () => void;
  /** An icon element, e.g. <ScanLine size={21} aria-hidden /> from lucide-react. */
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  'inline-flex w-full items-center justify-center gap-2.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Filled green, 56px tall, like "Check this photo" and "Scan a drug"
  primary: 'min-h-14 rounded-2xl border border-primary bg-primary px-5 py-3 text-[17px] text-white shadow-sm hover:brightness-110 active:scale-[0.99]',
  // Outlined, like "Retake photo" and "Check another drug"
  secondary: 'min-h-14 rounded-2xl border border-border bg-surface px-5 py-3 text-[17px] text-brand hover:bg-subtle active:scale-[0.99]',
  // Text only, like "Upload a different photo". min-h-11 keeps a 44px tap target
  link: 'min-h-12 px-2 text-[15px] text-brand hover:underline',
};

/** Owner: Vivian. Primary is filled green, secondary is outlined, link is text only. */
export function Button({
  variant = 'primary',
  href,
  external = false,
  onClick,
  icon,
  type = 'button',
  disabled = false,
  className = '',
  children,
}: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes}>
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}