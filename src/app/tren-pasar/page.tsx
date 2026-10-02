'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  COMMODITY_TRENDS,
  CommodityCategory,
  calculateProfitProjection,
  calculateAllMarketScores,
  getTopRecommendations,
  getMarketPulse,
  MarketIntelligenceScore,
} from '@/lib/market_demand';
import { recommendBestSeeds, LandConditionInput } from '@/lib/seed_recommender';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';

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
  'Semua', 'Tanaman Pangan', 'Sayuran', 'Buah-Buahan', 'Rempah & Bumbu', 'Perkebunan', 'Tanaman Obat'
];

const CAT_ICONS: Record<string, string> = {
  'Semua': '🗂️', 'Tanaman Pangan': '🌾', 'Sayuran': '🥬',
  'Buah-Buahan': '🍎', 'Rempah & Bumbu': '🌿', 'Perkebunan': '🌴', 'Tanaman Obat': '🌱'
};

function matchCommodityToTrend(cropName: string): string {
  const l = (cropName || '').toLowerCase();
  if (l.includes('jeruk') || l.includes('keprok') || l.includes('siam')) return 'Jeruk (Siam / Keprok)';
  if (l.includes('cokelat') || l.includes('coklat') || l.includes('kakao')) return 'Cokelat / Kakao';
  if (l.includes('anggur')) return 'Anggur';
  if (l.includes('bawang putih')) return 'Bawang Putih';
  if (l.includes('bawang')) return 'Bawang Merah';
  if (l.includes('cabai merah besar')) return 'Cabai Merah Besar';
  if (l.includes('cabai') || l.includes('cabe')) return 'Cabai Rawit Merah';
  if (l.includes('jagung')) return 'Jagung Manis';
  if (l.includes('tomat')) return 'Tomat Sayur';
  if (l.includes('padi') || l.includes('beras') || l.includes('gabah')) return 'Padi Sawah';
  if (l.includes('singkong') || l.includes('ubi kayu')) return 'Ubi Kayu / Singkong';
  if (l.includes('ubi jalar')) return 'Ubi Jalar';
  if (l.includes('kedelai')) return 'Kedelai';
  if (l.includes('kacang tanah')) return 'Kacang Tanah';
  if (l.includes('kentang')) return 'Kentang';
  if (l.includes('wortel')) return 'Wortel';
  if (l.includes('kubis') || l.includes('kol')) return 'Kubis / Kol';
  if (l.includes('buncis')) return 'Buncis';
  if (l.includes('kangkung')) return 'Kangkung';
  if (l.includes('bayam')) return 'Bayam';
  if (l.includes('terong')) return 'Terong';
  if (l.includes('timun') || l.includes('mentimun')) return 'Timun / Mentimun';
  if (l.includes('pisang')) return 'Pisang';
  if (l.includes('mangga')) return 'Mangga';
  if (l.includes('semangka')) return 'Semangka';
  if (l.includes('melon')) return 'Melon';
  if (l.includes('pepaya')) return 'Pepaya';
  if (l.includes('jambu')) return 'Jambu Biji';
  if (l.includes('jahe')) return 'Jahe Merah';
  if (l.includes('kunyit')) return 'Kunyit';
  if (l.includes('kencur')) return 'Kencur';
  if (l.includes('lengkuas')) return 'Lengkuas';
  if (l.includes('sawit')) return 'Kelapa Sawit';
  if (l.includes('arabika')) return 'Kopi Arabika';
  if (l.includes('robusta')) return 'Kopi Robusta';
  if (l.includes('kopi')) return 'Kopi Arabika';
  if (l.includes('karet')) return 'Karet';
  if (l.includes('tembakau')) return 'Tembakau';
  if (l.includes('lidah buaya') || l.includes('aloe')) return 'Lidah Buaya';
  if (l.includes('temulawak')) return 'Temulawak';
  return 'Bawang Merah';
}

function getSeedKomoditasKey(name: string): 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur' {
  const l = name.toLowerCase();
  if (l.includes('jeruk')) return 'Jeruk';
  if (l.includes('cokelat') || l.includes('kakao')) return 'Cokelat / Kakao';
  if (l.includes('anggur')) return 'Anggur';
  if (l.includes('padi')) return 'Padi';
  if (l.includes('cabai') || l.includes('cabe')) return 'Cabai Rawit Merah';
  if (l.includes('bawang')) return 'Bawang Merah';
  if (l.includes('jagung')) return 'Jagung';
  if (l.includes('tomat')) return 'Tomat';
  return 'Bawang Merah';
}

