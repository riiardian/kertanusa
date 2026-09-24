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
  title: 'Kertanusa - Kreasi Riset Tani Nusantara | Riset & Inovasi Pertanian Cerdas',
  description: 'Kertanusa (Kreasi Riset Tani Nusantara) - Kreativitas dalam mengolah riset dan informasi pertanian menjadi inovasi yang bermanfaat bagi masyarakat.',
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
            <p className="font-semibold text-slate-700">Kertanusa (Kreasi Riset Tani Nusantara) • Prototype Software Developer ICONFEST</p>
            <p className="mt-1 text-[11px] text-slate-500 max-w-xl mx-auto">Filosofi: Kreativitas dalam mengolah riset dan informasi pertanian menjadi inovasi yang bermanfaat bagi masyarakat.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}