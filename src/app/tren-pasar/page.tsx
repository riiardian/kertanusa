'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  COMMODITY_TRENDS,
  CommodityCategory,
  calculateProfitProjection,
  calculateAllMarketScores,
  getTopRecommendations,
  getMarketPulse,
  getUniversalCommodityData,
  MarketCommodityTrendExtended,
  MarketIntelligenceScore,
} from '@/lib/market_demand';
import { recommendBestSeeds } from '@/lib/seed_recommender';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Compass,
  DollarSign,
  Layers,
  Sprout,
  X,
  ChevronRight,
  Info,
  ArrowUpRight
} from 'lucide-react';

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

const ALL_CATEGORIES: (CommodityCategory | 'Semua')[] = [
  'Semua',
  'Tanaman Pangan',
  'Sayuran',
  'Buah-Buahan',
  'Rempah & Bumbu',
  'Perkebunan',
  'Tanaman Obat'
];

function getSeedKomoditasKey(name: string): 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur' {
  const l = name.toLowerCase();
  if (l.includes('jeruk')) return 'Jeruk';
  if (l.includes('cokelat') || l.includes('kakao')) return 'Cokelat / Kakao';
  if (l.includes('anggur')) return 'Anggur';
  if (l.includes('padi')) return 'Padi';
  if (l.includes('cabai') || l.includes('cabe')) return 'Cabai Rawit Merah';
  if (l.includes('bawang')) return 'Bawang Merah';
  if (l.includes('jagung')) return 'Jagung';
  return 'Tomat';
}

