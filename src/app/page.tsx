'use client';

import Image from 'next/image';
import Link from 'next/link';
import IndonesiaMap3D from '@/components/IndonesiaMap3D';
import LottieAnimation from '@/components/LottieAnimation';
import WeatherTrendsCharts from '@/components/WeatherTrendsCharts';
import CropGamificationTracker from '@/components/CropGamificationTracker';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { PetaniRecord, WeatherData } from '@/lib/types';

export default function HomePage() {
  const [petaniList, setPetaniList] = useState<PetaniRecord[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // State Pelacakan Lokasi Sawah
  const [locationName, setLocationName] = useState<string>('Brebes, Jawa Tengah');

  useEffect(() => {
    async function initData() {
      try {
        const resPetani = await fetch('/api/petani', { cache: 'no-store' });
        const dataP = await resPetani.json();
        
        let targetDaerah = 'Brebes, Jawa Tengah';
        let targetLat: number | undefined;
        let targetLon: number | undefined;

        if (dataP.success && dataP.data && dataP.data.length > 0) {
          setPetaniList(dataP.data);
          // Jika sudah ada lahan petani terdaftar, gunakan lokasi lahan petani pertama
          const first = dataP.data[0];
          targetDaerah = first.daerah;
          targetLat = first.lat;
          targetLon = first.lon;
          setLocationName(targetDaerah);
        }

        const weatherUrl = (targetLat && targetLon) 
          ? `/api/cuaca?lat=${targetLat}&lon=${targetLon}` 
          : `/api/cuaca?daerah=${encodeURIComponent(targetDaerah)}`;

        const resWeather = await fetch(weatherUrl, { cache: 'no-store' });
        const dataW = await resWeather.json();
        if (dataW.success) {
          setWeather(dataW.data);
          if (dataW.daerah) setLocationName(dataW.daerah);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Handler ganti sawah terdaftar
  const handleSelectPetaniLocation = async (daerah: string, lat?: number, lon?: number) => {
    try {
      setLoading(true);
      const url = (lat && lon) 
        ? `/api/cuaca?lat=${lat}&lon=${lon}` 
        : `/api/cuaca?daerah=${encodeURIComponent(daerah)}`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setWeather(json.data);
        setLocationName(daerah);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Label cerdas waktu & cuaca
  const getCuacaLabel = () => {
    if (weather?.is_day === 0) return 'Cuaca Malam';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'Cuaca Pagi';
    if (hour >= 10 && hour < 15) return 'Cuaca Siang';
    if (hour >= 15 && hour < 18) return 'Cuaca Sore';
    return 'Kondisi Cuaca';
  };

  return (
    <div className="w-full pb-14 text-slate-800">
      
      {/* 1. HERO BANNER FULL-WIDTH DENGAN TINGGI IDEAL & PROPORSIONAL */}
      <section className="relative w-full min-h-[640px] sm:min-h-[680px] md:min-h-[720px] flex items-stretch overflow-hidden">
        
        {/* Full-width Image 4K Ultra HD */}
        <Image
          src="/hero-pertanian-4k.webp"
          quality={95}
          alt="Lahan Pertanian Nusantara"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Soft Dark Gradient on Left (Clean & Natural) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent"></div>

        {/* Container Konten: Judul Diturunkan Proporsional & Pantauan Sawah Berada di Bawah dengan Margin Aman */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 md:pb-24">
          
          {/* Bagian Atas: Judul Sinergi Cerdas Ekosistem Pertanian */}
          <div className="max-w-2xl text-white space-y-3.5">
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] text-white drop-shadow-md">
              Sinergi Cerdas Ekosistem Pertanian
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-xl drop-shadow">
              Kelola kesehatan sawah dari bibit hingga panen dengan panduan cuaca harian dan pantauan kesuburan tanah yang saling terhubung.
            </p>
          </div>

          {/* Bagian Bawah: Pantauan Sawah Dinaikkan Sedikit agar Aman dari Tepi Bawah Layar */}
          <div className="max-w-3xl text-white pt-5 border-t border-white/20">
            
            {/* Baris Informasi Lokasi Pantauan */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm sm:text-base text-emerald-300 font-semibold drop-shadow">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pantauan Sawah: <strong className="text-white font-bold text-base sm:text-lg">{locationName}</strong></span>
              </div>

              {/* Pilihan cepat ganti lahan jika ada lebih dari 1 sawah */}
              {petaniList.length > 1 && (
                <select
                  onChange={(e) => {
                    const p = petaniList.find(item => item.id === e.target.value);
                    if (p) handleSelectPetaniLocation(p.daerah, p.lat, p.lon);
                  }}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/25 text-white focus:outline-none cursor-pointer"
                  title="Ganti lahan sawah yang dipantau"
                >
                  {petaniList.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.nama_petani} ({p.daerah})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Baris 4 Indikator Lottie (Berukuran Besar, Realtime Siang/Malam) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-7 pt-1">
              
              {/* Suhu Sawah */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center drop-shadow-md">
                  <LottieAnimation src="/thermometer.json" className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium block leading-tight">Suhu Sawah</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block mt-1">
                    {weather ? `${weather.suhu}°C` : '24.0°C'}
                  </span>
                </div>
              </div>

              {/* Kelembapan Tanah */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center drop-shadow-md">
                  <LottieAnimation src="/drop-water.json" className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium block leading-tight">Kelembapan Tanah</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block mt-1">
                    {weather ? `${weather.kelembapan_tanah}%` : '55%'}
                  </span>
                </div>
              </div>

              {/* Kondisi Cuaca (Realtime Siang/Malam) */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center drop-shadow-md">
                  <LottieAnimation src="/sun-hot.json" className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium block leading-tight">
                    {getCuacaLabel()}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-white block leading-tight mt-1 break-words">
                    {weather?.kondisi || (new Date().getHours() < 6 || new Date().getHours() >= 18 ? 'Malam Cerah' : 'Pagi Cerah')}
                  </span>
                </div>
              </div>

              {/* pH Tanah */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center drop-shadow-md">
                  <LottieAnimation src="/plant.json" className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium block leading-tight">pH Tanah</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none block mt-1">
                    {weather ? `pH ${weather.ph_tanah}` : 'pH 6.5'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* Konten Utama di Bawah Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* 2. DIAGRAM MONITORING: TREN 24 JAM SUHU & KELEMBAPAN TANAH + PRAKIRAAN HUJAN 7 HARI */}
        <section>
          <WeatherTrendsCharts weather={weather} />
        </section>

        {/* 3. FITUR GAMIFIKASI: STREAK RAWAT SAWAH & POHON TUMBUH BERUBAH BENTUK */}
        <section>
          <CropGamificationTracker petaniList={petaniList} />
        </section>

        {/* 4. PETA LOKASI SAWAH NUSANTARA 3D */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Peta Sebaran Lahan Sawah Terdaftar</span>
              </h2>
              <p className="text-xs text-slate-500">
                Titik lokasi sawah petani Indonesia yang sudah tersambung koordinat GPS
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
              {petaniList.length} Lahan Terdaftar
            </span>
          </div>

          <IndonesiaMap3D />
        </section>

      </div>
    </div>
  );
}