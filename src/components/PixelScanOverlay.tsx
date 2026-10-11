'use client';

import React, { useEffect, useRef } from 'react';

export default function PixelScanOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const render = () => {
      t += 0.02; // Calm, relaxed tempo for deliberate pixel screening
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Dot matrix grid spacing (14px between dots)
      const spacing = 14;
      const cols = Math.floor(w / spacing);
      const rows = Math.floor(h / spacing);
      const startX = (w - cols * spacing) / 2;
      const startY = (h - rows * spacing) / 2;

      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;

          // Distance from the center point
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Calm concentric ripple wave propagating OUTWARD from center
          // Wavelength 46px, gentle expansion speed 1.3
          const wave = Math.sin((dist / 46) - (t * 1.3));

          if (wave > 0.3) {
            const rawIntensity = (wave - 0.3) / 0.7; // 0 to 1
            const edgeFade = Math.max(0, 1 - (dist / (maxDist * 1.15)));
            const intensity = rawIntensity * edgeFade;

            const radius = 1.0 + intensity * 1.8;

            // Outer soft radiant aura for peak glowing pixels
            if (intensity > 0.55) {
              ctx.beginPath();
              ctx.arc(x, y, radius * 2.0, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(16, 185, 129, ${intensity * 0.22})`;
              ctx.fill();
            }

            // Core glowing dot (luminous emerald pixel)
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${0.35 + intensity * 0.65})`;
            ctx.fill();
          } else {
            // Dormant faint dot matrix
            ctx.beginPath();
            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl transition-all duration-300">
      {/* Translucent dark tint so glowing dots stand out clearly against any photo */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-brightness-90" />

      {/* HTML5 Canvas Dot Matrix (Concentric Expanding Ripples from Center) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
