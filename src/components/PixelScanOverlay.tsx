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
      t += 0.065; // Tempo lincah, cepat, dan responsif
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Posisi garis laser pemindai aktif (naik-turun cepat)
      const scanY = ((Math.sin(t * 1.8) + 1) / 2) * h;

      // Berkas cahaya laser pemindai horizontal
      const auraGrad = ctx.createLinearGradient(0, scanY - 24, 0, scanY + 24);
      auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      auraGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.16)');
      auraGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, scanY - 24, w, 48);

      const lineGrad = ctx.createLinearGradient(0, scanY, w, scanY);
      lineGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      lineGrad.addColorStop(0.2, 'rgba(52, 211, 153, 0.5)');
      lineGrad.addColorStop(0.5, 'rgba(167, 243, 208, 0.9)');
      lineGrad.addColorStop(0.8, 'rgba(52, 211, 153, 0.5)');
      lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, scanY - 1, w, 2.5);

      // Dot matrix grid spacing (13px antar titik)
      const spacing = 13;
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

          // Jarak dari titik pusat
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Gelombang ripple cepat memancar dari pusat
          const wave = Math.sin((dist / 38) - (t * 2.6));

          // Efek sapuan saat terkena garis laser pemindai
          const distToLaser = Math.abs(y - scanY);
          const laserHit = distToLaser < 22 ? (1 - distToLaser / 22) : 0;

          if (wave > 0.25 || laserHit > 0) {
            const waveIntensity = wave > 0.25 ? ((wave - 0.25) / 0.75) : 0;
            const edgeFade = Math.max(0, 1 - (dist / (maxDist * 1.15)));
            const combinedIntensity = Math.min(1, (waveIntensity * edgeFade * 0.75) + (laserHit * 0.85));

            const radius = 1.0 + combinedIntensity * 2.0;

            // Aura luar titik aktif
            if (combinedIntensity > 0.45) {
              ctx.beginPath();
              ctx.arc(x, y, radius * 2.0, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(16, 185, 129, ${combinedIntensity * 0.25})`;
              ctx.fill();
            }

            // Titik inti piksel bercahaya emerald
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + combinedIntensity * 0.6})`;
            ctx.fill();
          } else {
            // Titik matriks pasif redup
            ctx.beginPath();
            ctx.arc(x, y, 0.75, 0, Math.PI * 2);
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
