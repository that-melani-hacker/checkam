import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { VerifyProvider } from '@/lib/state/VerifyContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Applies the light/dark choice saved by ThemeToggle before the page paints, so there's no flash.
// Keep the key in sync with THEME_KEY in components/ui/ThemeToggle.tsx.
const themeScript = `try{var t=localStorage.getItem('checkam-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: 'CheckAm',
  description: "Check your drug pack against NAFDAC's records with one photo.",
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the theme script sets data-theme before React loads
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <VerifyProvider>
          {/* Each screen sets its own widths through PageShell (components/ui/PageShell.tsx) */}
          <main className="min-h-dvh">{children}</main>
        </VerifyProvider>
      </body>
    </html>
  );
}
