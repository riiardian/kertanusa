import { MarketCommodityTrend } from './types';

export const COMMODITY_TRENDS: MarketCommodityTrend[] = [
  {
    komoditas: 'Cabai Rawit Merah',
    harga_saat_ini: 78500,
    tren_mingguan: 'Naik',
    persentase_tren: 14.5,
    musim_puncak: 'Maret - Mei (Ramadhan/Idul Fitri) & Desember (Tahun Baru)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Mei', 'Desember'],
    alasan_permintaan: 'Kebutuhan bumbu masakan rumah tangga dan katering melonjak 300% menjelang hari raya besar nasional dan perayaan akhir tahun.',
    rekomendasi_waktu_tanam: 'Tanam pada pertengahan Januari untuk panen raya saat Ramadhan/Idul Fitri, atau tanam pada September untuk panen di bulan Desember.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 55000, indeks_daya_beli: 70 },
      { bulan: 'Feb', harga: 62000, indeks_daya_beli: 78 },
      { bulan: 'Mar', harga: 85000, indeks_daya_beli: 95 },
      { bulan: 'Apr', harga: 92000, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 74000, indeks_daya_beli: 82 },
      { bulan: 'Jun', harga: 48000, indeks_daya_beli: 60 },
      { bulan: 'Jul', harga: 42000, indeks_daya_beli: 52 },
      { bulan: 'Ags', harga: 45000, indeks_daya_beli: 55 },
      { bulan: 'Sep', harga: 51000, indeks_daya_beli: 65 },
      { bulan: 'Okt', harga: 63000, indeks_daya_beli: 75 },
      { bulan: 'Nov', harga: 72000, indeks_daya_beli: 88 },
      { bulan: 'Des', harga: 88000, indeks_daya_beli: 98 }
    ]
  },
  {
    komoditas: 'Bawang Merah',
    harga_saat_ini: 42000,
    tren_mingguan: 'Naik',
    persentase_tren: 8.2,
    musim_puncak: 'April - Juni (Musim Hajatan/Idul Adha)',
    bulan_harga_tertinggi: ['April', 'Mei', 'Juni', 'November'],
    alasan_permintaan: 'Peningkatan konsumsi rumah makan, industri bawang goreng, dan musim pesta pernikahan pedesaan (bulan Syawal & Dzulhijjah).',
    rekomendasi_waktu_tanam: 'Tanam pada akhir Februari atau awal Maret agar panen melimpah saat harga stabil di kisaran Rp 45.000 - 55.000/kg.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 32000, indeks_daya_beli: 62 },
      { bulan: 'Feb', harga: 35000, indeks_daya_beli: 68 },
      { bulan: 'Mar', harga: 41000, indeks_daya_beli: 80 },
      { bulan: 'Apr', harga: 49000, indeks_daya_beli: 94 },
      { bulan: 'Mei', harga: 53000, indeks_daya_beli: 98 },
      { bulan: 'Jun', harga: 46000, indeks_daya_beli: 85 },
      { bulan: 'Jul', harga: 30000, indeks_daya_beli: 58 },
      { bulan: 'Ags', harga: 28000, indeks_daya_beli: 50 },
      { bulan: 'Sep', harga: 31000, indeks_daya_beli: 55 },
      { bulan: 'Okt', harga: 36000, indeks_daya_beli: 65 },
      { bulan: 'Nov', harga: 44000, indeks_daya_beli: 82 },
      { bulan: 'Des', harga: 46000, indeks_daya_beli: 86 }
    ]
  },
  {
    komoditas: 'Tomat Sayur',
    harga_saat_ini: 18500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Januari - Maret (Musim Hujan Basah)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Produksi di sentra dataran tinggi menurun akibat serangan jamur busuk daun saat hujan tinggi, memicu kelangkaan pasokan di pasar induk perkotaan.',
    rekomendasi_waktu_tanam: 'Gunakan naungan paranet/agrivoltaik dan tanam di awal November untuk memanen buah segar mulus di Januari-Februari saat harga melambung tinggi.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 22000, indeks_daya_beli: 90 },
      { bulan: 'Feb', harga: 24000, indeks_daya_beli: 95 },
      { bulan: 'Mar', harga: 19000, indeks_daya_beli: 82 },
      { bulan: 'Apr', harga: 14000, indeks_daya_beli: 65 },
      { bulan: 'Mei', harga: 12000, indeks_daya_beli: 55 },
      { bulan: 'Jun', harga: 8000, indeks_daya_beli: 40 },
      { bulan: 'Jul', harga: 7000, indeks_daya_beli: 35 },
      { bulan: 'Ags', harga: 9000, indeks_daya_beli: 45 },
      { bulan: 'Sep', harga: 11000, indeks_daya_beli: 52 },
      { bulan: 'Okt', harga: 13000, indeks_daya_beli: 60 },
      { bulan: 'Nov', harga: 16000, indeks_daya_beli: 75 },
      { bulan: 'Des', harga: 21000, indeks_daya_beli: 88 }
    ]
  },
  {
    komoditas: 'Jagung Manis',
    harga_saat_ini: 9500,
    tren_mingguan: 'Naik',
    persentase_tren: 5.0,
    musim_puncak: 'Desember (Tahun Baru & Wisata Kuliner)',
    bulan_harga_tertinggi: ['Desember', 'Januari', 'Juli'],
    alasan_permintaan: 'Konsumsi jagung bakar dan pasar wisata malam tahun baru menyerap pasokan dalam jumlah masif.',
    rekomendasi_waktu_tanam: 'Tanam pada minggu ketiga Oktober agar tongkol jagung masak susu siap petik di tanggal 25-30 Desember.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 9000, indeks_daya_beli: 80 },
      { bulan: 'Feb', harga: 7500, indeks_daya_beli: 60 },
      { bulan: 'Mar', harga: 7000, indeks_daya_beli: 55 },
      { bulan: 'Apr', harga: 7200, indeks_daya_beli: 58 },
      { bulan: 'Mei', harga: 7800, indeks_daya_beli: 65 },
      { bulan: 'Jun', harga: 8200, indeks_daya_beli: 70 },
      { bulan: 'Jul', harga: 8800, indeks_daya_beli: 75 },
      { bulan: 'Ags', harga: 7500, indeks_daya_beli: 60 },
      { bulan: 'Sep', harga: 7200, indeks_daya_beli: 56 },
      { bulan: 'Okt', harga: 7600, indeks_daya_beli: 62 },
      { bulan: 'Nov', harga: 8500, indeks_daya_beli: 72 },
      { bulan: 'Des', harga: 12000, indeks_daya_beli: 100 }
    ]
  },
  {
    komoditas: 'Padi Sawah',
    harga_saat_ini: 7200,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.3,
    musim_puncak: 'Desember - Februari (Paceklik Pra-Panen) & Ramadhan',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Kebutuhan pokok beras stabil tinggi dengan kenaikan harga gabah kering panen (GKP) saat masa tunggu tanam musim rendengan.',
    rekomendasi_waktu_tanam: 'Tanam serentak pada awal musim hujan (November) untuk mengamankan panen raya di Februari-Maret dengan harga serapan Bulog optimal.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 7400, indeks_daya_beli: 92 },
      { bulan: 'Feb', harga: 7600, indeks_daya_beli: 96 },
      { bulan: 'Mar', harga: 7100, indeks_daya_beli: 88 },
      { bulan: 'Apr', harga: 6800, indeks_daya_beli: 75 },
      { bulan: 'Mei', harga: 6700, indeks_daya_beli: 70 },
      { bulan: 'Jun', harga: 6850, indeks_daya_beli: 74 },
      { bulan: 'Jul', harga: 6900, indeks_daya_beli: 78 },
      { bulan: 'Ags', harga: 7000, indeks_daya_beli: 82 },
      { bulan: 'Sep', harga: 7100, indeks_daya_beli: 85 },
      { bulan: 'Okt', harga: 7200, indeks_daya_beli: 88 },
      { bulan: 'Nov', harga: 7350, indeks_daya_beli: 90 },
      { bulan: 'Des', harga: 7550, indeks_daya_beli: 95 }
    ]
  },
  {
    komoditas: 'Jeruk (Siam / Keprok)',
    harga_saat_ini: 16500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.8,
    musim_puncak: 'Juni - Agustus (Musim Kemarau/Manis Optimal) & Imlek/Tahun Baru',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Agustus', 'Januari'],
    alasan_permintaan: 'Konsumsi buah segar harian keluarga perkotaan, industri perasan sari buah, dan pasokan ritel modern supermarket stabil tinggi.',
    rekomendasi_waktu_tanam: 'Pemupukan NPK berimbang dan pengairan teratur di musim kemarau untuk memaksimalkan kadar kemanisan (brix) dan ukuran buah seragam.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 18000, indeks_daya_beli: 90 },
      { bulan: 'Feb', harga: 16000, indeks_daya_beli: 80 },
      { bulan: 'Mar', harga: 14500, indeks_daya_beli: 72 },
      { bulan: 'Apr', harga: 15000, indeks_daya_beli: 75 },
      { bulan: 'Mei', harga: 16000, indeks_daya_beli: 80 },
      { bulan: 'Jun', harga: 18500, indeks_daya_beli: 92 },
      { bulan: 'Jul', harga: 19500, indeks_daya_beli: 98 },
      { bulan: 'Ags', harga: 19000, indeks_daya_beli: 95 },
      { bulan: 'Sep', harga: 16500, indeks_daya_beli: 82 },
      { bulan: 'Okt', harga: 15000, indeks_daya_beli: 74 },
      { bulan: 'Nov', harga: 16000, indeks_daya_beli: 80 },
      { bulan: 'Des', harga: 17500, indeks_daya_beli: 88 }
    ]
  },
  {
    komoditas: 'Cokelat / Kakao',
    harga_saat_ini: 82000,
    tren_mingguan: 'Naik',
    persentase_tren: 12.3,
    musim_puncak: 'Sepanjang Tahun (Defisit Pasokan Global & Industri Ekspor)',
    bulan_harga_tertinggi: ['Maret', 'April', 'September', 'Oktober', 'November'],
    alasan_permintaan: 'Penurunan panen kakao global di Afrika Barat memicu perebutan pasokan biji kakao fermentasi berkualitas tinggi oleh pabrik pengolahan cokelat dunia.',
    rekomendasi_waktu_tanam: 'Tanam bibit klon sambung pucuk unggul toleran VSD (Vascular Streak Dieback) serta lakukan pemangkasan sanitasi berkala pasca-panen.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 72000, indeks_daya_beli: 82 },
      { bulan: 'Feb', harga: 75000, indeks_daya_beli: 85 },
      { bulan: 'Mar', harga: 84000, indeks_daya_beli: 94 },
      { bulan: 'Apr', harga: 88000, indeks_daya_beli: 98 },
      { bulan: 'Mei', harga: 78000, indeks_daya_beli: 88 },
      { bulan: 'Jun', harga: 76000, indeks_daya_beli: 86 },
      { bulan: 'Jul', harga: 79000, indeks_daya_beli: 90 },
      { bulan: 'Ags', harga: 81000, indeks_daya_beli: 92 },
      { bulan: 'Sep', harga: 86000, indeks_daya_beli: 96 },
      { bulan: 'Okt', harga: 89000, indeks_daya_beli: 100 },
      { bulan: 'Nov', harga: 85000, indeks_daya_beli: 95 },
      { bulan: 'Des', harga: 82000, indeks_daya_beli: 93 }
    ]
  },
  {
    komoditas: 'Anggur',
    harga_saat_ini: 65000,
    tren_mingguan: 'Stabil',
    persentase_tren: 3.5,
    musim_puncak: 'Juni - Oktober (Kemarau Terik / Manis Maksimal) & Libur Akhir Tahun',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Agustus', 'September', 'Desember'],
    alasan_permintaan: 'Pasar anggur meja segar petik langsung kebun dan pasar buah premium perkotaan menawarkan margin keuntungan tinggi dengan kepastian pembeli tetap.',
    rekomendasi_waktu_tanam: 'Budidayakan dengan naungan atap plastik UV dan lakukan pemangkasan pembuahan teratur di awal musim kemarau saat fotosintesis maksimal.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 58000, indeks_daya_beli: 75 },
      { bulan: 'Feb', harga: 55000, indeks_daya_beli: 70 },
      { bulan: 'Mar', harga: 60000, indeks_daya_beli: 78 },
      { bulan: 'Apr', harga: 62000, indeks_daya_beli: 80 },
      { bulan: 'Mei', harga: 65000, indeks_daya_beli: 84 },
      { bulan: 'Jun', harga: 72000, indeks_daya_beli: 92 },
      { bulan: 'Jul', harga: 75000, indeks_daya_beli: 98 },
      { bulan: 'Ags', harga: 74000, indeks_daya_beli: 96 },
      { bulan: 'Sep', harga: 70000, indeks_daya_beli: 90 },
      { bulan: 'Okt', harga: 68000, indeks_daya_beli: 88 },
      { bulan: 'Nov', harga: 64000, indeks_daya_beli: 82 },
      { bulan: 'Des', harga: 72000, indeks_daya_beli: 94 }
    ]
  }
];

