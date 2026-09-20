'use client';

import Image from 'next/image';
import Link from 'next/link';
import IndonesiaMap3D from '@/components/IndonesiaMap3D';
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

  const getGrowthProgress = (umurHari?: number, jenisTanaman?: string) => {
    const age = umurHari || 35;
    let target = 100;
    const lower = (jenisTanaman || '').toLowerCase();
    if (lower.includes('bawang') || lower.includes('sayur')) target = 65;
    else if (lower.includes('jagung')) target = 95;
    else if (lower.includes('cabai')) target = 110;
    else if (lower.includes('padi')) target = 105;

    const percent = Math.min(100, Math.max(5, Math.round((age / target) * 100)));
    const sisaHari = Math.max(0, target - age);
    return { age, target, percent, sisaHari };
  };

  return (
    <div className="w-full pb-14 text-slate-800">
      
      {/* 1. HERO BANNER FULL-WIDTH (EDGE-TO-EDGE SEPERTI BRIN) */}
      <section className="relative w-full h-[540px] sm:h-[620px] md:h-[700px] flex items-center overflow-hidden">
        
        {/* Full-width Image Pertanian.webp */}
        <Image
          src="/hero-pertanian-4k.webp" quality={95}
          alt="Lahan Pertanian Nusantara"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Soft Dark Gradient on Left (Clean & Natural) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent"></div>

        {/* Container Konten Sejajar dengan Grid Halaman */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl text-white space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow">
              Pantau Kondisi Sawah & Pertumbuhan Tanaman
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Informasi cuaca sawah harian, kecukupan air tanah, dan perkiraan sisa hari menuju panen untuk petani.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/input-lahan"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mulai Catat Tanaman</span>
              </Link>
              <Link
                href="/monitoring"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold border border-white/30 backdrop-blur-sm transition-colors"
              >
                <span>Cek Cuaca Sawah</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Konten Utama di Bawah Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* 2. KONDISI CUACA & KESEHATAN TANAH HARI INI */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-emerald-600" />
                <span>Kondisi Cuaca & Tanah Sawah Hari Ini</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ringkasan keadaan alam di sekitar lahan pertanian untuk mempermudah perawatan harian
              </p>
            </div>
            <Link
              href="/monitoring"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Rincian Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Suhu Udara */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Thermometer className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500">Suhu Udara Sawah</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {weather ? `${weather.suhu}°C` : '29°C'}
                </p>
                <span className="text-[11px] font-medium text-amber-700">
                  Hangat Pas untuk Tumbuh
                </span>
              </div>
            </div>

            {/* Keadaan Air Tanah */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500">Keadaan Air Tanah</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {weather ? `${weather.kelembapan_tanah}%` : '58%'}
                </p>
                <span className="text-[11px] font-medium text-sky-700">
                  Tanah Basah Cukup (Aman)
                </span>
              </div>
            </div>

            {/* Sinar Matahari */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <Sun className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500">Sinar Matahari Hari Ini</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {weather?.kondisi || 'Cerah Berawan'}
                </p>
                <span className="text-[11px] font-medium text-emerald-700">
                  Bagus untuk Fotosintesis
                </span>
              </div>
            </div>

            {/* Kesehatan / Keasaman Tanah */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500">Kesehatan Tanah</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {weather ? `pH ${weather.ph_tanah}` : 'pH 6.5'}
                </p>
                <span className="text-[11px] font-medium text-emerald-700">
                  Tanah Subur Netral
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 3. PETA LOKASI SAWAH NUSANTARA 3D */}
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

        {/* 4. PERKEMBANGAN TANAMAN DI SAWAH PETANI */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>Perkembangan Tanaman di Sawah Petani</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau usia tanaman, tahapan tumbuh, dan hitungan mundur menuju hari panen
              </p>
            </div>

            <Link
              href="/input-lahan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Tanaman Baru</span>
            </Link>
          </div>

          {/* List Tanaman Petani */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-10 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                Memuat data perkembangan tanaman sawah...
              </div>
            ) : petaniList.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
                <Sprout className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">Belum ada tanaman yang didaftarkan</p>
                <Link
                  href="/input-lahan"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Daftarkan Lahan Sekarang</span>
                </Link>
              </div>
            ) : (
              petaniList.map((item) => {
                const progress = getGrowthProgress(item.umur_hari, item.jenis_tanaman);

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {item.nama_petani.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900">{item.nama_petani}</h3>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{item.daerah}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {item.status_tanaman || 'Tumbuh Sehat'}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                          {item.jenis_tanaman}
                        </span>
                        <span className="text-slate-500">
                          Luas: {item.luas_tanah} {item.satuan_luas}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Usia: <strong className="text-slate-900">{progress.age} Hari</strong>
                        </span>
                        <span className="text-emerald-700 font-bold text-xs">
                          {progress.percent}% Siap Panen
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${progress.percent}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Mulai Tanam</span>
                        <span className="font-medium text-slate-700">
                          {progress.sisaHari > 0 ? `Tersisa ±${progress.sisaHari} hari` : 'Siap Dipanen!'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
