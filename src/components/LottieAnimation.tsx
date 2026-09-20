'use client';

import React, { useEffect, useRef } from 'react';

interface LottieAnimationProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({
  src,
  className = 'w-12 h-12',
  loop = true,
  autoplay = true
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLottie() {
      if (!containerRef.current) return;
      try {
        const lottie = (await import('lottie-web')).default;

        if (!isMounted || !containerRef.current) return;

        if (animRef.current) {
          animRef.current.destroy();
        }

        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          path: src
        });
      } catch (e) {
        console.error('Error loading lottie animation', src, e);
      }
    }

    loadLottie();

    return () => {
      isMounted = false;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} />;
}
