'use client';

import { useEffect, useState } from 'react';
import { 
  Droplets, Thermometer, Sun, CloudRain, ShieldCheck, 
  MapPin, RefreshCw, AlertCircle, Info, Zap, Wind, 
  CloudSun, CheckCircle2, ChevronRight, Navigation, Satellite, UserCheck
} from 'lucide-react';
import { WeatherData, PetaniRecord } from '@/lib/types';
import { REGIONS } from '@/lib/agro_regions';
import IndonesiaMap3D from '@/components/IndonesiaMap3D';

export default function MonitoringPage() {
  const [selectedMode, setSelectedMode] = useState<'preset' | 'gps' | 'petani'>('preset');
  const [selectedDaerah, setSelectedDaerah] = useState(REGIONS[0].nama);
  const [registeredPetani, setRegisteredPetani] = useState<PetaniRecord[]>([]);
  const [selectedPetaniId, setSelectedPetaniId] = useState<string>('');
  
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number; label: string } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Muat daftar petani terdaftar dari database
  useEffect(() => {
    async function fetchPetani() {
      try {
        const res = await fetch('/api/petani');
        const json = await res.json();
        if (json.success && json.data) {
          setRegisteredPetani(json.data);
          if (json.data.length > 0 && !selectedPetaniId) {
            setSelectedPetaniId(json.data[0].id);
          }
        }
      } catch (e) {
        console.error('Gagal memuat data petani', e);
      }
    }
    fetchPetani();
  }, []);

  // Muat data cuaca berdasarkan parameter
  async function loadWeather(options: { lat?: number; lon?: number; daerah?: string; label?: string }) {
    setLoading(true);
    try {
      let url = '/api/cuaca?';
      if (options.lat !== undefined && options.lon !== undefined) {
        url += `lat=${options.lat}&lon=${options.lon}`;
      } else if (options.daerah) {
        url += `daerah=${encodeURIComponent(options.daerah)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setWeather(data.data);
        setCurrentCoords({
          lat: data.lat,
          lon: data.lon,
          label: options.label || data.daerah
        });
      }
    } catch (e) {
      console.error('Error fetching weather:', e);
    } finally {
      setLoading(false);
    }
  }

  // Load awal
  useEffect(() => {
    loadWeather({ daerah: selectedDaerah });
  }, []);

  // Handler Ganti Wilayah Preset
  function handleSelectRegion(nama: string) {
    setSelectedMode('preset');
    setSelectedDaerah(nama);
    setGpsAccuracy(null);
    loadWeather({ daerah: nama });
  }

  // Handler Deteksi GPS Langsung
  function handleDetectGps() {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung sensor GPS.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGpsAccuracy(Math.round(accuracy));
        setSelectedMode('gps');
        setGpsLoading(false);
        loadWeather({ 
          lat: latitude, 
          lon: longitude, 
          label: `GPS Sawah Presisi (${latitude.toFixed(4)}, ${longitude.toFixed(4)})` 
        });
      },
      (err) => {
        setGpsLoading(false);
        alert('Tidak dapat mendeteksi GPS: ' + err.message + '. Pastikan izin lokasi diaktifkan.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  // Handler Pilih Sawah Petani Terdaftar
  function handleSelectPetani(petaniId: string) {
    setSelectedPetaniId(petaniId);
    setSelectedMode('petani');
    const p = registeredPetani.find(item => item.id === petaniId);
    if (p) {
      if (p.lat && p.lon) {
        setGpsAccuracy(p.akurasi_gps || 10);
        loadWeather({ 
          lat: p.lat, 
          lon: p.lon, 
          label: `Lahan ${p.nama_petani} - ${p.daerah}` 
        });
      } else {
        setGpsAccuracy(null);
        loadWeather({ daerah: p.daerah, label: `Lahan ${p.nama_petani} - ${p.daerah}` });
      }
    }
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Satellite className="w-3.5 h-3.5 text-emerald-700" />
            <span>Telemetri Satelit BMKG & GPS Titik Sawah Presisi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Mikroklimat & Agrometeorologi
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Tarik data cuaca, suhu lingkungan, radiasi surya, dan estimasi kelembapan tanah langsung dari titik koordinat GPS sawah, bukan perkiraan kota.
          </p>
        </div>

        {/* Action Buttons: Live GPS & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={handleDetectGps}
            disabled={gpsLoading}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
              selectedMode === 'gps'
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {gpsLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Navigation className="w-4 h-4 text-amber-300" />
            )}
            <span>{gpsLoading ? 'Mencari GPS...' : '📍 Deteksi GPS Lokasi Saya'}</span>
          </button>

          <button
            onClick={() => {
              if (currentCoords) {
                loadWeather({ lat: currentCoords.lat, lon: currentCoords.lon, label: currentCoords.label });
              } else {
                loadWeather({ daerah: selectedDaerah });
              }
            }}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 transition-colors"
            title="Muat Ulang Telemetri Satelit"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

        </div>
      </div>

      {/* Target Selector Toolbar (Pilih Petani / Wilayah) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span>Pilih Titik Pemantauan:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Dropdown Petani Terdaftar */}
            {registeredPetani.length > 0 && (
              <div className="relative">
                <select
                  value={selectedMode === 'petani' ? selectedPetaniId : ''}
                  onChange={(e) => handleSelectPetani(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs text-slate-800 shadow-xs focus:border-emerald-500 outline-none"
                >
                  <option value="" disabled>-- Sawah Petani Terdaftar --</option>
                  {registeredPetani.map((p) => (
                    <option key={p.id} value={p.id}>
                      🌾 {p.nama_petani} ({p.jenis_tanaman} - {p.daerah.split(',')[0]})
                    </option>
                  ))}
                </select>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* Dropdown Wilayah Preset */}
            <div className="relative">
              <select
                value={selectedMode === 'preset' ? selectedDaerah : ''}
                onChange={(e) => handleSelectRegion(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs text-slate-800 shadow-xs focus:border-emerald-500 outline-none"
              >
                <option value="" disabled>-- Wilayah Acuan Riset --</option>
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.nama}>
                    {r.nama}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Active Coordinate & Satellite Status Banner */}
        {currentCoords && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-800">
                Lokasi Aktif: <span className="text-emerald-700 font-bold">{currentCoords.label}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Lat: {currentCoords.lat.toFixed(4)}, Lon: {currentCoords.lon.toFixed(4)}
              </span>
              {gpsAccuracy && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Akurasi GPS ±{gpsAccuracy}m
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Sumber: <strong className="text-slate-700">{weather?.sumber_data || 'Live Satelit Agrometeorologi BMKG'}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 3D Spatial Map with Live Beacons */}
      <div className="space-y-2">
        <IndonesiaMap3D 
          userCoords={currentCoords ? { lat: currentCoords.lat, lon: currentCoords.lon, label: currentCoords.label } : null}
          highlightFarmerId={selectedMode === 'petani' ? selectedPetaniId : undefined}
          onSelectFarmer={(farmer) => handleSelectPetani(farmer.id)}
        />
      </div>

      {loading ? (
        <div className="p-16 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-sm space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
          <p>Menyinkronkan telemetri cuaca satelit BMKG di koordinat sawah...</p>
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
                  <span>50% Optimal</span>
                  <span>100% Jenuh</span>
                </div>
              </div>
            </div>

            {/* 2. Suhu Lingkungan */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Suhu Titik Koordinat</span>
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
                  <span>Kondisi: {weather.kondisi}</span>
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
                  <p className="text-xs text-slate-500">Dikalibrasi dari profil tanah koordinat titik sawah</p>
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
                  <span>Status Radiasi Titik Sawah:</span>
                  <span className="text-emerald-700 font-bold">{weather.radiasi_surya} W/m² (Kondisi {weather.potensi_pompa_surya})</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Daya sinar matahari di koordinat sawah saat ini cukup untuk menggerakkan pompa submersible tenaga surya direct-drive dengan debit estimasi <strong>3.200 - 4.500 Liter/Jam</strong>.
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
                <h3 className="font-bold text-base text-slate-900">Prakiraan Cuaca Satelit BMKG 7 Hari Ke Depan</h3>
                <p className="text-xs text-slate-500">Estimasi suhu dan potensi curah hujan di koordinat sawah</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                <span>Angin: {weather.kecepatan_angin || 8.5} km/jam</span>
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
