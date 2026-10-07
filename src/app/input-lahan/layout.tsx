import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Lahan',
  description: 'Pendaftaran dan pemetaan parameter tanah sawah presisi Kertanusa.',
};

export default function InputLahanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
