import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iklim & pH',
  description: 'Pemantauan iklim mikro sawah, sensor agrometeorologi, dan pH tanah Kertanusa.',
};

export default function MonitoringLayout({ children }: { children: React.ReactNode }) {
  return children;
}
