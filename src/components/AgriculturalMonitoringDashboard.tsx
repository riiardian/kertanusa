'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, PieChart as PieIcon, Calendar, MapPin } from 'lucide-react';

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
  shareNasional: number; // Persentase dari total produksi pertanian
  warnaHex: string;
  ringkasan5Tahun: string;
  riwayat: YearlyPoint[];
}

const DATA_5_TAHUN: CommodityItem[] = [
  {
    id: 'padi',
    nama: 'Padi / Beras (GKG)',
    kategori: 'Pangan',
    sentra: 'Jawa Timur, Jawa Barat, Jawa Tengah, Sulsel',
    shareNasional: 38.5,
    warnaHex: '#059669',
    ringkasan5Tahun: 'Fluktuatif akibat iklim; sempat terkoreksi di 2023 karena El Nino, lalu pulih di 2024.',
    riwayat: [
      { tahun: 2020, produksi: 54.65, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis awal pandemi' },
      { tahun: 2021, produksi: 54.42, perubahanPersen: -0.42, status: 'turun', keterangan: 'Curah hujan La Nina basah' },
      { tahun: 2022, produksi: 54.75, perubahanPersen: 0.61, status: 'naik', keterangan: 'Perluasan bibit varietas genjah' },
      { tahun: 2023, produksi: 53.98, perubahanPersen: -1.41, status: 'turun', keterangan: 'Dampak kemarau ekstrem El Nino' },
      { tahun: 2024, produksi: 54.60, perubahanPersen: 1.15, status: 'naik', keterangan: 'Pemulihan pasokan & pompanisasi' }
    ]
  },
  {
    id: 'jagung',
    nama: 'Jagung Pipil Kering',
    kategori: 'Pangan',
    sentra: 'Jatim, Jateng, Lampung, Sulsel, NTB',
    shareNasional: 17.8,
    warnaHex: '#d97706',
    ringkasan5Tahun: 'Konsisten meningkat setiap tahun seiring tingginya kebutuhan bahan pakan ternak nasional.',
    riwayat: [
      { tahun: 2020, produksi: 22.80, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis awal periode' },
      { tahun: 2021, produksi: 23.50, perubahanPersen: 3.07, status: 'naik', keterangan: 'Kenaikan serapan pakan ternak' },
      { tahun: 2022, produksi: 24.20, perubahanPersen: 2.98, status: 'naik', keterangan: 'Ekspansi lahan tanam jagung' },
      { tahun: 2023, produksi: 24.80, perubahanPersen: 2.48, status: 'naik', keterangan: 'Tahan cuaca kering di lahan tadah' },
      { tahun: 2024, produksi: 25.20, perubahanPersen: 1.61, status: 'naik', keterangan: 'Produksi tertinggi 5 tahun terakhir' }
    ]
  },
  {
    id: 'pisang',
    nama: 'Pisang (Buah Terbesar)',
    kategori: 'Buah',
    sentra: 'Malang (Jatim), Jawa Barat, Lampung, Bali',
    shareNasional: 6.6,
    warnaHex: '#65a30d',
    ringkasan5Tahun: 'Buah tropis nomor satu di Indonesia, menyumbang lebih dari 35% total seluruh panen buah.',
    riwayat: [
      { tahun: 2020, produksi: 8.18, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis produksi buah' },
      { tahun: 2021, produksi: 8.74, perubahanPersen: 6.85, status: 'naik', keterangan: 'Peningkatan konsumsi rumah tangga' },
      { tahun: 2022, produksi: 9.24, perubahanPersen: 5.72, status: 'naik', keterangan: 'Permintaan pasar modern melonjak' },
      { tahun: 2023, produksi: 9.30, perubahanPersen: 0.65, status: 'naik', keterangan: 'Stabil di musim kemarau' },
      { tahun: 2024, produksi: 9.42, perubahanPersen: 1.29, status: 'naik', keterangan: 'Rekor panen buah segar' }
    ]
  },
  {
    id: 'cabai',
    nama: 'Cabai Rawit & Merah',
    kategori: 'Sayur',
    sentra: 'Kediri, Blitar, Garut, Temanggung, Lombok',
    shareNasional: 2.2,
    warnaHex: '#e11d48',
    ringkasan5Tahun: 'Volatilitas tinggi; sempat turun di 2023 akibat kemarau kering, namun melesat tajam di 2024.',
    riwayat: [
      { tahun: 2020, produksi: 2.72, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis produksi sayuran pedas' },
      { tahun: 2021, produksi: 2.75, perubahanPersen: 1.10, status: 'naik', keterangan: 'Pasokan aman di sentra Jatim' },
      { tahun: 2022, produksi: 2.98, perubahanPersen: 8.36, status: 'naik', keterangan: 'Panen raya serentak di Jawa' },
      { tahun: 2023, produksi: 2.85, perubahanPersen: -4.36, status: 'turun', keterangan: 'Kekeringan menekan luas panen' },
      { tahun: 2024, produksi: 3.10, perubahanPersen: 8.77, status: 'naik', keterangan: 'Lonjakan hasil panen irigasi tetes' }
    ]
  },
  {
    id: 'bawang',
    nama: 'Bawang Merah',
    kategori: 'Sayur',
    sentra: 'Brebes, Nganjuk, Bima, Demak, Enrekang',
    shareNasional: 1.6,
    warnaHex: '#9333ea',
    ringkasan5Tahun: 'Swasembada terjaga dengan pasokan lumbung Brebes & Bima yang konsisten di atas 2 juta ton.',
    riwayat: [
      { tahun: 2020, produksi: 1.82, perubahanPersen: 0, status: 'stabil', keterangan: 'Basis panen bawang' },
      { tahun: 2021, produksi: 2.00, perubahanPersen: 9.89, status: 'naik', keterangan: 'Ekspansi lahan di Bima & Nganjuk' },
      { tahun: 2022, produksi: 1.98, perubahanPersen: -1.00, status: 'turun', keterangan: 'Hujan basah memicu serangan ulat' },
      { tahun: 2023, produksi: 2.10, perubahanPersen: 6.06, status: 'naik', keterangan: 'Cuaca terik cocok untuk umbi' },
      { tahun: 2024, produksi: 2.25, perubahanPersen: 7.14, status: 'naik', keterangan: 'Produksi tertinggi sepanjang sejarah' }
    ]
  }
];

// Data komposisi proporsi nasional (Diagram Bulat Simpel)
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
  const selected = DATA_5_TAHUN.find((item) => item.id === selectedId) || DATA_5_TAHUN[0];

  // Hitung SVG Donut Chart Minimalis
  const radius = 48;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~301.59

  let runningOffset = 0;
  const donutSlices = PROPORSI_NASIONAL.map((item) => {
    const strokeLength = (item.persen / 100) * circumference;
    const offset = runningOffset;
    runningOffset += strokeLength;
    return {
      ...item,
      strokeLength,
      offset
    };
  });

  // Skala perbandingan visual tinggi bar 5 tahun
  const maxVal = Math.max(...selected.riwayat.map((r) => r.produksi)) * 1.12 || 1;

  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
      
      {/* 1. HEADER SECTION (Bersih, Rapi, Natural) */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              BPS & Kementerian Pertanian
            </span>
            <span className="text-xs text-slate-400 font-medium">Periode 2020 – 2024</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Monitoring Kenaikan & Penurunan Produksi Pertanian (5 Tahun Terakhir)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluasi tahunan hasil panen komoditas pangan pokok, aneka sayuran, dan buah-buahan di Indonesia.
          </p>
        </div>

        {/* Tab Pilihan Komoditas: Simple Flat Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 max-w-full">
          {DATA_5_TAHUN.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedId(k.id)}
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

      {/* 2. AREA MONITORING 5 TAHUN (TREN NAIK / TURUN TAHUN KE TAHUN) */}
      <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100">
        
        {/* Info Komoditas yang Sedang Dipantau */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{selected.nama}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {selected.kategori}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selected.ringkasan5Tahun}
            </p>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1.5 self-start sm:self-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Sentra: <strong className="text-slate-900">{selected.sentra}</strong></span>
          </div>
        </div>

        {/* Grid 5 Kolom Sejajar: 2020 s/d 2024 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {selected.riwayat.map((item, idx) => {
            const isLatest = idx === selected.riwayat.length - 1;
            const isUp = item.status === 'naik';
            const isDown = item.status === 'turun';
            const barHeightPct = Math.round((item.produksi / maxVal) * 100);

            return (
              <div
                key={item.tahun}
                className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                  isLatest
                    ? 'bg-white border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header Tahun & Badge Status */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-slate-900">{item.tahun}</span>
                    {idx === 0 ? (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Acuan
                      </span>
                    ) : isUp ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +{item.perubahanPersen}%
                      </span>
                    ) : isDown ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        {item.perubahanPersen}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Minus className="w-3 h-3" />
                        0%
                      </span>
                    )}
                  </div>

                  {/* Nilai Produksi */}
                  <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none mt-2">
                    {item.produksi}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Juta Ton</div>
                </div>

                {/* Indikator Bar Vertikal Natural */}
                <div className="my-3">
                  <div className="w-full bg-slate-100 rounded h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 ${
                        isLatest ? 'bg-emerald-600' : isDown ? 'bg-rose-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${barHeightPct}%` }}
                    />
                  </div>
                </div>

                {/* Catatan Singkat Penyebab Fluktuasi */}
                <div className="text-[10px] text-slate-500 leading-tight pt-1 border-t border-slate-100">
                  {item.keterangan}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. SECTION BAWAH: DIAGRAM BULAT PROPORSI & RANGKUMAN (Tanpa Card AI Slop) */}
      <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Diagram Bulat Minimalis */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg width="96" height="96" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
              {donutSlices.map((slice, i) => (
                <circle
                  key={i}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={slice.warna}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${slice.strokeLength} ${circumference}`}
                  strokeDashoffset={-slice.offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-black text-slate-900">100%</span>
              <span className="text-[9px] text-slate-400">Total Panen</span>
            </div>
          </div>

          {/* Legend Minimalis 2 Kolom */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {PROPORSI_NASIONAL.map((p) => (
              <div key={p.label} className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.warna }} />
                <span className="text-slate-700 font-medium">{p.label}:</span>
                <strong className="text-slate-900">{p.persen}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Insight BPS 5 Tahun */}
        <div className="text-xs text-slate-600 space-y-1 md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 w-full md:w-auto">
          <div className="font-semibold text-slate-900 flex items-center md:justify-end gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Tren Komoditas Unggulan Terbanyak (2020 – 2024)</span>
          </div>
          <p className="text-slate-500 max-w-md md:ml-auto">
            Padi tetap menjadi komoditas pangan terbesar (<strong>54.60 Juta Ton</strong>), sedangkan <strong>Pisang</strong> memimpin produksi buah nasional (<strong>9.42 Juta Ton</strong>) dengan tren naik konsisten 5 tahun berturut-turut.
          </p>
        </div>

      </div>

    </div>
  );
}
