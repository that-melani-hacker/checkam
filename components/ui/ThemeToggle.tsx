'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useVerify } from '@/lib/state/VerifyContext';

type Theme = 'light' | 'dark';

/** Where the choice is saved, and the event that tells every toggle on the page it changed. */
export const THEME_KEY = 'checkam-theme';
const THEME_EVENT = 'checkam-theme-change';

const label = {
  toDark: { en: 'Switch to dark mode', pcm: 'Change am to dark' },
  toLight: { en: 'Switch to light mode', pcm: 'Change am to light' },
};

function currentTheme(): Theme {
  const picked = document.documentElement.dataset.theme;
  if (picked === 'light' || picked === 'dark') return picked;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener('change', onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

/**
 * Light/dark switch for the header. Starts on the phone's setting; once tapped, the choice is
 * remembered on this device (the script in app/layout.tsx applies it before the page paints).
 */
export function ThemeToggle() {
  const { lang } = useVerify();
  // The server can't know the theme, so it renders the light icon; the browser corrects it.
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'light' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing: the choice lasts until the page closes.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const Icon = theme === 'dark' ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={(next === 'dark' ? label.toDark : label.toLight)[lang]}
      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-subtle text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
    >
      <Icon size={19} aria-hidden />
    </button>
  );
}
