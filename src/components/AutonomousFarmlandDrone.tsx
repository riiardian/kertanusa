'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plane, Droplets, Sparkles, Scan, BatteryCharging, Wifi } from 'lucide-react';

type DroneMission = 'siram' | 'pupuk' | 'scan';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function AutonomousFarmlandDrone() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mission, setMission] = useState<DroneMission>('siram');
  const [altitude, setAltitude] = useState(3.4);
  const [battery, setBattery] = useState(92);
  const [tankCapacity, setTankCapacity] = useState(84);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // State Drone & Partikel
    let t = 0;
    let currentMission: DroneMission = 'siram';
    let missionTimer = 0;
    const particles: Particle[] = [];

    // Posisi drone
    let droneX = width * 0.25;
    let droneY = height * 0.35;
    let droneTilt = 0;
    let rotorAngle = 0;

    // Riwayat waypoint patroli
    const missionCycle: DroneMission[] = ['siram', 'pupuk', 'scan'];
    let missionIdx = 0;

    // Render Loop
    const render = () => {
      t += 0.02;
      rotorAngle += 0.45;
      missionTimer += 1;

      // Otomatis ganti misi setiap ~380 frame (~6.3 detik pada 60fps)
      if (missionTimer > 380) {
        missionTimer = 0;
        missionIdx = (missionIdx + 1) % missionCycle.length;
        currentMission = missionCycle[missionIdx];
        setMission(currentMission);
        setAltitude(Number((3.0 + Math.sin(t * 0.5) * 0.8).toFixed(1)));
        setBattery(prev => (prev > 25 ? prev - 1 : 98));
        setTankCapacity(prev => (prev > 15 ? prev - 2 : 90));
      }

      // Pergerakan drone otomatis berbentuk kurva alami di atas sawah
      const targetX = width * 0.5 + Math.sin(t * 0.7) * (width * 0.35) + Math.cos(t * 0.3) * 40;
      const targetY = height * 0.28 + Math.sin(t * 1.1) * 35 + Math.cos(t * 0.5) * 15;

      // Smooth interpolation & natural banking tilt
      const dx = targetX - droneX;
      droneX += dx * 0.04;
      droneY += (targetY - droneY) * 0.04;
      droneTilt = Math.max(-0.25, Math.min(0.25, dx * 0.005));

      // 1. CLEAR & BACKGROUND SAWAH INDONESIA
      ctx.clearRect(0, 0, width, height);

      // Langit Gradasi
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#022c22'); // Deep forest night/emerald
      skyGrad.addColorStop(0.35, '#064e3b'); // Emerald green
      skyGrad.addColorStop(0.7, '#047857'); // Vibrant meadow
      skyGrad.addColorStop(1, '#065f46');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sinar Matahari Lembut di Ufuk
      const sunGrad = ctx.createRadialGradient(width * 0.8, height * 0.2, 10, width * 0.8, height * 0.2, width * 0.5);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      sunGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.15)');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. PERBUKITAN & TERASERING SAWAH 3D PERSPEKTIF
      // Bukit Jauh (Lapisan 1)
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      for (let i = 0; i <= width; i += 40) {
        ctx.lineTo(i, height * 0.42 + Math.sin(i * 0.005 + 1) * 20);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Bukit Sedang (Lapisan 2)
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.52);
      for (let i = 0; i <= width; i += 30) {
        ctx.lineTo(i, height * 0.5 + Math.sin(i * 0.008 + 2.5) * 16);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Hamparan Petak Sawah Terasering Berundak (Lapisan Depan 3D)
      const sawahLayers = [
        { y: height * 0.62, color: '#059669', waterColor: 'rgba(56, 189, 248, 0.25)' },
        { y: height * 0.72, color: '#10b981', waterColor: 'rgba(56, 189, 248, 0.35)' },
        { y: height * 0.84, color: '#047857', waterColor: 'rgba(56, 189, 248, 0.4)' },
        { y: height * 0.94, color: '#065f46', waterColor: 'rgba(14, 165, 233, 0.45)' },
      ];

      sawahLayers.forEach((layer, lIdx) => {
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.moveTo(0, layer.y);
        for (let i = 0; i <= width; i += 25) {
          const wave = Math.sin(i * 0.01 + lIdx * 1.5) * 8;
          ctx.lineTo(i, layer.y + wave);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Garis Pematang Sawah
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= width; i += 25) {
          const wave = Math.sin(i * 0.01 + lIdx * 1.5) * 8;
          if (i === 0) ctx.moveTo(0, layer.y + wave);
          else ctx.lineTo(i, layer.y + wave);
        }
        ctx.stroke();

        // Kilau Air Irigasi di Petak Sawah
        ctx.fillStyle = layer.waterColor;
        ctx.fillRect(0, layer.y + 4, width, (sawahLayers[lIdx + 1]?.y || height) - layer.y - 6);
      });

      // Rumpun Tanaman Padi Bergoyang Angin di Bagian Bawah
      const numStalks = Math.floor(width / 18);
      for (let i = 0; i < numStalks; i++) {
        const stalkX = i * 18 + 5;
        const stalkBaseY = height * 0.94 + Math.sin(i) * 10;
        const stalkHeight = 35 + (i % 5) * 6;
        const sway = Math.sin(t * 2 + i * 0.4) * 7;

        // Batang Padi
        ctx.strokeStyle = i % 3 === 0 ? '#34d399' : '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(stalkX, stalkBaseY);
        ctx.quadraticCurveTo(stalkX + sway * 0.5, stalkBaseY - stalkHeight * 0.6, stalkX + sway, stalkBaseY - stalkHeight);
        ctx.stroke();

        // Bulir Padi Keemasan
        ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#34d399';
        ctx.beginPath();
        ctx.ellipse(stalkX + sway, stalkBaseY - stalkHeight, 2.5, 5, sway * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. GENERATE EMIT PARTIKEL DARI DRONE
      if (currentMission === 'siram') {
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: droneX + (Math.random() - 0.5) * 36,
            y: droneY + 14,
            vx: (Math.random() - 0.5) * 1.8 + Math.sin(t) * 0.5,
            vy: 2.5 + Math.random() * 2.8,
            life: 1,
            maxLife: 45 + Math.random() * 20,
            size: 2 + Math.random() * 2.5,
            color: 'rgba(186, 230, 253,',
          });
        }
      } else if (currentMission === 'pupuk') {
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: droneX + (Math.random() - 0.5) * 44,
            y: droneY + 14,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 2.0 + Math.random() * 2.2,
            life: 1,
            maxLife: 50 + Math.random() * 20,
            size: 2.5 + Math.random() * 2,
            color: 'rgba(250, 204, 21,',
          });
        }
      }

      // Update & Gambar Partikel Semprotan
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color + ' ' + alpha.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + p.life * 0.02), 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.maxLife || p.y > height) {
          particles.splice(i, 1);
        }
      }

      // 4. EFEK MISI: LASER SCANNER / LIDAR
      if (currentMission === 'scan') {
        const scanWidth = 140 + Math.sin(t * 3) * 25;
        const groundY = height * 0.88;
        const laserGrad = ctx.createLinearGradient(droneX, droneY, droneX, groundY);
        laserGrad.addColorStop(0, 'rgba(52, 211, 153, 0.7)');
        laserGrad.addColorStop(0.3, 'rgba(16, 185, 129, 0.25)');
        laserGrad.addColorStop(1, 'rgba(5, 150, 105, 0.05)');
        ctx.fillStyle = laserGrad;
        ctx.beginPath();
        ctx.moveTo(droneX - 6, droneY + 12);
        ctx.lineTo(droneX + 6, droneY + 12);
        ctx.lineTo(droneX + scanWidth * 0.5, groundY);
        ctx.lineTo(droneX - scanWidth * 0.5, groundY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(droneX, groundY, scanWidth * 0.5, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(droneX - 22, groundY - 18, 44, 26);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('KEMATANGAN: 96%', droneX - 38, groundY - 24);
      }

      // 5. GAMBAR DRONE 3D CANGGIH
      ctx.save();
      ctx.translate(droneX, droneY);
      ctx.rotate(droneTilt);

      // Lengan Rangka Drone Karbon (4 Motor Arms)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-36, -10);
      ctx.lineTo(36, 10);
      ctx.moveTo(-36, 10);
      ctx.lineTo(36, -10);
      ctx.stroke();

      // Chassis Aerodinamis Modern Kertanusa
      const bodyGrad = ctx.createLinearGradient(-18, -12, 18, 12);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(0.5, '#e2e8f0');
      bodyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Gimbal Kamera & Nozzle Semprot
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, 8, 12, 6);
      ctx.fillStyle = currentMission === 'scan' ? '#34d399' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 13, 3, 0, Math.PI * 2);
      ctx.fill();

      // 4 Motor & Baling-Baling Berputar
      const motorPositions = [
        { x: -36, y: -10 },
        { x: 36, y: -10 },
        { x: -36, y: 10 },
        { x: 36, y: 10 },
      ];

      motorPositions.forEach((m, mIdx) => {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 5.5, 0, Math.PI * 2);
        ctx.fill();

        const rotorR = 19;
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(rotorAngle * (mIdx % 2 === 0 ? 1 : -1));
        ctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
        ctx.beginPath();
        ctx.ellipse(0, 0, rotorR, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        const isBlink = Math.sin(t * 6 + mIdx) > 0;
        ctx.fillStyle = isBlink ? (mIdx < 2 ? '#34d399' : '#ef4444') : '#0f172a';
        ctx.beginPath();
        ctx.arc(m.x, m.y + 4, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Label Tanda Misi di Atas Drone
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      const labelText =
        currentMission === 'siram'
          ? '?? PENYIRAMAN'
          : currentMission === 'pupuk'
          ? '?? PEMUPUKAN'
          : '?? SCAN PANEN';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(labelText, 0, -22);
      ctx.shadowBlur = 0;

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getMissionInfo = () => {
    switch (mission) {
      case 'siram':
        return {
          title: 'Penyiraman Presisi Otomatis',
          desc: 'Drone menyemprotkan kabut air mikro ke petak sawah terdaftar untuk menjaga kelembapan tanah.',
          badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
          icon: Droplets,
        };
      case 'pupuk':
        return {
          title: 'Pemberian Bio-Nutrisi Mikro',
          desc: 'Distribusi nutrisi dan pupuk cair organik terkalibrasi langsung pada zona perakaran tanaman.',
          badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
          icon: Sparkles,
        };
      case 'scan':
        return {
          title: 'Pemindaian Kematangan Bulir & Panen',
          desc: 'LiDAR & spektral visual mendeteksi persentase kematangan gabah dan koordinat petak siap panen.',
          badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
          icon: Scan,
        };
    }
  };

  const currentInfo = getMissionInfo();
  const IconComponent = currentInfo.icon;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-900/60 shadow-xl group">
      <div className="relative w-full h-[360px] overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40"></div>
        <div className="absolute top-3.5 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-white tracking-wide">Kertanusa Drone Alpha-01</span>
            <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
              Patroli Otonom
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] text-slate-200 shadow-md">
            <div className="flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baterai: <strong className="text-white">{battery}%</strong></span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-400" />
              <span>Alt: <strong className="text-white">{altitude}m</strong></span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>RTK GPS: <strong className="text-emerald-300">?2cm</strong></span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/30 text-white max-w-xl shadow-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <IconComponent className="w-4 h-4 text-emerald-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-tight">{currentInfo.title}</span>
                <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full border ' + currentInfo.badgeColor}>
                  Otomatis
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {currentInfo.desc}
              </p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-right">
            <span className="text-[10px] text-slate-400">Kapasitas Tangki</span>
            <span className="text-xs font-black text-emerald-400">{tankCapacity}% Terisi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
