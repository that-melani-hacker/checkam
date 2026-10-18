'use client';
import type { ClientErrorCode } from '@/lib/types';

type Props = { code: ClientErrorCode; onRetry: () => void };

/** Owner: Albert. One message per error code, with retry. Test D8. */
export function ErrorScreen({ code }: Props) {
  // TODO(Albert): build from Figma
  return <div data-todo="ErrorScreen" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">ErrorScreen</div>;
}
