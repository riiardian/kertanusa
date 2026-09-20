import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

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

export const metadata: Metadata = {
  title: 'AgroNusantara AI - Keputusan Presisi & Intelijen Pasar Petani Pelosok',
  description: 'Platform agroteknologi cerdas berbasis energi terbarukan, mikroklimat tanah, computer vision deteksi hama & kematangan panen, dan intelijen tren daya beli pasar pangan Indonesia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased overflow-x-hidden font-sans">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-semibold text-slate-700">AgroNusantara AI • Prototype Software Developer ICONFEST</p>
            <p className="mt-1 text-[11px]">Mendukung Kedaulatan Pangan & Transisi Energi Bersih Petani Daerah Terpencil Indonesia</p>
          </div>
        </footer>
      </body>
    </html>
  );
}