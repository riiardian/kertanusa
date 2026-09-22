'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Sparkles } from 'lucide-react';

interface YearlyPoint {
  tahun: number;
  labelTahun: string;
  produksi: number; // Juta Ton
  perubahanPersen: number; // YoY %
  status: 'naik' | 'turun' | 'stabil';
  tipe: 'realisasi' | 'estimasi' | 'target';
  keterangan: string;
}

interface CommodityCategory {
  id: string;
  nama: string;
  kategoriLabel: string;
  pangsaPersen: number;
  warnaHex: string;
  lumbungTerbesar: string;
  komoditasPopuler: string;
  riwayat: YearlyPoint[];
}

// Data 2021 s/d 2026 yang 100% sinkron antara tab pilihan dan diagram bulat
const DATA_KOMODITAS: CommodityCategory[] = [
  {
    id: 'padi',
    nama: 'Padi (Beras)',
    kategoriLabel: 'Tanaman Pangan',
    pangsaPersen: 38.5,
    warnaHex: '#059669',
    lumbungTerbesar: 'Jawa Timur, Jawa Barat, Jawa Tengah, Sulawesi Selatan',
    komoditasPopuler: 'Beras Medium, Premium, Ciherang, Inpari',
    riwayat: [
      { tahun: 2021, labelTahun: '2021', produksi: 54.42, perubahanPersen: 0, status: 'stabil', tipe: 'realisasi', keterangan: 'Curah hujan La Nina basah' },
      { tahun: 2022, labelTahun: '2022', produksi: 54.75, perubahanPersen: 0.61, status: 'naik', tipe: 'realisasi', keterangan: 'Perluasan bibit varietas genjah' },
      { tahun: 2023, labelTahun: '2023', produksi: 53.98, perubahanPersen: -1.41, status: 'turun', tipe: 'realisasi', keterangan: 'Kemarau panjang fenomena El Nino' },
      { tahun: 2024, labelTahun: '2024', produksi: 54.60, perubahanPersen: 1.15, status: 'naik', tipe: 'realisasi', keterangan: 'Realisasi final pemulihan pasokan' },
      { tahun: 2025, labelTahun: '2025 (Est)', produksi: 55.80, perubahanPersen: 2.20, status: 'naik', tipe: 'estimasi', keterangan: 'Estimasi sementara: program pompanisasi' },
      { tahun: 2026, labelTahun: '2026 (Tgt)', produksi: 57.20, perubahanPersen: 2.51, status: 'naik', tipe: 'target', keterangan: 'Target roadmap Swasembada Pangan' }
    ]
  },
  {
    id: 'jagung',
    nama: 'Jagung',
    kategoriLabel: 'Tanaman Pangan & Pakan',
    pangsaPersen: 17.8,
    warnaHex: '#d97706',
    lumbungTerbesar: 'Jawa Timur, Jawa Tengah, Lampung, Sulawesi Selatan, NTB',
    komoditasPopuler: 'Jagung Pipil Kering, Jagung Manis Hibrida',
    riwayat: [
      { tahun: 2021, labelTahun: '2021', produksi: 23.50, perubahanPersen: 0, status: 'stabil', tipe: 'realisasi', keterangan: 'Kenaikan serapan pakan ayam petelur' },
      { tahun: 2022, labelTahun: '2022', produksi: 24.20, perubahanPersen: 2.98, status: 'naik', tipe: 'realisasi', keterangan: 'Ekspansi lahan tanam jagung baru' },
      { tahun: 2023, labelTahun: '2023', produksi: 24.80, perubahanPersen: 2.48, status: 'naik', tipe: 'realisasi', keterangan: 'Tahan cuaca kering di lahan tadah hujan' },
      { tahun: 2024, labelTahun: '2024', produksi: 25.20, perubahanPersen: 1.61, status: 'naik', tipe: 'realisasi', keterangan: 'Rekor realisasi panen tertinggi' },
      { tahun: 2025, labelTahun: '2025 (Est)', produksi: 26.10, perubahanPersen: 3.57, status: 'naik', tipe: 'estimasi', keterangan: 'Estimasi sementara serapan industri' },
      { tahun: 2026, labelTahun: '2026 (Tgt)', produksi: 27.00, perubahanPersen: 3.45, status: 'naik', tipe: 'target', keterangan: 'Target kemandirian pakan nasional' }
    ]
  },
  {
    id: 'singkong',
    nama: 'Singkong / Umbi',
    kategoriLabel: 'Pangan & Industri Tepung',
    pangsaPersen: 11.6,
    warnaHex: '#ca8a04',
    lumbungTerbesar: 'Lampung (Lumbung Tapioka), Jawa Tengah, Jawa Timur, NTT',
    komoditasPopuler: 'Ubi Kayu Gajah, Ubi Jalar Madu, Singkong Manis',
    riwayat: [
      { tahun: 2021, labelTahun: '2021', produksi: 17.80, perubahanPersen: 0, status: 'stabil', tipe: 'realisasi', keterangan: 'Permintaan pabrik tepung tapioka normal' },
      { tahun: 2022, labelTahun: '2022', produksi: 17.40, perubahanPersen: -2.25, status: 'turun', tipe: 'realisasi', keterangan: 'Peralihan petani ke komoditas jagung' },
      { tahun: 2023, labelTahun: '2023', produksi: 16.90, perubahanPersen: -2.87, status: 'turun', tipe: 'realisasi', keterangan: 'Kekeringan menekan bobot umbi tanah' },
      { tahun: 2024, labelTahun: '2024', produksi: 16.40, perubahanPersen: -2.96, status: 'turun', tipe: 'realisasi', keterangan: 'Penurunan luas tanam sentra Lampung' },
      { tahun: 2025, labelTahun: '2025 (Est)', produksi: 17.10, perubahanPersen: 4.27, status: 'naik', tipe: 'estimasi', keterangan: 'Estimasi pemulihan harga bahan tapioka' },
      { tahun: 2026, labelTahun: '2026 (Tgt)', produksi: 17.80, perubahanPersen: 4.09, status: 'naik', tipe: 'target', keterangan: 'Target program hilirisasi bioenergi & tepung' }
    ]
  },
  {
    id: 'buah',
    nama: 'Buah-buahan',
    kategoriLabel: 'Hortikultura Buah',
    pangsaPersen: 16.5,
    warnaHex: '#65a30d',
    lumbungTerbesar: 'Jawa Timur (Malang/Banyuwangi), Jawa Barat, Lampung, Bali',
    komoditasPopuler: 'Pisang (35%+ buah RI), Mangga, Jeruk, Nanas, Pepaya',
    riwayat: [
      { tahun: 2021, labelTahun: '2021', produksi: 22.80, perubahanPersen: 0, status: 'stabil', tipe: 'realisasi', keterangan: 'Konsumsi buah harian keluarga naik' },
      { tahun: 2022, labelTahun: '2022', produksi: 23.60, perubahanPersen: 3.51, status: 'naik', tipe: 'realisasi', keterangan: 'Ekspansi kebun pisang & alpukat komersial' },
      { tahun: 2023, labelTahun: '2023', produksi: 24.10, perubahanPersen: 2.12, status: 'naik', tipe: 'realisasi', keterangan: 'Cuaca terik mendukung manisnya buah' },
      { tahun: 2024, labelTahun: '2024', produksi: 24.50, perubahanPersen: 1.66, status: 'naik', tipe: 'realisasi', keterangan: 'Realisasi panen buah segar melimpah' },
      { tahun: 2025, labelTahun: '2025 (Est)', produksi: 25.40, perubahanPersen: 3.67, status: 'naik', tipe: 'estimasi', keterangan: 'Estimasi sementara: serapan ritel modern' },
      { tahun: 2026, labelTahun: '2026 (Tgt)', produksi: 26.20, perubahanPersen: 3.15, status: 'naik', tipe: 'target', keterangan: 'Target peningkatan ekspor buah tropis' }
    ]
  },
  {
    id: 'sayur',
    nama: 'Sayur-sayuran',
    kategoriLabel: 'Hortikultura Sayur',
    pangsaPersen: 10.2,
    warnaHex: '#e11d48',
    lumbungTerbesar: 'Brebes, Kediri, Temanggung, Garut, Bima, Malang',
    komoditasPopuler: 'Cabai Rawit, Bawang Merah, Tomat, Kubis, Wortel',
    riwayat: [
      { tahun: 2021, labelTahun: '2021', produksi: 13.80, perubahanPersen: 0, status: 'stabil', tipe: 'realisasi', keterangan: 'Pasokan sayur segar di pasar induk' },
      { tahun: 2022, labelTahun: '2022', produksi: 14.40, perubahanPersen: 4.35, status: 'naik', tipe: 'realisasi', keterangan: 'Panen raya cabai & bawang serentak' },
      { tahun: 2023, labelTahun: '2023', produksi: 13.90, perubahanPersen: -3.47, status: 'turun', tipe: 'realisasi', keterangan: 'Kekeringan menekan sayuran daun & cabai' },
      { tahun: 2024, labelTahun: '2024', produksi: 14.60, perubahanPersen: 5.04, status: 'naik', tipe: 'realisasi', keterangan: 'Realisasi panen melimpah berkat irigasi tetes' },
      { tahun: 2025, labelTahun: '2025 (Est)', produksi: 15.20, perubahanPersen: 4.11, status: 'naik', tipe: 'estimasi', keterangan: 'Estimasi sementara: ekspansi greenhouse' },
      { tahun: 2026, labelTahun: '2026 (Tgt)', produksi: 15.80, perubahanPersen: 3.95, status: 'naik', tipe: 'target', keterangan: 'Target stabilisasi pasokan anti-inflasi' }
    ]
  },
  {
    id: 'lainnya',
    nama: 'Komoditas Lainnya',
    kategoriLabel: 'Kacang & Aneka Nabati',
    pangsaPersen: 5.4,
    warnaHex: '#64748b',
    lumbungTerbesar: 'Jawa Tengah (Grobogan), Jawa Timur, NTT, NTB',
    komoditasPopuler: 'Kedelai, Kacang Tanah, Kacang Hijau, Talas',
    riwayat: [
      { tahun: 2021, labelTahun: '2021', produksi: 7.90, perubahanPersen: 0, status: 'stabil', tipe: 'realisasi', keterangan: 'Produksi kacang-kacangan lokal' },
      { tahun: 2022, labelTahun: '2022', produksi: 8.10, perubahanPersen: 2.53, status: 'naik', tipe: 'realisasi', keterangan: 'Program tanam kedelai tumpang sari' },
      { tahun: 2023, labelTahun: '2023', produksi: 7.85, perubahanPersen: -3.09, status: 'turun', tipe: 'realisasi', keterangan: 'Kekeringan pada tanaman palawija' },
      { tahun: 2024, labelTahun: '2024', produksi: 8.05, perubahanPersen: 2.55, status: 'naik', tipe: 'realisasi', keterangan: 'Panen kacang tanah & hijau membaik' },
      { tahun: 2025, labelTahun: '2025 (Est)', produksi: 8.30, perubahanPersen: 3.11, status: 'naik', tipe: 'estimasi', keterangan: 'Estimasi sementara perluasan lahan palawija' },
      { tahun: 2026, labelTahun: '2026 (Tgt)', produksi: 8.60, perubahanPersen: 3.61, status: 'naik', tipe: 'target', keterangan: 'Target reduksi impor kedelai industri tahu tempe' }
    ]
  }
];

