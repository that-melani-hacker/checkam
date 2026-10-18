import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { VerifyProvider } from '@/lib/state/VerifyContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CheckAm',
  description: "Check your drug pack against NAFDAC's records with one photo.",
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <VerifyProvider>
          {/* One centered phone-width column on every screen size */}
          <main className="mx-auto min-h-dvh w-full max-w-md px-6 md:max-w-lg">{children}</main>
        </VerifyProvider>
      </body>
    </html>
  );
}
