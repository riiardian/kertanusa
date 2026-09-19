'use client';

import Image from 'next/image';
import Link from 'next/link';
import IndonesiaMap3D from '@/components/IndonesiaMap3D';
import { useEffect, useState } from 'react';
import { 
  Sprout, Droplets, Thermometer, Sun, ShieldCheck, 
  MapPin, ArrowRight, PlusCircle, CheckCircle2, Clock, 
  CloudSun, Calendar, Sparkles, ChevronRight
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

  // Helper estimasi kematangan panen sederhana yang mudah dibaca petani
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
    <div className="space-y-8 pb-14 text-slate-800">
      
      {/* 1. HERO SECTION DENGAN GAMBAR PERTANIAN.WEBP */}
      <section className="rounded-2xl bg-white border border-emerald-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Kolom Teks Sambutan Ramah Petani */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Panduan Praktis Petani Sawah Indonesia</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Pantau Kondisi Sawah & Pertumbuhan Tanaman Anda
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Lihat cuaca sawah harian, kecukupan air tanah, dan perkiraan sisa hari menuju panen dengan mudah tanpa istilah yang membingungkan.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/input-lahan"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mulai Catat Tanaman Baru</span>
              </Link>
              <Link
                href="/monitoring"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all"
              >
                <CloudSun className="w-4 h-4 text-emerald-600" />
                <span>Lihat Cuaca Lengkap</span>
              </Link>
            </div>

            {/* Catatan Ringkas Bahasa Petani */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data cuaca disesuaikan otomatis dengan titik GPS lokasi sawah Anda.</span>
            </div>
          </div>

          {/* Kolom Gambar Pertanian */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] w-full bg-emerald-50 border-t lg:border-t-0 lg:border-l border-emerald-100 flex items-center justify-center p-3 sm:p-5">
            <div className="relative w-full h-full min-h-[260px] rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/pertanian.webp"
                alt="Lahan Pertanian Hijau Subur Nusantara"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2.5 text-white text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-medium">Sawah Subur Indonesia</span>
                </div>
                <span className="text-[11px] text-emerald-200">Hijau & Alami</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. KONDISI CUACA & KESEHATAN TANAH HARI INI (BAHASA SEDERHANA PETANI) */}
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
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium">
                <span>Hangat Pas untuk Tumbuh</span>
              </div>
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
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-[11px] font-medium">
                <span>Tanah Basah Cukup (Aman)</span>
              </div>
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
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                <span>Bagus untuk Pompa & Daun</span>
              </div>
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
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                <span>Tanah Subur Netral</span>
              </div>
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

      {/* 4. PERKEMBANGAN TANAMAN DI SAWAH PETANI (VISUAL & MUDAH DIIKUTI) */}
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

          <div className="flex items-center gap-2">
            <Link
              href="/input-lahan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Tanaman Baru</span>
            </Link>
          </div>
        </div>

        {/* List Tanaman Petani dalam Bentuk Kartu Perkembangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-10 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
              Memuat data perkembangan tanaman sawah...
            </div>
          ) : petaniList.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
              <Sprout className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Belum ada tanaman yang didaftarkan</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Klik tombol di bawah untuk mencatat bibit yang baru saja Anda tanam di sawah.
              </p>
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
                  {/* Header Kartu: Nama Petani & Lokasi */}
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

                    {/* Informasi Tanaman */}
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

                  {/* Progress Bar Tahapan Pertumbuhan */}
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

                    {/* Visual Bar */}
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Mulai Tanam</span>
                      <span className="font-medium text-slate-700">
                        {progress.sisaHari > 0 ? `Tersisa ±${progress.sisaHari} hari lagi` : 'Siap Dipanen!'}
                      </span>
                    </div>
                  </div>

                  {/* Catatan / Saran Mudah Petani */}
                  <div className="text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/80 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {item.catatan || (
                        progress.percent < 40 
                          ? 'Fokus pemupukan awal dan jaga kecukupan air tanah agar akar kuat.'
                          : progress.percent < 80
                          ? 'Awasi hama wereng/daun di pagi hari, periksa saluran air sawah.'
                          : 'Tanaman sudah mulai tua dan menguning, kurangi air perlahan menjelang panen.'
                      )}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 5. KARTU AJAKAN PENDAFTARAN SAWAH BARU */}
      <section className="rounded-2xl bg-emerald-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">Punya Petak Sawah yang Baru Ditanami Bibit?</h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Nyalakan GPS di HP Anda dan masukkan nama tanaman agar perkembangan panen dan cuaca sawah Anda otomatis terpantau setiap hari.
          </p>
        </div>

        <Link
          href="/input-lahan"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4 text-emerald-700" />
          <span>Daftarkan Lahan Sekarang</span>
        </Link>
      </section>

    </div>
  );
}
