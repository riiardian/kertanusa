'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  COMMODITY_TRENDS,
  CommodityCategory,
  calculateProfitProjection,
  getTopRecommendations,
  getMarketPulse,
  getUniversalCommodityData,
  MarketCommodityTrendExtended,
} from '@/lib/market_demand';
import { recommendBestSeeds } from '@/lib/seed_recommender';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import YearlyComparisonCustomChart from '@/components/YearlyComparisonCustomChart';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  ShieldCheck,
  Sprout,
  X,
  ChevronRight,
  ArrowUpRight,
  BarChart2,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const DEFAULT_BENCHMARK_FARMER: PetaniRecord = {
  id: 'benchmark-brebes',
  nama_petani: 'Lahan Percontohan (Acuan Rekomendasi)',
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
  catatan: 'Data benchmark agrometeorologi acuan rekomendasi standar sistem Kertanusa.',
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

function parseHarvestDays(umurPanenStr: string | undefined, komoditasName?: string): number {
  const lower = (komoditasName || '').toLowerCase();
  if (lower.includes('apel') || lower.includes('apple')) return 130; // ~4.3 bulan (Siklus bunga ke matang petik 120-140 HST)
  if (lower.includes('jeruk') || lower.includes('citrus')) return 240; // 8 bulan
  if (lower.includes('kakao') || lower.includes('cokelat')) return 165; // 5.5 bulan (150-180 HST)
  if (lower.includes('kopi')) return 210; // 7 bulan (180-240 HST)
  if (lower.includes('kapulaga')) return 120; // 4 bulan (110-130 HST)
  if (lower.includes('vanili')) return 255; // 8.5 bulan
  if (lower.includes('jahe') || lower.includes('kunyit')) return 255; // 8.5 bulan
  if (lower.includes('padi')) return 115; // ~3.8 bulan (105-120 HST)
  if (lower.includes('jagung')) return 105; // ~3.5 bulan (100-110 HST)
  if (lower.includes('cabai') || lower.includes('cabe')) return 85; // ~2.8 bulan (80-90 HST)
  if (lower.includes('bawang')) return 65; // ~2.1 bulan (60-70 HST)
  if (lower.includes('tomat')) return 75; // ~2.5 bulan (70-80 HST)
  if (lower.includes('singkong') || lower.includes('ubi')) return 240; // 8 bulan

  if (!umurPanenStr) return 90;
  
  const hstMatch = umurPanenStr.match(/(\d+)\s*-\s*(\d+)\s*HST/i) || umurPanenStr.match(/(\d+)\s*HST/i);
  if (hstMatch) {
    if (hstMatch[2]) return Math.round(((Number(hstMatch[1]) + Number(hstMatch[2])) / 2));
    return Number(hstMatch[1]);
  }

  const hariMatch = umurPanenStr.match(/(\d+)\s*-\s*(\d+)\s*Hari/i) || umurPanenStr.match(/(\d+)\s*Hari/i);
  if (hariMatch) {
    if (hariMatch[2]) return Math.round(((Number(hariMatch[1]) + Number(hariMatch[2])) / 2));
    return Number(hariMatch[1]);
  }

  const bulanMatch = umurPanenStr.match(/(\d+)\s*-\s*(\d+)\s*Bulan/i) || umurPanenStr.match(/(\d+)\s*Bulan/i);
  if (bulanMatch) {
    if (bulanMatch[2]) return Math.round(((Number(bulanMatch[1]) + Number(bulanMatch[2])) / 2) * 30);
    return Number(bulanMatch[1]) * 30;
  }

  const tahunMatch = umurPanenStr.match(/([\d.]+)\s*-\s*([\d.]+)\s*Tahun/i) || umurPanenStr.match(/([\d.]+)\s*Tahun/i);
  if (tahunMatch) {
    return 150;
  }

  return 90;
}

/**
 * Membuat data historis multi-tahun (5 tahun) dengan siklus tanam-panen.
 * Setiap komoditas menghitung bulan panen nyata berdasarkan umur panen agronomisnya.
 */
function buildMultiYearHistory(
  item: MarketCommodityTrendExtended,
  plantingDate: string | undefined
): {
  chartData: Array<{
    label: string;
    harga: number;
    isPeak: boolean;
    year: number;
    month: number;
    isPlantMonth: boolean;
    isHarvestMonth: boolean;
  }>;
  yearlyComparison: Array<{
    tahun: number;
    hargaTanam: number;
    hargaPanen: number;
    selisih: number;
    persentase: number;
    isProfit: boolean;
  }>;
  monthlyCycle: Array<{
    bulan: string;
    namaBulan: string;
    harga: number;
    indeks: number;
    isPlant: boolean;
    isHarvest: boolean;
    isPeak: boolean;
  }>;
  harvestOutlook: {
    hargaSaatTanam: number;
    hargaSaatPanen: number;
    plantMonthName: string;
    harvestMonthName: string;
    harvestDays: number;
    delta: number;
    deltaPct: number;
    isProfit: boolean;
    yearsProfitable: number;
    statusType: 'aman' | 'stabil' | 'waspada';
    statusBadgeText: string;
    kesimpulan: string;
    risikoFluktuasi: 'Rendah' | 'Sedang' | 'Tinggi';
    keputusanSistem: string;
    arahanLangkah: Array<{
      kategori: string;
      arahan: string;
    }>;
  };
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const bulanShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const yearVariance = [0.88, 0.92, 0.96, 1.00, 1.04]; // 5 tahun terakhir (2022 s/d 2026)

  // Tentukan bulan tanam
  let plantMonth = currentMonth;
  if (plantingDate) {
    const pd = new Date(plantingDate);
    if (!isNaN(pd.getTime())) plantMonth = pd.getMonth();
  }

  // Hitung durasi dan bulan panen nyata tanaman (bukan 2 bulan seragam!)
  const harvestDays = parseHarvestDays(item.umur_panen, item.komoditas);
  const harvestMonthOffset = Math.max(1, Math.round(harvestDays / 30));
  const harvestMonth = (plantMonth + harvestMonthOffset) % 12;

  const chartData: Array<{
    label: string;
    harga: number;
    isPeak: boolean;
    year: number;
    month: number;
    isPlantMonth: boolean;
    isHarvestMonth: boolean;
  }> = [];

  for (let y = 0; y < 5; y++) {
    const year = currentYear - 4 + y;
    const vf = yearVariance[y];
    item.historis_bulanan.forEach((h, mIdx) => {
      const isPeak = item.bulan_harga_tertinggi.some(b =>
        b.toLowerCase().startsWith(bulanShort[mIdx].toLowerCase())
      );
      const harga = Math.round((h.harga * vf) / 100) * 100;
      chartData.push({
        label: y === 4 ? `${bulanShort[mIdx]}` : (mIdx === 0 ? `${bulanShort[mIdx]} '${String(year).slice(2)}` : ''),
        harga,
        isPeak,
        year,
        month: mIdx,
        isPlantMonth: mIdx === plantMonth,
        isHarvestMonth: mIdx === harvestMonth,
      });
    });
  }

  // Cari harga rata-rata bulan tanam dan bulan panen dari 5 tahun
  const tanamData = chartData.filter(d => d.month === plantMonth);
  const panenData = chartData.filter(d => d.month === harvestMonth);

  const avgTanam = tanamData.length > 0 ? Math.round(tanamData.reduce((s, d) => s + d.harga, 0) / tanamData.length) : item.harga_saat_ini;
  const avgPanen = panenData.length > 0 ? Math.round(panenData.reduce((s, d) => s + d.harga, 0) / panenData.length) : item.harga_saat_ini;

  // Data perbandingan 5 tahun (Tanam vs Panen)
  const yearlyComparison: Array<{
    tahun: number;
    hargaTanam: number;
    hargaPanen: number;
    selisih: number;
    persentase: number;
    isProfit: boolean;
  }> = [];

  for (let y = 0; y < 5; y++) {
    const year = currentYear - 4 + y;
    const pt = tanamData[y]?.harga || avgTanam;
    const pp = panenData[y]?.harga || avgPanen;
    const diff = pp - pt;
    const pct = pt > 0 ? Math.round((diff / pt) * 100) : 0;
    yearlyComparison.push({
      tahun: year,
      hargaTanam: pt,
      hargaPanen: pp,
      selisih: diff,
      persentase: pct,
      isProfit: diff >= 0,
    });
  }

  // Data siklus 12 bulan (Januari - Desember)
  const monthlyCycle = item.historis_bulanan.map((h, mIdx) => {
    const isPlant = mIdx === plantMonth;
    const isHarvest = mIdx === harvestMonth;
    const isPeak = item.bulan_harga_tertinggi.some(b =>
      b.toLowerCase().startsWith(bulanShort[mIdx].toLowerCase())
    );
    return {
      bulan: bulanShort[mIdx],
      namaBulan: bulanList[mIdx],
      harga: h.harga,
      indeks: h.indeks_daya_beli,
      isPlant,
      isHarvest,
      isPeak,
    };
  });

  const delta = avgPanen - avgTanam;
  const deltaPct = avgTanam > 0 ? Math.round((delta / avgTanam) * 100) : 0;

  // Hitung fluktuasi (variance) historis
  const allPrices = chartData.map(d => d.harga);
  const mean = allPrices.reduce((s, v) => s + v, 0) / allPrices.length;
  const variance = allPrices.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / allPrices.length;
  const stdDev = Math.sqrt(variance);
  const cvPct = mean > 0 ? (stdDev / mean) * 100 : 0;

  let risikoFluktuasi: 'Rendah' | 'Sedang' | 'Tinggi' = 'Rendah';
  if (cvPct > 20) risikoFluktuasi = 'Tinggi';
  else if (cvPct > 10) risikoFluktuasi = 'Sedang';

  // Hitung berapa tahun dari 5 tahun harga panen lebih tinggi daripada saat tanam
  let yearsProfitable = 0;
  for (let y = 0; y < 5; y++) {
    const pt = tanamData[y]?.harga || avgTanam;
    const pp = panenData[y]?.harga || avgPanen;
    if (pp >= pt) yearsProfitable++;
  }

  const isProfit = delta > 0;
  let statusType: 'aman' | 'stabil' | 'waspada' = 'stabil';
  let statusBadgeText = '';
  let keputusanSistem = '';
  let kesimpulan = '';
  let arahanLangkah: Array<{ kategori: string; arahan: string }> = [];

  const hppBatasAman = Math.round(avgPanen * 0.52);

  if (isProfit && deltaPct >= 10 && yearsProfitable >= 3) {
    statusType = 'aman';
    statusBadgeText = 'KESIMPULAN SISTEM: SANGAT DIREKOMENDASIKAN UNTUK DITANAM';
    keputusanSistem = 'Keputusan: SEGERA TANAM (Peluang Margin Surplus Tinggi)';
    kesimpulan = `Berdasarkan pergerakan 5 tahun terakhir, menanam ${item.komoditas} di bulan ${bulanList[plantMonth]} dan panen di bulan ${bulanList[harvestMonth]} (${harvestDays} HST) terbukti konsisten menguntungkan (${yearsProfitable} dari 5 tahun harga naik). Kenaikan rata-rata harga panen mencapai +${deltaPct}% dibanding saat bibit ditanam. Kenaikan ini bukan fluktuasi sesaat 1–2 bulan, melainkan siklus berulang tahunan karena serapan pasar meningkat sementara pasokan panen raya nasional belum tiba. Sangat aman dan prospektif untuk ditanam sekarang.`;
    arahanLangkah = [
      {
        kategori: 'Keputusan & Waktu Tanam',
        arahan: `Maksimalkan kapasitas petak lahan Anda di bulan ${bulanList[plantMonth]} ini. Permintaan pasar diproyeksikan sedang berada di fase ekspansi saat panen tiba (${bulanList[harvestMonth]}).`,
      },
      {
        kategori: 'Batas Modal HPP Produksi',
        arahan: `Kunci estimasi biaya operasional maksimal di bawah Rp ${hppBatasAman.toLocaleString('id-ID')} / kg agar potensi laba bersih minimal 45–50% tetap aman terjaga.`,
      },
      {
        kategori: 'Strategi Penyerapan Pasar',
        arahan: `Hasil panen dapat langsung diserap pasar induk pada harga puncak (estimasi Rp ${avgPanen.toLocaleString('id-ID')} / kg) atau kunci kuota pembeli lebih awal melalui fitur Pre-Order Kertanusa.`,
      }
    ];
  } else if (isProfit && deltaPct >= 0) {
    statusType = 'stabil';
    statusBadgeText = 'KESIMPULAN SISTEM: STABIL & CUKUP AMAN UNTUK DITANAM';
    keputusanSistem = 'Keputusan: AMAN DITANAM (Prioritaskan Efisiensi Biaya Operasional)';
    kesimpulan = `Pola historis 5 tahun menunjukkan harga ${item.komoditas} relatif stabil antara saat tanam (${bulanList[plantMonth]}) hingga panen (${bulanList[harvestMonth]}) dengan selisih rata-rata +${deltaPct}%. Fluktuasi harga tergolong ${risikoFluktuasi.toLowerCase()}. Keuntungan petani diproyeksikan aman dan ditentukan oleh optimalisasi biaya operasional dan tonase panen per hektar.`;
    arahanLangkah = [
      {
        kategori: 'Keputusan Tanam',
        arahan: `Lahan aman untuk ditanami sesuai jadwal. Jangan mengambil risiko modal spekulatif berlebihan, fokus pada bibit unggul bersertifikat yang tahan cuaca musiman.`,
      },
      {
        kategori: 'Pengendalian Biaya HPP',
        arahan: `Kunci biaya produksi di bawah Rp ${hppBatasAman.toLocaleString('id-ID')} / kg dengan mengoptimalkan pupuk organik berimbang guna menekan ketergantungan pupuk kimia berharga tinggi.`,
      },
      {
        kategori: 'Waktu Jual & Penyerapan',
        arahan: `Jual hasil panen secara bertahap atau gunakan fasilitas Pre-Order Kertanusa untuk mengamankan harga kontrak dengan pembeli sebelum terjadi penumpukan stok di pasar lokal.`,
      }
    ];
  } else {
    statusType = 'waspada';
    statusBadgeText = 'KESIMPULAN SISTEM: WASPADA – RISIKO HARGA ANJLOK SAAT PANEN';
    keputusanSistem = 'Keputusan: TUNDA SIKLUS / PILIH VARIETAS GENJAH / DIVERSIFIKASI';
    kesimpulan = `PERINGATAN RISIKO: Meskipun tren jangka pendek terlihat positif, rekaman data 5 tahun menunjukkan bahwa saat panen tiba di bulan ${bulanList[harvestMonth]}, harga rata-rata justru terkoreksi turun ${Math.abs(deltaPct)}% dibanding saat tanam (${bulanList[plantMonth]}). Hal ini dipicu oleh banjir panen raya serentak di sentra produksi lain.`;
    arahanLangkah = [
      {
        kategori: 'Penyesuaian Siklus',
        arahan: `Bila tetap ingin menanam, pilih varietas super genjah agar masa panen maju 2–3 minggu lebih awal mendahului puncak banjir pasokan dari sentra lain.`,
      },
      {
        kategori: 'Diversifikasi Lahan',
        arahan: `Pertimbangkan membagi 40–50% lahan Anda ke tanaman alternatif yang memiliki proyeksi serapan pasar lebih stabil seperti Kapulaga atau Cokelat.`,
      },
      {
        kategori: 'Mitigasi Pascapanen',
        arahan: `Siapkan fasilitas pengeringan atau tempat penyimpanan pascapanen agar Anda tidak terpaksa menjual di titik harga terendah saat panen raya tiba.`,
      }
    ];
  }

  return {
    chartData,
    yearlyComparison,
    monthlyCycle,
    harvestOutlook: {
      hargaSaatTanam: avgTanam,
      hargaSaatPanen: avgPanen,
      plantMonthName: bulanList[plantMonth],
      harvestMonthName: bulanList[harvestMonth],
      harvestDays,
      delta,
      deltaPct,
      isProfit,
      yearsProfitable,
      statusType,
      statusBadgeText,
      kesimpulan,
      risikoFluktuasi,
      keputusanSistem,
      arahanLangkah,
    },
  };
}



// Tooltip untuk siklus 12 bulan
interface MonthlyPayloadEntry {
  value: number;
  payload: {
    bulan: string;
    namaBulan: string;
    harga: number;
    indeks: number;
    isPlant: boolean;
    isHarvest: boolean;
    isPeak: boolean;
  };
}

const MonthlyCycleTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: MonthlyPayloadEntry[];
  plantMonth: string;
  harvestMonth: string;
}) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs space-y-1 min-w-[190px]">
        <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex justify-between items-center">
          <span>Bulan {item.namaBulan}</span>
          {item.isHarvest && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Bulan Panen
            </span>
          )}
          {item.isPlant && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
              Bulan Tanam
            </span>
          )}
          {item.isPeak && !item.isHarvest && !item.isPlant && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
              Puncak Pasar
            </span>
          )}
        </div>
        <div className="flex justify-between items-center text-slate-700 pt-0.5">
          <span>Harga Rata-Rata:</span>
          <span className="font-bold text-slate-900">Rp {item.harga.toLocaleString('id-ID')} / kg</span>
        </div>
        <div className="flex justify-between items-center text-slate-500 text-[11px]">
          <span>Indeks Daya Beli:</span>
          <span className="font-semibold text-slate-700">{item.indeks} / 100</span>
        </div>
      </div>
    );
  }
  return null;
};

