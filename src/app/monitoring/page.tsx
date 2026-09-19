'use client';

import { useEffect, useState } from 'react';
import { 
  Droplets, Thermometer, Sun, CloudRain, ShieldCheck, 
  MapPin, RefreshCw, AlertCircle, Info, Zap, Wind, 
  CloudSun, CheckCircle2, ChevronRight
} from 'lucide-react';
import { WeatherData } from '@/lib/types';
import { REGIONS } from '@/lib/agro_regions';

export default function MonitoringPage() {
  const [selectedDaerah, setSelectedDaerah] = useState(REGIONS[0].nama);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadWeather(daerah: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/cuaca?daerah=${encodeURIComponent(daerah)}`);
      const data = await res.json();
      if (data.success) {
        setWeather(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(selectedDaerah);
  }, [selectedDaerah]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Region Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Telemetri Mikroklimat & Lahan Presisi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Kelembapan, Suhu, Cuaca & pH
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Estimasi data agrometeorologi terintegrasi satelit dan kalibrasi karakteristik tanah wilayah pertanian Indonesia.
          </p>
        </div>

        {/* Region Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedDaerah}
              onChange={(e) => setSelectedDaerah(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs text-slate-800 shadow-sm focus:border-emerald-500 outline-none"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.nama}>
                  {r.nama}
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={() => loadWeather(selectedDaerah)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-sm">
          Menyinkronkan telemetri cuaca dan profil tanah {selectedDaerah}...
        </div>
      ) : weather && (
        <>
          {/* Top 4 Sensor Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Kelembapan Tanah */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Kelembapan Tanah</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{weather.kelembapan_tanah}%</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    weather.status_tanah === 'Optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : weather.status_tanah === 'Kering'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {weather.status_tanah}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Rentang ideal tanaman: 55% - 70%</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      weather.kelembapan_tanah < 50 
                        ? 'bg-amber-500' 
                        : weather.kelembapan_tanah > 80 
                        ? 'bg-blue-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, weather.kelembapan_tanah)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0% Kering</span>
                  <span>50%</span>
                  <span>100% Jenuh</span>
                </div>
              </div>
            </div>

            {/* 2. Suhu Lingkungan */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Suhu Lingkungan</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Thermometer className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{weather.suhu}°C</span>
                  <span className="text-xs font-semibold text-slate-500">
                    Min {weather.suhu_min}° / Max {weather.suhu_max}°
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Zona Suhu Aman Pertumbuhan</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Kelembapan Udara (RH):</span>
                <span className="font-bold text-slate-700">{weather.kelembapan_udara}%</span>
              </div>
            </div>

            {/* 3. Potensi Pompa Surya */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Radiasi Pompa Surya</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{weather.radiasi_surya}</span>
                  <span className="text-xs font-bold text-slate-500">W/m²</span>
                </div>
                <p className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Efisiensi: {weather.potensi_pompa_surya}</span>
                </p>
              </div>

              <div className="p-2 rounded-lg bg-blue-50 text-[11px] text-blue-900 leading-tight">
                ☀️ Pompa air tenaga surya direct-flow dapat bekerja maksimal jam 09.30 - 14.30.
              </div>
            </div>

            {/* 4. pH Tanah & Remediasi */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Keasaman (pH) Tanah</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">pH {weather.ph_tanah}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {weather.status_ph}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Skala netral optimal: 6.0 - 7.0</p>
              </div>

              {/* Visual pH Line */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-red-400 via-emerald-400 to-blue-400"></div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>4.0 Asam</span>
                  <span>7.0 Netral</span>
                  <span>9.0 Basa</span>
                </div>
              </div>
            </div>

          </div>

          {/* Middle Row: Detailed pH Advice & Solar Pumping Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* pH Soil Remediation Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Rekomendasi Pembenah Tanah & Pupuk (pH)</h3>
                  <p className="text-xs text-slate-500">Berdasarkan hasil analisis pH tanah wilayah {selectedDaerah}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-950 leading-relaxed">
                {weather.rekomendasi_ph}
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-700">Dampak pH Tanah terhadap Penyerapan Unsur Hara:</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span><strong>pH &lt; 5.5 (Masam)</strong>: Unsur Fosfat (P) terikat oleh Aluminium dan Besi sehingga akar tanaman kerdil. Butuh kapur Dolomit / Kalsium Karbonat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span><strong>pH 6.0 - 6.8 (Ideal)</strong>: Efisiensi penyerapan pupuk N, P, K, Ca, dan Mg mencapai 100%. Tanaman tumbuh prima.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <span><strong>pH &gt; 7.5 (Basa)</strong>: Unsur mikro Besi (Fe) dan Seng (Zn) sulit diserap, picu klorosis daun muda. Butuh pupuk belerang (ZA).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solar Irrigation Advisory */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Panduan Pompa Tenaga Surya Mandiri (PATS)</h3>
                  <p className="text-xs text-slate-500">Irigasi sawah pelosok tanpa genset & baterai aki mahal</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs text-amber-950">
                <div className="flex justify-between items-center font-semibold">
                  <span>Status Radiasi Hari Ini:</span>
                  <span className="text-emerald-700 font-bold">{weather.radiasi_surya} W/m² (Sangat Baik)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Daya sinar matahari saat ini cukup untuk menggerakkan pompa submersible tenaga surya direct-drive dengan debit rata-rata <strong>3.200 - 4.500 Liter/Jam</strong>.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-700">Jadwal Operasional Pompa Surya Hari Ini:</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block">Pagi (07.00 - 09.30)</span>
                    <strong className="text-slate-700 block mt-1">Daya Awal (30%)</strong>
                    <span className="text-[10px] text-slate-400">Pengisian Toren</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-emerald-600 font-bold block">Puncak (09.30 - 14.30)</span>
                    <strong className="text-emerald-800 block mt-1">Debit Maksimal (100%)</strong>
                    <span className="text-[10px] text-emerald-600 font-medium">Irigasi Sawah Utama</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block">Sore (14.30 - 17.00)</span>
                    <strong className="text-slate-700 block mt-1">Daya Turun (40%)</strong>
                    <span className="text-[10px] text-slate-400">Gravitasi Toren</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: 7-Day Forecast */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Prakiraan Cuaca 7 Hari Ke Depan</h3>
                <p className="text-xs text-slate-500">Estimasi suhu dan potensi curah hujan di wilayah {selectedDaerah}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.prakiraan_7hari.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border text-center space-y-2 ${
                    idx === 0 
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <span className={`text-xs font-bold block ${idx === 0 ? 'text-emerald-800' : 'text-slate-700'}`}>
                    {item.hari}
                  </span>

                  <div className="w-10 h-10 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center text-emerald-600">
                    {item.icon === 'cloud-rain' ? (
                      <CloudRain className="w-5 h-5 text-blue-500" />
                    ) : item.icon === 'cloud-sun' ? (
                      <CloudSun className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                  </div>

                  <div>
                    <span className="text-base font-extrabold text-slate-900 block">{item.suhu}°C</span>
                    <span className="text-[11px] text-slate-500 block leading-tight">{item.kondisi}</span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/60">
                    Hujan: {item.curah_hujan} mm
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
