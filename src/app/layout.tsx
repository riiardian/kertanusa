import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Lora, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import PageTransitionLoader from '@/components/PageTransitionLoader';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Beranda | KERTANUSA',
    template: '%s | KERTANUSA',
  },
  description: 'Kertanusa (Kreasi Riset Tani Nusantara) - Kreativitas dalam mengolah riset dan informasi pertanian menjadi inovasi yang bermanfaat bagi masyarakat.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logokertanusa.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/logokertanusa.png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${lora.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased overflow-x-hidden font-sans">
        <PageTransitionLoader />
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
