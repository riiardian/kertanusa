'use client';

import Image from 'next/image';
import Link from 'next/link';
import IndonesiaMap3D from '@/components/IndonesiaMap3D';
import LottieAnimation from '@/components/LottieAnimation';
import WeatherTrendsCharts from '@/components/WeatherTrendsCharts';
import CropGamificationTracker from '@/components/CropGamificationTracker';
import { useEffect, useState } from 'react';
import { 
  Sprout, Droplets, Thermometer, Sun, ShieldCheck, 
  MapPin, PlusCircle, Clock, CloudSun, ChevronRight
} from 'lucide-react';
import { PetaniRecord, WeatherData } from '@/lib/types';

export default function HomePage() {
  const [petaniList, setPetaniList] = useState<PetaniRecord[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      try {
        const [resPetani, resWeather] = await Promise.all([
          fetch('/api/petani'),
          fetch('/api/cuaca?daerah=Brebes,%20Jawa%20Tengah')
        ]);
        const dataP = await resPetani.json();
        const dataW = await resWeather.json();
        if (dataP.success) setPetaniList(dataP.data);
        if (dataW.success) setWeather(dataW.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  return (
    <div className="w-full pb-14 text-slate-800">
      
      {/* 1. HERO BANNER FULL-WIDTH DENGAN INDIKATOR LOTTIE DI SISI KIRI (TANPA KOTAK CARD) */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[680px] flex items-center overflow-hidden">
        
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
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent"></div>

        {/* Container Konten di Sisi Kiri Banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="max-w-xl text-white space-y-5">
            
            {/* Live Telemetry Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Pusat Kendali Pantau Agrometeorologi Sawah</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow">
              Pantau Kondisi Sawah & Pertumbuhan Tanaman
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Informasi cuaca sawah harian, kecukupan air tanah, dan perkiraan sisa hari menuju panen untuk petani.
            </p>

            {/* Tombol Aksi */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/input-lahan"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-colors hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mulai Catat Tanaman</span>
              </Link>
              <Link
                href="/monitoring"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm text-sm font-semibold transition-colors"
              >
                <span>Cek Cuaca Lengkap</span>
              </Link>
            </div>

            {/* 4 Indikator Cuaca Murni Animasi Lottie di Sisi Kiri (Tanpa Box Card) */}
            <div className="pt-4 border-t border-white/15">
              <span className="text-[11px] font-semibold text-emerald-300 block mb-3 uppercase tracking-wider">
                Kondisi Sawah Live Hari Ini
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Suhu */}
                <div className="flex items-center gap-2.5">
                  <LottieAnimation src="/thermometer.json" className="w-9 h-9 shrink-0 drop-shadow" />
                  <div>
                    <span className="text-[11px] text-slate-300 block leading-tight">Suhu Sawah</span>
                    <span className="text-base sm:text-lg font-extrabold text-white">
                      {weather ? `${weather.suhu}°C` : '29°C'}
                    </span>
                  </div>
                </div>

                {/* Air Tanah */}
                <div className="flex items-center gap-2.5">
                  <LottieAnimation src="/drop-water.json" className="w-9 h-9 shrink-0 drop-shadow" />
                  <div>
                    <span className="text-[11px] text-slate-300 block leading-tight">Air Tanah</span>
                    <span className="text-base sm:text-lg font-extrabold text-white">
                      {weather ? `${weather.kelembapan_tanah}%` : '58%'}
                    </span>
                  </div>
                </div>

                {/* Sinar Matahari */}
                <div className="flex items-center gap-2.5">
                  <LottieAnimation src="/sun-hot.json" className="w-9 h-9 shrink-0 drop-shadow" />
                  <div>
                    <span className="text-[11px] text-slate-300 block leading-tight">Matahari</span>
                    <span className="text-base sm:text-lg font-extrabold text-white truncate max-w-[90px] block">
                      {weather?.kondisi || 'Cerah'}
                    </span>
                  </div>
                </div>

                {/* pH Tanah */}
                <div className="flex items-center gap-2.5">
                  <LottieAnimation src="/plant.json" className="w-9 h-9 shrink-0 drop-shadow" />
                  <div>
                    <span className="text-[11px] text-slate-300 block leading-tight">pH Tanah</span>
                    <span className="text-base sm:text-lg font-extrabold text-white">
                      {weather ? `pH ${weather.ph_tanah}` : 'pH 6.5'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Konten Utama di Bawah Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* 2. DIAGRAM MONITORING: TREN 24 JAM SUHU & AIR TANAH + PRAKIRAAN HUJAN 7 HARI */}
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