// Generic CustomTooltip untuk chart sekunder
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg shadow-md p-3 text-xs select-none pointer-events-none outline-none ring-0">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-slate-900 font-bold">
          Rp {payload[0].value.toLocaleString('id-ID')} / kg
        </p>
      </div>
    );
  }
  return null;
};

export default function MarketDemandPage() {
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
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      return !!stored;
    }
    return false;
  });

  const [activeCategory, setActiveCategory] = useState<CommodityCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.jenis_tanaman) return parsed.jenis_tanaman;
        } catch {}
      }
    }
    return DEFAULT_BENCHMARK_FARMER.jenis_tanaman || 'Bawang Merah';
  });
  const [chartViewMode, setChartViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [calcLuas, setCalcLuas] = useState<number>(10000);
  const [daysPassed, setDaysPassed] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function initActiveFarmer() {
      try {
        let targetFarmer: PetaniRecord | null = null;
        const storedData = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_data') : null;
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_id') : null;

        let parsed: Partial<PetaniRecord> | null = null;
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
          if (typeof window !== 'undefined') {
            localStorage.setItem('kertanusa_active_farmer_id', targetFarmer.id);
            localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(targetFarmer));
          }
          // Prioritaskan jenis tanaman lahan petani saat pertama kali buka
          setSelectedKomoditas(prev => {
            if (!prev || prev === DEFAULT_BENCHMARK_FARMER.jenis_tanaman) {
              return targetFarmer.jenis_tanaman;
            }
            return prev;
          });
          const luasM2 = targetFarmer.satuan_luas === 'hektar' ? Number(targetFarmer.luas_tanah) * 10000 : Number(targetFarmer.luas_tanah) || 10000;
          setCalcLuas(luasM2);
          if (targetFarmer.waktu_tanam) {
            const diff = Date.now() - new Date(targetFarmer.waktu_tanam).getTime();
            setDaysPassed(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
          }
        } else {
          setIsUserLahan(false);
          setActivePetani(DEFAULT_BENCHMARK_FARMER);
          setSelectedKomoditas(prev => {
            if (!prev) return DEFAULT_BENCHMARK_FARMER.jenis_tanaman;
            return prev;
          });
          setCalcLuas(10000);
          if (DEFAULT_BENCHMARK_FARMER.waktu_tanam) {
            const diff = Date.now() - new Date(DEFAULT_BENCHMARK_FARMER.waktu_tanam).getTime();
            setDaysPassed(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
          }
        }
      } catch {
        setIsUserLahan(false);
        setActivePetani(DEFAULT_BENCHMARK_FARMER);
        setSelectedKomoditas(prev => prev || DEFAULT_BENCHMARK_FARMER.jenis_tanaman);
        setDaysPassed(35);
      }
    }
    initActiveFarmer();
  }, []);

  const userLuasM2 = useMemo(() => {
    if (!activePetani) return 10000;
    return activePetani.satuan_luas === 'hektar' ? Number(activePetani.luas_tanah) * 10000 : Number(activePetani.luas_tanah) || 10000;
  }, [activePetani]);

  const pulse = useMemo(() => getMarketPulse(), []);

  const pulseSparklines = useMemo(() => {
    const makeSpark = (name: string) => {
      const comm = getUniversalCommodityData(name);
      return comm.historis_bulanan.map(h => ({ b: h.bulan, p: h.harga }));
    };
    return {
      mostDemanded: makeSpark(pulse.mostDemanded.komoditas),
      fastestRising: makeSpark(pulse.fastestRising.komoditas),
      mostStable: makeSpark(pulse.mostStable.komoditas),
    };
  }, [pulse]);

  const topRecs = useMemo(() => getTopRecommendations(calcLuas, 3), [calcLuas]);

  const filteredCommodities = useMemo(() => {
    if (!searchQuery.trim() && activeCategory === 'Semua') {
      return [];
    }

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
      if (filtered.length === 0) {
        const universalItem = getUniversalCommodityData(searchQuery);
        return [universalItem];
      }
      return filtered;
    }
    return list;
  }, [activeCategory, searchQuery]);

  const currentDetailItem = useMemo(() => {
    const targetName = selectedKomoditas || activePetani?.jenis_tanaman || DEFAULT_BENCHMARK_FARMER.jenis_tanaman;
    if (targetName) {
      const found = COMMODITY_TRENDS.find(c => c.komoditas.toLowerCase() === targetName.toLowerCase());
      if (found) return found;
      return getUniversalCommodityData(targetName);
    }
    if (searchQuery.trim()) {
      const found = COMMODITY_TRENDS.find(c => c.komoditas.toLowerCase().includes(searchQuery.toLowerCase()));
      if (found) return found;
      return getUniversalCommodityData(searchQuery);
    }
    return getUniversalCommodityData(DEFAULT_BENCHMARK_FARMER.jenis_tanaman);
  }, [selectedKomoditas, activePetani, searchQuery]);

  const currentProjection = useMemo(() => {
    return calculateProfitProjection(calcLuas, currentDetailItem.komoditas);
  }, [currentDetailItem.komoditas, calcLuas]);

  const detailRec = useMemo(() => {
    const key = getSeedKomoditasKey(currentDetailItem.komoditas);
    return recommendBestSeeds({
      komoditas: key,
      daerahNama: activePetani.daerah || 'Brebes',
      ketinggian: 'rendah',
      tipe_lahan: 'irigasi_teknis',
      musim: 'kemarau',
      ph_tanah: Number(activePetani.ph_tanah) || 6.5
    });
  }, [currentDetailItem.komoditas, activePetani.daerah, activePetani.ph_tanah]);

  // Multi-year historical analysis
  const multiYearAnalysis = useMemo(() => {
    return buildMultiYearHistory(
      currentDetailItem,
      activePetani.waktu_tanam
    );
  }, [currentDetailItem, activePetani.waktu_tanam]);

  // Data untuk chart 12-bulan (tahun berjalan saja)
  const monthlyChartData = useMemo(() => {
    return currentDetailItem.historis_bulanan.map(h => {
      const isPeak = currentDetailItem.bulan_harga_tertinggi.some(b =>
        b.toLowerCase().startsWith(h.bulan.toLowerCase())
      );
      return {
        bulan: h.bulan,
        harga: h.harga,
        indeks: h.indeks_daya_beli,
        isPeak,
      };
    });
  }, [currentDetailItem]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8 text-slate-800">

      {/* ── HEADER ── */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Daya Beli & Tren Pasar Pertanian
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Pantauan tren harga dan analisis daya beli komoditas berbasis data historis untuk menentukan waktu tanam terbaik dan hasil panen maksimal.
        </p>
      </div>

      {/* ── 1. KARTU RINCIAN LAHAN ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isUserLahan ? `Rincian Lahan ${activePetani.nama_petani}` : 'Rincian Lahan Percontohan (Acuan Rekomendasi)'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isUserLahan
              ? 'Data lahan terhubung langsung dengan profil pendaftaran sawah Anda.'
              : 'Data acuan standar untuk contoh panduan cuaca dan perawatan sawah.'}
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Nama Pemilik / Petani</span>
            <span className="text-slate-900 font-bold">
              {isUserLahan ? activePetani.nama_petani : 'Lahan Percontohan (Acuan Rekomendasi)'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Wilayah / Lokasi</span>
            <span className="text-slate-900 font-semibold">{activePetani.daerah || '-'}</span>
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

      {/* ── 2. SINYAL PASAR & ANALISIS SIKLUS TANAM-PANEN HISTORIS ── */}
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-700" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Sinyal Pasar & Proyeksi Siklus Tanam-Panen (Multi-Tahun)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Perhitungan historis 5 tahun dari bulan tanam hingga panen untuk memastikan komoditas aman ditanam saat ini.
              </p>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { label: activePetani.jenis_tanaman || 'Bawang Merah', sub: isUserLahan ? 'Lahan Anda' : 'Default Sistem' },
              { label: pulse.mostDemanded.komoditas, sub: 'Permintaan Tertinggi' },
              { label: pulse.fastestRising.komoditas, sub: 'Kenaikan Tercepat' },
              { label: pulse.mostStable.komoditas, sub: 'Paling Stabil' },
            ].map(tab => {
              const isSelected = currentDetailItem.komoditas.toLowerCase() === tab.label.toLowerCase();
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setSelectedKomoditas(tab.label)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold">{tab.label}</span>
                  <span className={`text-[11px] ml-1.5 font-medium ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    ({tab.sub})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Utama: Diagram Siklus & Hasil Perhitungan Tanam vs Panen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          {/* Header Card: Komoditas Terpilih & Jadwal Tanam-Panen */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentDetailItem.komoditas}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-700 text-white">
                  {currentDetailItem.kategori}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Jadwal Tanam: <strong className="text-slate-800">{multiYearAnalysis.harvestOutlook.plantMonthName}</strong> ➔ Estimasi Panen: <strong className="text-slate-800">{multiYearAnalysis.harvestOutlook.harvestMonthName}</strong> (~{multiYearAnalysis.harvestOutlook.harvestDays} HST)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 font-medium block">Harga Pasar Saat Ini</span>
                <strong className="text-base sm:text-lg font-bold text-slate-900">
                  Rp {currentDetailItem.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
                </strong>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 font-medium block">Tren Mingguan</span>
                <strong className="text-sm sm:text-base font-bold text-slate-800">
                  {currentDetailItem.tren_mingguan === 'Naik' ? `↑ +${currentDetailItem.persentase_tren}%` : `→ ${currentDetailItem.persentase_tren}%`}
                </strong>
              </div>
            </div>
          </div>

          {/* DIAGRAM INTERAKTIF: Perbandingan 5 Tahun (Tanam vs Panen) - Super Jelas & Ramah Petani */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-800 font-bold flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-emerald-700" />
                Perbandingan Harga: Saat Tanam vs Saat Panen (5 Tahun Terakhir)
              </span>
            </div>

            {/* Chart Area - Clean & Natural Custom Chart */}
            <div className="border border-slate-200 rounded-2xl bg-white p-3 sm:p-5 space-y-3">
              <YearlyComparisonCustomChart
                data={multiYearAnalysis.yearlyComparison}
                plantMonth={multiYearAnalysis.harvestOutlook.plantMonthName}
                harvestMonth={multiYearAnalysis.harvestOutlook.harvestMonthName}
              />

              {/* Keterangan Batang & Kesimpulan Panen yang Menyatu Sederhana */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-5 gap-y-2 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="w-3.5 h-3.5 rounded-sm bg-slate-500 inline-block shrink-0" />
                    <span>Harga Saat Tanam ({multiYearAnalysis.harvestOutlook.plantMonthName})</span>
                  </span>
                  <span className="flex items-center gap-2 font-bold text-emerald-800">
                    <span className="w-3.5 h-3.5 rounded-sm bg-emerald-700 inline-block shrink-0" />
                    <span>Harga Saat Panen ({multiYearAnalysis.harvestOutlook.harvestMonthName})</span>
                  </span>
                </div>
                <div className="sm:ml-auto">
                  <span
                    className={`font-semibold ${
                      multiYearAnalysis.harvestOutlook.yearsProfitable >= 3
                        ? 'text-emerald-700'
                        : multiYearAnalysis.harvestOutlook.yearsProfitable === 0
                        ? 'text-rose-600'
                        : 'text-amber-700'
                    }`}
                  >
                    {multiYearAnalysis.harvestOutlook.yearsProfitable} dari 5 tahun harga naik saat panen
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 METRIK ANALISIS SIKLUS TANAM VS PANEN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wide">
                Harga Rata-Rata Saat Tanam
              </span>
              <strong className="text-slate-900 font-bold text-base block">
                Rp {multiYearAnalysis.harvestOutlook.hargaSaatTanam.toLocaleString('id-ID')} / kg
              </strong>
              <span className="text-slate-400 text-[10px] block">
                Rata-rata historis bulan {multiYearAnalysis.harvestOutlook.plantMonthName}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wide">
                Proyeksi Harga Saat Panen
              </span>
              <strong className="text-slate-900 font-bold text-base block">
                Rp {multiYearAnalysis.harvestOutlook.hargaSaatPanen.toLocaleString('id-ID')} / kg
              </strong>
              <span className="text-slate-400 text-[10px] block">
                Rata-rata historis bulan {multiYearAnalysis.harvestOutlook.harvestMonthName}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wide">
                Selisih Harga Musiman
              </span>
              <strong className="text-slate-900 font-bold text-base block">
                {multiYearAnalysis.harvestOutlook.deltaPct >= 0 ? '+' : ''}{multiYearAnalysis.harvestOutlook.deltaPct}%
              </strong>
              <span className="text-slate-400 text-[10px] block">
                Fluktuasi: {multiYearAnalysis.harvestOutlook.risikoFluktuasi} ({multiYearAnalysis.harvestOutlook.yearsProfitable} dari 5 thn menguntungkan)
              </span>
            </div>
          </div>

          {/* KOTAK SIMPULAN & ARAHAN SISTEM BAGI PETANI */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            {/* Header Badge & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  multiYearAnalysis.harvestOutlook.statusType === 'aman'
                    ? 'bg-emerald-700 text-white'
                    : multiYearAnalysis.harvestOutlook.statusType === 'stabil'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  {multiYearAnalysis.harvestOutlook.statusType === 'waspada' ? (
                    <AlertTriangle className="w-5 h-5 text-white stroke-[2.2]" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-white stroke-[2.2]" />
                  )}
                </div>
                <div>
                  <span className="text-[10.5px] font-extrabold tracking-wider uppercase text-emerald-800 block">
                    {multiYearAnalysis.harvestOutlook.statusBadgeText}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight mt-0.5">
                    {multiYearAnalysis.harvestOutlook.keputusanSistem}
                  </h4>
                </div>
              </div>

              {/* Status Pill Badge Solid */}
              <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  multiYearAnalysis.harvestOutlook.statusType === 'aman'
                    ? 'bg-emerald-700'
                    : multiYearAnalysis.harvestOutlook.statusType === 'stabil'
                    ? 'bg-emerald-700'
                    : 'bg-amber-600'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                  {multiYearAnalysis.harvestOutlook.statusType === 'waspada' ? 'Perlu Mitigasi' : 'Rekomendasi Aman'}
                </span>
              </div>
            </div>

            {/* Ringkasan Analisis Perhitungan */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {multiYearAnalysis.harvestOutlook.kesimpulan}
            </p>

            {/* ARAHAN SISTEM BAGI PETANI (3 POIN KONKRET) */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                Arahan Strategis Hasil Perhitungan Sistem untuk Petani:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {multiYearAnalysis.harvestOutlook.arahanLangkah.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <strong className="text-xs font-bold text-slate-900 leading-snug">
                        {step.kategori}
                      </strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">
                      {step.arahan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 KARTU SINYAL PASAR ESENSIAL DENGAN MINI SPARKLINE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Sinyal 1: Permintaan Tertinggi */}
          <div
            onClick={() => setSelectedKomoditas(pulse.mostDemanded.komoditas)}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-slate-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                Permintaan Pasar Tertinggi
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-700 transition-colors">
                Klik Analisis →
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{pulse.mostDemanded.komoditas}</h3>
              <span className="text-xs text-slate-400 font-medium">{pulse.mostDemanded.kategori}</span>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="h-10 w-full pt-1">
              <ResponsiveContainer width="100%" height={38}>
                <AreaChart data={pulseSparklines.mostDemanded} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="p" stroke="#1e293b" fill="#f1f5f9" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Indeks Serapan:</span>
              <span className="font-bold text-slate-900">{pulse.mostDemanded.skorPermintaan} / 100</span>
            </div>
          </div>

          {/* Sinyal 2: Kenaikan Tercepat */}
          <div
            onClick={() => setSelectedKomoditas(pulse.fastestRising.komoditas)}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-slate-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
                Kenaikan Harga Tercepat
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-700 transition-colors">
                Klik Analisis →
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{pulse.fastestRising.komoditas}</h3>
              <span className="text-xs text-slate-400 font-medium">Rp {pulse.fastestRising.hargaSaatIni.toLocaleString('id-ID')} / kg</span>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="h-10 w-full pt-1">
              <ResponsiveContainer width="100%" height={38}>
                <AreaChart data={pulseSparklines.fastestRising} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="p" stroke="#1e293b" fill="#f1f5f9" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Lonjakan Mingguan:</span>
              <span className="font-bold text-slate-900">+{pulse.fastestRising.persentaseTren}%</span>
            </div>
          </div>

          {/* Sinyal 3: Paling Stabil */}
          <div
            onClick={() => setSelectedKomoditas(pulse.mostStable.komoditas)}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-slate-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                Stabilitas Pasar & Risiko Rendah
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-700 transition-colors">
                Klik Analisis →
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{pulse.mostStable.komoditas}</h3>
              <span className="text-xs text-slate-400 font-medium">Tahan gejolak harga musiman</span>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="h-10 w-full pt-1">
              <ResponsiveContainer width="100%" height={38}>
                <AreaChart data={pulseSparklines.mostStable} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="p" stroke="#1e293b" fill="#f1f5f9" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Skor Stabilitas:</span>
              <span className="font-bold text-slate-900">{pulse.mostStable.skorStabilitas} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. REKOMENDASI TERARAH ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-500" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Rekomendasi Tanaman untuk Lahan Anda
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Analisis kesesuaian agroklimat wilayah <strong className="text-slate-700">{activePetani.daerah}</strong> — luas <strong className="text-slate-700">{calcLuas.toLocaleString('id-ID')} m²</strong>
              </p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {isUserLahan && userLuasM2 > 0 && ![1000, 5000, 10000].includes(userLuasM2) && (
              <button
                type="button"
                onClick={() => setCalcLuas(userLuasM2)}
                className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold cursor-pointer hover:bg-slate-700 transition-colors"
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
            const isSelected = currentDetailItem.komoditas.toLowerCase() === rec.komoditas.toLowerCase();
            return (
              <div
                key={rec.komoditas}
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isSelected ? 'border-slate-900 ring-1 ring-slate-200' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Pilihan #{idx + 1}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{rec.komoditas}</h3>
                      <span className="text-xs text-slate-500 font-medium">{rec.kategori}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-slate-700 bg-slate-100 border border-slate-200">
                      {rec.labelRekomendasi}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {rec.alasanSingkat}
                  </p>

                  {/* Mini chart - bar indeks permintaan */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Skor Total Pasar</span>
                      <span className="font-bold text-slate-900">{rec.skorTotal}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-slate-800 transition-all"
                        style={{ width: `${rec.skorTotal}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Harga Pasar</span>
                      <strong className="text-slate-900 font-semibold">Rp {rec.hargaSaatIni.toLocaleString('id-ID')}/kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ROI Estimasi</span>
                      <strong className="text-slate-900 font-semibold">{rec.roi}%</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedKomoditas(rec.komoditas);
                    setSearchQuery(rec.komoditas);
                    const el = document.getElementById('analisis-komoditas');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-center border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Analisis Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. DIREKTORI & PENCARIAN ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden">

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pencarian Intelijen Komoditas
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ketik nama tanaman, buah, sayur, rempah, atau tanaman obat apapun.
                </p>
              </div>
            </div>
            {filteredCommodities.length > 0 && (
              <span className="text-xs text-slate-500 font-medium">
                <strong className="text-slate-900">{filteredCommodities.length}</strong> komoditas ditemukan
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ketik tanaman apapun (contoh: Porang, Vanili, Stevia, Sorgum, Buah Naga, dll)..."
              value={searchQuery}
              onChange={e => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim()) {
                  setSelectedKomoditas(val.trim());
                }
              }}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 outline-none transition-all placeholder:text-slate-400 bg-white"
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

          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Contoh Cepat:</span>
            {['Porang', 'Vanili', 'Stevia', 'Sorgum', 'Cabai Rawit Merah', 'Bawang Merah', 'Buah Naga Merah', 'Kopi Arabika'].map(pill => (
              <button
                key={pill}
                type="button"
                onClick={() => {
                  setSearchQuery(pill);
                  setSelectedKomoditas(pill);
                  const el = document.getElementById('analisis-komoditas');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                  searchQuery.toLowerCase() === pill.toLowerCase()
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  if (cat === 'Semua') {
                    setSearchQuery('');
                  } else {
                    setSearchQuery(cat);
                  }
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

        {filteredCommodities.length > 0 ? (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Hasil Pencarian ({filteredCommodities.length} Komoditas):
              </span>
              <span className="text-[11px] text-slate-400">Klik baris untuk memuat analisis detail</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-semibold z-10">
                  <tr>
                    <th className="py-2.5 px-3.5">Komoditas</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Harga Pasar</th>
                    <th className="py-2.5 px-3 text-right">Tren</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCommodities.map(c => {
                    const isSelected = currentDetailItem.komoditas.toLowerCase() === c.komoditas.toLowerCase();
                    return (
                      <tr
                        key={c.komoditas}
                        onClick={() => {
                          setSelectedKomoditas(c.komoditas);
                          const el = document.getElementById('analisis-komoditas');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`transition-colors cursor-pointer hover:bg-slate-50 ${
                          isSelected ? 'bg-slate-50' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3.5">
                          <div className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>{c.komoditas}</div>
                          <div className="text-[10px] text-slate-400 font-normal sm:hidden">{c.kategori}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 hidden sm:table-cell">
                          {c.kategori}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                          Rp {c.harga_saat_ini.toLocaleString('id-ID')}/kg
                        </td>
                        <td className="py-2.5 px-3 text-right text-xs font-semibold">
                          {c.tren_mingguan === 'Naik'
                            ? <span className="text-slate-700">+{c.persentase_tren}%</span>
                            : <span className="text-slate-500">Stabil</span>
                          }
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            className="text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Pilih
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 border-t border-slate-100 bg-slate-50/40 text-center space-y-2">
            <Sprout className="w-6 h-6 text-slate-400 mx-auto" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Pencarian Intelijen Komoditas Pertanian
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Ketik nama tumbuhan, sayuran, buah, atau tanaman obat pada kolom di atas untuk memuat data harga pasar, estimasi panen, dan panduan agronomis secara otomatis.
            </p>
          </div>
        )}

      </div>

      {/* ── 5. ANALISIS DETAIL KOMODITAS TERPILIH ── */}
      <div id="analisis-komoditas" className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden scroll-mt-24">

        {/* Header Detail */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-700 text-white">
                {currentDetailItem.kategori}
              </span>
              <span className="text-xs text-slate-400 font-medium">Panduan Lengkap Budidaya & Pasar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentDetailItem.komoditas}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-medium block">Harga Pasar Saat Ini</span>
              <strong className="text-lg sm:text-xl font-black text-slate-900 block">
                Rp {currentDetailItem.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
              </strong>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-medium block">Tren Mingguan</span>
              <strong className={`text-base font-bold block ${currentDetailItem.tren_mingguan === 'Naik' ? 'text-slate-800' : 'text-slate-500'}`}>
                {currentDetailItem.tren_mingguan === 'Naik' ? `↑ +${currentDetailItem.persentase_tren}%` : `→ ${currentDetailItem.persentase_tren}%`}
              </strong>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-10">

          {/* ─ BAGIAN A: CHART HISTORIS HARGA 12 BULAN ─ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-slate-500" />
                  Dinamika Harga Bulanan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fluktuasi harga per bulan dalam satu siklus tahunan. Batang lebih gelap menandai bulan puncak permintaan.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-800 inline-block" /> Puncak</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200 inline-block border border-slate-300" /> Normal</span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl bg-slate-50/30 p-3 sm:p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={monthlyChartData}
                  maxBarSize={isMobile ? 14 : 26}
                  barCategoryGap={isMobile ? '16%' : '12%'}
                  margin={{ top: 8, right: 4, left: isMobile ? -14 : -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="bulan"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={isMobile ? 38 : 44}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip cursor={false} wrapperStyle={{ outline: 'none', pointerEvents: 'none' }} content={<CustomTooltip />} />
                  <Bar
                    dataKey="harga"
                    radius={[4, 4, 0, 0]}
                    fill="#e2e8f0"
                  >
                    {monthlyChartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.isPeak ? '#1e293b' : '#e2e8f0'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-1">
                <span className="font-bold text-slate-800 block">Musim Puncak Permintaan:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.musim_puncak}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-1">
                <span className="font-bold text-slate-800 block">Saran Waktu Tanam Ideal:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.rekomendasi_waktu_tanam}</p>
              </div>
            </div>
          </div>

          {/* ─ BAGIAN B: ANALISIS HISTORIS MULTI-TAHUN (5 TAHUN) ─ */}
          <div className="border-t border-slate-100 pt-8 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                Tren Harga Historis 5 Tahun
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pergerakan harga dari {new Date().getFullYear() - 4} hingga {new Date().getFullYear()} untuk memahami pola jangka panjang dan identifikasi momen optimal tanam-panen.
              </p>
            </div>

            <div className="border border-slate-100 rounded-xl bg-slate-50/30 p-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={multiYearAnalysis.chartData}
                  margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e293b" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    interval={11}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip cursor={false} wrapperStyle={{ outline: 'none', pointerEvents: 'none' }} content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="harga"
                    stroke="#1e293b"
                    strokeWidth={1.5}
                    fill="url(#priceGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#1e293b', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Kesimpulan Outlook Tanam vs Panen */}
            <div className={`rounded-xl border p-5 space-y-4 ${
              multiYearAnalysis.harvestOutlook.isProfit
                ? 'border-slate-200 bg-white'
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  multiYearAnalysis.harvestOutlook.isProfit ? 'bg-slate-900' : 'bg-slate-200'
                }`}>
                  {multiYearAnalysis.harvestOutlook.isProfit
                    ? <CheckCircle className="w-4 h-4 text-white" />
                    : <AlertTriangle className="w-4 h-4 text-slate-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900">
                    Analisis Outlook Tanam → Panen
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {multiYearAnalysis.harvestOutlook.kesimpulan}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-center">
                  <span className="text-slate-500 block text-[10px] font-medium uppercase tracking-wide">Harga Saat Tanam</span>
                  <strong className="text-slate-800 font-bold block text-sm">
                    Rp {multiYearAnalysis.harvestOutlook.hargaSaatTanam.toLocaleString('id-ID')}
                  </strong>
                  <span className="text-[10px] text-slate-400">rata-rata historis</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-center">
                  <span className="text-slate-500 block text-[10px] font-medium uppercase tracking-wide">Harga Saat Panen</span>
                  <strong className="text-slate-800 font-bold block text-sm">
                    Rp {multiYearAnalysis.harvestOutlook.hargaSaatPanen.toLocaleString('id-ID')}
                  </strong>
                  <span className="text-[10px] text-slate-400">rata-rata historis</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-center">
                  <span className="text-slate-500 block text-[10px] font-medium uppercase tracking-wide">Selisih Harga</span>
                  <strong className={`font-bold block text-sm ${multiYearAnalysis.harvestOutlook.isProfit ? 'text-slate-900' : 'text-slate-500'}`}>
                    {multiYearAnalysis.harvestOutlook.isProfit ? '+' : ''}{multiYearAnalysis.harvestOutlook.deltaPct}%
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    Fluktuasi: {multiYearAnalysis.harvestOutlook.risikoFluktuasi}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─ BAGIAN C: KARAKTERISTIK LAHAN & PEDOMAN TEKNIS ─ */}
          <div className="border-t border-slate-100 pt-8 space-y-4">
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
                <span className="text-slate-400 font-medium block">Tren Harga</span>
                <strong className="text-slate-900 font-bold text-sm block">
                  {currentDetailItem.tren_mingguan} (+{currentDetailItem.persentase_tren}%)
                </strong>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Tekstur & Kondisi Tanah:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.karakteristik_tanah || 'Tanah gembur lempung berpasir kaya bahan organik dengan aerasi dan drainase lancar.'}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Tips Agronomis & Mitigasi Risiko:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{currentDetailItem.tips_agronomis || 'Lakukan pengolahan tanah sempurna, gunakan benih murni bersertifikat, dan atur drainase agar akar tanaman terhindar dari penyakit busuk akar.'}</p>
              </div>
            </div>
          </div>

          {/* ─ BAGIAN D: SIMULASI PROFIT ─ */}
          <div className="border-t border-slate-100 pt-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Simulasi Estimasi Keuntungan Lahan
                </h3>
                <p className="text-xs text-slate-500">
                  Perhitungan tonase panen, modal, dan laba bersih berdasarkan luas lahan Anda.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Luas Lahan:</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={calcLuas}
                  onChange={e => setCalcLuas(Math.max(1, Number(e.target.value)))}
                  className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 focus:border-slate-500 text-xs font-bold outline-none text-right bg-white"
                />
                <span className="text-xs text-slate-600 font-semibold">m²</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Estimasi Tonase Panen:</span>
                  <strong className="text-slate-900 font-bold text-sm">
                    {currentProjection.totalPanenKg.toLocaleString('id-ID')} kg
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Modal & Biaya Operasional:</span>
                  <strong className="text-slate-700 font-bold">
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
                  <strong className="text-2xl sm:text-3xl font-black text-white block mt-1">
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

          {/* ─ BAGIAN E: REKOMENDASI BENIH ─ */}
          {detailRec.varietasTerbaik && (
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Rekomendasi Varietas Bibit / Benih Unggul
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
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
                      Daftar varietas benih lokal tersertifikasi dapat dikonsultasikan melalui dinas pertanian setempat.
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
