'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

interface YearlyPoint {
  tahun: number;
  produksi: number; // Juta Ton
  perubahanPersen: number; // YoY %
  status: 'naik' | 'turun' | 'stabil';
  keterangan: string;
}

interface CommodityItem {
  id: string;
  nama: string;
  kategori: 'Pangan' | 'Buah' | 'Sayur';
  sentra: string;
  warnaHex: string;
  riwayat: YearlyPoint[];
}

const DATA_5_TAHUN: CommodityItem[] = [
  {
    id: 'padi',
    nama: 'Padi / Beras (GKG)',
    kategori: 'Pangan',
    sentra: 'Jawa Timur, Jawa Barat, Jawa Tengah, Sulsel',
    warnaHex: '#059669',
    riwayat: [
      { tahun: 2020, produksi: 54.65, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis awal periode' },
      { tahun: 2021, produksi: 54.42, perubahanPersen: -0.42, status: 'turun', keterangan: 'Curah hujan La Nina basah' },
      { tahun: 2022, produksi: 54.75, perubahanPersen: 0.61, status: 'naik', keterangan: 'Perluasan bibit genjah unggul' },
      { tahun: 2023, produksi: 53.98, perubahanPersen: -1.41, status: 'turun', keterangan: 'Kemarau panjang El Nino' },
      { tahun: 2024, produksi: 54.60, perubahanPersen: 1.15, status: 'naik', keterangan: 'Pemulihan pasokan normal' }
    ]
  },
  {
    id: 'jagung',
    nama: 'Jagung Pipil Kering',
    kategori: 'Pangan',
    sentra: 'Jatim, Jateng, Lampung, Sulsel, NTB',
    warnaHex: '#d97706',
    riwayat: [
      { tahun: 2020, produksi: 22.80, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis panen awal' },
      { tahun: 2021, produksi: 23.50, perubahanPersen: 3.07, status: 'naik', keterangan: 'Tingginya serapan pakan ternak' },
      { tahun: 2022, produksi: 24.20, perubahanPersen: 2.98, status: 'naik', keterangan: 'Ekspansi lahan tanam jagung' },
      { tahun: 2023, produksi: 24.80, perubahanPersen: 2.48, status: 'naik', keterangan: 'Tahan cuaca kering lahan tadah' },
      { tahun: 2024, produksi: 25.20, perubahanPersen: 1.61, status: 'naik', keterangan: 'Produksi puncak tertinggi' }
    ]
  },
  {
    id: 'pisang',
    nama: 'Pisang Nusantara',
    kategori: 'Buah',
    sentra: 'Malang (Jatim), Jawa Barat, Lampung, Bali',
    warnaHex: '#65a30d',
    riwayat: [
      { tahun: 2020, produksi: 8.18, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis buah nasional' },
      { tahun: 2021, produksi: 8.74, perubahanPersen: 6.85, status: 'naik', keterangan: 'Konsumsi rumah tangga melonjak' },
      { tahun: 2022, produksi: 9.24, perubahanPersen: 5.72, status: 'naik', keterangan: 'Permintaan pasar modern' },
      { tahun: 2023, produksi: 9.30, perubahanPersen: 0.65, status: 'naik', keterangan: 'Stabil di musim kemarau' },
      { tahun: 2024, produksi: 9.42, perubahanPersen: 1.29, status: 'naik', keterangan: 'Rekor panen buah segar' }
    ]
  },
  {
    id: 'cabai',
    nama: 'Aneka Cabai',
    kategori: 'Sayur',
    sentra: 'Kediri, Blitar, Garut, Temanggung, Lombok',
    warnaHex: '#e11d48',
    riwayat: [
      { tahun: 2020, produksi: 2.72, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis awal periode' },
      { tahun: 2021, produksi: 2.75, perubahanPersen: 1.10, status: 'naik', keterangan: 'Pasokan stabil di Jawa' },
      { tahun: 2022, produksi: 2.98, perubahanPersen: 8.36, status: 'naik', keterangan: 'Panen raya serentak' },
      { tahun: 2023, produksi: 2.85, perubahanPersen: -4.36, status: 'turun', keterangan: 'Kekeringan menekan luas panen' },
      { tahun: 2024, produksi: 3.10, perubahanPersen: 8.77, status: 'naik', keterangan: 'Lonjakan hasil irigasi tetes' }
    ]
  },
  {
    id: 'bawang',
    nama: 'Bawang Merah',
    kategori: 'Sayur',
    sentra: 'Brebes, Nganjuk, Bima, Demak, Enrekang',
    warnaHex: '#9333ea',
    riwayat: [
      { tahun: 2020, produksi: 1.82, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis awal panen' },
      { tahun: 2021, produksi: 2.00, perubahanPersen: 9.89, status: 'naik', keterangan: 'Ekspansi lumbung Bima & Nganjuk' },
      { tahun: 2022, produksi: 1.98, perubahanPersen: -1.00, status: 'turun', keterangan: 'Hujan basah memicu serangan ulat' },
      { tahun: 2023, produksi: 2.10, perubahanPersen: 6.06, status: 'naik', keterangan: 'Cuaca terik optimal untuk umbi' },
      { tahun: 2024, produksi: 2.25, perubahanPersen: 7.14, status: 'naik', keterangan: 'Produksi tertinggi sepanjang masa' }
    ]
  }
];

// Data proporsi komoditas nasional (Diagram Bulat)
const PROPORSI_NASIONAL = [
  { label: 'Padi (Beras)', persen: 38.5, warna: '#059669' },
  { label: 'Jagung', persen: 17.8, warna: '#d97706' },
  { label: 'Singkong / Umbi', persen: 11.6, warna: '#ca8a04' },
  { label: 'Buah-buahan', persen: 16.5, warna: '#65a30d' },
  { label: 'Sayuran', persen: 10.2, warna: '#e11d48' },
  { label: 'Lainnya', persen: 5.4, warna: '#64748b' }
];

export default function AgriculturalMonitoringDashboard() {
  const [selectedId, setSelectedId] = useState('padi');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const selected = DATA_5_TAHUN.find((item) => item.id === selectedId) || DATA_5_TAHUN[0];

  // Perhitungan Koordinat Diagram Garis (Continuous Line Chart)
  const values = selected.riwayat.map((r) => r.produksi);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valDiff = maxVal - minVal;
  // Berikan buffer proporsional agar grafik tampak bergelombang jelas naik turunnya
  const buffer = Math.max(valDiff * 0.45, 0.35);
  const yMin = Math.max(0, minVal - buffer);
  const yMax = maxVal + buffer;

  const SVG_W = 600;
  const SVG_H = 190;
  const PAD_X = 50;
  const PAD_TOP = 30;
  const PAD_BOTTOM = 35;
  const PLOT_W = SVG_W - PAD_X * 2;
  const PLOT_H = SVG_H - PAD_TOP - PAD_BOTTOM;

  const points = selected.riwayat.map((item, idx) => {
    const x = PAD_X + (idx / (selected.riwayat.length - 1)) * PLOT_W;
    const norm = (item.produksi - yMin) / (yMax - yMin);
    const y = PAD_TOP + (1 - norm) * PLOT_H;
    return { ...item, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(SVG_H - PAD_BOTTOM).toFixed(1)} L ${points[0].x.toFixed(1)} ${(SVG_H - PAD_BOTTOM).toFixed(1)} Z`;

  // Perhitungan Diagram Bulat Donut Chart
  const donutRadius = 42;
  const donutStroke = 12;
  const circumference = 2 * Math.PI * donutRadius; // ~263.89

  let runningOffset = 0;
  const donutSlices = PROPORSI_NASIONAL.map((item) => {
    const length = (item.persen / 100) * circumference;
    const offset = runningOffset;
    runningOffset += length;
    return { ...item, length, offset };
  });

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              BPS & Kementerian Pertanian
            </span>
            <span className="text-xs text-slate-400 font-medium">Periode 2020 – 2024</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Monitoring Kenaikan & Penurunan Produksi Pertanian (5 Tahun)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagram garis fluktuasi hasil panen tahun ke tahun dan proporsi komoditas pangan nasional.
          </p>
        </div>

        {/* Tab Komoditas Simpel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 max-w-full">
          {DATA_5_TAHUN.map((k) => (
            <button
              key={k.id}
              onClick={() => {
                setSelectedId(k.id);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedId === k.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {k.nama.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. BODY UTAMA: DIAGRAM GARIS FLUKTUASI & DIAGRAM BULAT PROPORSI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* KOLOM KIRI (75%): DIAGRAM GARIS NAIK-TURUN BERKELANJUTAN (LINE CHART) */}
        <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between">
          
          {/* Sub-header info komoditas & status terkini */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">{selected.nama}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selected.kategori}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Sentra Utama: <strong className="text-slate-700">{selected.sentra}</strong></span>
              </div>
            </div>

            {/* Status Titik Aktif / 2024 */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Tahun {activePoint.tahun}:</span>
              <span className="text-sm font-black text-slate-900">{activePoint.produksi} Jt Ton</span>
              {activePoint.perubahanPersen > 0 && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{activePoint.perubahanPersen}%
                </span>
              )}
              {activePoint.perubahanPersen < 0 && (
                <span className="text-xs font-bold text-rose-700 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> {activePoint.perubahanPersen}%
                </span>
              )}
              {activePoint.perubahanPersen === 0 && (
                <span className="text-xs font-semibold text-slate-400">Acuan</span>
              )}
            </div>
          </div>

          {/* KANVAS DIAGRAM GARIS (SVG LINE CHART) */}
          <div className="relative w-full bg-slate-50/40 rounded-xl p-2 border border-slate-100 my-2">
            
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                {/* Gradient Fill Area Bawah Garis */}
                <linearGradient id={`gradient-${selected.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selected.warnaHex} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={selected.warnaHex} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Garis Grid Horizontal Tipis */}
              {[0, 0.5, 1].map((ratio) => {
                const y = PAD_TOP + ratio * PLOT_H;
                const labelVal = (yMax - ratio * (yMax - yMin)).toFixed(1);
                return (
                  <g key={ratio}>
                    <line
                      x1={PAD_X}
                      y1={y}
                      x2={SVG_W - PAD_X}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD_X - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      fontWeight="500"
                    >
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Area Gradient di Bawah Garis */}
              <path d={areaPath} fill={`url(#gradient-${selected.id})`} />

              {/* Garis Utama Naik Turun */}
              <path
                d={linePath}
                fill="none"
                stroke={selected.warnaHex}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Titik Vertex Tiap Tahun & Label Naik-Turun */}
              {points.map((p, idx) => {
                const isHovered = hoveredIdx === idx;
                const isUp = p.status === 'naik';
                const isDown = p.status === 'turun';

                return (
                  <g
                    key={p.tahun}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Lingkaran Titik Garis */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6.5 : 4.5}
                      fill="#ffffff"
                      stroke={selected.warnaHex}
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      className="transition-all duration-150"
                    />

                    {/* Label Angka Produksi di Atas Titik */}
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#0f172a"
                    >
                      {p.produksi}
                    </text>

                    {/* Badge Persentase Naik/Turun di Atas Angka */}
                    {idx > 0 && (
                      <text
                        x={p.x}
                        y={p.y - 24}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={isUp ? '#059669' : isDown ? '#e11d48' : '#64748b'}
                      >
                        {isUp ? `▲ +${p.perubahanPersen}%` : `▼ ${p.perubahanPersen}%`}
                      </text>
                    )}

                    {/* Label Tahun di Bawah (X-Axis) */}
                    <text
                      x={p.x}
                      y={SVG_H - PAD_BOTTOM + 18}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill={isHovered ? '#0f172a' : '#475569'}
                    >
                      {p.tahun}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Keterangan Titik Riwayat 5 Tahun (Flat Inline, Bukan Card Terpisah) */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-center">
            {selected.riwayat.map((r, i) => (
              <div
                key={r.tahun}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`py-1.5 px-1 rounded transition-colors cursor-pointer ${
                  hoveredIdx === i ? 'bg-slate-100 font-bold' : 'text-slate-600'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-800">{r.tahun}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5" title={r.keterangan}>
                  {r.keterangan}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* KOLOM KANAN (25%): DIAGRAM BULAT PROPORSI NASIONAL */}
        <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-slate-50/40">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Proporsi Produksi Nasional
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                BPS 2024
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              Pembagian porsi hasil panen komoditas pangan pokok, sayur, dan buah di seluruh Indonesia.
            </p>

            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center my-3">
              <svg width="130" height="130" viewBox="0 0 110 110" className="transform -rotate-90">
                <circle
                  cx="55"
                  cy="55"
                  r={donutRadius}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth={donutStroke}
                />
                {donutSlices.map((slice, i) => (
                  <circle
                    key={i}
                    cx="55"
                    cy="55"
                    r={donutRadius}
                    fill="none"
                    stroke={slice.warna}
                    strokeWidth={donutStroke}
                    strokeDasharray={`${slice.length} ${circumference}`}
                    strokeDashoffset={-slice.offset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-sm font-black text-slate-900 leading-none">100%</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Total Pangan</span>
              </div>
            </div>

            {/* List Legend Minimalis */}
            <div className="space-y-1.5 pt-3 border-t border-slate-200/70">
              {PROPORSI_NASIONAL.map((p) => (
                <div key={p.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.warna }} />
                    <span className="text-slate-600">{p.label}</span>
                  </div>
                  <strong className="text-slate-900 font-bold">{p.persen}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200/70 text-[11px] text-slate-500 leading-tight">
            💡 <strong>Padi</strong> & <strong>Jagung</strong> menyerap lebih dari 55% kapasitas lahan panen nasional.
          </div>
        </div>

      </div>

    </div>
  );
}
