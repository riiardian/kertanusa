'use client';

import React, { useState } from 'react';
import { 
  Droplets, Sun, Clock, AlertTriangle, CheckCircle2, 
  CloudRain, CloudSun, ShieldCheck, Thermometer
} from 'lucide-react';
import { WeatherData } from '@/lib/types';

interface WeatherTrendsChartsProps {
  weather?: WeatherData | null;
}

export default function WeatherTrendsCharts({ weather }: WeatherTrendsChartsProps) {
  const [activeTab, setActiveTab] = useState<'jadwal' | '7hari'>('jadwal');

  // Nilai data riil / fallback
  const kelembapan = weather?.kelembapan_tanah ?? 64;
  const suhu = weather?.suhu ?? 29.5;
  const kondisi = weather?.kondisi ?? 'Pagi Cerah';

  // Status Kelembapan Tanah
  let statusTanah = {
    label: 'Lembap Ideal',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'Cadangan air di perakaran tanaman cukup baik. Pertahankan jadwal penyiraman normal.',
    color: '#059669'
  };

  if (kelembapan < 40) {
    statusTanah = {
      label: 'Tanah Kering',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      desc: 'Kelembapan di bawah batas aman. Disarankan segera menyiram sesuai jadwal terdekat.',
      color: '#e11d48'
    };
  } else if (kelembapan > 75) {
    statusTanah = {
      label: 'Sangat Basah',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      desc: 'Kondisi tanah jenuh air. Tunda penyiraman agar perakaran tidak membusuk.',
      color: '#0284c7'
    };
  }

  // Pin posisi meteran (clamp 5% - 95% agar pin tidak keluar garis)
  const pinPos = Math.max(4, Math.min(96, kelembapan));

  // Data 7 Hari Curah Hujan Simpel
  const forecast7Days = weather?.prakiraan_7hari || [
    { hari: 'Hari Ini', suhu: 34, kondisi: 'Cerah Terik', curah_hujan: 0, icon: 'sun' },
    { hari: 'Senin', suhu: 33, kondisi: 'Berawan Tebal', curah_hujan: 0, icon: 'cloud-sun' },
    { hari: 'Selasa', suhu: 33, kondisi: 'Hujan Ringan', curah_hujan: 0.2, icon: 'cloud-rain' },
    { hari: 'Rabu', suhu: 33, kondisi: 'Hujan Ringan', curah_hujan: 0.3, icon: 'cloud-rain' },
    { hari: 'Kamis', suhu: 33, kondisi: 'Cerah Berawan', curah_hujan: 0, icon: 'sun' },
    { hari: 'Jumat', suhu: 32, kondisi: 'Hujan Sedang', curah_hujan: 1.2, icon: 'cloud-rain' },
    { hari: 'Sabtu', suhu: 32, kondisi: 'Hujan Ringan', curah_hujan: 0.4, icon: 'cloud-rain' },
  ];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header & Tab Sederhana ala AeroFlazz */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <span>Pantau Air & Jadwal Siram Sawah</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi langsung ke inti: kondisi kelembapan tanah riil dan jam menyiram yang aman
          </p>
        </div>

        {/* Tab Buttons Sederhana */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/70 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'jadwal'
                ? 'bg-[#0B1A13] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Status & Jadwal Siram
          </button>
          <button
            onClick={() => setActiveTab('7hari')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === '7hari'
                ? 'bg-[#0B1A13] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prakiraan Hujan 7 Hari
          </button>
        </div>
      </div>

      {/* Tab 1: Status Air & Jadwal Siram Langsung ke Intinya */}
      {activeTab === 'jadwal' && (
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Grid 2 Kolom: Kiri Meteran Level Air, Kanan 2 Jadwal Siram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* KOLOM KIRI: Meteran Kelembapan Tanah (5 Kolom) */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kelembapan Tanah Saat Ini
                  </span>
                  <Droplets className="w-4 h-4 text-emerald-700" />
                </div>

                {/* Angka Besar & Badge Status */}
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {kelembapan}%
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${statusTanah.badgeBg}`}>
                    {statusTanah.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {statusTanah.desc}
                </p>
              </div>

              {/* LEVEL METER BAR (3 ZONA: KERING, IDEAL, BASAH) */}
              <div className="pt-2">
                
                {/* Posisi Angka Pin di Atas Bar */}
                <div className="relative w-full h-6 mb-1">
                  <div 
                    className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                    style={{ left: `${pinPos}%` }}
                  >
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-white leading-none shadow-xs">
                      {kelembapan}%
                    </span>
                    <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-slate-900"></div>
                  </div>
                </div>

                {/* Bar 3 Zona Warna */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200">
                  {/* Zona Kering (<40%) */}
                  <div 
                    className="h-full bg-amber-400" 
                    style={{ width: '40%' }} 
                    title="Zona Kering (<40%)"
                  ></div>
                  {/* Zona Ideal (40-75%) */}
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: '35%' }} 
                    title="Zona Ideal (40-75%)"
                  ></div>
                  {/* Zona Basah (>75%) */}
                  <div 
                    className="h-full bg-sky-400" 
                    style={{ width: '25%' }} 
                    title="Zona Sangat Basah (>75%)"
                  ></div>
                </div>

                {/* Label Keterangan Zona */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mt-1.5 px-0.5">
                  <span className="text-amber-700">Kering (&lt;40%)</span>
                  <span className="text-emerald-700">Ideal (40–75%)</span>
                  <span className="text-sky-700">Basah (&gt;75%)</span>
                </div>
              </div>

              {/* Info Suhu Saat Ini Ringkas */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Suhu Udara: <strong className="text-slate-900">{suhu}°C</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kondisi: <strong className="text-slate-900">{kondisi}</strong></span>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN: 2 Kartu Jadwal Siram & Peringatan Siang (7 Kolom) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              
              {/* Kartu 1: Jadwal Siram Pagi */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                    <Sun className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Jadwal Siram Pagi</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                        Waktu Terbaik
                      </span>
                    </div>
                    <div className="text-xl font-black text-emerald-900 mt-0.5 font-mono">
                      06:00 – 07:30 <span className="text-xs font-semibold text-emerald-700">WIB</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Stomata daun terbuka sempurna. Penyerapan air dan nutrisi pupuk paling efisien tanpa risiko layu.
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
                    Serapan 94%
                  </span>
                </div>
              </div>

              {/* Kartu 2: Jadwal Siram Sore */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                    <Droplets className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Jadwal Siram Sore</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">
                        Rekomendasi
                      </span>
                    </div>
                    <div className="text-xl font-black text-emerald-900 mt-0.5 font-mono">
                      17:00 – 18:30 <span className="text-xs font-semibold text-emerald-700">WIB</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Suhu tanah sudah dingin. Air meresap langsung ke perakaran tanpa terbuang oleh penguapan matahari.
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
                    Penguapan Rendah
                  </span>
                </div>
              </div>

              {/* Banner Peringatan Siang Hari (Larangan Menyiram) */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="leading-relaxed">
                  <strong>Hindari Menyiram Pukul 11:30 – 14:30 WIB:</strong> Tanah sedang bersuhu tinggi ({weather?.suhu_max ?? 35}°C). Menyiram saat terik dapat merebus perakaran dan menyebabkan tanaman layu mendadak.
                </span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Prakiraan Cuaca 7 Hari Bersih & Rapi */}
      {activeTab === '7hari' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold text-slate-800 text-sm">Prakiraan Curah Hujan 7 Hari ke Depan</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman Menjemur</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Waspada Hujan</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast7Days.map((item, idx) => {
              const willRain = item.curah_hujan > 0 || item.kondisi.toLowerCase().includes('hujan');

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between text-center transition-all ${
                    willRain
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-emerald-50/40 border-emerald-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.hari}</span>
                    <span className="text-[11px] text-slate-500 block font-mono">{item.suhu}°C</span>

                    <div className="my-2.5 flex justify-center">
                      {willRain ? (
                        <CloudRain className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Sun className="w-6 h-6 text-amber-500" />
                      )}
                    </div>

                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {item.kondisi}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {item.curah_hujan > 0 ? `${item.curah_hujan} mm` : '0 mm (Kering)'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    {willRain ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 block truncate">
                        Tunda Pupuk
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 block truncate">
                        Aman Jemur
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Tips Kerja Tani Mingguan:</strong> Jika terjadi hujan ringan (&gt;0.5 mm), Anda dapat mematikan pompa irigasi untuk menghemat daya listrik dan bahan bakar.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
