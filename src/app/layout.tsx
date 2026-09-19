import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

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
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
