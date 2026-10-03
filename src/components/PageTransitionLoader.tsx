'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import LottieAnimation from './LottieAnimation';
import loadingAnimation from '../../public/growingplant.json';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // Tepat 2 detik (2000ms), mulai transisi memudar (fade-out)
    fadeTimerRef.current = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Setelah transisi memudar halus selesai (2350ms), unmount overlay
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsFading(false);
    }, 2350);
  };

  // Intersepsi klik tautan internal agar loader muncul seketika (0ms) tanpa jeda layar putih
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const rawHref = target.getAttribute('href');
      if (!rawHref) return;

      // Abaikan protokol luar, email, telepon, atau anchor hash lokal
      if (
        rawHref.startsWith('http') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('#')
      ) {
        return;
      }

      try {
        const url = new URL(target.href, window.location.origin);
        const targetPath = url.pathname;

        // Beranda (/) tidak memerlukan animasi loading
        if (targetPath === '/') return;

        // Jika menuju halaman yang sama, abaikan
        if (targetPath === pathname) return;

        // Munculkan loader seketika sebelum Next.js memproses routing
        setIsVisible(true);
        setIsFading(false);
      } catch {
        // Fallback abaikan jika URL parsing gagal
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [pathname]);

  // Pantau perpindahan pathname (baik navigasi maupun initial direct visit/refresh)
  useEffect(() => {
    // 1. Jika di halaman Beranda (/), pastikan loading tertutup
    if (pathname === '/') {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setIsVisible(false);
      setIsFading(false);
      return;
    }

    // 2. Jika berpindah ke halaman non-beranda (atau refresh)
    setIsVisible(true);
    setIsFading(false);
    startTimer();

    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  if (!isVisible || pathname === '/') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none transition-opacity duration-350 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center">
        <LottieAnimation
          animationData={loadingAnimation}
          className="w-36 h-36 sm:w-44 sm:h-44"
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}