function deriveLandCondition(petani: PetaniRecord, komoditasKey: 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur'): LandConditionInput {
  const d = (petani.daerah || '').toLowerCase();
  const ketinggian = (d.includes('malang') || d.includes('batu') || d.includes('karo') || d.includes('lembang') || d.includes('dieng') || d.includes('wonosobo')) ? 'tinggi'
    : (d.includes('cianjur') || d.includes('tabanan') || d.includes('sukabumi') || d.includes('boyolali') || d.includes('temanggung')) ? 'sedang' : 'rendah';
  const tipeLahan = (d.includes('lombok') || d.includes('sumba') || d.includes('gunungkidul') || d.includes('kering') || d.includes('tadah')) ? 'tadah_hujan'
    : (d.includes('rawa') || d.includes('pasang')) ? 'rawa_pasangsurut' : 'irigasi_teknis';
  const month = new Date().getMonth();
  return { daerahNama: petani.daerah, komoditas: komoditasKey, ketinggian, tipe_lahan: tipeLahan, musim: (month >= 9 || month <= 3) ? 'hujan' : 'kemarau', ph_tanah: petani.ph_tanah || 6.5, target_pasar: 'umum' };
}

// ——— Komponen Skor Bar ———
function ScoreBar({ value, color = 'emerald' }: { value: number; color?: string }) {
  const colorMap: Record<string, string> = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', blue: 'bg-blue-500', rose: 'bg-rose-500' };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colorMap[color] || 'bg-emerald-500'}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-mono text-slate-500 w-6 text-right">{value}</span>
    </div>
  );
}

// ——— Komponen Risiko Badge ———
function RisikoBadge({ level }: { level: string }) {
  if (level === 'Rendah') return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Risiko Rendah</span>;
  if (level === 'Sedang') return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Risiko Sedang</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Risiko Tinggi</span>;
}