export function calculateProfitProjection(luasM2: number, komoditas: string) {
  // Estimasi yield rata-rata per m2
  const yieldPerM2: Record<string, { kg: number, biayaPerM2: number, hargaDefault: number }> = {
    'Cabai Rawit Merah': { kg: 0.9, biayaPerM2: 24000, hargaDefault: 75000 },
    'Bawang Merah': { kg: 1.2, biayaPerM2: 22000, hargaDefault: 42000 },
    'Tomat Sayur': { kg: 2.5, biayaPerM2: 20000, hargaDefault: 18000 },
    'Tomat': { kg: 2.5, biayaPerM2: 20000, hargaDefault: 18000 },
    'Jagung Manis': { kg: 1.8, biayaPerM2: 8000, hargaDefault: 9500 },
    'Jagung': { kg: 1.8, biayaPerM2: 8000, hargaDefault: 9500 },
    'Padi Sawah': { kg: 0.6, biayaPerM2: 4500, hargaDefault: 7200 },
    'Padi Sawah (Ciherang/Inpari)': { kg: 0.6, biayaPerM2: 4500, hargaDefault: 7200 },
    'Padi': { kg: 0.6, biayaPerM2: 4500, hargaDefault: 7200 },
    'Jeruk (Siam / Keprok)': { kg: 1.5, biayaPerM2: 7000, hargaDefault: 16500 },
    'Jeruk': { kg: 1.5, biayaPerM2: 7000, hargaDefault: 16500 },
    'Cokelat / Kakao': { kg: 0.25, biayaPerM2: 5000, hargaDefault: 82000 },
    'Cokelat': { kg: 0.25, biayaPerM2: 5000, hargaDefault: 82000 },
    'Kakao': { kg: 0.25, biayaPerM2: 5000, hargaDefault: 82000 },
    'Anggur': { kg: 1.2, biayaPerM2: 28000, hargaDefault: 65000 }
  };

  const item = yieldPerM2[komoditas] || yieldPerM2['Bawang Merah'] || yieldPerM2['Cabai Rawit Merah'];
  const totalPanenKg = Math.round(luasM2 * item.kg);
  const totalBiayaProduksi = Math.round(luasM2 * item.biayaPerM2);
  const totalOmset = Math.round(totalPanenKg * item.hargaDefault);
  const labaBersih = totalOmset - totalBiayaProduksi;
  const roi = Math.round((labaBersih / (totalBiayaProduksi || 1)) * 100);

  return {
    totalPanenKg,
    totalBiayaProduksi,
    totalOmset,
    labaBersih,
    roi
  };
}
