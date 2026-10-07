import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harga Pasar | KERTANUSA',
  description: 'Sinyal pasar, analisis historis siklus tanam-panen, dan panduan harga komoditas Kertanusa.',
};

export default function TrenPasarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