export default function AgriculturalMonitoringDashboard() {
  const [selectedId, setSelectedId] = useState('padi');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const selected = DATA_KOMODITAS.find((item) => item.id === selectedId) || DATA_KOMODITAS[0];

  // Hitung koordinat SVG Line Chart
  const values = selected.riwayat.map((r) => r.produksi);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valDiff = maxVal - minVal || 1;
  const buffer = Math.max(valDiff * 0.4, 0.4);
  const yMin = Math.max(0, minVal - buffer);
  const yMax = maxVal + buffer;

  const SVG_W = 680;
  const SVG_H = 200;
  const PAD_X = 55;
  const PAD_TOP = 36;
  const PAD_BOTTOM = 38;
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

  // Hitung Donut Chart
  const donutRadius = 40;
  const donutStroke = 11;
  const circumference = 2 * Math.PI * donutRadius;

  let runningOffset = 0;
  const donutSlices = DATA_KOMODITAS.map((item) => {
    const length = (item.pangsaPersen / 100) * circumference;
    const offset = runningOffset;
    runningOffset += length;
    return { ...item, length, offset };
  });

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className="w-full space-y-6">
      
      {/* 1. HEADER SECTION (Seamless Flat, Nyatu dengan Background) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              BPS & Kementan RI
            </span>
            <span className="text-xs text-slate-500 font-medium">Periode 2021 – 2026 (Terkini)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monitoring Fluktuasi Panen Nasional & Proporsi Komoditas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Diagram garis fluktuasi naik-turun hasil panen tahun ke tahun hingga target 2026, sinkron dengan komposisi produksi pangan nasional.
          </p>
        </div>

        {/* Tab Pilihan Komoditas: 100% Sinkron dengan Donut Chart */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 max-w-full">
          {DATA_KOMODITAS.map((k) => (
            <button
              key={k.id}
              onClick={() => {
                setSelectedId(k.id);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedId === k.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {k.nama}
            </button>
          ))}
        </div>
      </div>

      {/* 2. AREA INTI: LINE CHART (KIRI) & DONUT CHART (KANAN) SEAMLESS TANPA CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI: DIAGRAM GARIS FLUKTUASI (2021 - 2026) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Detail Informasi Komoditas Aktif & Lumbung Daerah Terbesar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">{selected.nama}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selected.kategoriLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mencakup: <strong className="text-slate-700">{selected.komoditasPopuler}</strong>
              </p>
            </div>

            {/* Badge Titik Tahun Aktif */}
            <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg self-start sm:self-auto shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Tahun {activePoint.labelTahun}:</span>
              <span className="text-base font-black text-slate-900 leading-none">{activePoint.produksi} Jt Ton</span>
              {activePoint.perubahanPersen > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{activePoint.perubahanPersen}%
                </span>
              )}
              {activePoint.perubahanPersen < 0 && (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> {activePoint.perubahanPersen}%
                </span>
              )}
              {activePoint.perubahanPersen === 0 && (
                <span className="text-xs font-semibold text-slate-400">Basis</span>
              )}
            </div>
          </div>

          {/* Penjelasan Wilayah Lumbung Terbesar (Sentra Produksi Utama) */}
          <div className="flex items-start gap-2 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-slate-600">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Daerah Lumbung Panen Terbesar (Sentra Utama): </span>
              <span>{selected.lumbungTerbesar}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                *Sentra utama adalah provinsi/kabupaten yang menghasilkan lebih dari 50% total pasokan panen nasional.
              </p>
            </div>
          </div>

          {/* KANVAS DIAGRAM GARIS (SVG LINE CHART) */}
          <div className="w-full select-none pt-2">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id={`lineGrad-${selected.id}`} x1="0" y1="0" x2="0" y2="1">
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

              {/* Area Gradient */}
              <path d={areaPath} fill={`url(#lineGrad-${selected.id})`} />

              {/* Garis Naik-Turun Berkelanjutan */}
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
                    {/* Circle Dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6.5 : 4.5}
                      fill="#ffffff"
                      stroke={selected.warnaHex}
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      className="transition-all duration-150"
                    />

                    {/* Angka Produksi di Atas Titik */}
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

                    {/* Persentase Naik/Turun */}
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

                    {/* Label Tahun (X-Axis) */}
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

                    {/* Tag Status (Realisasi / Est / Target) */}
                    <text
                      x={p.x}
                      y={SVG_H - PAD_BOTTOM + 30}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="600"
                      fill={p.tipe === 'target' ? '#059669' : p.tipe === 'estimasi' ? '#d97706' : '#94a3b8'}
                    >
                      {p.tipe === 'target' ? 'Target' : p.tipe === 'estimasi' ? 'Estimasi' : 'BPS'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Keterangan Dinamika Tahunan (Flat Natural Row) */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-center">
            {selected.riwayat.map((r, i) => (
              <div
                key={r.tahun}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`py-1.5 px-1 rounded transition-colors cursor-pointer ${
                  hoveredIdx === i ? 'bg-slate-100 font-bold' : 'text-slate-600'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-800">{r.labelTahun}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5" title={r.keterangan}>
                  {r.keterangan}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* KOLOM KANAN: DIAGRAM BULAT PROPORSI NASIONAL (100% SINKRON DENGAN TAB) */}
        <div className="lg:col-span-4 space-y-4 pt-2 lg:pt-0 lg:border-l lg:border-slate-200/80 lg:pl-8">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Proporsi Produksi Nasional
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                BPS 2024
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Porsi pangsa hasil panen komoditas pangan, sayur, dan buah di seluruh wilayah Indonesia.
            </p>

            {/* Donut Chart SVG */}
            <div className="relative flex items-center justify-center my-4">
              <svg width="124" height="124" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r={donutRadius}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth={donutStroke}
                />
                {donutSlices.map((slice) => {
                  const isCurrent = selected.id === slice.id;
                  return (
                    <circle
                      key={slice.id}
                      cx="50"
                      cy="50"
                      r={donutRadius}
                      fill="none"
                      stroke={slice.warnaHex}
                      strokeWidth={isCurrent ? donutStroke + 3 : donutStroke}
                      strokeDasharray={`${slice.length} ${circumference}`}
                      strokeDashoffset={-slice.offset}
                      className="transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedId(slice.id);
                        setHoveredIdx(null);
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-sm font-black text-slate-900 leading-none">{selected.pangsaPersen}%</span>
                <span className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[60px]">{selected.nama.split('(')[0]}</span>
              </div>
            </div>

            {/* List Legend: Klik Langsung Berpindah */}
            <div className="space-y-1.5 pt-2">
              {DATA_KOMODITAS.map((p) => {
                const isSelected = selected.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedId(p.id);
                      setHoveredIdx(null);
                    }}
                    className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md transition-colors text-left ${
                      isSelected ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.warnaHex }} />
                      <span>{p.nama}</span>
                    </div>
                    <strong className="text-slate-900">{p.pangsaPersen}%</strong>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/70 text-xs text-slate-500 leading-relaxed">
            💡 <strong>Padi</strong> dan <strong>Jagung</strong> adalah dua komoditas terbesar yang menyerap lebih dari 55% kapasitas lahan panen nasional Indonesia.
          </div>
        </div>

      </div>

    </div>
  );
}
