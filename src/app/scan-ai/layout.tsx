import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan AI & Panen',
  description: 'Deteksi dini hama, penyakit tanaman, dan estimasi waktu panen berbasis AI Kertanusa.',
};

export default function ScanAiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
