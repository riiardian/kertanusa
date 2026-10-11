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
  metadataBase: new URL('https://kertanusa.web.id'),
  alternates: {
    canonical: 'https://kertanusa.web.id',
  },
  title: {
    default: 'KERTANUSA — Kreasi Riset Tani Nusantara',
    template: '%s | KERTANUSA',
  },
  description: 'Kertanusa (Kreasi Riset Tani Nusantara) - Platform pertanian presisi dan sistem pendukung keputusan (DSS) berbasis AI dan satelit untuk memandu petani Indonesia.',
  keywords: [
    'Kertanusa',
    'Pertanian Presisi',
    'AI Pertanian',
    'Computer Vision Tanaman',
    'Telkom University',
    'Rio Ardian Pratama',
    'Agroklimat BMKG',
    'Penyakit Tanaman AI',
  ],
  authors: [{ name: 'Rio Ardian Pratama', url: 'https://github.com/riiardian' }],
  creator: 'Rio Ardian Pratama',
  publisher: 'KERTANUSA',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://kertanusa.web.id',
    siteName: 'KERTANUSA',
    title: 'KERTANUSA — Platform Pertanian Presisi & AI Pemandu Petani',
    description: 'Kreasi Riset Tani Nusantara - Platform pertanian presisi berbasis Artificial Intelligence dan satelit karya mahasiswa Telkom University.',
    images: [
      {
        url: '/hero-pertanian-4k.webp',
        width: 1200,
        height: 630,
        alt: 'KERTANUSA Platform Pertanian Presisi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KERTANUSA — Platform Pertanian Presisi & AI Pemandu Petani',
    description: 'Sistem pendukung keputusan pertanian presisi berbasis AI karya mahasiswa Telkom University.',
    images: ['/hero-pertanian-4k.webp'],
  },
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
    <html lang="id" className={`${jakarta.variable} ${lora.variable} ${outfit.variable} scroll-smooth`}>
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
