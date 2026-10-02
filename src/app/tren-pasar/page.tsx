'use client';

import { useState, useEffect, useMemo } from 'react';
import { COMMODITY_TRENDS, calculateProfitProjection } from '@/lib/market_demand';
import { 
  recommendBestSeeds, 
  LandConditionInput 
} from '@/lib/seed_recommender';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';

// Data acuan percontohan standar (Brebes) jika user belum mendaftarkan lahan
const DEFAULT_BENCHMARK_FARMER: PetaniRecord = {
  id: 'benchmark-brebes',
  nama_petani: 'Lahan Acuan Rekomendasi',
  daerah: REGIONS[0].nama,
  lat: REGIONS[0].lat,
  lon: REGIONS[0].lon,
  jenis_tanaman: REGIONS[0].komoditas_unggulan[0] || 'Bawang Merah',
  luas_tanah: 10000,
  satuan_luas: 'm²',
  waktu_tanam: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  kontak: '-',
  estimasi_panen: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  umur_hari: 35,
  kelembapan_tanah: REGIONS[0].kelembapan_tanah_default,
  suhu_lingkungan: REGIONS[0].suhu_rata_rata,
  ph_tanah: REGIONS[0].ph_rata_rata,
  status_tanaman: 'Vegetatif Aktif',
  catatan: 'Data acuan standar agrometeorologi rekomendasi sistem Kertanusa.',
  created_at: new Date().toISOString()
};

// Deteksi kategori komoditas benih dari nama komoditas
function getSeedKomoditasKey(komoditasName: string): 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur' {
  const lower = (komoditasName || '').toLowerCase();
  if (lower.includes('jeruk') || lower.includes('citrus') || lower.includes('keprok') || lower.includes('siam')) return 'Jeruk';
  if (lower.includes('cokelat') || lower.includes('coklat') || lower.includes('kakao') || lower.includes('cocoa')) return 'Cokelat / Kakao';
  if (lower.includes('anggur') || lower.includes('grape')) return 'Anggur';
  if (lower.includes('padi') || lower.includes('gabah') || lower.includes('beras')) return 'Padi';
  if (lower.includes('cabai') || lower.includes('cabe') || lower.includes('chili') || lower.includes('lombok')) return 'Cabai Rawit Merah';
  if (lower.includes('bawang')) return 'Bawang Merah';
  if (lower.includes('jagung')) return 'Jagung';
  if (lower.includes('tomat')) return 'Tomat';
  return 'Bawang Merah';
}

// Menghubungkan nama tanaman yang diinput user ke salah satu item COMMODITY_TRENDS
function matchCommodityToTrend(cropName: string): string {
  const lower = (cropName || '').toLowerCase();
  if (lower.includes('jeruk') || lower.includes('citrus') || lower.includes('keprok') || lower.includes('siam')) return 'Jeruk (Siam / Keprok)';
  if (lower.includes('cokelat') || lower.includes('coklat') || lower.includes('kakao') || lower.includes('cocoa')) return 'Cokelat / Kakao';
  if (lower.includes('anggur') || lower.includes('grape')) return 'Anggur';
  if (lower.includes('bawang')) return 'Bawang Merah';
  if (lower.includes('cabai') || lower.includes('cabe') || lower.includes('chili') || lower.includes('lombok')) return 'Cabai Rawit Merah';
  if (lower.includes('jagung')) return 'Jagung Manis';
  if (lower.includes('tomat')) return 'Tomat Sayur';
  if (lower.includes('padi') || lower.includes('beras') || lower.includes('gabah')) return 'Padi Sawah';
  return 'Bawang Merah';
}

