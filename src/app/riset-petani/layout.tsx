import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riset Petani',
  description: 'Database riset agronomis dan data lahan petani binaan Kertanusa.',
};

export default function RisetPetaniLayout({ children }: { children: React.ReactNode }) {
  return children;
}
