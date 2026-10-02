'use client';

import Image from 'next/image';
import Link from 'next/link';
import IndonesiaMap3D from '@/components/IndonesiaMap3D';
import LottieAnimation from '@/components/LottieAnimation';
import AgriculturalMonitoringDashboard from '@/components/AgriculturalMonitoringDashboard';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { WeatherData } from '@/lib/types';

export default function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // State Pelacakan Lokasi Sawah
  const [locationName, setLocationName] = useState<string>('Brebes, Jawa Tengah');

  useEffect(() => {
    async function initData() {
      try {
        let targetDaerah = 'Brebes, Jawa Tengah';
        let targetLat = -6.8703;
        let targetLon = 109.0435;

        // 1. Baca data lahan aktif dari localStorage
        if (typeof window !== 'undefined') {
          const storedData = localStorage.getItem('kertanusa_active_farmer_data');
          const storedId = localStorage.getItem('kertanusa_active_farmer_id');

          let parsed: any = null;
          if (storedData) {
            try {
              parsed = JSON.parse(storedData);
            } catch {
              parsed = null;
            }
          }

          if (parsed && parsed.daerah) {
            targetDaerah = parsed.daerah;
            if (parsed.lat !== undefined && parsed.lon !== undefined) {
              targetLat = Number(parsed.lat);
              targetLon = Number(parsed.lon);
            }
          }

          // Sinkronisasi/validasi dengan database API Petani
          if (storedId || parsed?.id) {
            try {
              const resPetani = await fetch('/api/petani', { cache: 'no-store' });
              const jsonPetani = await resPetani.json();
              if (jsonPetani.success && Array.isArray(jsonPetani.data)) {
                const match = jsonPetani.data.find((p: any) =>
                  (storedId && p.id === storedId) ||
                  (parsed?.id && p.id === parsed.id) ||
                  (parsed?.nama_petani && p.nama_petani.trim().toLowerCase() === parsed.nama_petani.trim().toLowerCase())
                );

                if (match) {
                  if (match.daerah) targetDaerah = match.daerah;
                  if (match.lat !== undefined && match.lon !== undefined) {
                    targetLat = Number(match.lat);
                    targetLon = Number(match.lon);
                  }
                  localStorage.setItem('kertanusa_active_farmer_id', match.id);
                  localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(match));
                } else if (!parsed) {
                  localStorage.removeItem('kertanusa_active_farmer_id');
                  localStorage.removeItem('kertanusa_active_farmer_data');
                  targetDaerah = 'Brebes, Jawa Tengah';
                  targetLat = -6.8703;
                  targetLon = 109.0435;
                }
              }
            } catch (err) {
              console.warn('Gagal sinkron /api/petani di homepage:', err);
            }
          }
        }

        setLocationName(targetDaerah);

        // 2. Ambil data cuaca realtime sesuai koordinat lahan aktif
        const weatherUrl = `/api/cuaca?lat=${targetLat}&lon=${targetLon}&daerah=${encodeURIComponent(targetDaerah)}`;
        const resWeather = await fetch(weatherUrl, { cache: 'no-store' });
        const dataW = await resWeather.json();
        if (dataW.success && dataW.data) {
          setWeather(dataW.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    initData();

    // Dengarkan event storage & focus agar jika data diinput/diubah di halaman lain langsung terupdate
    const handleSync = () => {
      initData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleSync);
      window.addEventListener('focus', handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleSync);
        window.removeEventListener('focus', handleSync);
      }
    };
  }, []);

  // Label cerdas waktu & cuaca
  const getCuacaLabel = () => {
    if (weather?.is_day === 0) return 'Cuaca Malam';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'Cuaca Pagi';
    if (hour >= 10 && hour < 15) return 'Cuaca Siang';
    if (hour >= 15 && hour < 18) return 'Cuaca Sore';
    return 'Cuaca Malam';
  };

  return (
    <div className="w-full pb-14 text-slate-800">
      
      {/* 1. HERO BANNER FULL-WIDTH DENGAN TINGGI IDEAL & PROPORSIONAL */}
      <section className="relative w-full min-h-[700px] sm:min-h-[740px] md:min-h-[780px] flex items-stretch overflow-hidden">
        
        {/* Full-width Image 4K Ultra HD */}
        <Image
          src="/hero-pertanian-4k.webp"
          quality={95}
          alt="Lahan Pertanian Kertanusa"
          fill
          priority
          className="hero-banner-image"
          sizes="100vw"
        />

        {/* Soft Dark Gradient on Left (Clean & Natural) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent"></div>

        {/* Container Konten: Judul Diturunkan Proporsional & Pantauan Sawah Berada di Bawah dengan Margin Aman */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 md:pb-24">
          
          {/* Bagian Atas: Judul Sinergi Cerdas Ekosistem Pertanian */}
          <div className="max-w-3xl text-white space-y-3.5">
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] text-white drop-shadow-md">
              Revolusi Cerdas Ekosistem Pertanian Nusantara
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow">
              Mengintegrasikan pemantauan geospasial, kecerdasan buatan, dan riset presisi untuk mengawal kedaulatan pangan Indonesia.
            </p>
          </div>

          {/* Bagian Bawah: Pantauan Sawah Dinaikkan Sedikit agar Aman dari Tepi Bawah Layar */}
          <div className="max-w-3xl text-white pt-5 border-t border-white/20">
            
            {/* Baris Informasi Lokasi Pantauan (Clean tanpa dropdown bapak rio) */}
            <div className="flex items-center gap-2 text-sm sm:text-base text-emerald-300 font-semibold drop-shadow mb-4">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pantauan Sawah: <strong className="text-white font-bold text-base sm:text-lg">{locationName}</strong></span>
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
                    {weather ? `${weather.suhu}°C` : '29.5°C'}
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
                    {weather ? `${weather.kelembapan_tanah}%` : '58%'}
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
                    {weather?.kondisi || (new Date().getHours() < 6 || new Date().getHours() >= 18 ? 'Malam Cerah' : 'Cerah Berawan')}
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
          <AgriculturalMonitoringDashboard />
        </section>

        {/* 3. PETA LOKASI SAWAH NUSANTARA 3D */}
        <section id="peta-sebaran-lahan" className="space-y-3 scroll-mt-24 sm:scroll-mt-28">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Peta Sebaran Lahan Sawah Terdaftar</span>
            </h2>
            <p className="text-xs text-slate-500">
              Titik lokasi sawah petani Indonesia yang sudah tersambung koordinat GPS
            </p>
          </div>

          <IndonesiaMap3D />
        </section>

      </div>
    </div>
  );
}
