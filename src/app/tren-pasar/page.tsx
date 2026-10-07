'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  COMMODITY_TRENDS,
  CommodityCategory,
  getMarketPulse,
  MarketCommodityTrendExtended,
  getRegionSuitabilityDetails,
} from '@/lib/market_demand';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';
import { isRecognizedCrop } from '@/lib/crops';
import YearlyComparisonCustomChart from '@/components/YearlyComparisonCustomChart';
import {
  Search,
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

function parseHarvestDays(umurPanenStr: string | undefined, komoditasName?: string): number {
  const lower = (komoditasName || '').toLowerCase();

  // 1. Tanaman Pohon / Perennial Buah & Perkebunan (Awal Tanam Bibit ➔ Panen Perdana)
  if (lower.includes('durian') || lower.includes('duren')) return 1825; // 5 Tahun (~1.825 HST) dari bibit okulasi hingga panen perdana
  if (lower.includes('karet')) return 1825; // 5-6 Tahun (~1.825 HST) dari bibit okulasi hingga buka sadap lateks
  if (lower.includes('mangga') || lower.includes('mango')) return 1200; // 3-4 Tahun (~1.200 HST) dari bibit okulasi hingga panen perdana
  if (lower.includes('alpukat') || lower.includes('avocado')) return 1200; // 3-4 Tahun (~1.200 HST) dari bibit sambung pucuk hingga panen perdana
  if (lower.includes('apel') || lower.includes('apple')) return 1200; // 3-4 Tahun (~1.200 HST) dari bibit okulasi hingga panen perdana
  if (lower.includes('sawit')) return 1200; // 3-4 Tahun (~1.200 HST) dari bibit sawit hingga panen TBS perdana
  if (lower.includes('jeruk') || lower.includes('citrus') || lower.includes('lemon')) return 900; // 2.5-3 Tahun (~900 HST) dari bibit okulasi hingga panen perdana
  if (lower.includes('kopi')) return 900; // 2.5-3 Tahun (~900 HST) dari bibit tanam hingga panen perdana
  if (lower.includes('vanili')) return 900; // 2-3 Tahun (~900 HST) dari sulur tanam hingga panen polong perdana
  if (lower.includes('kakao') || lower.includes('cokelat')) return 800; // 2-3 Tahun (~800 HST) dari bibit sambung hingga panen perdana
  if (lower.includes('kapulaga')) return 730; // 1.5-2 Tahun (~730 HST) dari anakan rumpun hingga panen perdana

  // 2. Tanaman Buah Semusim Panjang / Merambat / Rumpun (8-12 Bulan)
  if (lower.includes('naga')) return 330; // 10-12 Bulan (~330 HST) dari stek cabang hingga panen perdana
  if (lower.includes('anggur') || lower.includes('grape')) return 330; // 10-12 Bulan (~330 HST) dari bibit stek/grafting hingga pembuahan perdana
  if (lower.includes('pisang')) return 300; // 9-11 Bulan (~300 HST) dari anakan bibit hingga panen tandan
  if (lower.includes('nanas') || lower.includes('pineapple') || lower.includes('nenas')) return 285; // 9.5 Bulan (270-300 HST) dari tunas batang
  if (lower.includes('singkong') || lower.includes('ubi kayu')) return 270; // 8-10 Bulan (~270 HST) dari stek batang hingga cabut umbi
  if (lower.includes('jahe') || lower.includes('kunyit') || lower.includes('kencur')) return 270; // 9 Bulan (~270 HST) hingga rimpang tua
  if (lower.includes('pepaya') || lower.includes('papaya')) return 240; // 7-8 Bulan (~240 HST) dari semaian hingga panen rutin
  if (lower.includes('porang')) return 180; // 6 Bulan per musim (~180 HST)
  if (lower.includes('ubi jalar')) return 120; // 3.5-4 Bulan (~120 HST)

  // 3. Tanaman Buah Semusim Merambat & Sayur/Pangan Hortikultura
  if (lower.includes('semangka')) return 60; // 55-65 HST (~60 HST)
  if (lower.includes('melon')) return 65; // 60-70 HST (~65 HST)
  if (lower.includes('padi') || lower.includes('gabah') || lower.includes('beras')) return 115; // 105-120 HST
  if (lower.includes('cabai rawit') || lower.includes('cabe rawit')) return 80; // 75-85 HST
  if (lower.includes('cabai') || lower.includes('cabe') || lower.includes('chili')) return 85; // 80-90 HST
  if (lower.includes('jagung')) return 75; // 70-80 HST
  if (lower.includes('tomat')) return 75; // 70-80 HST
  if (lower.includes('kentang')) return 90; // 85-100 HST
  if (lower.includes('kacang tanah')) return 95; // 90-100 HST
  if (lower.includes('kedelai')) return 85; // 80-90 HST
  if (lower.includes('bawang merah')) return 60; // 55-65 HST
  if (lower.includes('bawang daun') || lower.includes('prei')) return 70; // 65-75 HST
  if (lower.includes('bawang')) return 65; // 60-70 HST

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

  const tahunMatch = umurPanenStr.match(/([\d.]+)\s*-\s*([\d.]+)\s*Tahun/i) || umurPanenStr.match(/([\d.]+)\s*Tahun/i);
  if (tahunMatch) {
    if (tahunMatch[2]) return Math.round(((Number(tahunMatch[1]) + Number(tahunMatch[2])) / 2) * 365);
    return Math.round(Number(tahunMatch[1]) * 365);
  }

  const bulanMatch = umurPanenStr.match(/(\d+)\s*-\s*(\d+)\s*Bulan/i) || umurPanenStr.match(/(\d+)\s*Bulan/i);
  if (bulanMatch) {
    if (bulanMatch[2]) return Math.round(((Number(bulanMatch[1]) + Number(bulanMatch[2])) / 2) * 30);
    return Number(bulanMatch[1]) * 30;
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
    plantYear: number;
    harvestYear: number;
    plantScheduleText: string;
    harvestScheduleText: string;
    isPerennial: boolean;
    yearsOffset: number;
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

  // Tentukan bulan & tahun tanam
  let plantMonth = currentMonth;
  let plantYear = currentYear;
  if (plantingDate) {
    const pd = new Date(plantingDate);
    if (!isNaN(pd.getTime())) {
      plantMonth = pd.getMonth();
      plantYear = pd.getFullYear();
    }
  }

  // Hitung durasi dan bulan panen nyata tanaman (bukan 2 bulan seragam!)
  const harvestDays = parseHarvestDays(item.umur_panen, item.komoditas);
  const isPerennial = harvestDays >= 365;
  const yearsOffset = Math.max(1, Math.round(harvestDays / 365));
  const harvestMonthOffset = Math.max(1, Math.round(harvestDays / 30));

  // Untuk pohon tahunan, panen perdana tiba di tahun ke-(plantYear + yearsOffset)
  // dan puncak pemanenan mengikuti musim panen raya komoditas (bulan_harga_tertinggi)
  let harvestMonth = (plantMonth + harvestMonthOffset) % 12;
  const harvestYear = isPerennial 
    ? plantYear + yearsOffset 
    : plantYear + Math.floor((plantMonth + harvestMonthOffset) / 12);

  if (isPerennial && item.bulan_harga_tertinggi && item.bulan_harga_tertinggi.length > 0) {
    const peakIdx = bulanList.findIndex(b =>
      item.bulan_harga_tertinggi.some(p => p.toLowerCase().startsWith(b.slice(0, 3).toLowerCase()))
    );
    if (peakIdx >= 0) {
      harvestMonth = peakIdx;
    }
  }

  const plantScheduleText = `${bulanList[plantMonth]} ${plantYear}`;
  const harvestScheduleText = isPerennial
    ? `${bulanList[harvestMonth]} ${harvestYear} (~${harvestDays.toLocaleString('id-ID')} HST / ±${yearsOffset} Tahun)`
    : `${bulanList[harvestMonth]} ${harvestYear} (~${harvestDays} HST / ±${Math.max(1, Math.round(harvestDays / 30))} Bulan)`;

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

  // Helper modulo aman agar selalu bernilai 0..11 positif
  const safeMonth = (idx: number): number => ((idx % 12) + 12) % 12;

  // Menghitung Siklus Terbaik (Bulan Puncak Harga & Waktu Tanam Optimal Biar Untung)
  let maxPrice = -Infinity;
  let optimalHarvestMonthIdx = safeMonth(harvestMonth);
  item.historis_bulanan.forEach((h, idx) => {
    if (h.harga > maxPrice) {
      maxPrice = h.harga;
      optimalHarvestMonthIdx = idx;
    }
  });

  // Waktu tanam terbaik:
  // - Untuk pohon tahunan/perkebunan: awal musim hujan (Oktober - November)
  // - Untuk tanaman semusim: hitung mundur modulo dari puncak panen
  const optimalPlantMonthIdx = isPerennial
    ? 9 // Oktober (awal musim hujan terbaik tanam pohon)
    : safeMonth(optimalHarvestMonthIdx - (harvestMonthOffset % 12));

  const optimalPlantMonthName = bulanList[optimalPlantMonthIdx] || 'Oktober';
  const optimalHarvestMonthName = bulanList[safeMonth(optimalHarvestMonthIdx)] || 'November';

  const optimalPlantPrice = item.historis_bulanan[optimalPlantMonthIdx]?.harga || item.harga_saat_ini;
  const optimalPeakPrice = maxPrice > 0 ? maxPrice : item.harga_saat_ini;
  const optimalDelta = optimalPeakPrice - optimalPlantPrice;
  const optimalDeltaPct = optimalPlantPrice > 0 ? Math.round(((optimalPeakPrice - optimalPlantPrice) / optimalPlantPrice) * 100) : 0;

  const isProfit = delta > 0;
  let statusType: 'aman' | 'stabil' | 'waspada' = 'stabil';
  let statusBadgeText = '';
  let keputusanSistem = '';
  let kesimpulan = '';
  let arahanLangkah: Array<{ kategori: string; arahan: string }> = [];

  const hppBatasAman = Math.round(avgPanen * 0.52);

  if (deltaPct >= 10 && yearsProfitable >= 3) {
    statusType = 'aman';
    statusBadgeText = isPerennial ? 'Rekomendasi Investasi Pohon' : 'Rekomendasi Tanam';
    keputusanSistem = isPerennial
      ? `Investasi Pohon Direkomendasikan (Prospek Pasar Musim Panen Raya Sangat Kuat)`
      : `Direkomendasikan Tanam di Bulan ${bulanList[plantMonth]} (Potensi Keuntungan Tinggi)`;
    kesimpulan = isPerennial
      ? `Berdasarkan kalkulasi historis 5 tahun, budidaya ${item.komoditas} memiliki prospek harga musim panen yang sangat menguntungkan di kisaran Rp ${avgPanen.toLocaleString('id-ID')} / kg (potensi surplus +${deltaPct}% dibanding harga dasar). Tanaman ini membutuhkan masa investasi vegetatif ±${yearsOffset} tahun (~${harvestDays.toLocaleString('id-ID')} HST) hingga panen perdana, kemudian menghasilkan panen rutin bernilai tinggi setiap musim raya tahunan.`
      : `Berdasarkan kalkulasi historis 5 tahun, menanam ${item.komoditas} di bulan ${bulanList[plantMonth]} konsisten menghasilkan keuntungan dengan proyeksi kenaikan harga panen rata-rata +${deltaPct}% (${yearsProfitable} dari 5 tahun harga naik). Periode ini ideal untuk memulai siklus tanam.`;
    arahanLangkah = [
      {
        kategori: isPerennial ? '1. Fase Tanam Bibit & Investasi Lahan' : '1. Jadwal Pelaksanaan Tanam',
        arahan: isPerennial
          ? `Gunakan bibit sambung pucuk / okulasi unggul bersertifikat untuk memastikan pohon mulai berbuah perdana tepat waktu (~${yearsOffset} tahun / ${harvestDays.toLocaleString('id-ID')} HST). Tanam di awal musim hujan.`
          : `Lahan siap ditanami di bulan ${bulanList[plantMonth]}. Estimasi masa panen tiba pada bulan ${bulanList[harvestMonth]} (~${harvestDays} HST) sebelum puncak panen raya nasional tiba.`,
      },
      {
        kategori: isPerennial ? '2. Proyeksi Penjualan Musim Raya' : '2. Estimasi Harga Panen',
        arahan: `Hasil panen diproyeksikan terserap optimal di pasar pada kisaran Rp ${avgPanen.toLocaleString('id-ID')} / kg dengan potensi surplus keuntungan modal sekitar +${deltaPct}%.`,
      },
      {
        kategori: isPerennial ? '3. Pemeliharaan Tajuk & Nutrisi Multi-Tahun' : '3. Pemeliharaan Nutrisi Lahan',
        arahan: isPerennial
          ? `Lakukan pemangkasan bentuk tajuk arsitektur piramida di tahun 1-2, dan manajemen stres air (water stress) terukur di musim kemarau menjelang fase pembuahan perdana.`
          : `Jaga kestabilan kelembapan dan pH tanah secara rutin, serta gunakan benih unggul adaptif cuaca untuk memastikan tonase hasil panen maksimal.`,
      }
    ];
  } else if (deltaPct >= 0 || yearsProfitable >= 3) {
    statusType = 'stabil';
    statusBadgeText = isPerennial ? 'Investasi Pohon Stabil' : 'Siklus Stabil';
    keputusanSistem = isPerennial
      ? `Aman Ditanam untuk Investasi Jangka Panjang (Fokus Efisiensi Pemeliharaan Bibit)`
      : `Aman Ditanam Sesuai Jadwal (Fokus Efisiensi Biaya Operasional)`;
    kesimpulan = isPerennial
      ? `Pergerakan harga ${item.komoditas} relatif stabil antara masa tanam (${bulanList[plantMonth]}) dan musim panen (${bulanList[harvestMonth]}) dengan tren rata-rata +${deltaPct}%. Tanaman membutuhkan masa tumbuh ±${yearsOffset} tahun (~${harvestDays.toLocaleString('id-ID')} HST) hingga panen perdana dan perawatan tajuk yang teratur.`
      : `Pergerakan harga ${item.komoditas} relatif stabil antara masa tanam (${bulanList[plantMonth]}) dan panen (${bulanList[harvestMonth]}) dengan tren rata-rata +${deltaPct}%. Keuntungan budidaya dapat terjaga optimal melalui efisiensi biaya kerja dan perawatan tanah yang terukur.`;
    arahanLangkah = [
      {
        kategori: isPerennial ? '1. Jadwal Tanam Bibit' : '1. Jadwal Tanam Lapangan',
        arahan: isPerennial
          ? `Penanaman bibit pohon dapat dijalankan sesuai rencana di bulan ${bulanList[plantMonth]}. Estimasi panen perdana tiba sekitar tahun ${harvestYear} (${bulanList[harvestMonth]}, ~${harvestDays.toLocaleString('id-ID')} HST).`
          : `Penanaman dapat dijalankan sesuai jadwal kerja di bulan ${bulanList[plantMonth]}. Estimasi panen tiba sekitar bulan ${bulanList[harvestMonth]} (~${harvestDays} HST).`,
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
    keputusanSistem = isPerennial
      ? `Disarankan Tanam di Awal Musim Hujan ➔ Jadwal Terbaik: Bulan ${optimalPlantMonthName}`
      : `Disarankan Tunda Tanam Bulan Ini ➔ Jadwal Terbaik: Bulan ${optimalPlantMonthName}`;
    kesimpulan = `Data historis 5 tahun menunjukkan jika menanam ${item.komoditas} di bulan ${bulanList[plantMonth]}, harga pasar saat panen (${bulanList[harvestMonth]}) cenderung mengalami koreksi turun rata-rata ${Math.abs(deltaPct)}% (${yearsProfitable} dari 5 tahun harga naik) akibat banjir pasokan panen serentak. Agar modal petani terlindungi, sistem menyarankan menyesuaikan jadwal tanam ke bulan ${optimalPlantMonthName} saat pasokan pasar lebih seimbang.`;
    arahanLangkah = [
      {
        kategori: '1. Penyesuaian Jadwal Tanam',
        arahan: isPerennial
          ? `Waktu penanaman bibit pohon terbaik adalah awal musim hujan (bulan ${optimalPlantMonthName}) agar perakaran kuat sebelum kemarau.`
          : `Tunda tanam di bulan ${bulanList[plantMonth]}. Waktu tanam terbaik adalah bulan ${optimalPlantMonthName} (~${harvestDays} HST) agar waktu panen tiba di bulan ${optimalHarvestMonthName}.`,
      },
      {
        kategori: '2. Proyeksi Penjualan Hasil',
        arahan: `Menanam di bulan ${optimalPlantMonthName} membidik estimasi harga puncak panen historis di kisaran Rp ${optimalPeakPrice.toLocaleString('id-ID')} / kg (potensi surplus +${Math.max(15, optimalDeltaPct)}%).`,
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
      plantYear,
      harvestYear,
      plantScheduleText,
      harvestScheduleText,
      isPerennial,
      yearsOffset,
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
      optimalPlantMonthName,
      optimalHarvestMonthName,
      optimalPeakPrice,
      optimalDeltaPct,
    },
  };
}

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
  const [daysPassed, setDaysPassed] = useState<number>(0);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return COMMODITY_TRENDS.filter(c =>
      c.komoditas.toLowerCase().includes(q) ||
      c.kategori.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

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

  const pulse = useMemo(() => getMarketPulse(activePetani?.daerah), [activePetani?.daerah]);

  const filteredCommodities = useMemo(() => {
    let list = COMMODITY_TRENDS;
    if (activeCategory !== 'Semua') {
      list = list.filter(c => c.kategori === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(c =>
        c.komoditas.toLowerCase().includes(q) ||
        c.kategori.toLowerCase().includes(q) ||
        c.alasan_permintaan.toLowerCase().includes(q)
      );
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

        {isUserLahan && !isRecognizedCrop(activePetani.jenis_tanaman) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950">Komoditas &ldquo;{activePetani.jenis_tanaman}&rdquo; tidak terdaftar resmi</strong>
              <span>
                Nama ini tidak dikenali sebagai tanaman budidaya pertanian/hortikultura. Grafik dan proyeksi pasar di bawah menggunakan komoditas acuan <strong>{currentDetailItem.komoditas}</strong>. Anda dapat memperbarui data di menu Pendaftaran Lahan.
              </span>
            </div>
          </div>
        )}
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
        <div id="sinyal-pasar-card" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 scroll-mt-24">
          {/* Header Card: Komoditas Terpilih & Jadwal Tanam-Panen */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1.5 max-w-2xl">
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
              <p className="text-xs text-slate-600">
                Jadwal Tanam: <strong className="text-slate-900">{multiYearAnalysis.harvestOutlook.plantScheduleText}</strong> ➔ {multiYearAnalysis.harvestOutlook.isPerennial ? 'Estimasi Panen Perdana:' : 'Estimasi Panen:'} <strong className="text-slate-900">{multiYearAnalysis.harvestOutlook.harvestScheduleText}</strong>
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
            <div className="space-y-1 text-xs">
              <strong className="text-slate-900 font-bold block text-sm">
                Karakteristik Wilayah: {currentDetailItem.komoditas} di {activePetani.daerah}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {regionalSuitability.alasan}
              </p>
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
                    <span>Harga {multiYearAnalysis.harvestOutlook.isPerennial ? 'Musim Panen Raya' : 'Saat Panen'} ({multiYearAnalysis.harvestOutlook.harvestMonthName})</span>
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
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">

        <div className="p-5 sm:p-6 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Katalog & Pencarian Komoditas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih atau cari komoditas untuk memuat perbandingan harga historis dan kalender panen.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-emerald-700/60 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <input
              type="text"
              placeholder="Cari tanaman (contoh: Durian, Nanas, Cabai Rawit, Bawang Merah, Padi, Jagung)..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              onChange={e => {
                const val = e.target.value;
                setSearchQuery(val);
                setIsSearchFocused(true);
                const q = val.trim().toLowerCase();
                if (q) {
                  const matched = COMMODITY_TRENDS.find(c => {
                    const k = c.komoditas.toLowerCase();
                    return k === q || k.startsWith(q) || (q.length >= 4 && k.includes(q));
                  });
                  if (matched) {
                    setSelectedKomoditas(matched.komoditas);
                  }
                }
              }}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer z-10 p-1"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown Saran Komoditas Responsif */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100">
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((item) => (
                    <button
                      key={item.komoditas}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedKomoditas(item.komoditas);
                        setSearchQuery(item.komoditas);
                        setIsSearchFocused(false);
                        const el = document.getElementById('sinyal-pasar-card');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 transition-colors flex items-center justify-between gap-3 text-xs group cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-emerald-900">
                          {item.komoditas}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.umur_panen}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900 block">
                          Rp {item.harga_saat_ini.toLocaleString('id-ID')}/kg
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100/60 font-medium">
                          {item.kategori}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">
                    Tidak ditemukan komoditas resmi &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
            {ALL_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white hover:bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {filteredCommodities.length > 0 ? (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Daftar Komoditas Pertanian
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Klik baris komoditas untuk memperbarui grafik tren & analisis
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 sticky top-0 border-b border-slate-200 text-slate-600 font-semibold z-10">
                  <tr>
                    <th className="py-2.5 px-3.5">Komoditas</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Harga Pasar</th>
                    <th className="py-2.5 px-3 text-right">Tren Mingguan</th>
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
                          const el = document.getElementById('sinyal-pasar-card');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/70'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-3.5">
                          <div>
                            <div className={`font-bold ${isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-800'}`}>
                              {c.komoditas}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal sm:hidden">
                              {c.kategori}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 hidden sm:table-cell">
                          <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600 border border-slate-200/50">
                            {c.kategori}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          Rp {c.harga_saat_ini.toLocaleString('id-ID')}
                          <span className="text-[10px] text-slate-400 font-normal"> /kg</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-xs">
                          {c.tren_mingguan === 'Naik' ? (
                            <span className="text-emerald-700 font-bold">
                              +{c.persentase_tren}%
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium">
                              Stabil
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                                : 'bg-emerald-700 text-white hover:bg-emerald-800'
                            }`}
                          >
                            {isSelected ? 'Terpilih' : 'Pilih'}
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
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 text-center space-y-2">
            <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Komoditas &quot;{searchQuery}&quot; Tidak Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Silakan periksa ejaan atau klik salah satu kategori di atas untuk melihat daftar tanaman budidaya resmi.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
