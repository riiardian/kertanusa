'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function PixelScanOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(14);

  useEffect(() => {
    // Simulated smooth progress percentage countup (identik ChatGPT 33%)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        const jump = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + jump, 98);
      });
    }, 190);

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
      t += 0.04;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Dot matrix spacing (13px for dense, crisp pixel scan feel)
      const spacing = 13;
      const cols = Math.floor(w / spacing);
      const rows = Math.floor(h / spacing);
      const startX = (w - cols * spacing) / 2;
      const startY = (h - rows * spacing) / 2;

      const cx = w / 2;
      const cy = h / 2;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;

          // Polar coordinates from center for rotating/swirling effect ("muter-muter")
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          // Dual swirling spiral wave + radial pulse
          // Spiral arm wave rotating clockwise
          const spiralWave = Math.sin(angle * 2 - dist * 0.035 + t * 3.5);
          // Secondary concentric wave
          const ringWave = Math.cos(dist * 0.06 - t * 2.2);
          const val = (spiralWave * 0.65 + ringWave * 0.35); // -1 to 1

          if (val > 0.28) {
            // Active glowing pixel in the swirling scan wave
            const intensity = Math.min((val - 0.28) / 0.72, 1);
            const radius = 1.1 + intensity * 1.7;

            // Outer radiant glow for bright pixels
            if (intensity > 0.6) {
              ctx.beginPath();
              ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(16, 185, 129, ${intensity * 0.25})`;
              ctx.fill();
            }

            // Core glowing dot (luminous emerald/cyan pixel)
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + intensity * 0.6})`;
            ctx.fill();
          } else {
            // Subtle dormant dot matrix (faint guide pixel)
            ctx.beginPath();
            ctx.arc(x, y, 0.85, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(progressTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl transition-all duration-300">
      {/* Translucent dark tint so glowing dots stand out against any photo */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-brightness-90" />

      {/* HTML5 Canvas Dot Matrix (Swirling Pixel Reader) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Status Label (Top-Left, ChatGPT style) */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-200">
            Mendiagnosis citra
          </span>
        </div>
      </div>

      {/* Percentage Pill (Bottom-Right, identik ChatGPT) */}
      <div className="absolute bottom-3 right-3 z-10">
        <div className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-md">
          {progress}%
        </div>
      </div>
    </div>
  );
}