export default function TrenPasarPage() {
  const [activePetani, setActivePetani] = useState<PetaniRecord>(() => {
    if (typeof window !== 'undefined') {
      try { const s = localStorage.getItem('kertanusa_active_farmer_data'); if (s) return JSON.parse(s); } catch {}
    }
    return DEFAULT_BENCHMARK_FARMER;
  });
  const [isUserLahan, setIsUserLahan] = useState<boolean>(() =>
    typeof window !== 'undefined' ? !!localStorage.getItem('kertanusa_active_farmer_data') : false
  );

  const userLuasM2 = useMemo(() =>
    activePetani.satuan_luas === 'hektar' ? Number(activePetani.luas_tanah) * 10000 : Number(activePetani.luas_tanah),
    [activePetani]
  );

  const [calcLuas, setCalcLuas] = useState<number>(userLuasM2);
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CommodityCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [rankSort, setRankSort] = useState<'total' | 'permintaan' | 'stabilitas' | 'profit'>('total');

  const daysPassed = useMemo(() => {
    const p = activePetani?.waktu_tanam;
    if (!p) return 1;
    return Math.max(1, Math.floor((Date.now() - new Date(p).getTime()) / 86400000));
  }, [activePetani?.waktu_tanam]);

  useEffect(() => {
    async function init() {
      try {
        const storedData = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_data') : null;
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_id') : null;
        let parsed: any = null;
        if (storedData) { try { parsed = JSON.parse(storedData); } catch {} }
        if (storedId || parsed) {
          const res = await fetch('/api/petani');
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const found = json.data.find((p: PetaniRecord) =>
              (storedId && p.id === storedId) || (parsed?.id && p.id === parsed.id) ||
              (parsed?.nama_petani && p.nama_petani.trim().toLowerCase() === parsed.nama_petani.trim().toLowerCase())
            );
            if (found) {
              setIsUserLahan(true); setActivePetani(found);
              const luas = found.satuan_luas === 'hektar' ? Number(found.luas_tanah) * 10000 : Number(found.luas_tanah);
              setCalcLuas(luas);
              if (typeof window !== 'undefined') { localStorage.setItem('kertanusa_active_farmer_id', found.id); localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(found)); }
              return;
            }
          }
        }
      } catch {}
      setIsUserLahan(false); setActivePetani(DEFAULT_BENCHMARK_FARMER); setCalcLuas(DEFAULT_BENCHMARK_FARMER.luas_tanah);
    }
    init();
    const sync = () => init();
    if (typeof window !== 'undefined') { window.addEventListener('storage', sync); window.addEventListener('focus', sync); }
    return () => { if (typeof window !== 'undefined') { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync); } };
  }, []);

  // Market Intelligence Data
  const allScores = useMemo(() => calculateAllMarketScores(calcLuas), [calcLuas]);
  const topRecs = useMemo(() => getTopRecommendations(calcLuas, 3), [calcLuas]);
  const pulse = useMemo(() => getMarketPulse(), []);

  // Filter & sort ranking
  const filteredRanking = useMemo(() => {
    let list = allScores.filter(s => {
      const matchCat = activeCategory === 'Semua' || s.kategori === activeCategory;
      const matchSearch = !searchQuery || s.komoditas.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
    if (rankSort === 'permintaan') list = [...list].sort((a, b) => b.skorPermintaan - a.skorPermintaan);
    else if (rankSort === 'stabilitas') list = [...list].sort((a, b) => b.skorStabilitas - a.skorStabilitas);
    else if (rankSort === 'profit') list = [...list].sort((a, b) => (b.roi ?? 0) - (a.roi ?? 0));
    return list;
  }, [allScores, activeCategory, searchQuery, rankSort]);

  // Detail komoditas yang dipilih
  const detailTrend = useMemo(() =>
    selectedKomoditas ? COMMODITY_TRENDS.find(c => c.komoditas === selectedKomoditas) || COMMODITY_TRENDS[0] : null,
    [selectedKomoditas]
  );
  const detailMaxPrice = useMemo(() => detailTrend ? Math.max(...detailTrend.historis_bulanan.map(h => h.harga)) : 1, [detailTrend]);
  const detailProjection = useMemo(() => selectedKomoditas ? calculateProfitProjection(calcLuas, selectedKomoditas) : null, [calcLuas, selectedKomoditas]);
  const detailSeedKey = useMemo(() => selectedKomoditas ? getSeedKomoditasKey(selectedKomoditas) : 'Bawang Merah', [selectedKomoditas]);
  const detailCondition = useMemo(() => deriveLandCondition(activePetani, detailSeedKey), [activePetani, detailSeedKey]);
  const detailRec = useMemo(() => recommendBestSeeds(detailCondition), [detailCondition]);

  const userCropName = matchCommodityToTrend(activePetani.jenis_tanaman);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-6 text-slate-800">

      {/* ── HEADER ── */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Index Daya Beli Pasar</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Analisis real-time apa yang paling dicari & dibeli masyarakat — dengan rekomendasi komoditas terbaik untuk lahan Anda.
        </p>
      </div>

      {/* ── RINCIAN LAHAN ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isUserLahan ? `Rincian Lahan ${activePetani.nama_petani}` : 'Rincian Lahan Percontohan (Brebes)'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isUserLahan ? 'Data lahan terhubung langsung dengan profil pendaftaran sawah Anda.' : 'Data acuan standar untuk contoh panduan cuaca dan perawatan sawah.'}
          </p>
        </div>
        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          {[
            ['Nama Pemilik / Petani', activePetani.nama_petani, 'font-bold'],
            ['Wilayah / Lokasi', activePetani.daerah || '-', 'font-semibold'],
            ['Titik Lokasi Lahan (GPS)', activePetani.lat && activePetani.lon ? `${Number(activePetani.lat).toFixed(5)}, ${Number(activePetani.lon).toFixed(5)}` : (activePetani.daerah ? 'Sesuai Wilayah' : '-'), 'font-mono font-semibold'],
            ['Jenis Tanaman', activePetani.jenis_tanaman, 'font-bold'],
            ['Luas Lahan', `${activePetani.luas_tanah} ${activePetani.satuan_luas || 'm²'}`, 'font-semibold'],
          ].map(([label, value, cls]) => (
            <div key={label} className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 font-medium">{label}</span>
              <span className={`text-slate-900 ${cls}`}>{value}</span>
            </div>
          ))}
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Tanggal Mulai Tanam</span>
            <span className="text-slate-900 font-semibold">{activePetani.waktu_tanam} <span className="text-slate-500 font-normal">({daysPassed} HST)</span></span>
          </div>
        </div>
      </div>

      {/* ── MARKET PULSE ── */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-bold text-slate-900">📡 Sinyal Pasar Saat Ini</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Paling Banyak Dicari */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">🔥 Paling Banyak Dicari</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg">{pulse.mostDemanded.icon}</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{pulse.mostDemanded.komoditas}</span>
            </div>
            <div className="text-xs text-slate-600">Indeks permintaan: <strong className="text-emerald-700">{pulse.mostDemanded.skorPermintaan}/100</strong></div>
            <div className="text-[11px] text-slate-400">{pulse.mostDemanded.kategori}</div>
          </div>
          {/* Harga Naik Tertinggi */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">📈 Harga Naik Tercepat</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg">{pulse.fastestRising.icon}</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{pulse.fastestRising.komoditas}</span>
            </div>
            <div className="text-xs text-slate-600">Naik <strong className="text-amber-600">+{pulse.fastestRising.persentaseTren}%</strong> minggu ini</div>
            <div className="text-[11px] text-slate-400">Rp {pulse.fastestRising.hargaSaatIni.toLocaleString('id-ID')}/kg</div>
          </div>
          {/* Paling Stabil */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">🛡️ Paling Stabil & Aman</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg">{pulse.mostStable.icon}</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{pulse.mostStable.komoditas}</span>
            </div>
            <div className="text-xs text-slate-600">Stabilitas harga: <strong className="text-blue-600">{pulse.mostStable.skorStabilitas}/100</strong></div>
            <div className="text-[11px] text-slate-400">Risiko kerugian harga rendah</div>
          </div>
        </div>
      </div>

      {/* ── TOP REKOMENDASI UNTUK LAHAN ANDA ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">🎯 Rekomendasi Terbaik untuk Lahan Anda</h2>
            <p className="text-xs text-slate-500">
              Berdasarkan lokasi <strong className="text-slate-700">{activePetani.daerah}</strong> dan luas lahan <strong className="text-slate-700">{calcLuas.toLocaleString('id-ID')} m²</strong>
            </p>
          </div>
          {/* Input luas lahan quick-set */}
          <div className="hidden sm:flex gap-1.5">
            {isUserLahan && userLuasM2 > 0 && ![1000, 2500, 5000, 10000].includes(userLuasM2) && (
              <button onClick={() => setCalcLuas(userLuasM2)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors">
                Lahan Saya
              </button>
            )}
            {[1000, 5000, 10000].map(v => (
              <button key={v} onClick={() => setCalcLuas(v)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${calcLuas === v ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {v >= 10000 ? '1 ha' : `${(v / 1000).toFixed(0).replace('.', ',')}k m²`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topRecs.map((rec, idx) => {
            const isUserCrop = rec.komoditas === userCropName;
            const rankColors = ['border-emerald-300 bg-emerald-50/40', 'border-slate-200 bg-white', 'border-slate-200 bg-white'];
            return (
              <button key={rec.komoditas} type="button"
                onClick={() => setSelectedKomoditas(rec.komoditas)}
                className={`text-left p-4 rounded-xl border shadow-xs cursor-pointer hover:shadow-md transition-all group ${rankColors[idx]}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">#{idx + 1} Terbaik</span>
                      <span className="text-sm font-bold text-slate-900 leading-tight">{rec.komoditas}</span>
                    </div>
                  </div>
                  {isUserCrop && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 shrink-0">Lahan Anda</span>}
                </div>

                <div className="text-[11px] font-bold mb-2">{rec.labelRekomendasi}</div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Skor Pasar</span>
                    <span className="font-bold text-slate-800">{rec.skorTotal}/100</span>
                  </div>
                  <ScoreBar value={rec.skorTotal} color={rec.skorTotal >= 70 ? 'emerald' : rec.skorTotal >= 55 ? 'amber' : 'rose'} />
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Harga/kg</span>
                    <strong className="text-slate-800">Rp {rec.hargaSaatIni.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Laba</span>
                    <strong className={rec.estimasiLabaBersih && rec.estimasiLabaBersih > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                      Rp {(rec.estimasiLabaBersih || 0).toLocaleString('id-ID')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROI</span>
                    <strong className="text-slate-800">{rec.roi}%</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-2.5">{rec.alasanSingkat}</p>

                <div className="mt-2 text-[10px] text-emerald-700 font-semibold group-hover:underline">Lihat detail & analisis →</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RANKING SEMUA KOMODITAS ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header ranking */}
        <div className="p-5 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">📊 Ranking Komoditas Pasar</h2>
              <p className="text-xs text-slate-500">{COMMODITY_TRENDS.length} komoditas diranking berdasarkan Market Intelligence Score</p>
            </div>
            {/* Sort options */}
            <div className="flex gap-1.5 flex-wrap">
              {([['total', 'Skor Total'], ['permintaan', 'Permintaan'], ['stabilitas', 'Stabilitas'], ['profit', 'Profit']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setRankSort(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${rankSort === key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter kategori + search */}
          <div className="space-y-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Cari komoditas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 outline-none transition-all bg-white" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {ALL_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${activeCategory === cat ? 'bg-emerald-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <span>{CAT_ICONS[cat]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabel Ranking */}
        <div className="divide-y divide-slate-100">
          {filteredRanking.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              <span className="text-2xl block mb-2">🔍</span>
              Tidak ditemukan komoditas &quot;{searchQuery}&quot;
            </div>
          ) : filteredRanking.map((item, idx) => {
            const globalRank = allScores.findIndex(s => s.komoditas === item.komoditas) + 1;
            const isUserCrop = item.komoditas === userCropName;
            const isSelected = selectedKomoditas === item.komoditas;
            return (
              <button key={item.komoditas} type="button" onClick={() => setSelectedKomoditas(isSelected ? null : item.komoditas)}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-emerald-50/50' : ''}`}>
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <span className="text-[11px] font-bold text-slate-400 w-5 shrink-0 text-center">
                    {globalRank <= 3 ? ['🥇', '🥈', '🥉'][globalRank - 1] : `#${globalRank}`}
                  </span>

                  {/* Icon + Nama */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{item.komoditas}</span>
                        {isUserCrop && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">Lahan Anda</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">{item.kategori}</span>
                    </div>
                  </div>

                  {/* Skor & Label — hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    {/* Mini score bars */}
                    <div className="w-28 space-y-1">
                      <div className="flex items-center gap-1 text-[9px] text-slate-400">
                        <span className="w-12">Permintaan</span>
                        <div className="flex-1 h-1 bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.skorPermintaan}%` }} /></div>
                        <span className="w-5 text-right">{item.skorPermintaan}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400">
                        <span className="w-12">Stabilitas</span>
                        <div className="flex-1 h-1 bg-slate-100 rounded-full"><div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.skorStabilitas}%` }} /></div>
                        <span className="w-5 text-right">{item.skorStabilitas}</span>
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="text-right w-20">
                      <div className="text-[11px] text-slate-400">ROI</div>
                      <div className="text-xs font-bold text-slate-800">{item.roi}%</div>
                    </div>
                  </div>

                  {/* Harga */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">Rp {item.hargaSaatIni.toLocaleString('id-ID')}</div>
                    <div className={`text-[10px] font-semibold ${item.trenMingguan === 'Naik' ? 'text-emerald-600' : item.trenMingguan === 'Turun' ? 'text-rose-500' : 'text-slate-400'}`}>
                      {item.trenMingguan === 'Naik' ? '↑' : item.trenMingguan === 'Turun' ? '↓' : '→'} {item.persentaseTren}%
                    </div>
                  </div>

                  {/* Skor Total */}
                  <div className="text-right shrink-0 w-14">
                    <div className={`text-lg font-black ${item.skorTotal >= 70 ? 'text-emerald-600' : item.skorTotal >= 55 ? 'text-amber-600' : 'text-rose-500'}`}>
                      {item.skorTotal}
                    </div>
                    <RisikoBadge level={item.risikoLevel} />
                  </div>

                  {/* Arrow */}
                  <svg className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Label rekomendasi + alasan (collapsed di bawah baris) */}
                {!isSelected && (
                  <div className="mt-1.5 ml-8 text-[10px] text-slate-500 flex items-center gap-2">
                    <span>{item.labelRekomendasi}</span>
                    <span className="text-slate-300">·</span>
                    <span className="truncate">{item.alasanSingkat}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DETAIL KOMODITAS (expanded when selected) ── */}
      {selectedKomoditas && detailTrend && detailProjection && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {detailTrend.icon} Analisis Detail: {detailTrend.komoditas}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Tren harga, rekomendasi varietas, dan simulasi keuntungan untuk lahan Anda</p>
            </div>
            <button onClick={() => setSelectedKomoditas(null)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-5 space-y-5">

            {/* Grafik Tren Harga */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Tren Harga Bulanan</h3>
                <span className="text-sm font-bold text-emerald-700">Rp {detailTrend.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span></span>
              </div>
              <div className="h-40 flex items-end justify-between gap-1.5">
                {detailTrend.historis_bulanan.map((h, i) => {
                  const pct = Math.round((h.harga / detailMaxPrice) * 100);
                  const isPeak = detailTrend.bulan_harga_tertinggi.some(b => b.toLowerCase().startsWith(h.bulan.toLowerCase()));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                      <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{(h.harga / 1000).toFixed(0)}k</span>
                      <div className={`w-full rounded-t-md ${isPeak ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ height: `${pct}%` }} />
                      <span className={`text-[10px] ${isPeak ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>{h.bulan}</span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Puncak Permintaan:</span>
                  <p className="text-slate-600 leading-relaxed">{detailTrend.musim_puncak}.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Saran Waktu Tanam:</span>
                  <p className="text-slate-600 leading-relaxed">{detailTrend.rekomendasi_waktu_tanam}</p>
                </div>
              </div>
            </div>

            {/* Rekomendasi Benih */}
            {detailRec.varietasTerbaik && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Rekomendasi Varietas: {detailSeedKey}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Utama</span>
                    <div className="text-sm font-bold text-slate-900">{detailRec.varietasTerbaik.nama_varietas}</div>
                    <div className="divide-y divide-slate-100 text-[11px]">
                      {[['Potensi Panen', detailRec.varietasTerbaik.potensi_hasil], ['Umur Panen', detailRec.varietasTerbaik.umur_panen], ['Harga Jual', detailRec.varietasTerbaik.estimasi_harga_jual]].map(([k, v]) => (
                        <div key={k} className="py-1.5 flex justify-between"><span className="text-slate-500">{k}</span><strong className="text-slate-900">{v}</strong></div>
                      ))}
                    </div>
                  </div>
                  {detailRec.varietasAlternatif[0] ? (
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">Alternatif</span>
                      <div className="text-sm font-bold text-slate-900">{detailRec.varietasAlternatif[0].nama_varietas}</div>
                      <div className="divide-y divide-slate-100 text-[11px]">
                        {[['Potensi Panen', detailRec.varietasAlternatif[0].potensi_hasil], ['Umur Panen', detailRec.varietasAlternatif[0].umur_panen], ['Harga Jual', detailRec.varietasAlternatif[0].estimasi_harga_jual]].map(([k, v]) => (
                          <div key={k} className="py-1.5 flex justify-between"><span className="text-slate-500">{k}</span><strong className="text-slate-900">{v}</strong></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-center">
                      <p className="text-[11px] text-slate-400 text-center italic">Database varietas untuk komoditas ini sedang dikembangkan.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Simulasi Profit */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">Simulasi Profit untuk Lahan Anda</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {isUserLahan && userLuasM2 > 0 && ![1000, 2500, 5000, 10000].includes(userLuasM2) && (
                    <button onClick={() => setCalcLuas(userLuasM2)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100">
                      Sesuai Lahan ({userLuasM2.toLocaleString('id-ID')} m²)
                    </button>
                  )}
                  {[1000, 2500, 5000, 10000].map(v => (
                    <button key={v} onClick={() => setCalcLuas(v)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${calcLuas === v ? 'bg-emerald-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                      {v >= 10000 ? '1 ha' : `${v.toLocaleString('id-ID')} m²`}
                    </button>
                  ))}
                </div>
              </div>
              <input type="number" min="100" step="100" value={calcLuas}
                onChange={e => setCalcLuas(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-emerald-600 text-sm font-semibold outline-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  {[['Estimasi Tonase Panen', `${detailProjection.totalPanenKg.toLocaleString('id-ID')} kg`, ''], ['Estimasi Biaya Operasional', `Rp ${detailProjection.totalBiayaProduksi.toLocaleString('id-ID')}`, 'text-rose-600'], ['Proyeksi Omset Penjualan', `Rp ${detailProjection.totalOmset.toLocaleString('id-ID')}`, 'font-bold']].map(([k, v, c]) => (
                    <div key={k} className={`flex justify-between ${k === 'Proyeksi Omset Penjualan' ? 'border-t border-slate-200 pt-2' : ''}`}>
                      <span className="text-slate-500">{k}</span>
                      <strong className={`text-slate-900 ${c}`}>{v}</strong>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-emerald-700 text-white space-y-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-emerald-100">Estimasi Keuntungan Bersih:</span>
                    <div className="text-xl sm:text-2xl font-bold mt-0.5">Rp {detailProjection.labaBersih.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="text-xs text-emerald-100 pt-2 border-t border-emerald-600 flex justify-between">
                    <span>ROI:</span>
                    <strong className="text-white">{detailProjection.roi}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
