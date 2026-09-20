'use client';

import React, { useState } from 'react';
import { 
  CloudRain, Sun, Thermometer, Droplets, 
  Clock, Calendar, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { WeatherData } from '@/lib/types';

interface WeatherTrendsChartsProps {
  weather?: WeatherData | null;
}

export default function WeatherTrendsCharts({ weather }: WeatherTrendsChartsProps) {
  const [activeTab, setActiveTab] = useState<'24h' | '7hari'>('24h');

  // Data 24 Jam Tren Suhu Udara vs Air Tanah (Jam 04:00 - 22:00)
  const hourlyData = [
    { jam: '04:00', suhu: 24, air: 70, status: 'Lembap Dingin' },
    { jam: '06:00', suhu: 25, air: 65, status: 'Waktu Siram Ideal', isBestSpray: true },
    { jam: '08:00', suhu: 28, air: 60, status: 'Cerah Hangat' },
    { jam: '10:00', suhu: 31, air: 50, status: 'Mulai Terik' },
    { jam: '12:00', suhu: 34, air: 40, status: 'Terik Puncak (Jangan Siram)' },
    { jam: '14:00', suhu: 35, air: 38, status: 'Suhu Tertinggi' },
    { jam: '16:00', suhu: 32, air: 46, status: 'Mulai Redup' },
    { jam: '18:00', suhu: 29, air: 58, status: 'Waktu Siram Sore', isBestSpray: true },
    { jam: '20:00', suhu: 27, air: 65, status: 'Sejuk Alami' },
    { jam: '22:00', suhu: 25, air: 68, status: 'Malam Tenang' },
  ];

  // Data 7 Hari Curah Hujan & Rekomendasi Petani
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
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header & Tab Switcher */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Diagram Pantau Cuaca & Kebutuhan Air Sawah</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Membantu petani menentukan jam menyiram dan hari yang aman untuk menjemur gabah atau memupuk
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('24h')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === '24h'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tren 24 Jam Suhu & Air
          </button>
          <button
            onClick={() => setActiveTab('7hari')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === '7hari'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prakiraan Hujan 7 Hari
          </button>
        </div>
      </div>

      {/* Tab 1: Tren 24 Jam Suhu vs Air Tanah */}
      {activeTab === '24h' && (
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Legend & Quick Hint */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                <span className="font-semibold text-slate-700">Kadar Air Tanah (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-700">Suhu Udara (°C)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Waktu Terbaik Menyiram: 06:00 Pagi & 18:00 Sore</span>
            </div>
          </div>

          {/* Diagram Visual 24 Jam Bar & Curve Comparison */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
            {hourlyData.map((item, idx) => {
              // Kalkulasi tinggi visual bar
              const airHeight = Math.round((item.air / 80) * 120); // max 120px
              const suhuHeight = Math.round((item.suhu / 40) * 120);

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition-all ${
                    item.isBestSpray
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200/60'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  {/* Jam */}
                  <span className="text-[11px] font-bold text-slate-700 font-mono">
                    {item.jam}
                  </span>

                  {/* Visual Bar Container */}
                  <div className="h-32 w-full flex items-end justify-center gap-1.5 py-2">
                    {/* Bar Air Tanah (Biru) */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-sky-700 mb-0.5">{item.air}%</span>
                      <div
                        className="w-3 rounded-t-sm bg-sky-500 transition-all duration-500"
                        style={{ height: `${airHeight}px` }}
                        title={`Air Tanah: ${item.air}%`}
                      ></div>
                    </div>

                    {/* Bar Suhu (Oranye) */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-amber-700 mb-0.5">{item.suhu}°</span>
                      <div
                        className="w-3 rounded-t-sm bg-amber-500 transition-all duration-500"
                        style={{ height: `${suhuHeight}px` }}
                        title={`Suhu: ${item.suhu}°C`}
                      ></div>
                    </div>
                  </div>

                  {/* Status Keterangan Jam */}
                  {item.isBestSpray ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white text-center leading-tight">
                      Siram Pas
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 text-center truncate w-full">
                      {item.status.split(' ')[0]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Kotak Kesimpulan Praktis Petani */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>
                <strong>Panduan Pompa Hari Ini:</strong> Air tanah berada pada titik terendah (38%) pada pukul 12:00 - 14:00. Disarankan menghidupkan pompa pada sore hari pukul 17:00 - 18:30 saat suhu sudah dingin (29°C) agar air meresap sempurna ke akar.
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Prakiraan Hujan 7 Hari */}
      {activeTab === '7hari' && (
        <div className="p-5 sm:p-6 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">
              Peluang Curah Hujan Mingguan di Lokasi Sawah Anda
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman Menjemur</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Waspada Hujan</span>
            </div>
          </div>

          {/* 7 Hari Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast7Days.map((item, idx) => {
              const willRain = item.curah_hujan > 0 || item.kondisi.toLowerCase().includes('hujan');
              const barHeight = Math.min(100, Math.max(10, Math.round(item.curah_hujan * 60)));

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-between space-y-3 transition-all ${
                    willRain
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-emerald-50/40 border-emerald-200'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-900 block">{item.hari}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{item.suhu}°C</span>
                  </div>

                  {/* Icon & Rain Bar */}
                  <div className="flex flex-col items-center my-1">
                    {willRain ? (
                      <CloudRain className="w-7 h-7 text-blue-600 animate-bounce" />
                    ) : (
                      <Sun className="w-7 h-7 text-amber-500" />
                    )}
                    <span className="text-xs font-bold text-slate-800 mt-1">
                      {item.curah_hujan > 0 ? `${item.curah_hujan} mm` : '0 mm (Kering)'}
                    </span>
                  </div>

                  {/* Rekomendasi Aksi Petani */}
                  <div className="w-full text-center pt-2 border-t border-slate-200/70">
                    {willRain ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 block truncate">
                        Tunda Pupuk
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 block truncate">
                        Bagus Jemur
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Peringatan Semprot Pupuk:</strong> Pada hari <strong>Selasa & Jumat</strong> diprediksi terjadi hujan ringan hingga sedang. Jangan menyemprotkan pupuk cair atau pestisida daun di hari tersebut agar cairan tidak luntur terbuang oleh air hujan.
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
