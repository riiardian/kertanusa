import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daya Beli Pasar',
  description: 'Sinyal pasar, analisis historis siklus tanam-panen, dan panduan harga komoditas Kertanusa.',
};

export default function TrenPasarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
