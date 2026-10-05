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
  title: 'Kertanusa - Kreasi Riset Tani Nusantara | Riset & Inovasi Pertanian Cerdas',
  description: 'Kertanusa (Kreasi Riset Tani Nusantara) - Kreativitas dalam mengolah riset dan informasi pertanian menjadi inovasi yang bermanfaat bagi masyarakat.',
  icons: {
    icon: '/logokertanusa.png',
    apple: '/logokertanusa.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${lora.variable} ${outfit.variable}`}>
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