export default function MarketDemandPage() {
  const [activePetani, setActivePetani] = useState<PetaniRecord>(DEFAULT_BENCHMARK_FARMER);
  const [isUserLahan, setIsUserLahan] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CommodityCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(null);
  const [calcLuas, setCalcLuas] = useState<number>(10000);

  // 1. Muat profil lahan aktif
  useEffect(() => {
    async function loadFarmer() {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_data') : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.nama_petani) {
            setActivePetani(parsed);
            setIsUserLahan(true);
            const luasM2 = parsed.satuan_luas === 'hektar' ? Number(parsed.luas_tanah) * 10000 : Number(parsed.luas_tanah) || 10000;
            setCalcLuas(luasM2);
            return;
          }
        }

        const res = await fetch('/api/petani', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const latest = json.data[json.data.length - 1];
          setActivePetani(latest);
          setIsUserLahan(true);
          const luasM2 = latest.satuan_luas === 'hektar' ? Number(latest.luas_tanah) * 10000 : Number(latest.luas_tanah) || 10000;
          setCalcLuas(luasM2);
        }
      } catch {
        // Fallback default benchmark
      }
    }
    loadFarmer();
  }, []);

  // Luas lahan normalisasi m2
  const userLuasM2 = useMemo(() => {
    if (!activePetani) return 10000;
    return activePetani.satuan_luas === 'hektar' ? Number(activePetani.luas_tanah) * 10000 : Number(activePetani.luas_tanah) || 10000;
  }, [activePetani]);

  // Sinyal pasar esensial
  const pulse = useMemo(() => getMarketPulse(), []);

  // Top rekomendasi lahan
  const topRecs = useMemo(() => getTopRecommendations(calcLuas, 3), [calcLuas]);

  // Filter komoditas katalog
  const filteredCommodities = useMemo(() => {
    let list = COMMODITY_TRENDS;
    if (activeCategory !== 'Semua') {
      list = list.filter(c => c.kategori === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const filtered = list.filter(c =>
        c.komoditas.toLowerCase().includes(q) ||
        c.kategori.toLowerCase().includes(q) ||
        c.alasan_permintaan.toLowerCase().includes(q)
      );
      // Jika tidak ditemukan di list terfilter, generate universal commodity data
      if (filtered.length === 0) {
        const universalItem = getUniversalCommodityData(searchQuery);
        return [universalItem];
      }
      return filtered;
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Komoditas aktif terpilih
  const currentDetailItem: MarketCommodityTrendExtended = useMemo(() => {
    if (selectedKomoditas) {
      return getUniversalCommodityData(selectedKomoditas);
    }
    // Default pertama dari list atau teratas
    if (filteredCommodities.length > 0) {
      return filteredCommodities[0];
    }
    return COMMODITY_TRENDS[0];
  }, [selectedKomoditas, filteredCommodities]);

  // Hitung simulasi profit komoditas aktif
  const currentProjection = useMemo(() => {
    return calculateProfitProjection(calcLuas, currentDetailItem.komoditas);
  }, [calcLuas, currentDetailItem]);

  // Rekomendasi varietas benih
  const seedKey = getSeedKomoditasKey(currentDetailItem.komoditas);
  const detailRec = useMemo(() => {
    const reg = REGIONS.find(r => r.nama.toLowerCase().includes((activePetani.daerah || '').toLowerCase())) || REGIONS[0];
    return recommendBestSeeds({
      daerahNama: activePetani.daerah || reg.nama,
      komoditas: seedKey,
      ketinggian: 'rendah',
      tipe_lahan: 'irigasi_teknis',
      musim: 'hujan',
      ph_tanah: activePetani.ph_tanah || reg.ph_rata_rata || 6.5,
      target_pasar: 'umum'
    });
  }, [activePetani, seedKey]);

  // Harga tertinggi untuk skala grafik
  const maxPriceInGraph = useMemo(() => {
    return Math.max(...currentDetailItem.historis_bulanan.map(h => h.harga), 1);
  }, [currentDetailItem]);

  // Hitung umur HST
  const daysPassed = useMemo(() => {
    if (!activePetani.waktu_tanam) return 0;
    const diff = Date.now() - new Date(activePetani.waktu_tanam).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [activePetani.waktu_tanam]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">

      {/* ── HEADER ── */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            Data Intelijen Pasar Agrikultur
          </span>
          <span className="text-xs text-slate-400 font-medium">Pembaruan Riil Pasar Nasional</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Daya Beli & Tren Pasar Pertanian
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Pantauan harga riil komoditas, pola pergerakan permintaan konsumen, dan panduan agronomis budidaya praktis untuk membantu petani menentukan komoditas terbaik dan meminimalkan risiko kerugian panen.
        </p>
      </div>

      {/* ── 1. PROFIL LAHAN AKTIF PETANI ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Profil Lahan Terdaftar
            </h2>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              Terhubung Sistem
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Acuan analisis spesifik wilayah & iklim lahan Anda
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Nama Pemilik / Petani</span>
            <strong className="text-slate-900 font-bold text-sm block truncate">{activePetani.nama_petani}</strong>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Wilayah / Sentra Lahan</span>
            <strong className="text-slate-900 font-semibold text-sm block truncate">{activePetani.daerah || '-'}</strong>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Luas Lahan Terdata</span>
            <strong className="text-slate-900 font-bold text-sm block">{activePetani.luas_tanah} {activePetani.satuan_luas || 'm²'}</strong>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Tanaman Saat Ini</span>
            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900 font-bold text-sm truncate">{activePetani.jenis_tanaman}</strong>
              <span className="text-[11px] text-slate-500 font-normal">({daysPassed} HST)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SINYAL PASAR ESENSIAL (CLEAN ICONS, NO EMOJIS) ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
            Sinyal Pasar Esensial
          </h2>
          <span className="text-[11px] text-slate-400">Ringkasan kondisi serapan pasar terkini</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sinyal 1: Permintaan Pasar Tertinggi */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Permintaan Pasar Tertinggi
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Paling Dicari
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{pulse.mostDemanded.komoditas}</h3>
              <span className="text-xs text-slate-400 font-medium">{pulse.mostDemanded.kategori}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Indeks Serapan:</span>
              <strong className="text-emerald-700 font-bold">{pulse.mostDemanded.skorPermintaan} / 100</strong>
            </div>
          </div>

          {/* Sinyal 2: Kenaikan Harga Tercepat */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                Kenaikan Harga Tercepat
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Tren Positif
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{pulse.fastestRising.komoditas}</h3>
              <span className="text-xs text-slate-400 font-medium">Rp {pulse.fastestRising.hargaSaatIni.toLocaleString('id-ID')} / kg</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Lonjakan Mingguan:</span>
              <strong className="text-emerald-700 font-bold">+{pulse.fastestRising.persentaseTren}%</strong>
            </div>
          </div>

          {/* Sinyal 3: Paling Stabil & Aman */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Stabilitas Pasar & Risiko Rendah
              </span>
              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Minim Risiko
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{pulse.mostStable.komoditas}</h3>
              <span className="text-xs text-slate-400 font-medium">Tahan gejolak harga musiman</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Skor Stabilitas:</span>
              <strong className="text-blue-700 font-bold">{pulse.mostStable.skorStabilitas} / 100</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. REKOMENDASI TERARAH UNTUK LAHAN PETANI ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Rekomendasi Tanaman untuk Lahan Anda
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis kesesuaian agroklimat wilayah <strong className="text-slate-700">{activePetani.daerah}</strong> dengan luas lahan <strong className="text-slate-700">{calcLuas.toLocaleString('id-ID')} m²</strong>
            </p>
          </div>

          {/* Luas toggle cepat */}
          <div className="flex gap-1.5">
            {isUserLahan && userLuasM2 > 0 && ![1000, 5000, 10000].includes(userLuasM2) && (
              <button
                type="button"
                onClick={() => setCalcLuas(userLuasM2)}
                className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                Lahan Saya ({userLuasM2.toLocaleString('id-ID')} m²)
              </button>
            )}
            {[1000, 5000, 10000].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setCalcLuas(v)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  calcLuas === v
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {v >= 10000 ? '1 Ha' : `${(v / 1000).toFixed(0)}k m²`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topRecs.map((rec, idx) => {
            const isSelected = selectedKomoditas === rec.komoditas;
            return (
              <div
                key={rec.komoditas}
                className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                  isSelected ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Pilihan #{idx + 1}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{rec.komoditas}</h3>
                      <span className="text-xs text-slate-500 font-medium">{rec.kategori}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-emerald-800 bg-emerald-50 border border-emerald-200">
                      {rec.labelRekomendasi}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {rec.alasanSingkat}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Harga Beli Pasar:</span>
                      <strong className="text-slate-900 font-semibold">Rp {rec.hargaSaatIni.toLocaleString('id-ID')} / kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Proyeksi Laba Bersih:</span>
                      <strong className="text-emerald-700 font-bold">
                        Rp {(rec.estimasiLabaBersih || 0).toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimasi ROI:</span>
                      <strong className="text-slate-800 font-semibold">{rec.roi}%</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedKomoditas(rec.komoditas);
                    // Gulir halus ke kartu analisis
                    const el = document.getElementById('analisis-komoditas');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-center border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Panduan & Analisis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. DIREKTORI & PENCARIAN DATASET AGRIKULTUR LENGKAP ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Pencarian & Kategori */}
        <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                Direktori Seluruh Dataset Komoditas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ketik nama tanaman, buah, sayur, rempah, atau tanaman obat apapun untuk membuka panduan budidaya & analisis pasar.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Menampilkan {filteredCommodities.length} Komoditas
            </span>
          </div>

          {/* Search Bar Bebas */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari komoditas apapun (misal: Porang, Vanili, Stevia, Sorgum, Buah Naga, Wasabi, dll)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-400 bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Kategori Tab Datar (Tanpa Emoji) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Daftar Komoditas (Clean Key-Value & Plain Cards) */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCommodities.map(c => {
            const isSelected = currentDetailItem.komoditas.toLowerCase() === c.komoditas.toLowerCase();
            return (
              <button
                key={c.komoditas}
                type="button"
                onClick={() => {
                  setSelectedKomoditas(c.komoditas);
                  const el = document.getElementById('analisis-komoditas');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{c.komoditas}</h3>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{c.kategori}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.tren_mingguan === 'Naik'
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                      : 'text-slate-600 bg-slate-100'
                  }`}>
                    {c.tren_mingguan === 'Naik' ? `+${c.persentase_tren}%` : 'Stabil'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Harga Pasar:</span>
                  <strong className="text-slate-900 font-semibold">Rp {c.harga_saat_ini.toLocaleString('id-ID')} / kg</strong>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Panen: {c.umur_panen || '3-4 Bulan'}</span>
                  <span className="text-emerald-700 font-semibold group-hover:underline flex items-center gap-0.5">
                    Detail panduan →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── 5. ANALISIS DETAIL & PANDUAN LENGKAP KOMODITAS TERPILIH ── */}
      <div id="analisis-komoditas" className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden scroll-mt-24">
        
        {/* Header Detail */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {currentDetailItem.kategori}
              </span>
              <span className="text-xs text-slate-400 font-medium">Panduan Lengkap Budidaya & Pasar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentDetailItem.komoditas}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-medium block">Harga Pasar Saat Ini</span>
              <strong className="text-lg sm:text-xl font-black text-slate-900 block">
                Rp {currentDetailItem.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
              </strong>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-8">

          {/* 1. GRAFIK TREN HARGA BULANAN (CLEAN BARS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Dinamika Tren Harga 12 Bulan
                </h3>
                <p className="text-xs text-slate-500">
                  Pergerakan fluktuasi harga bulanan nasional untuk mengidentifikasi momentum panen tertinggi.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
                  <span className="text-slate-600">Harga Standar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                  <span className="text-slate-600">Puncak Permintaan</span>
                </div>
              </div>
            </div>

            {/* Visualisasi Batang Sederhana & Bersih */}
            <div className="pt-4 pb-2 border border-slate-100 rounded-xl bg-slate-50/50 px-4">
              <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-3">
                {currentDetailItem.historis_bulanan.map((h, i) => {
                  const pct = Math.round((h.harga / maxPriceInGraph) * 100);
                  const isPeak = currentDetailItem.bulan_harga_tertinggi.some(b => b.toLowerCase().startsWith(h.bulan.toLowerCase()));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[10px] text-slate-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {(h.harga / 1000).toFixed(0)}k
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isPeak ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                        style={{ height: `${pct}%` }}
                      />
                      <span className={`text-[10px] mt-1 font-medium ${isPeak ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
                        {h.bulan}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keterangan Musim Puncak & Waktu Tanam */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-1">
                <span className="font-bold text-slate-800 block text-xs">Musim Puncak Permintaan:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.musim_puncak}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-1">
                <span className="font-bold text-slate-800 block text-xs">Saran Waktu Tanam Ideal:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.rekomendasi_waktu_tanam}</p>
              </div>
            </div>
          </div>

          {/* 2. PANDUAN AGRONOMIS & KARAKTERISTIK LAHAN */}
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Karakteristik Lahan & Pedoman Teknis Budidaya
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-medium block">pH Tanah Optimal</span>
                <strong className="text-slate-900 font-bold text-sm block">{currentDetailItem.ph_ideal || 'pH 5.8 - 6.8'}</strong>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-medium block">Umur Panen</span>
                <strong className="text-slate-900 font-bold text-sm block">{currentDetailItem.umur_panen || '70 - 90 HST'}</strong>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-medium block">Potensi Panen / Ha</span>
                <strong className="text-slate-900 font-bold text-sm block">{currentDetailItem.potensi_hasil_per_ha || '12 - 20 Ton'}</strong>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-medium block">Tren Harga Pasar</span>
                <strong className="text-emerald-700 font-bold text-sm block">
                  {currentDetailItem.tren_mingguan} (+{currentDetailItem.persentase_tren}%)
                </strong>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <span className="font-bold text-slate-800 block text-xs">Tekstur & Kondisi Tanah:</span>
              <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.karakteristik_tanah || 'Tanah gembur lempung berpasir kaya bahan organik dengan aerasi dan drainase lancar.'}</p>
              
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block text-xs mb-1">Tips Agronomis & Mitigasi Risiko:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.tips_agronomis || 'Lakukan pengolahan tanah sempurna, gunakan benih murni bersertifikat, dan atur drainase agar akar tanaman terhindar dari penyakit busuk akar.'}</p>
              </div>
            </div>
          </div>

          {/* 3. SIMULASI PROFIT SESUAI LUAS LAHAN PETANI */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Simulasi Estimasi Keuntungan Lahan
                </h3>
                <p className="text-xs text-slate-500">
                  Perhitungan estimasi tonase hasil panen, modal operasional, dan laba bersih berdasarkan luas lahan Anda.
                </p>
              </div>

              {/* Input Luas Lahan */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Luas Lahan:</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={calcLuas}
                  onChange={e => setCalcLuas(Math.max(1, Number(e.target.value)))}
                  className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 focus:border-emerald-600 text-xs font-bold outline-none text-right bg-white"
                />
                <span className="text-xs text-slate-600 font-semibold">m²</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Estimasi Tonase Panen:</span>
                  <strong className="text-slate-900 font-bold text-sm">
                    {currentProjection.totalPanenKg.toLocaleString('id-ID')} kg
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Modal & Biaya Operasional:</span>
                  <strong className="text-rose-600 font-bold">
                    Rp {currentProjection.totalBiayaProduksi.toLocaleString('id-ID')}
                  </strong>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-slate-500 font-medium">Proyeksi Omset Penjualan:</span>
                  <strong className="text-slate-900 font-bold text-sm">
                    Rp {currentProjection.totalOmset.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Proyeksi Laba Bersih Petani:</span>
                  <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-1">
                    Rp {currentProjection.labaBersih.toLocaleString('id-ID')}
                  </strong>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Return on Investment (ROI):</span>
                  <strong className="text-white font-bold text-sm">{currentProjection.roi}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4. REKOMENDASI BENIH UNGGUL (JIKA TERSEDIA) */}
          {detailRec.varietasTerbaik && (
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Rekomendasi Varietas Bibit / Benih Unggul
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    Pilihan Utama
                  </span>
                  <strong className="text-sm font-bold text-slate-900 block">
                    {detailRec.varietasTerbaik.nama_varietas}
                  </strong>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-slate-500">Potensi Panen:</span>
                      <strong className="text-slate-900">{detailRec.varietasTerbaik.potensi_hasil}</strong>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-slate-500">Umur Panen:</span>
                      <strong className="text-slate-900">{detailRec.varietasTerbaik.umur_panen}</strong>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-slate-500">Harga Jual Rata-Rata:</span>
                      <strong className="text-slate-900">{detailRec.varietasTerbaik.estimasi_harga_jual}</strong>
                    </div>
                  </div>
                </div>

                {detailRec.varietasAlternatif[0] ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                      Pilihan Alternatif
                    </span>
                    <strong className="text-sm font-bold text-slate-900 block">
                      {detailRec.varietasAlternatif[0].nama_varietas}
                    </strong>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="py-1.5 flex justify-between">
                        <span className="text-slate-500">Potensi Panen:</span>
                        <strong className="text-slate-900">{detailRec.varietasAlternatif[0].potensi_hasil}</strong>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-slate-500">Umur Panen:</span>
                        <strong className="text-slate-900">{detailRec.varietasAlternatif[0].umur_panen}</strong>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-slate-500">Harga Jual Rata-Rata:</span>
                        <strong className="text-slate-900">{detailRec.varietasAlternatif[0].estimasi_harga_jual}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-center text-center">
                    <span className="text-xs text-slate-400 italic">
                      Daftar varietas benih lokal tersertifikasi untuk wilayah Anda dapat dikonsultasikan melalui dinas pertanian setempat.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