// Analisis agroekologi lahan berdasarkan data profil petani
function deriveLandCondition(
  petani: PetaniRecord, 
  komoditasKey: 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur'
): LandConditionInput {
  const daerah = (petani.daerah || '').toLowerCase();
  
  const ketinggian = (daerah.includes('malang') || daerah.includes('batu') || daerah.includes('karo') || daerah.includes('lembang') || daerah.includes('dieng') || daerah.includes('wonosobo') || daerah.includes('brastagi'))
    ? 'tinggi'
    : (daerah.includes('cianjur') || daerah.includes('tabanan') || daerah.includes('sukabumi') || daerah.includes('boyolali') || daerah.includes('temanggung'))
    ? 'sedang'
    : 'rendah';

  const tipeLahan = (daerah.includes('lombok') || daerah.includes('sumba') || daerah.includes('gunungkidul') || daerah.includes('kering') || daerah.includes('tadah'))
    ? 'tadah_hujan'
    : (daerah.includes('rawa') || daerah.includes('pasang'))
    ? 'rawa_pasangsurut'
    : 'irigasi_teknis';

  const month = new Date().getMonth();
  const musim = (month >= 9 || month <= 3) ? 'hujan' : 'kemarau';
  const ph = petani.ph_tanah || 6.5;

  return {
    daerahNama: petani.daerah,
    komoditas: komoditasKey,
    ketinggian,
    tipe_lahan: tipeLahan,
    musim,
    ph_tanah: ph,
    target_pasar: 'umum'
  };
}

