import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Input Lahan',
  description: 'Form pendaftaran dan pemetaan parameter tanah sawah Kertanusa.',
};

export default function InputLahanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
