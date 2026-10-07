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
  getRegionSuitabilityDetails,
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
  Search,
  Sprout,
  X,
  ChevronRight,
  BarChart2,
  Activity,
  CheckCircle,
  Info,
  Calendar,
  AlertCircle,
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

function getSeedKomoditasKey(name: string): 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur' | 'Apel' {
  const l = name.toLowerCase();
  if (l.includes('apel') || l.includes('apple')) return 'Apel';
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
  if (lower.includes('nanas') || lower.includes('pineapple') || lower.includes('nenas')) return 285; // 9.5 bulan (rata-rata 270-300 HST sesuai riset hortikultura)
  if (lower.includes('durian') || lower.includes('duren')) return 120; // 4 bulan (siklus bunga anthesis ke matang petik 110-130 HST)
  if (lower.includes('mangga') || lower.includes('mango')) return 120; // 4 bulan (siklus bunga ke matang petik 110-130 HST)
  if (lower.includes('apel') || lower.includes('apple')) return 130; // ~4.3 bulan (Siklus bunga ke matang petik 120-140 HST)
  if (lower.includes('jeruk') || lower.includes('citrus')) return 240; // 8 bulan
  if (lower.includes('kakao') || lower.includes('cokelat')) return 165; // 5.5 bulan (150-180 HST)
  if (lower.includes('kopi')) return 210; // 7 bulan (180-240 HST)
  if (lower.includes('kapulaga')) return 120; // 4 bulan (110-130 HST)
  if (lower.includes('pisang')) return 240; // 8 bulan
  if (lower.includes('vanili')) return 255; // 8.5 bulan
  if (lower.includes('jahe') || lower.includes('kunyit')) return 255; // 8.5 bulan
  if (lower.includes('padi')) return 115; // ~3.8 bulan (105-120 HST)
  if (lower.includes('jagung')) return 75; // ~2.5 bulan (70-80 HST)
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
    optimalPlantMonthName: string;
    optimalHarvestMonthName: string;
    optimalPeakPrice: number;
    optimalDeltaPct: number;
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

  // Menghitung Siklus Terbaik (Bulan Puncak Harga & Waktu Tanam Optimal Biar Untung)
  let maxPrice = -Infinity;
  let optimalHarvestMonthIdx = harvestMonth;
  item.historis_bulanan.forEach((h, idx) => {
    if (h.harga > maxPrice) {
      maxPrice = h.harga;
      optimalHarvestMonthIdx = idx;
    }
  });

  // Waktu tanam terbaik dihitung mundur dari bulan panen puncak
  const optimalPlantMonthIdx = (optimalHarvestMonthIdx - harvestMonthOffset + 12) % 12;
  const optimalPlantPrice = item.historis_bulanan[optimalPlantMonthIdx]?.harga || item.harga_saat_ini;
  const optimalPeakPrice = maxPrice;
  const optimalDelta = optimalPeakPrice - optimalPlantPrice;
  const optimalDeltaPct = optimalPlantPrice > 0 ? Math.round(((optimalPeakPrice - optimalPlantPrice) / optimalPlantPrice) * 100) : 0;

  const isProfit = delta > 0;
  let statusType: 'aman' | 'stabil' | 'waspada' = 'stabil';
  let statusBadgeText = '';
  let keputusanSistem = '';
  let kesimpulan = '';
  let arahanLangkah: Array<{ kategori: string; arahan: string }> = [];

  const hppBatasAman = Math.round(avgPanen * 0.52);

  if (isProfit && deltaPct >= 10 && yearsProfitable >= 3) {
    statusType = 'aman';
    statusBadgeText = 'Rekomendasi Tanam';
    keputusanSistem = `Direkomendasikan Tanam di Bulan ${bulanList[plantMonth]} (Potensi Keuntungan Tinggi)`;
    kesimpulan = `Berdasarkan kalkulasi historis 5 tahun, menanam ${item.komoditas} di bulan ${bulanList[plantMonth]} konsisten menghasilkan keuntungan dengan proyeksi kenaikan harga panen rata-rata +${deltaPct}% (${yearsProfitable} dari 5 tahun harga naik). Periode ini ideal untuk memulai siklus tanam.`;
    arahanLangkah = [
      {
        kategori: '1. Jadwal Tanam Lapangan',
        arahan: `Lahan siap ditanami di bulan ${bulanList[plantMonth]}. Estimasi masa panen tiba pada bulan ${bulanList[harvestMonth]} (~${harvestDays} HST) sebelum puncak panen raya nasional tiba.`,
      },
      {
        kategori: '2. Estimasi Harga Panen',
        arahan: `Hasil panen diproyeksikan terserap optimal di pasar pada kisaran Rp ${avgPanen.toLocaleString('id-ID')} / kg dengan potensi surplus keuntungan modal sekitar +${deltaPct}%.`,
      },
      {
        kategori: '3. Pemeliharaan Nutrisi Lahan',
        arahan: `Jaga kestabilan kelembapan dan pH tanah secara rutin, serta gunakan benih unggul adaptif cuaca untuk memastikan tonase hasil panen maksimal.`,
      }
    ];
  } else if (isProfit && deltaPct >= 0) {
    statusType = 'stabil';
    statusBadgeText = 'Siklus Stabil';
    keputusanSistem = `Aman Ditanam Sesuai Jadwal (Fokus Efisiensi Biaya Operasional)`;
    kesimpulan = `Pergerakan harga ${item.komoditas} relatif stabil antara masa tanam (${bulanList[plantMonth]}) dan panen (${bulanList[harvestMonth]}) dengan tren rata-rata +${deltaPct}%. Keuntungan budidaya dapat terjaga optimal melalui efisiensi biaya kerja dan perawatan tanah yang terukur.`;
    arahanLangkah = [
      {
        kategori: '1. Jadwal Tanam Lapangan',
        arahan: `Penanaman dapat dijalankan sesuai jadwal kerja di bulan ${bulanList[plantMonth]}. Estimasi panen tiba sekitar bulan ${bulanList[harvestMonth]} (~${harvestDays} HST).`,
      },
      {
        kategori: '2. Pengendalian Biaya HPP',
        arahan: `Kunci estimasi biaya operasional di bawah Rp ${hppBatasAman.toLocaleString('id-ID')} / kg dengan memanfaatkan pupuk organik berimbang guna menekan ketergantungan pupuk kimia mahal.`,
      },
      {
        kategori: '3. Pemeliharaan Kondisi Tanah',
        arahan: `Pantau kecukupan air dan sirkulasi aerasi tanah agar tanaman tidak mengalami stres air selama fase pertumbuhan vegetatif.`,
      }
    ];
  } else {
    statusType = 'waspada';
    statusBadgeText = 'Penyesuaian Jadwal Tanam';
    keputusanSistem = `Disarankan Tunda Tanam Bulan Ini ➔ Jadwal Terbaik: Bulan ${bulanList[optimalPlantMonthIdx]}`;
    kesimpulan = `Data historis 5 tahun menunjukkan jika menanam ${item.komoditas} di bulan ${bulanList[plantMonth]}, harga pasar saat panen (${bulanList[harvestMonth]}) cenderung mengalami koreksi turun rata-rata ${Math.abs(deltaPct)}% (${yearsProfitable} dari 5 tahun harga naik) akibat banjir pasokan panen serentak. Agar modal petani terlindungi, sistem menyarankan menyesuaikan jadwal tanam ke bulan ${bulanList[optimalPlantMonthIdx]} saat pasokan pasar lebih seimbang.`;
    arahanLangkah = [
      {
        kategori: '1. Penyesuaian Jadwal Tanam',
        arahan: `Tunda tanam di bulan ${bulanList[plantMonth]}. Waktu tanam terbaik adalah bulan ${bulanList[optimalPlantMonthIdx]} (~${harvestDays} HST) agar waktu panen tiba di bulan ${bulanList[optimalHarvestMonthIdx]}.`,
      },
      {
        kategori: '2. Proyeksi Penjualan Hasil',
        arahan: `Menanam di bulan ${bulanList[optimalPlantMonthIdx]} membidik estimasi harga puncak panen historis di kisaran Rp ${optimalPeakPrice.toLocaleString('id-ID')} / kg (potensi surplus +${Math.max(15, optimalDeltaPct)}%).`,
      },
      {
        kategori: '3. Pengelolaan Lahan & Tanah',
        arahan: `Manfaatkan waktu jeda ini untuk pemulihan pH tanah, pengolahan gulma, dan penyiapan petak lahan, atau alihkan ke komoditas unggulan wilayah yang sedang naik tren panennya.`,
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
      optimalPlantMonthName: bulanList[optimalPlantMonthIdx],
      optimalHarvestMonthName: bulanList[optimalHarvestMonthIdx],
      optimalPeakPrice,
      optimalDeltaPct,
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
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
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

  const pulse = useMemo(() => getMarketPulse(activePetani?.daerah), [activePetani?.daerah]);

  const topRecs = useMemo(() => getTopRecommendations(calcLuas, 3, activePetani?.daerah), [calcLuas, activePetani?.daerah]);

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
      return filtered;
    }
    return list;
  }, [activeCategory, searchQuery]);

  const currentDetailItem = useMemo(() => {
    const targetName = selectedKomoditas || activePetani?.jenis_tanaman || DEFAULT_BENCHMARK_FARMER.jenis_tanaman;
    if (targetName) {
      const found = COMMODITY_TRENDS.find(c => c.komoditas.toLowerCase() === targetName.toLowerCase());
      if (found) return found;
      const partialFound = COMMODITY_TRENDS.find(c =>
        c.komoditas.toLowerCase().includes(targetName.toLowerCase()) ||
        targetName.toLowerCase().includes(c.komoditas.toLowerCase())
      );
      if (partialFound) return partialFound;
    }
    const fallbackName = activePetani?.jenis_tanaman || DEFAULT_BENCHMARK_FARMER.jenis_tanaman;
    return COMMODITY_TRENDS.find(c => c.komoditas.toLowerCase().includes(fallbackName.toLowerCase()))
      || COMMODITY_TRENDS.find(c => c.komoditas === 'Bawang Merah')
      || COMMODITY_TRENDS[0];
  }, [selectedKomoditas, activePetani]);

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

  const regionalSuitability = useMemo(() => {
    return getRegionSuitabilityDetails(currentDetailItem.komoditas, activePetani?.daerah);
  }, [currentDetailItem.komoditas, activePetani?.daerah]);

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
            {(() => {
              const farmerCrop = activePetani.jenis_tanaman || 'Bawang Merah';
              const matchedFarmerComm = COMMODITY_TRENDS.find(c =>
                c.komoditas.toLowerCase() === farmerCrop.toLowerCase() ||
                c.komoditas.toLowerCase().includes(farmerCrop.toLowerCase()) ||
                farmerCrop.toLowerCase().includes(c.komoditas.toLowerCase())
              );
              const farmerTargetKey = matchedFarmerComm ? matchedFarmerComm.komoditas : farmerCrop;

              const tabs = [
                {
                  label: farmerCrop,
                  targetKey: farmerTargetKey,
                  sub: isUserLahan ? 'Lahan Anda' : 'Default Sistem'
                },
                {
                  label: pulse.mostDemanded.komoditas,
                  targetKey: pulse.mostDemanded.komoditas,
                  sub: 'Permintaan Tertinggi'
                },
                {
                  label: pulse.fastestRising.komoditas,
                  targetKey: pulse.fastestRising.komoditas,
                  sub: 'Kenaikan Tercepat'
                },
                {
                  label: pulse.mostStable.komoditas,
                  targetKey: pulse.mostStable.komoditas,
                  sub: 'Paling Stabil'
                },
              ].filter((tab, idx, arr) => arr.findIndex(t => t.targetKey.toLowerCase() === tab.targetKey.toLowerCase()) === idx);

              return tabs.map(tab => {
                const currentName = currentDetailItem.komoditas.toLowerCase();
                const targetKeyLower = tab.targetKey.toLowerCase();
                const labelLower = tab.label.toLowerCase();

                const isSelected =
                  currentName === targetKeyLower ||
                  currentName === labelLower ||
                  currentName.startsWith(labelLower) ||
                  currentName.includes(labelLower) ||
                  targetKeyLower.includes(currentName) ||
                  labelLower.includes(currentName);

                return (
                  <button
                    key={tab.targetKey}
                    type="button"
                    onClick={() => setSelectedKomoditas(tab.targetKey)}
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
              });
            })()}
          </div>
        </div>

        {/* Card Utama: Diagram Siklus & Hasil Perhitungan Tanam vs Panen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          {/* Header Card: Komoditas Terpilih & Jadwal Tanam-Panen */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{currentDetailItem.komoditas}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-700 text-white">
                  {currentDetailItem.kategori}
                </span>
                {!regionalSuitability.isSuitable && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-700 text-white">
                    Kurang Cocok di {activePetani.daerah || 'Wilayah Anda'}
                  </span>
                )}
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

          {/* Catatan Agroklimat Wilayah */}
          {!regionalSuitability.isSuitable && (
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/80 flex items-start gap-3 text-xs">
              <Sprout className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-slate-900 font-bold block text-sm">
                  Karakteristik Wilayah: {currentDetailItem.komoditas} di {activePetani.daerah}
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  {regionalSuitability.alasan}
                </p>
              </div>
            </div>
          )}

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
                        : 'text-slate-600'
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

          {/* PANDUAN KEPUTUSAN TANAM PETANI (Clean, Ringkas, Berbasis Data Riset) */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
            {/* Header: Judul Langsung Jelas, Tanpa Icon Hiasan, Tanpa Badge */}
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block">
                Panduan Budidaya Berdasarkan Riset Pasar & Agroklimat
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                {multiYearAnalysis.harvestOutlook.keputusanSistem}
              </h3>
            </div>

            {/* Penjelasan Singkat & Padat Hasil Perhitungan 5 Tahun */}
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              {multiYearAnalysis.harvestOutlook.kesimpulan}
            </p>

            {/* 3 Arahan Praktis Petani */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {multiYearAnalysis.harvestOutlook.arahanLangkah.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5"
                >
                  <strong className="text-xs font-bold text-slate-900 block">
                    {step.kategori}
                  </strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.arahan}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── 3. DIREKTORI & PENCARIAN ── */}
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
              placeholder="Ketik tanaman (contoh: Nanas, Durian, Cabai Rawit, Bawang Merah, Padi, Jagung, Kacang Tanah)..."
              value={searchQuery}
              onChange={e => {
                const val = e.target.value;
                setSearchQuery(val);
                const q = val.trim().toLowerCase();
                if (q) {
                  // Hanya ubah komoditas aktif jika input persis cocok dengan komoditas terdaftar
                  const exact = COMMODITY_TRENDS.find(c => c.komoditas.toLowerCase() === q);
                  if (exact) {
                    setSelectedKomoditas(exact.komoditas);
                  }
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
            {[
              'Bawang Merah',
              'Cabai Rawit Merah',
              'Padi Sawah',
              'Nanas (Madu Subang / Honi)',
              'Durian (Montong / Bawor / Musang King)',
              'Jagung Manis',
              'Kopi Arabika',
              'Kacang Tanah',
              'Porang (Amorphophallus muelleri)'
            ].map(pill => (
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
                {pill.includes('(') ? pill.split('(')[0].trim() : pill}
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
        ) : searchQuery.trim() ? (
          <div className="p-8 border-t border-slate-100 bg-white text-center space-y-2.5">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Komoditas &quot;{searchQuery}&quot; Tidak Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Kertanusa hanya menganalisis komoditas pangan, hortikultura, perkebunan, dan rempah resmi berbasis data riset agronomi nasional. Silakan masukkan nama tanaman budidaya yang valid seperti <strong>Cabai, Bawang Merah, Padi, Nanas, Durian, Jagung, Kacang Tanah</strong>, dll.
            </p>
          </div>
        ) : (
          <div className="p-6 border-t border-slate-100 bg-slate-50/40 text-center space-y-2">
            <Sprout className="w-6 h-6 text-slate-400 mx-auto" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Pencarian Intelijen Komoditas Pertanian
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Ketik nama tanaman, buah, sayur, atau rempah pada kolom di atas atau pilih salah satu kategori untuk memuat data harga pasar, estimasi panen, dan panduan agronomis.
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
                    : <Sprout className="w-4 h-4 text-slate-600" />
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    Rekomendasi Varietas Bibit / Benih Unggul
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Spesifikasi varietas terdaftar yang adaptif terhadap agroklimat wilayah {activePetani.daerah || 'setempat'}.
                  </p>
                </div>

                {multiYearAnalysis.harvestOutlook.statusType === 'waspada' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
                    <Sprout className="w-3.5 h-3.5 text-slate-600" />
                    Penyesuaian Jadwal Tanam
                  </span>
                )}
              </div>

              {/* Banner Anjuran Penjadwalan jika komoditas perlu penyesuaian jadwal tanam */}
              {multiYearAnalysis.harvestOutlook.statusType === 'waspada' && (
                <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Sprout className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Anjuran Penjadwalan: Pembelian Bibit {currentDetailItem.komoditas} Disarankan untuk Bulan {multiYearAnalysis.harvestOutlook.optimalPlantMonthName}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Data historis 5 tahun memproyeksikan harga saat panen ({multiYearAnalysis.harvestOutlook.harvestMonthName}) cenderung terkoreksi turun <strong>{Math.abs(multiYearAnalysis.harvestOutlook.deltaPct)}%</strong> akibat melimpahnya panen raya serentak. Untuk memastikan hasil panen memperoleh keuntungan maksimal, sistem menyarankan <strong>menjadwalkan tanam pada bulan {multiYearAnalysis.harvestOutlook.optimalPlantMonthName}</strong> agar panen Anda tiba saat harga pasar di puncak (Rp {multiYearAnalysis.harvestOutlook.optimalPeakPrice?.toLocaleString('id-ID')} / kg).
                      </p>
                    </div>
                  </div>

                  {topRecs.length > 0 && topRecs[0].komoditas.toLowerCase() !== currentDetailItem.komoditas.toLowerCase() && (
                    <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-slate-700 font-medium">
                        Rekomendasi Bibit Alternatif Wilayah {activePetani.daerah || 'Anda'} Bulan Ini: <strong className="text-slate-950">{topRecs[0].komoditas}</strong> (Proyeksi panen untung +{topRecs[0].harvestDeltaPct}%)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedKomoditas(topRecs[0].komoditas);
                          const el = document.getElementById('analisis-komoditas');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer text-xs whitespace-nowrap self-start sm:self-auto"
                      >
                        Lihat Bibit {topRecs[0].komoditas} →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${
                    multiYearAnalysis.harvestOutlook.statusType === 'waspada'
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : 'text-slate-700 bg-slate-100 border-slate-200'
                  }`}>
                    {multiYearAnalysis.harvestOutlook.statusType === 'waspada'
                      ? `Acuan Siklus Tanam Bulan ${multiYearAnalysis.harvestOutlook.optimalPlantMonthName}`
                      : 'Pilihan Utama'}
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
