'use client';
import type { Verdict } from '@/lib/types';

type Props = { verdict: Verdict };

/** Owner: Melani. Report (red states), Check another, Retake (unreadable). */
export function ResultActions({ verdict }: Props) {
  // TODO(Melani): build from Figma
  return <div data-todo="ResultActions" className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">ResultActions</div>;
}
