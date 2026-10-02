'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ArrowUpRight, Calculator, 
  MapPin, AlertTriangle, Sprout
} from 'lucide-react';
import { COMMODITY_TRENDS, calculateProfitProjection } from '@/lib/market_demand';
import { 
  recommendBestSeeds, 
  LandConditionInput 
} from '@/lib/seed_recommender';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';

// Data acuan benchmark standar jika petani belum mendaftarkan lahan
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
function getSeedKomoditasKey(komoditasName: string): 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' {
  const lower = (komoditasName || '').toLowerCase();
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
  komoditasKey: 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat'
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

  // Musim di Indonesia: Okt - Apr = Rendengan (Hujan), Mei - Sep = Gadu (Kemarau)
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
  // Status Lahan Aktif: Sinkron dari inputan petani atau default benchmark
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

  // Hitung luas lahan awal dalam m²
  const initialLuas = useMemo(() => {
    if (activePetani?.luas_tanah) {
      return activePetani.satuan_luas === 'hektar' 
        ? Number(activePetani.luas_tanah) * 10000 
        : Number(activePetani.luas_tanah);
    }
    return 10000;
  }, [activePetani]);

  const [calcLuas, setCalcLuas] = useState<number>(initialLuas);

  // Komoditas terpilih (default sinkron dengan tanaman petani atau default trend)
  const [selectedKomoditas, setSelectedKomoditas] = useState<string>(() => {
    return matchCommodityToTrend(activePetani.jenis_tanaman);
  });

  // Sinkronisasi otomatis data lahan petani yang sudah diinput dari database/localStorage
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

        // Validasi ke backend apakah data petani ini masih ada di database
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

          // Sinkronkan komoditas pilihan langsung dengan tanaman yang diinput user
          const matched = matchCommodityToTrend(targetFarmer.jenis_tanaman);
          setSelectedKomoditas(matched);
        } else {
          // Petani belum input: Gunakan data default rekomendasi sistem
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

    // Listener storage & focus agar perubahan di tab lain / halaman input lahan langsung sinkron tanpa refresh
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

  // Komoditas yang cocok dengan tanaman user
  const userMatchedCommodity = useMemo(() => {
    return matchCommodityToTrend(activePetani.jenis_tanaman);
  }, [activePetani.jenis_tanaman]);

  // Luas lahan user dalam m² untuk tombol cepat
  const userLuasM2 = useMemo(() => {
    return activePetani.satuan_luas === 'hektar'
      ? Number(activePetani.luas_tanah) * 10000
      : Number(activePetani.luas_tanah);
  }, [activePetani]);

  // Data rekomendasi bibit sesuai komoditas & agroekologi lahan aktif
  const seedKomoditasKey = useMemo(() => getSeedKomoditasKey(selectedKomoditas), [selectedKomoditas]);
  const condition = useMemo(() => deriveLandCondition(activePetani, seedKomoditasKey), [activePetani, seedKomoditasKey]);
  const recommendation = useMemo(() => recommendBestSeeds(condition), [condition]);

  // Data tren harga dan simulasi panen
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
      
      {/* 1. HEADER HALAMAN (CLEAN & NATURAL) */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Daya Beli Pasar & Rekomendasi Bibit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Analisis tren harga pasar, estimasi pendapatan panen, dan rekomendasi varietas bibit unggul sesuai kondisi lahan.
        </p>
      </div>

      {/* 2. KARTU RINCIAN LAHAN (KONSISTEN DENGAN MONITORING IKLIM & INPUT LAHAN) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {isUserLahan ? `Rincian Lahan ${activePetani.nama_petani}` : 'Rincian Lahan Acuan Rekomendasi (Brebes)'}
              </h2>
              {isUserLahan ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Lahan Terdaftar</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  <span>Rekomendasi Sistem</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isUserLahan 
                ? 'Data lahan terhubung otomatis dari profil pendaftaran sawah/lahan Anda.' 
                : 'Data acuan standar rekomendasi (belum ada lahan terdaftar).'}
            </p>
          </div>
          {!isUserLahan && (
            <Link 
              href="/input-lahan" 
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Daftarkan Lahan Anda</span>
            </Link>
          )}
        </div>

        {/* Tabel Ringkas Key-Value Rapi */}
        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Nama Pemilik / Petani</span>
            <span className="text-slate-900 font-bold">{activePetani.nama_petani}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Wilayah / Lokasi</span>
            <span className="text-slate-900 font-semibold">{activePetani.daerah}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Komoditas Terdaftar</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold">{activePetani.jenis_tanaman}</span>
              {isUserLahan && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Sinkron Otomatis
                </span>
              )}
            </div>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Luas Lahan</span>
            <span className="text-slate-900 font-semibold">
              {activePetani.luas_tanah} {activePetani.satuan_luas || 'm²'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Agroekologi Lahan</span>
            <span className="text-slate-900 font-medium capitalize">
              Dataran {condition.ketinggian} • {condition.tipe_lahan.replace('_', ' ')} • pH {condition.ph_tanah}
            </span>
          </div>
        </div>
      </div>

      {/* 3. PILIHAN TAB KOMODITAS PERTANIAN */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Pilih Komoditas Pertanian:
          </span>
          <span className="text-[11px] text-slate-500">
            Harga acuan pasar nasional
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {COMMODITY_TRENDS.map((item) => {
            const isSelected = selectedKomoditas === item.komoditas;
            const isUserCrop = isUserLahan && userMatchedCommodity === item.komoditas;
            return (
              <button
                key={item.komoditas}
                type="button"
                onClick={() => setSelectedKomoditas(item.komoditas)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.komoditas}</span>
                {isUserCrop && (
                  <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-semibold ${
                    isSelected ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Lahan Anda
                  </span>
                )}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  Rp {item.harga_saat_ini.toLocaleString('id-ID')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MODUL 1: REKOMENDASI VARIETAS BIBIT UNGGUL SESUAI LAHAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Rekomendasi Varietas Bibit Unggul Sesuai Lahan
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              {seedKomoditasKey}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Disesuaikan dengan elevasi tanah, iklim wilayah {activePetani.daerah}, dan ketahanan terhadap hama musiman.
          </p>
        </div>

        {/* Ringkasan Parameter Lahan Aktif */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Ketinggian Lahan:</span>
            <span className="font-bold text-slate-800 capitalize mt-0.5 block">
              Dataran {condition.ketinggian}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Tipe Pengairan:</span>
            <span className="font-bold text-slate-800 capitalize mt-0.5 block">
              {condition.tipe_lahan.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Musim Berjalan:</span>
            <span className="font-bold text-slate-800 capitalize mt-0.5 block">
              Musim {condition.musim}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">pH Tanah Terdeteksi:</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              pH {condition.ph_tanah} ({condition.ph_tanah < 5.5 ? 'Masam' : condition.ph_tanah > 7.0 ? 'Basa' : 'Netral'})
            </span>
          </div>
        </div>

        {/* Diagnosa Risiko Wilayah */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Diagnosa Faktor Wilayah & Risiko Hama:</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11.5px]">
            {recommendation.diagnosaAgronomis.ancaman_utama} {recommendation.diagnosaAgronomis.kesimpulan_strategi}
          </p>
        </div>

        {/* Grid Bibit Utama & Alternatif */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Bibit Pilihan Utama (#1 - 2 Kolom) */}
          <div className="lg:col-span-2 rounded-xl border border-emerald-500 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                  Pilihan Utama Sistem
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Kecocokan {bestSeed.skor_kecocokan}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Komoditas: <strong className="text-slate-700">{bestSeed.komoditas}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {bestSeed.nama_varietas}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Resmi dirilis oleh: <strong className="text-slate-700 font-medium">{bestSeed.pemulia_resmi}</strong>
              </p>
            </div>

            {/* 4 Indikator Performa */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Potensi Panen</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                  {bestSeed.potensi_hasil}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Umur Panen</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                  {bestSeed.umur_panen}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Daya Serap Pasar</span>
                <strong className="text-xs sm:text-sm font-bold text-emerald-700 block mt-0.5">
                  {bestSeed.daya_serap_pasar}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Estimasi Harga Jual</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                  {bestSeed.estimasi_harga_jual}
                </strong>
              </div>
            </div>

            {/* Alasan Kenapa Sistem Memilih Bibit Ini */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 block">
                Mengapa Varietas Ini Paling Tepat untuk Lahan Anda?
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bestSeed.alasan_rekomendasi}
              </p>
            </div>

            {/* Ketahanan Hama & Karakteristik */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 block">
                Profil Ketahanan Hama & Karakteristik Tanaman:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bestSeed.ketahanan_hama_penyakit.map((ket, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ket}</span>
                  </div>
                ))}
              </div>
              <div className="pt-1 text-[11px] text-slate-500">
                <strong>Kualitas Hasil:</strong> {bestSeed.tekstur_atau_kualitas}
              </div>
            </div>
          </div>

          {/* Bibit Alternatif Cadangan (#2 - 1 Kolom) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10.5px] font-bold">
                  Alternatif Unggul #2
                </span>
                {altSeeds[0] && (
                  <span className="text-[11px] font-bold text-slate-600">
                    Kecocokan {altSeeds[0].skor_kecocokan}%
                  </span>
                )}
              </div>

              {altSeeds[0] ? (
                <div className="space-y-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {altSeeds[0].nama_varietas}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pemulia: {altSeeds[0].pemulia_resmi}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Potensi:</span>
                      <strong className="text-slate-800">{altSeeds[0].potensi_hasil}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Umur:</span>
                      <strong className="text-slate-800">{altSeeds[0].umur_panen}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Pasar:</span>
                      <strong className="text-emerald-700 font-bold">{altSeeds[0].kategori_pasar}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {altSeeds[0].alasan_rekomendasi}
                  </p>

                  <div className="space-y-0.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-800 block">Kelebihan Khusus:</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {altSeeds[0].keunggulan_utama}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Tidak ada varietas alternatif lain untuk kategori ini.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500">
              <em>Gunakan varietas alternatif jika benih utama sulit ditemukan di toko pertanian terdekat.</em>
            </div>
          </div>

        </div>
      </div>

      {/* 5. MODUL 2: GRAFIK TREN HARGA BULANAN & ANALISIS MUSIM */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Grafik Tren Harga Bulanan: {currentTrend.komoditas}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +{currentTrend.persentase_tren}%
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Rata-rata harga grosir acuan pasar nasional (Rp / kg)</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block">Harga Acuan Sekarang:</span>
            <p className="text-lg sm:text-xl font-bold text-emerald-700">
              Rp {currentTrend.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
            </p>
          </div>
        </div>

        {/* Grafik Batang Bulanan Bersih */}
        <div className="space-y-3">
          <div className="h-52 flex items-end justify-between gap-1.5 sm:gap-2 pt-6">
            {currentTrend.historis_bulanan.map((hist, idx) => {
              const heightPercent = Math.round((hist.harga / maxPrice) * 100);
              const isPeak = currentTrend.bulan_harga_tertinggi.some(b => b.toLowerCase().startsWith(hist.bulan.toLowerCase()));
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-100 px-1 py-0.5 rounded">
                    {(hist.harga / 1000).toFixed(0)}k
                  </span>

                  <div 
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isPeak ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>

                  <span className={`text-[11px] ${isPeak ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                    {hist.bulan}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Keterangan Warna */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block"></span>
              <span className="font-medium text-slate-600">Bulan Puncak Permintaan / Harga Tertinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block"></span>
              <span className="font-medium text-slate-600">Bulan Pasokan Stabil</span>
            </div>
          </div>
        </div>

        {/* Analisis Musim & Puncak Permintaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1">
            <span className="text-xs font-bold text-amber-900 block">Musim Puncak Permintaan:</span>
            <p className="text-sm font-bold text-amber-950">{currentTrend.musim_puncak}</p>
            <p className="text-xs text-amber-800 leading-relaxed mt-1">
              {currentTrend.alasan_permintaan}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-1">
            <span className="text-xs font-bold text-emerald-900 block">Rekomendasi Waktu Tanam Cerdas:</span>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed mt-1">
              {currentTrend.rekomendasi_waktu_tanam}
            </p>
            <div className="pt-1.5 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mencegah anjlok harga saat panen raya serentak</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MODUL 3: KALKULATOR SIMULASI KEUNTUNGAN PANEN */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold">Simulasi Keuntungan Panen</h2>
            <p className="text-xs text-slate-500">Estimasi hasil panen & omset bersih berdasarkan luas lahan Anda</p>
          </div>
        </div>

        {/* Input Luas Lahan */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Luas Lahan Anda (m²):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              min="100"
              step="100"
              value={calcLuas}
              onChange={(e) => setCalcLuas(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm font-semibold outline-none"
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
                      ? 'bg-emerald-600 text-white font-bold' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {v >= 10000 ? `${v/10000}ha` : `${v.toLocaleString('id-ID')} m²`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Rincian Perhitungan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Tonase Panen:</span>
              <strong className="text-slate-900 font-bold">{projection.totalPanenKg.toLocaleString('id-ID')} kg</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Modal Operasional:</span>
              <strong className="text-rose-600 font-semibold">Rp {projection.totalBiayaProduksi.toLocaleString('id-ID')}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-semibold">Proyeksi Omset Penjualan:</span>
              <strong className="text-slate-900 font-bold">Rp {projection.totalOmset.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          {/* Kotak Keuntungan Bersih Solid */}
          <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-xs space-y-1 flex flex-col justify-between">
            <div>
              <span className="text-xs text-emerald-100 font-medium block">Estimasi Keuntungan Bersih:</span>
              <div className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                Rp {projection.labaBersih.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="text-xs text-emerald-100 pt-2 border-t border-emerald-500/60 flex justify-between">
              <span>Tingkat Pengembalian (ROI):</span>
              <strong className="text-white font-bold">{projection.roi}%</strong>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
          <strong>Catatan:</strong> Angka di atas dihitung dengan asumsi pemeliharaan sesuai bibit varietas unggul rekomendasi sistem dan panen pada periode puncak permintaan pasar.
        </div>
      </div>

    </div>
  );
}
