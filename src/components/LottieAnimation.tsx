'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LottieAnimationProps {
  src?: string;
  animationData?: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

// Pre-warm / cache lottie-web di browser client
let cachedLottie: any = null;
if (typeof window !== 'undefined') {
  import('lottie-web').then((mod) => {
    cachedLottie = mod.default || mod;
  }).catch(() => {});
}

export default function LottieAnimation({
  src,
  animationData,
  className = 'w-12 h-12',
  loop = true,
  autoplay = true
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLottie() {
      if (!containerRef.current) return;
      try {
        const lottie = cachedLottie || (await import('lottie-web')).default;
        cachedLottie = lottie;

        if (!isMounted || !containerRef.current) return;

        if (animRef.current) {
          animRef.current.destroy();
        }

        const animConfig: any = {
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay
        };

        if (animationData) {
          animConfig.animationData = animationData;
        } else if (src) {
          animConfig.path = src;
        }

        animRef.current = lottie.loadAnimation(animConfig);
        setIsReady(true);
      } catch (e) {
        console.error('Error loading lottie animation', src || 'animationData', e);
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
  }, [src, animationData, loop, autoplay]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
    </div>
  );
}
