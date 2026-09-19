'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  Sprout, Droplets, Thermometer, Sun, ScanSearch, 
  TrendingUp, Users, ArrowRight, ShieldCheck, CheckCircle2,
  Calendar, MapPin, AlertTriangle, Sparkles
} from 'lucide-react';
import { PetaniRecord, WeatherData } from '@/lib/types';
import { COMMODITY_TRENDS } from '@/lib/market_demand';

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
    <div className="space-y-8 pb-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-10 shadow-lg shadow-emerald-950/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Platform Agroteknologi Presisi & Energi Mandiri Petani Pelosok</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Keputusan Tani Lebih Tepat, Panen Melimpah & Bernilai Jual Tinggi
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Mengintegrasikan estimasi mikroklimat tanah, pemantauan cuaca pompa surya mandiri, Computer Vision deteksi hama & kematangan panen, serta riset tren daya beli pasar pangan Indonesia.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/input-lahan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-all"
            >
              <Sprout className="w-4 h-4" />
              <span>Daftarkan Lahan Petani</span>
            </Link>
            <Link
              href="/scan-ai"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold backdrop-blur-sm transition-all"
            >
              <ScanSearch className="w-4 h-4 text-emerald-300" />
              <span>Buka AI Scanner Hama</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
          <div className="w-full h-full border-l border-white/20 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Quick Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Kelembapan Tanah</span>
            <p className="text-xl font-bold text-slate-900">
              {weather ? `${weather.kelembapan_tanah}%` : '58%'}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">
              Status: {weather?.status_tanah || 'Optimal'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Suhu Lingkungan</span>
            <p className="text-xl font-bold text-slate-900">
              {weather ? `${weather.suhu}°C` : '29.5°C'}
            </p>
            <span className="text-[11px] font-semibold text-slate-600">
              Rentang: {weather ? `${weather.suhu_min}-${weather.suhu_max}°C` : '24-33°C'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Daya Pompa Surya</span>
            <p className="text-xl font-bold text-slate-900">
              {weather ? `${weather.radiasi_surya} W/m²` : '780 W/m²'}
            </p>
            <span className="text-[11px] font-semibold text-blue-600">
              Efisiensi: {weather?.potensi_pompa_surya || 'Optimal'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Tingkat pH Tanah</span>
            <p className="text-xl font-bold text-slate-900">
              {weather ? `pH ${weather.ph_tanah}` : 'pH 6.5'}
            </p>
            <span className="text-[11px] font-semibold text-purple-600">
              Kategori: {weather?.status_ph || 'Netral Ideal'}
            </span>
          </div>
        </div>

      </section>

      {/* Main 2-Column Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Navigation Cards & Recent Farmers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Fitur Utama Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Link 
              href="/monitoring" 
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Monitoring Iklim & pH Tanah
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pantau kelembapan tanah, prakiraan cuaca 7 hari, intensitas radiasi matahari untuk pompa surya, dan takaran kapur dolomit tanah masam.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 gap-1">
                <span>Buka Dashboard Iklim</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/scan-ai" 
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ScanSearch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    AI Scan Hama & Kesiapan Panen
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pindai foto daun/buah untuk mendeteksi penyakit (Antraknosa, Kutu Kebul, Hawar Daun), resep pupuk organik, dan status matang panen.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 gap-1">
                <span>Mulai Pemindaian AI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/tren-pasar" 
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Analisis Tren Daya Beli Pasar
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ketahui komoditas yang paling dicari masyarakat pada musim tertentu agar hasil panen terserap cepat dengan harga tertinggi.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 gap-1">
                <span>Lihat Tren & Proyeksi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/riset-petani" 
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Database Riset Petani Pelosok
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Rekap data profil lahan, varietas tanaman, dan demografi petani se-Indonesia untuk riset ketahanan pangan dan evaluasi panen.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 gap-1">
                <span>Kelola Data Riset</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

          {/* Lahan Terdaftar Terbaru */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Lahan & Petani Terdaftar Terbaru</h3>
                <p className="text-xs text-slate-500">Data termonitor dalam sistem riset agrikultur</p>
              </div>
              <Link href="/riset-petani" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <span>Semua Data ({petaniList.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Memuat data petani...</div>
              ) : petaniList.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {item.nama_petani.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.nama_petani}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.daerah}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <Sprout className="w-3 h-3" />
                          {item.jenis_tanaman} ({item.luas_tanah} {item.satuan_luas})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status_tanaman || 'Vegetatif'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Umur: {item.umur_hari || 35} hari
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Market Alerts & Solar Pumping Insight */}
        <div className="space-y-6">
          
          {/* Smart Market Alert */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm">Peluang Emas Pasar Terkini</h3>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed">
              Berdasarkan analisis kalender daya beli, komoditas <strong>Cabai Rawit Merah</strong> diproyeksikan mengalami lonjakan permintaan hingga <strong>+14.5%</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Harga Grosir Acuan:</span>
                <span className="font-bold text-slate-900">Rp 78.500 / kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Musim Puncak:</span>
                <span className="font-semibold text-emerald-700">Maret - Mei</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                💡 <em>Rekomendasi tanam: Tanam minggu ini agar panen serentak di harga puncak.</em>
              </div>
            </div>

            <Link
              href="/tren-pasar"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors"
            >
              <span>Buka Riset Komoditas Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Renewable Energy & Solar Water Pump Insight */}
          <div className="p-5 rounded-2xl bg-emerald-900 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Irigasi Pompa Tenaga Surya</h4>
                <p className="text-[11px] text-emerald-200">Mandiri Energi Bebas BBM</p>
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Sawah tanpa jaringan listrik PLN dapat memanfaatkan radiasi matahari siang hari secara langsung tanpa baterai mahal.
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Nol biaya bahan bakar solar / bensin</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Penyiraman optimal jam 09.30 - 14.00</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Mencegah tanah kering & gagal panen</span>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href="/monitoring"
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
              >
                <span>Cek Potensi Surya Daerah Kamu</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
