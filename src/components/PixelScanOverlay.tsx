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
      t += 0.045; // Expansion speed
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

          // Concentric ripple wave propagating OUTWARD from center
          const wave = Math.sin((dist / 38) - (t * 2.8));

          if (wave > 0.35) {
            const rawIntensity = (wave - 0.35) / 0.65; // 0 to 1
            const edgeFade = Math.max(0, 1 - (dist / (maxDist * 1.1)));
            const intensity = rawIntensity * edgeFade;

            const radius = 1.0 + intensity * 2.0;

            // Outer radiant aura for peak glowing pixels
            if (intensity > 0.5) {
              ctx.beginPath();
              ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(16, 185, 129, ${intensity * 0.28})`;
              ctx.fill();
            }

            // Core glowing dot (luminous emerald/cyan pixel)
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${0.35 + intensity * 0.65})`;
            ctx.fill();
          } else {
            // Dormant faint dot matrix
            ctx.beginPath();
            ctx.arc(x, y, 0.85, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill();
          }
        }
      }

      // Subtle center pulsing emitter that continuously spawns the waves
      const centerPulse = (Math.sin(t * 2.8) + 1) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 5 + centerPulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + centerPulse * 0.4})`;
      ctx.fill();

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
      {/* Translucent dark tint so glowing dots stand out against any photo */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-brightness-90" />

      {/* HTML5 Canvas Dot Matrix (Concentric Expanding Ripples from Center) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