export default function TrenPasarPage() {
  const [activePetani, setActivePetani] = useState<PetaniRecord>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return DEFAULT_BENCHMARK_FARMER;
  });

  const [isUserLahan, setIsUserLahan] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('kertanusa_active_farmer_data');
    }
    return false;
  });

  const initialLuas = useMemo(() => {
    if (activePetani?.luas_tanah) {
      return activePetani.satuan_luas === 'hektar' 
        ? Number(activePetani.luas_tanah) * 10000 
        : Number(activePetani.luas_tanah);
    }
    return 10000;
  }, [activePetani]);

  const [calcLuas, setCalcLuas] = useState<number>(initialLuas);

  const [selectedKomoditas, setSelectedKomoditas] = useState<string>(() => {
    return matchCommodityToTrend(activePetani.jenis_tanaman);
  });

  // Hitung Hari Setelah Tanam (HST) persis format monitoring iklim
  const daysPassed = useMemo(() => {
    const plantDateStr = activePetani?.waktu_tanam;
    if (!plantDateStr) return 1;
    const pDate = new Date(plantDateStr);
    const now = new Date();
    return Math.max(1, Math.floor((now.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24)));
  }, [activePetani?.waktu_tanam]);

  // Sinkronisasi data petani dari localStorage dan backend
  useEffect(() => {
    async function initFarmerData() {
      try {
        let targetFarmer: PetaniRecord | null = null;
        const storedData = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_data') : null;
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_id') : null;

        let parsed: any = null;
        if (storedData) {
          try {
            parsed = JSON.parse(storedData);
          } catch {
            parsed = null;
          }
        }

        if (storedId || parsed) {
          const res = await fetch('/api/petani');
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            targetFarmer = json.data.find((p: PetaniRecord) => 
              (storedId && p.id === storedId) ||
              (parsed?.id && p.id === parsed.id) ||
              (parsed?.nama_petani && p.nama_petani.trim().toLowerCase() === parsed.nama_petani.trim().toLowerCase())
            ) || null;
          }
        }

        if (targetFarmer) {
          setIsUserLahan(true);
          setActivePetani(targetFarmer);
          
          const luasM2 = targetFarmer.satuan_luas === 'hektar' 
            ? Number(targetFarmer.luas_tanah) * 10000 
            : Number(targetFarmer.luas_tanah);
          setCalcLuas(luasM2);

          if (typeof window !== 'undefined') {
            localStorage.setItem('kertanusa_active_farmer_id', targetFarmer.id);
            localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(targetFarmer));
          }

          const matched = matchCommodityToTrend(targetFarmer.jenis_tanaman);
          setSelectedKomoditas(matched);
        } else {
          setIsUserLahan(false);
          setActivePetani(DEFAULT_BENCHMARK_FARMER);
          setCalcLuas(DEFAULT_BENCHMARK_FARMER.luas_tanah);
          setSelectedKomoditas(matchCommodityToTrend(DEFAULT_BENCHMARK_FARMER.jenis_tanaman));
        }
      } catch (err) {
        console.error('Gagal sinkron data petani di tren-pasar, gunakan data acuan default:', err);
        setIsUserLahan(false);
        setActivePetani(DEFAULT_BENCHMARK_FARMER);
        setCalcLuas(DEFAULT_BENCHMARK_FARMER.luas_tanah);
      }
    }

    initFarmerData();

    const handleSync = () => {
      initFarmerData();
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

  const userMatchedCommodity = useMemo(() => {
    return matchCommodityToTrend(activePetani.jenis_tanaman);
  }, [activePetani.jenis_tanaman]);

  const userLuasM2 = useMemo(() => {
    return activePetani.satuan_luas === 'hektar'
      ? Number(activePetani.luas_tanah) * 10000
      : Number(activePetani.luas_tanah);
  }, [activePetani]);

  const seedKomoditasKey = useMemo(() => getSeedKomoditasKey(selectedKomoditas), [selectedKomoditas]);
  const condition = useMemo(() => deriveLandCondition(activePetani, seedKomoditasKey), [activePetani, seedKomoditasKey]);
  const recommendation = useMemo(() => recommendBestSeeds(condition), [condition]);

  const currentTrend = useMemo(() => {
    return COMMODITY_TRENDS.find(c => c.komoditas === selectedKomoditas) || COMMODITY_TRENDS[0];
  }, [selectedKomoditas]);

  const projection = useMemo(() => {
    return calculateProfitProjection(calcLuas, selectedKomoditas);
  }, [calcLuas, selectedKomoditas]);

  const maxPrice = useMemo(() => {
    return Math.max(...currentTrend.historis_bulanan.map(h => h.harga));
  }, [currentTrend]);

  const bestSeed = recommendation.varietasTerbaik;
  const altSeeds = recommendation.varietasAlternatif;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-6 text-slate-800">
      
      {/* 1. HEADER HALAMAN (CLEAN & NATURAL KONSISTEN) */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Daya Beli Pasar & Rekomendasi Bibit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Informasi harga komoditas pasar, tren musiman, dan rekomendasi varietas benih unggul sesuai lahan Anda.
        </p>
      </div>

      {/* 2. KARTU RINCIAN LAHAN (PERSIS 100% MONITORING IKLIM SESUAI SCREENSHOT) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isUserLahan ? `Rincian Lahan ${activePetani.nama_petani}` : 'Rincian Lahan Percontohan (Brebes)'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isUserLahan 
              ? 'Data lahan terhubung langsung dengan profil pendaftaran sawah Anda.'
              : 'Data acuan standar untuk contoh panduan cuaca dan perawatan sawah.'}
          </p>
        </div>

        {/* Tabel Ringkas Key-Value Rapi */}
        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Nama Pemilik / Petani</span>
            <span className="text-slate-900 font-bold">{activePetani.nama_petani}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Wilayah / Lokasi</span>
            <span className="text-slate-900 font-semibold">{activePetani.daerah || '-'}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Titik Lokasi Lahan (GPS)</span>
            <span className="text-slate-900 font-mono font-semibold">
              {activePetani.lat && activePetani.lon 
                ? `${Number(activePetani.lat).toFixed(5)}, ${Number(activePetani.lon).toFixed(5)}` 
                : (activePetani.daerah ? 'Sesuai Wilayah' : '-')}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Jenis Tanaman</span>
            <span className="text-slate-900 font-bold">{activePetani.jenis_tanaman}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Luas Lahan</span>
            <span className="text-slate-900 font-semibold">
              {activePetani.luas_tanah} {activePetani.satuan_luas || 'm²'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Tanggal Mulai Tanam</span>
            <span className="text-slate-900 font-semibold">
              {activePetani.waktu_tanam} <span className="text-slate-500 font-normal">({daysPassed} HST)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. PILIHAN KOMODITAS PERTANIAN (CLEAN TABS ALIGNED WITH BERANDA) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pilihan Komoditas Pertanian & Perkebunan</h3>
            <p className="text-xs text-slate-500">Pangan pokok, bumbu, hortikultura buah, dan perkebunan bernilai ekonomi tinggi</p>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Harga acuan Bapanas & Pasar Induk</span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {COMMODITY_TRENDS.map((item) => {
            const isSelected = selectedKomoditas === item.komoditas;
            const isUserCrop = isUserLahan && userMatchedCommodity === item.komoditas;
            return (
              <button
                key={item.komoditas}
                type="button"
                onClick={() => setSelectedKomoditas(item.komoditas)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.komoditas}</span>
                {isUserCrop && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    isSelected ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    Lahan Anda
                  </span>
                )}
                <span className={`text-[10.5px] font-mono ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  Rp {item.harga_saat_ini.toLocaleString('id-ID')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MODUL REKOMENDASI VARIETAS BENIH (BERSIH, TANPA AI SLOP) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Rekomendasi Varietas Unggul: {seedKomoditasKey}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Varietas resmi bersertifikasi yang adaptif dengan dataran {condition.ketinggian} dan iklim wilayah {activePetani.daerah}.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Ketinggian: <strong className="text-slate-800 capitalize">Dataran {condition.ketinggian}</strong> • pH: <strong className="text-slate-800">{condition.ph_tanah}</strong>
          </span>
        </div>

        {/* Grid 2 Kartu: Varietas Pilihan Utama & Varietas Alternatif */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          {/* Kartu Varietas Utama */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                Rekomendasi Utama
              </span>
              <span className="text-[11px] text-slate-400">
                Pemulia: <strong className="text-slate-600 font-medium">{bestSeed.pemulia_resmi}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {bestSeed.nama_varietas}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {bestSeed.alasan_rekomendasi}
              </p>
            </div>

            {/* Spek Agronomi Rapi */}
            <div className="divide-y divide-slate-100 text-xs pt-1">
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Potensi Panen</span>
                <strong className="text-slate-900">{bestSeed.potensi_hasil}</strong>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Umur Panen</span>
                <strong className="text-slate-900">{bestSeed.umur_panen}</strong>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Daya Serap Pasar</span>
                <strong className="text-emerald-700">{bestSeed.daya_serap_pasar}</strong>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Estimasi Harga Jual</span>
                <strong className="text-slate-900">{bestSeed.estimasi_harga_jual}</strong>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-500">Ketahanan Hama</span>
                <span className="text-slate-800 text-right max-w-[65%] truncate" title={bestSeed.ketahanan_hama_penyakit.join(', ')}>
                  {bestSeed.ketahanan_hama_penyakit[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Kartu Varietas Alternatif */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                Varietas Alternatif
              </span>
              {altSeeds[0] && (
                <span className="text-[11px] text-slate-400">
                  Pemulia: <strong className="text-slate-600 font-medium">{altSeeds[0].pemulia_resmi}</strong>
                </span>
              )}
            </div>

            {altSeeds[0] ? (
              <>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {altSeeds[0].nama_varietas}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {altSeeds[0].alasan_rekomendasi}
                  </p>
                </div>

                <div className="divide-y divide-slate-200/80 text-xs pt-1">
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-500">Potensi Panen</span>
                    <strong className="text-slate-900">{altSeeds[0].potensi_hasil}</strong>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-500">Umur Panen</span>
                    <strong className="text-slate-900">{altSeeds[0].umur_panen}</strong>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-500">Daya Serap Pasar</span>
                    <strong className="text-slate-800">{altSeeds[0].kategori_pasar}</strong>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-500">Estimasi Harga Jual</span>
                    <strong className="text-slate-900">{altSeeds[0].estimasi_harga_jual}</strong>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-500">Keunggulan</span>
                    <span className="text-slate-800 text-right max-w-[65%] truncate" title={altSeeds[0].keunggulan_utama}>
                      {altSeeds[0].keunggulan_utama}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                Belum ada varietas alternatif tambahan untuk komoditas ini.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* 5. MODUL GRAFIK TREN HARGA BULANAN & KALENDER MUSIM */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tren Harga Bulanan: {currentTrend.komoditas}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rata-rata harga acuan pasar nasional sepanjang tahun (Rp / kg)
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block">Harga Acuan Saat Ini:</span>
            <p className="text-lg font-bold text-emerald-700">
              Rp {currentTrend.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
            </p>
          </div>
        </div>

        {/* Diagram Batang Bulanan Clean */}
        <div className="space-y-3 pt-2">
          <div className="h-48 flex items-end justify-between gap-1.5 sm:gap-2">
            {currentTrend.historis_bulanan.map((hist, idx) => {
              const heightPercent = Math.round((hist.harga / maxPrice) * 100);
              const isPeak = currentTrend.bulan_harga_tertinggi.some(b => b.toLowerCase().startsWith(hist.bulan.toLowerCase()));
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                  <span className="text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-100 px-1 py-0.5 rounded">
                    {(hist.harga / 1000).toFixed(0)}k
                  </span>

                  <div 
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isPeak ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  <span className={`text-[11px] ${isPeak ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                    {hist.bulan}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-600">Bulan Puncak Harga / Permintaan Tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-600">Pasokan Normal</span>
            </div>
          </div>
        </div>

        {/* 2 Catatan Musim & Waktu Tanam Sederhana */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Periode Puncak Permintaan:</span>
            <p className="text-slate-600 leading-relaxed">
              {currentTrend.musim_puncak}. {currentTrend.alasan_permintaan}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Saran Waktu Tanam:</span>
            <p className="text-slate-600 leading-relaxed">
              {currentTrend.rekomendasi_waktu_tanam}
            </p>
          </div>
        </div>
      </div>

      {/* 6. MODUL SIMULASI KEUNTUNGAN PANEN */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Simulasi Hasil & Omset Panen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perhitungan estimasi hasil panen dan pendapatan berdasarkan luas lahan Anda.
          </p>
        </div>

        {/* Input Luas Lahan */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Luas Lahan (m²):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              min="100"
              step="100"
              value={calcLuas}
              onChange={(e) => setCalcLuas(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 text-sm font-semibold outline-none"
            />
            <div className="flex gap-1.5 shrink-0 flex-wrap">
              {isUserLahan && userLuasM2 > 0 && ![1000, 2500, 5000, 10000].includes(userLuasM2) && (
                <button
                  type="button"
                  onClick={() => setCalcLuas(userLuasM2)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 cursor-pointer transition-colors"
                >
                  Sesuai Lahan ({userLuasM2.toLocaleString('id-ID')} m²)
                </button>
              )}
              {[1000, 2500, 5000, 10000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCalcLuas(v)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    calcLuas === v 
                      ? 'bg-emerald-700 text-white font-bold' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {v >= 10000 ? `${v/10000}ha` : `${v.toLocaleString('id-ID')} m²`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rincian Finansial Bersih */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Tonase Panen</span>
              <strong className="text-slate-900">{projection.totalPanenKg.toLocaleString('id-ID')} kg</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Biaya Operasional</span>
              <strong className="text-rose-600">Rp {projection.totalBiayaProduksi.toLocaleString('id-ID')}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-medium">Proyeksi Omset Penjualan</span>
              <strong className="text-slate-900 font-bold">Rp {projection.totalOmset.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-700 text-white shadow-xs space-y-1 flex flex-col justify-between">
            <div>
              <span className="text-xs text-emerald-100 font-medium block">Estimasi Keuntungan Bersih:</span>
              <div className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                Rp {projection.labaBersih.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="text-xs text-emerald-100 pt-2 border-t border-emerald-600 flex justify-between">
              <span>Tingkat Pengembalian (ROI):</span>
              <strong className="text-white font-bold">{projection.roi}%</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
