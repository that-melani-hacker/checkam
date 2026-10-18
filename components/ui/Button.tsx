type Props = { variant?: 'primary' | 'secondary'; onClick?: () => void; children: React.ReactNode };

/** Owner: Vivian. Primary is filled green, secondary is outlined. */
export function Button({ children }: Props) {
  // TODO(Vivian): build from Figma
  return <div data-todo="Button" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">Button</div>;
}
