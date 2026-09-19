'use client';

import React, { useState, useEffect } from 'react';
import { 
  Navigation, Satellite, MapPin, Eye, EyeOff, 
  Sparkles, Layers, RefreshCw, X, ChevronRight,
  Thermometer, Droplets, ShieldCheck, Sprout
} from 'lucide-react';
import { PetaniRecord } from '@/lib/types';

interface IndonesiaMap3DProps {
  interactive?: boolean;
  highlightFarmerId?: string;
  onSelectFarmer?: (farmer: PetaniRecord) => void;
  userCoords?: { lat: number; lon: number; label?: string } | null;
}

export default function IndonesiaMap3D({ 
  interactive = true, 
  highlightFarmerId,
  onSelectFarmer,
  userCoords
}: IndonesiaMap3DProps) {
  const [is3D, setIs3D] = useState(true);
  const [farmers, setFarmers] = useState<PetaniRecord[]>([]);
  const [selectedPin, setSelectedPin] = useState<PetaniRecord | null>(null);
  const [myGps, setMyGps] = useState<{ lat: number; lon: number; accuracy?: number } | null>(userCoords || null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filterIsland, setFilterIsland] = useState<string>('Semua');

  // Load petani data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/petani');
        const json = await res.json();
        if (json.success && json.data) {
          setFarmers(json.data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  // Update myGps if userCoords prop changes
  useEffect(() => {
    if (userCoords) {
      setMyGps(userCoords);
    }
  }, [userCoords]);

  // Convert lat/lon to percentage (x%, y%) on Indonesia bounding box
  // Lon: 95.0 to 141.0 (width 46)
  // Lat: -11.0 to 6.0 (height 17)
  function getCoordinatesPercent(lat: number, lon: number) {
    const x = Math.max(3, Math.min(97, ((lon - 95.0) / 46.0) * 100));
    const y = Math.max(8, Math.min(92, ((6.0 - lat) / 17.0) * 100));
    return { x, y };
  }

  // Handle GPS trigger directly from map
  function triggerGps() {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung sensor GPS.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyGps({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy)
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        alert('Gagal mendeteksi GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const filteredFarmers = farmers.filter(f => {
    if (filterIsland === 'Semua') return true;
    if (filterIsland === 'Jawa') return f.daerah.toLowerCase().includes('jawa') || f.daerah.toLowerCase().includes('brebes') || f.daerah.toLowerCase().includes('malang') || f.daerah.toLowerCase().includes('cianjur');
    if (filterIsland === 'Luar Jawa') return !f.daerah.toLowerCase().includes('jawa') && !f.daerah.toLowerCase().includes('brebes') && !f.daerah.toLowerCase().includes('malang') && !f.daerah.toLowerCase().includes('cianjur');
    return true;
  });

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-xl overflow-hidden relative">
      
      {/* Top Map Control Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Map Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Satellite className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">
                Peta Spasial Riset Nusantara 3D
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Live Telemetri Satelit
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Titik nyala memetakan sawah petani & riset mikroklimat BMKG antar-pulau
            </p>
          </div>
        </div>

        {/* Right: Map View Mode & GPS Actions */}
        <div className="flex items-center gap-2">
          
          {/* Island Filter */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-[11px]">
            {['Semua', 'Jawa', 'Luar Jawa'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterIsland(tab)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filterIsland === tab
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 3D vs 2D Toggle */}
          <button
            onClick={() => setIs3D(!is3D)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            title="Ubah Sudut Pandang"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{is3D ? '3D Isometrik' : '2D Datar'}</span>
          </button>

          {/* Nyalakan GPS Button */}
          <button
            onClick={triggerGps}
            disabled={gpsLoading}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all ${
              myGps
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {gpsLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>{gpsLoading ? 'Mencari...' : myGps ? 'GPS Aktif' : 'Nyalakan GPS'}</span>
          </button>

        </div>

      </div>

      {/* Main Map Canvas Area */}
      <div 
        className="w-full relative overflow-hidden bg-radial from-slate-900 via-slate-950 to-black select-none"
        style={{ minHeight: '380px', height: '420px', perspective: is3D ? '1100px' : 'none' }}
      >
        
        {/* Agrometeorological Radar Background Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Khatulistiwa Line (0° Latitude) */}
        <div 
          className="absolute left-0 right-0 border-b border-dashed border-amber-500/40 pointer-events-none z-0 flex items-center justify-end pr-4 text-[10px] font-mono text-amber-500/60"
          style={{ top: '35.3%' }}
        >
          <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
            Garis Khatulistiwa (0° Equator)
          </span>
        </div>

        {/* 3D Transformable Map Container */}
        <div 
          className="w-full h-full relative transition-transform duration-700 ease-out"
          style={{
            transform: is3D 
              ? 'rotateX(26deg) rotateZ(-2deg) scale(0.92) translateY(-10px)' 
              : 'none',
            transformStyle: 'preserve-3d'
          }}
        >
          
          {/* Indonesia Island Vectors (Realistic Cartographic Vector Shapes) */}
          <svg 
            viewBox="0 0 1000 420" 
            className="w-full h-full filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="60%" stopColor="#047857" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. SUMATERA */}
            <path 
              d="M 50 80 
                 C 70 65, 95 60, 110 55 
                 C 130 50, 145 70, 160 105 
                 C 175 140, 200 175, 230 215 
                 C 255 245, 275 275, 290 305 
                 C 275 315, 255 310, 240 290 
                 C 215 255, 185 210, 150 160 
                 C 115 115, 80 85, 50 80 Z" 
              fill="url(#islandGrad)" 
              stroke="#10b981" 
              strokeWidth="1.5"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
            {/* Kepulauan Nias, Mentawai, Bangka Belitung */}
            <circle cx="85" cy="140" r="5" fill="#047857" stroke="#10b981" />
            <circle cx="120" cy="190" r="6" fill="#047857" stroke="#10b981" />
            <ellipse cx="270" cy="220" rx="14" ry="9" fill="#047857" stroke="#10b981" />
            <ellipse cx="300" cy="245" rx="9" ry="7" fill="#047857" stroke="#10b981" />

            {/* 2. JAWA & MADURA */}
            <path 
              d="M 230 325 
                 C 260 320, 295 318, 330 320 
                 C 370 322, 410 325, 450 330 
                 C 455 340, 440 345, 400 345 
                 C 360 345, 310 348, 270 345 
                 C 240 343, 225 335, 230 325 Z" 
              fill="url(#islandGrad)" 
              stroke="#10b981" 
              strokeWidth="1.5"
              className="opacity-95 hover:opacity-100 transition-opacity"
            />
            {/* Madura */}
            <ellipse cx="430" cy="318" rx="20" ry="7" fill="#047857" stroke="#10b981" />

            {/* 3. BALI, LOMBOK, SUMBAWA, FLORES, TIMOR */}
            <ellipse cx="475" cy="336" rx="10" ry="7" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1.2" />
            <ellipse cx="500" cy="338" rx="12" ry="8" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1.2" />
            <path d="M 520 335 Q 545 330 565 340 Q 545 348 520 335 Z" fill="url(#islandGrad)" stroke="#10b981" />
            <path d="M 575 335 C 600 330, 630 335, 645 340 C 625 348, 595 345, 575 335 Z" fill="url(#islandGrad)" stroke="#10b981" />
            <ellipse cx="690" cy="355" rx="26" ry="11" fill="url(#islandGrad)" stroke="#10b981" />

            {/* 4. KALIMANTAN */}
            <path 
              d="M 330 145 
                 C 370 125, 420 120, 460 140 
                 C 490 155, 500 185, 490 220 
                 C 480 250, 450 265, 410 260 
                 C 370 255, 340 240, 325 210 
                 C 315 180, 315 155, 330 145 Z" 
              fill="url(#islandGrad)" 
              stroke="#10b981" 
              strokeWidth="1.5"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />

            {/* 5. SULAWESI (K-Shape) */}
            <path 
              d="M 550 145 
                 C 565 140, 590 155, 605 170 
                 C 590 180, 575 190, 565 205 
                 C 575 220, 600 230, 615 240 
                 C 600 250, 580 250, 565 235 
                 C 555 245, 560 270, 555 285 
                 C 545 280, 540 250, 545 225 
                 C 535 210, 525 200, 520 185 
                 C 530 165, 540 150, 550 145 Z" 
              fill="url(#islandGrad)" 
              stroke="#10b981" 
              strokeWidth="1.5"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />

            {/* 6. MALUKU & HALMAHERA */}
            <path d="M 670 160 Q 685 145 695 165 Q 680 180 670 160 Z" fill="url(#islandGrad)" stroke="#10b981" />
            <ellipse cx="690" cy="225" rx="14" ry="8" fill="url(#islandGrad)" stroke="#10b981" />
            <ellipse cx="695" cy="255" rx="16" ry="9" fill="url(#islandGrad)" stroke="#10b981" />

            {/* 7. PAPUA */}
            <path 
              d="M 750 200 
                 C 780 185, 830 190, 880 195 
                 C 930 200, 965 210, 980 230 
                 C 980 270, 960 300, 920 310 
                 C 870 320, 830 290, 800 275 
                 C 770 260, 745 230, 750 200 Z" 
              fill="url(#islandGrad)" 
              stroke="#10b981" 
              strokeWidth="1.5"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </svg>

          {/* Glowing Farmer Research Telemetry Beacons ("Titik Nyala Riset") */}
          {filteredFarmers.map((f) => {
            const lat = f.lat || -6.8703;
            const lon = f.lon || 109.0435;
            const { x, y } = getCoordinatesPercent(lat, lon);
            const isHighlighted = highlightFarmerId === f.id || selectedPin?.id === f.id;

            return (
              <div
                key={f.id}
                onClick={() => {
                  setSelectedPin(f);
                  if (onSelectFarmer) onSelectFarmer(f);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {/* 3D Vertical Beacon Stem */}
                {is3D && (
                  <div className="w-0.5 h-6 bg-gradient-to-t from-emerald-400 to-transparent absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-80"></div>
                )}

                {/* Radar Ping Ripple Wave */}
                <span className="absolute -inset-2 rounded-full bg-emerald-400 opacity-60 animate-ping"></span>

                {/* Core Glowing Telemetry Pin */}
                <div className={`relative w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                  isHighlighted 
                    ? 'bg-amber-400 border-white ring-4 ring-amber-400/50 scale-125' 
                    : 'bg-emerald-500 border-emerald-200 ring-2 ring-emerald-500/40 hover:scale-125'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></span>
                </div>

                {/* Mini Hover Label */}
                <div className="absolute left-1/2 -translate-x-1/2 top-5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                  <span className="bg-slate-900/95 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/40 shadow-lg">
                    🌾 {f.nama_petani} ({f.jenis_tanaman})
                  </span>
                </div>
              </div>
            );
          })}

          {/* Live User GPS Coordinates Beacon (If Active) */}
          {myGps && (() => {
            const { x, y } = getCoordinatesPercent(myGps.lat, myGps.lon);
            return (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {/* High Intensity Cyan/Amber Radar Beacon */}
                <span className="absolute -inset-4 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                <span className="absolute -inset-7 rounded-full bg-cyan-500/30 animate-pulse"></span>

                {/* 3D Stem */}
                {is3D && (
                  <div className="w-0.5 h-8 bg-gradient-to-t from-cyan-400 via-amber-300 to-transparent absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"></div>
                )}

                {/* Live Core Pin */}
                <div className="relative w-5 h-5 rounded-full bg-cyan-400 border-2 border-white ring-4 ring-cyan-400/60 shadow-lg flex items-center justify-center">
                  <Navigation className="w-2.5 h-2.5 text-slate-950" />
                </div>

                {/* Persistent Live Badge */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap z-30">
                  <span className="bg-cyan-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span>LOKASI SAYA (LIVE GPS)</span>
                  </span>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Selected Farmer Modal Popover Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 p-4 rounded-xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-md z-30 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{selectedPin.nama_petani}</h4>
                  <p className="text-[10px] text-emerald-400 font-medium">{selectedPin.daerah}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPin(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[9px]">Komoditas & Luas</span>
                <strong className="text-emerald-300 block truncate">{selectedPin.jenis_tanaman}</strong>
                <span className="text-[10px] text-slate-300">{selectedPin.luas_tanah} {selectedPin.satuan_luas}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 block text-[9px]">Titik Koordinat GPS</span>
                <span className="font-mono text-[10px] text-slate-200 block truncate">
                  {selectedPin.lat?.toFixed(4)}, {selectedPin.lon?.toFixed(4)}
                </span>
                <span className="text-[10px] text-emerald-400">
                  ±{selectedPin.akurasi_gps || 8}m Akurasi
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-[10px]">
              <span className="flex items-center gap-1 text-slate-300">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span>Tanah: <strong>{selectedPin.kelembapan_tanah || 58}%</strong></span>
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>pH: <strong>{selectedPin.ph_tanah || 6.5}</strong></span>
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Thermometer className="w-3 h-3" />
                <span>{selectedPin.suhu_lingkungan || 29.5}°C</span>
              </span>
            </div>

            <div className="pt-1 flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Status: <strong className="text-slate-200">{selectedPin.status_tanaman || 'Vegetatif'}</strong></span>
              <a 
                href="/monitoring"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
              >
                <span>Lihat Telemetri Lengkap</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Telemetry Legend & National Research Summary */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500"></span>
            <span>Titik Sawah Riset Petani ({filteredFarmers.length} Lokasi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400"></span>
            <span>{myGps ? 'Titik GPS Sawah Anda Terkunci' : 'Aktifkan GPS untuk Menandai Sawah'}</span>
          </div>
        </div>

        {/* Realtime Satellites Sync */}
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Satelit Terkoneksi: <strong>BMKG Agrometeorologi & Open-Meteo</strong></span>
        </div>

      </div>

    </div>
  );
}
