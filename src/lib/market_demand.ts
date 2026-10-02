import { MarketCommodityTrend } from './types';

export type CommodityCategory = 'Tanaman Pangan' | 'Sayuran' | 'Buah-Buahan' | 'Rempah & Bumbu' | 'Perkebunan' | 'Tanaman Obat';

export interface MarketCommodityTrendExtended extends MarketCommodityTrend {
  kategori: CommodityCategory;
  icon: string;
}

export const COMMODITY_TRENDS: MarketCommodityTrendExtended[] = [
  // ==================== TANAMAN PANGAN ====================
  {
    komoditas: 'Padi Sawah',
    kategori: 'Tanaman Pangan',
    icon: '🌾',
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
    komoditas: 'Jagung Manis',
    kategori: 'Tanaman Pangan',
    icon: '🌽',
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
    komoditas: 'Ubi Kayu / Singkong',
    kategori: 'Tanaman Pangan',
    icon: '🍠',
    harga_saat_ini: 3200,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Sepanjang Tahun (Kebutuhan Industri Tapioka)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Juli', 'Agustus'],
    alasan_permintaan: 'Industri tapioka, tepung mocaf, dan pabrik bioetanol menyerap panen singkong sepanjang tahun dengan volume konstan.',
    rekomendasi_waktu_tanam: 'Tanam di awal musim hujan (Oktober-November) untuk panen 8-10 bulan kemudian saat harga tapioka naik.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 3500, indeks_daya_beli: 85 },
      { bulan: 'Feb', harga: 3400, indeks_daya_beli: 82 },
      { bulan: 'Mar', harga: 3000, indeks_daya_beli: 70 },
      { bulan: 'Apr', harga: 2900, indeks_daya_beli: 65 },
      { bulan: 'Mei', harga: 2800, indeks_daya_beli: 60 },
      { bulan: 'Jun', harga: 2900, indeks_daya_beli: 65 },
      { bulan: 'Jul', harga: 3200, indeks_daya_beli: 78 },
      { bulan: 'Ags', harga: 3400, indeks_daya_beli: 82 },
      { bulan: 'Sep', harga: 3300, indeks_daya_beli: 80 },
      { bulan: 'Okt', harga: 3100, indeks_daya_beli: 75 },
      { bulan: 'Nov', harga: 3200, indeks_daya_beli: 78 },
      { bulan: 'Des', harga: 3400, indeks_daya_beli: 82 }
    ]
  },
  {
    komoditas: 'Ubi Jalar',
    kategori: 'Tanaman Pangan',
    icon: '🍠',
    harga_saat_ini: 5500,
    tren_mingguan: 'Naik',
    persentase_tren: 3.2,
    musim_puncak: 'Oktober - Januari (Musim Dingin / Permintaan Makanan Tradisional)',
    bulan_harga_tertinggi: ['Oktober', 'November', 'Desember', 'Januari'],
    alasan_permintaan: 'Tren pangan sehat dan organik mendongkrak permintaan ubi jalar ungu dan kuning untuk olahan modern dan camilan premium.',
    rekomendasi_waktu_tanam: 'Tanam pada Juli-Agustus agar panen raya tepat pada Oktober-Desember saat pasar tradisional dan modern membutuhkan pasokan tinggi.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 5800, indeks_daya_beli: 82 },
      { bulan: 'Feb', harga: 5200, indeks_daya_beli: 72 },
      { bulan: 'Mar', harga: 4800, indeks_daya_beli: 62 },
      { bulan: 'Apr', harga: 4500, indeks_daya_beli: 55 },
      { bulan: 'Mei', harga: 4500, indeks_daya_beli: 55 },
      { bulan: 'Jun', harga: 4800, indeks_daya_beli: 62 },
      { bulan: 'Jul', harga: 5200, indeks_daya_beli: 72 },
      { bulan: 'Ags', harga: 5500, indeks_daya_beli: 76 },
      { bulan: 'Sep', harga: 5800, indeks_daya_beli: 82 },
      { bulan: 'Okt', harga: 6500, indeks_daya_beli: 92 },
      { bulan: 'Nov', harga: 7000, indeks_daya_beli: 100 },
      { bulan: 'Des', harga: 6800, indeks_daya_beli: 96 }
    ]
  },
  {
    komoditas: 'Kedelai',
    kategori: 'Tanaman Pangan',
    icon: '🫘',
    harga_saat_ini: 11500,
    tren_mingguan: 'Naik',
    persentase_tren: 6.5,
    musim_puncak: 'Ramadhan & Lebaran (Kebutuhan Tempe-Tahu Nasional)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Mei', 'Juni'],
    alasan_permintaan: 'Kebutuhan kedelai untuk industri tempe dan tahu melonjak saat Ramadhan. Produksi lokal hanya memenuhi 30% kebutuhan nasional sehingga harga lokal premium.',
    rekomendasi_waktu_tanam: 'Tanam pada Januari-Februari dengan varietas Anjasmoro untuk panen tepat menjelang Ramadhan saat harga kedelai lokal tertinggi.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 10500, indeks_daya_beli: 80 },
      { bulan: 'Feb', harga: 11000, indeks_daya_beli: 85 },
      { bulan: 'Mar', harga: 12500, indeks_daya_beli: 96 },
      { bulan: 'Apr', harga: 13000, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 12000, indeks_daya_beli: 92 },
      { bulan: 'Jun', harga: 11500, indeks_daya_beli: 88 },
      { bulan: 'Jul', harga: 10800, indeks_daya_beli: 82 },
      { bulan: 'Ags', harga: 10500, indeks_daya_beli: 80 },
      { bulan: 'Sep', harga: 10800, indeks_daya_beli: 82 },
      { bulan: 'Okt', harga: 11000, indeks_daya_beli: 85 },
      { bulan: 'Nov', harga: 11200, indeks_daya_beli: 86 },
      { bulan: 'Des', harga: 11500, indeks_daya_beli: 88 }
    ]
  },
  {
    komoditas: 'Kacang Tanah',
    kategori: 'Tanaman Pangan',
    icon: '🥜',
    harga_saat_ini: 18000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.1,
    musim_puncak: 'Januari - Maret & Idul Fitri (Industri Kacang Goreng & Bumbu)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'April'],
    alasan_permintaan: 'Kebutuhan industri bumbu kacang satay, permen kacang, dan kacang goreng ritel menyerap panen lokal di luar pasokan impor.',
    rekomendasi_waktu_tanam: 'Tanam pada Oktober-November di lahan kering atau tegalan untuk panen Januari-Februari saat harga puncak kacang lokal.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 20000, indeks_daya_beli: 95 },
      { bulan: 'Feb', harga: 21000, indeks_daya_beli: 100 },
      { bulan: 'Mar', harga: 19500, indeks_daya_beli: 92 },
      { bulan: 'Apr', harga: 19000, indeks_daya_beli: 90 },
      { bulan: 'Mei', harga: 17500, indeks_daya_beli: 82 },
      { bulan: 'Jun', harga: 16500, indeks_daya_beli: 78 },
      { bulan: 'Jul', harga: 16000, indeks_daya_beli: 75 },
      { bulan: 'Ags', harga: 16500, indeks_daya_beli: 78 },
      { bulan: 'Sep', harga: 17000, indeks_daya_beli: 80 },
      { bulan: 'Okt', harga: 17500, indeks_daya_beli: 82 },
      { bulan: 'Nov', harga: 18000, indeks_daya_beli: 85 },
      { bulan: 'Des', harga: 19500, indeks_daya_beli: 92 }
    ]
  },

  // ==================== SAYURAN ====================
  {
    komoditas: 'Cabai Rawit Merah',
    kategori: 'Sayuran',
    icon: '🌶️',
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
    komoditas: 'Cabai Merah Besar',
    kategori: 'Sayuran',
    icon: '🫑',
    harga_saat_ini: 52000,
    tren_mingguan: 'Naik',
    persentase_tren: 9.2,
    musim_puncak: 'Maret - Mei & November - Desember',
    bulan_harga_tertinggi: ['Maret', 'April', 'November', 'Desember'],
    alasan_permintaan: 'Industri saus sambal botolan, mi instan, dan katering hotel menyerap cabai merah besar dalam jumlah besar dan konsisten sepanjang tahun.',
    rekomendasi_waktu_tanam: 'Tanam pada akhir Januari menggunakan mulsa plastik perak untuk menjaga kelembapan dan panen optimal pada April-Mei.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 42000, indeks_daya_beli: 68 },
      { bulan: 'Feb', harga: 48000, indeks_daya_beli: 78 },
      { bulan: 'Mar', harga: 65000, indeks_daya_beli: 95 },
      { bulan: 'Apr', harga: 68000, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 55000, indeks_daya_beli: 82 },
      { bulan: 'Jun', harga: 38000, indeks_daya_beli: 58 },
      { bulan: 'Jul', harga: 32000, indeks_daya_beli: 48 },
      { bulan: 'Ags', harga: 35000, indeks_daya_beli: 52 },
      { bulan: 'Sep', harga: 38000, indeks_daya_beli: 58 },
      { bulan: 'Okt', harga: 45000, indeks_daya_beli: 70 },
      { bulan: 'Nov', harga: 58000, indeks_daya_beli: 88 },
      { bulan: 'Des', harga: 62000, indeks_daya_beli: 92 }
    ]
  },
  {
    komoditas: 'Bawang Merah',
    kategori: 'Sayuran',
    icon: '🧅',
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
    komoditas: 'Bawang Putih',
    kategori: 'Sayuran',
    icon: '🧄',
    harga_saat_ini: 38000,
    tren_mingguan: 'Stabil',
    persentase_tren: 3.5,
    musim_puncak: 'Ramadhan & Imlek (Konsumsi Bumbu Masak Meningkat)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Januari', 'Februari'],
    alasan_permintaan: 'Bawang putih lokal unggul dalam kualitas aroma dan diminati restoran kelas atas. Produksi lokal terbatas sehingga harga selalu di atas bawang impor.',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi (>700 mdpl) pada awal Mei-Juni untuk panen September-Oktober sebelum musim impor besar-besaran.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 42000, indeks_daya_beli: 92 },
      { bulan: 'Feb', harga: 40000, indeks_daya_beli: 88 },
      { bulan: 'Mar', harga: 44000, indeks_daya_beli: 96 },
      { bulan: 'Apr', harga: 45000, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 38000, indeks_daya_beli: 82 },
      { bulan: 'Jun', harga: 35000, indeks_daya_beli: 76 },
      { bulan: 'Jul', harga: 32000, indeks_daya_beli: 70 },
      { bulan: 'Ags', harga: 30000, indeks_daya_beli: 65 },
      { bulan: 'Sep', harga: 32000, indeks_daya_beli: 70 },
      { bulan: 'Okt', harga: 35000, indeks_daya_beli: 76 },
      { bulan: 'Nov', harga: 38000, indeks_daya_beli: 82 },
      { bulan: 'Des', harga: 40000, indeks_daya_beli: 88 }
    ]
  },
  {
    komoditas: 'Tomat Sayur',
    kategori: 'Sayuran',
    icon: '🍅',
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
    komoditas: 'Kentang',
    kategori: 'Sayuran',
    icon: '🥔',
    harga_saat_ini: 16000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.8,
    musim_puncak: 'Juni - Agustus (Musim Kemarau / Panen Raya)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Oktober', 'November'],
    alasan_permintaan: 'Industri keripik kentang nasional dan restoran cepat saji (french fries) menjadi penyerap utama kentang lokal ukuran sedang-besar.',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi >700 mdpl pada April-Mei untuk panen raya musim kemarau Juli-Agustus dengan hasil bersih dan ukuran optimal.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 19000, indeks_daya_beli: 92 },
      { bulan: 'Feb', harga: 20000, indeks_daya_beli: 96 },
      { bulan: 'Mar', harga: 17000, indeks_daya_beli: 82 },
      { bulan: 'Apr', harga: 15000, indeks_daya_beli: 72 },
      { bulan: 'Mei', harga: 14000, indeks_daya_beli: 65 },
      { bulan: 'Jun', harga: 13000, indeks_daya_beli: 60 },
      { bulan: 'Jul', harga: 12000, indeks_daya_beli: 55 },
      { bulan: 'Ags', harga: 13000, indeks_daya_beli: 60 },
      { bulan: 'Sep', harga: 14000, indeks_daya_beli: 65 },
      { bulan: 'Okt', harga: 17000, indeks_daya_beli: 82 },
      { bulan: 'Nov', harga: 18500, indeks_daya_beli: 90 },
      { bulan: 'Des', harga: 18000, indeks_daya_beli: 88 }
    ]
  },
  {
    komoditas: 'Wortel',
    kategori: 'Sayuran',
    icon: '🥕',
    harga_saat_ini: 12000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.0,
    musim_puncak: 'Ramadhan & Natal (Kebutuhan Katering Meningkat)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Desember'],
    alasan_permintaan: 'Wortel lokal dataran tinggi diserap industri jus segar, katering hotel, dan pasar modern supermarket dengan standar ukuran dan kebersihan ketat.',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi (>600 mdpl) pada Januari-Februari menggunakan bedengan tinggi dan mulsa untuk panen Maret-April saat permintaan Ramadhan.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 11000, indeks_daya_beli: 75 },
      { bulan: 'Feb', harga: 12000, indeks_daya_beli: 82 },
      { bulan: 'Mar', harga: 14000, indeks_daya_beli: 96 },
      { bulan: 'Apr', harga: 15000, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 12000, indeks_daya_beli: 82 },
      { bulan: 'Jun', harga: 10000, indeks_daya_beli: 68 },
      { bulan: 'Jul', harga: 9500, indeks_daya_beli: 64 },
      { bulan: 'Ags', harga: 10000, indeks_daya_beli: 68 },
      { bulan: 'Sep', harga: 10500, indeks_daya_beli: 72 },
      { bulan: 'Okt', harga: 11000, indeks_daya_beli: 75 },
      { bulan: 'Nov', harga: 12000, indeks_daya_beli: 82 },
      { bulan: 'Des', harga: 14500, indeks_daya_beli: 98 }
    ]
  },
  {
    komoditas: 'Kubis / Kol',
    kategori: 'Sayuran',
    icon: '🥬',
    harga_saat_ini: 8500,
    tren_mingguan: 'Turun',
    persentase_tren: 3.1,
    musim_puncak: 'Januari - Maret & Ramadhan',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'April'],
    alasan_permintaan: 'Pasokan dari sentra Dieng dan Brastagi sering terganggu kabut tebal musim hujan sehingga harga melonjak di pasar urban Jawa dan Sumatera.',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi pada September-Oktober untuk panen Desember-Januari saat permintaan puncak dan kualitas krop paling padat.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 11000, indeks_daya_beli: 88 },
      { bulan: 'Feb', harga: 12000, indeks_daya_beli: 96 },
      { bulan: 'Mar', harga: 10000, indeks_daya_beli: 80 },
      { bulan: 'Apr', harga: 9000, indeks_daya_beli: 72 },
      { bulan: 'Mei', harga: 7000, indeks_daya_beli: 55 },
      { bulan: 'Jun', harga: 5500, indeks_daya_beli: 42 },
      { bulan: 'Jul', harga: 5000, indeks_daya_beli: 38 },
      { bulan: 'Ags', harga: 5500, indeks_daya_beli: 42 },
      { bulan: 'Sep', harga: 6500, indeks_daya_beli: 50 },
      { bulan: 'Okt', harga: 7500, indeks_daya_beli: 60 },
      { bulan: 'Nov', harga: 9000, indeks_daya_beli: 72 },
      { bulan: 'Des', harga: 10500, indeks_daya_beli: 84 }
    ]
  },
  {
    komoditas: 'Buncis',
    kategori: 'Sayuran',
    icon: '🫛',
    harga_saat_ini: 14000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.5,
    musim_puncak: 'Januari - Maret & Ramadhan',
    bulan_harga_tertinggi: ['Februari', 'Maret', 'April'],
    alasan_permintaan: 'Buncis dataran tinggi menjadi sayuran premium favorit hotel dan restoran fine dining. Ekspor ke Singapura dan Malaysia memberikan harga premium.',
    rekomendasi_waktu_tanam: 'Tanam setiap 2-3 bulan sekali (musim kontinu) agar pasokan stabil ke pembeli tetap katering atau restoran dengan kontrak harga tetap.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 15000, indeks_daya_beli: 88 },
      { bulan: 'Feb', harga: 17000, indeks_daya_beli: 100 },
      { bulan: 'Mar', harga: 16000, indeks_daya_beli: 94 },
      { bulan: 'Apr', harga: 15500, indeks_daya_beli: 91 },
      { bulan: 'Mei', harga: 13000, indeks_daya_beli: 76 },
      { bulan: 'Jun', harga: 11500, indeks_daya_beli: 67 },
      { bulan: 'Jul', harga: 11000, indeks_daya_beli: 64 },
      { bulan: 'Ags', harga: 12000, indeks_daya_beli: 70 },
      { bulan: 'Sep', harga: 13000, indeks_daya_beli: 76 },
      { bulan: 'Okt', harga: 14000, indeks_daya_beli: 82 },
      { bulan: 'Nov', harga: 14500, indeks_daya_beli: 85 },
      { bulan: 'Des', harga: 15000, indeks_daya_beli: 88 }
    ]
  },
  {
    komoditas: 'Kangkung',
    kategori: 'Sayuran',
    icon: '🌿',
    harga_saat_ini: 4500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.2,
    musim_puncak: 'Sepanjang Tahun (Sayuran Harian)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Juli', 'Agustus'],
    alasan_permintaan: 'Sayuran harian dapur Indonesia yang selalu dibutuhkan warung makan dan pasar tradisional. Permintaan stabil sepanjang tahun dengan siklus tanam 3 minggu.',
    rekomendasi_waktu_tanam: 'Tanam secara kontinyu setiap 2-3 minggu sekali untuk pasokan rutin ke warung atau pasar terdekat. Modal awal rendah, perputaran modal super cepat.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 5500, indeks_daya_beli: 85 },
      { bulan: 'Feb', harga: 5000, indeks_daya_beli: 78 },
      { bulan: 'Mar', harga: 4500, indeks_daya_beli: 68 },
      { bulan: 'Apr', harga: 4000, indeks_daya_beli: 62 },
      { bulan: 'Mei', harga: 4000, indeks_daya_beli: 62 },
      { bulan: 'Jun', harga: 4200, indeks_daya_beli: 65 },
      { bulan: 'Jul', harga: 5000, indeks_daya_beli: 78 },
      { bulan: 'Ags', harga: 5500, indeks_daya_beli: 85 },
      { bulan: 'Sep', harga: 5000, indeks_daya_beli: 78 },
      { bulan: 'Okt', harga: 4500, indeks_daya_beli: 68 },
      { bulan: 'Nov', harga: 4500, indeks_daya_beli: 68 },
      { bulan: 'Des', harga: 4800, indeks_daya_beli: 74 }
    ]
  },
  {
    komoditas: 'Bayam',
    kategori: 'Sayuran',
    icon: '🥬',
    harga_saat_ini: 5000,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.8,
    musim_puncak: 'Ramadhan & Puasa Sekolah',
    bulan_harga_tertinggi: ['Maret', 'April', 'Januari'],
    alasan_permintaan: 'Sayuran wajib menu sehat, khususnya saat program makan siang bergizi sekolah berjalan. Pasar organik dan supermarket modern membayar premium harga.',
    rekomendasi_waktu_tanam: 'Tanam dengan sistem raised bed hidroponik ringan di lahan pekarangan untuk pasokan konsisten ke warung dan catering sekolah terdekat.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 5500, indeks_daya_beli: 85 },
      { bulan: 'Feb', harga: 5200, indeks_daya_beli: 80 },
      { bulan: 'Mar', harga: 6000, indeks_daya_beli: 92 },
      { bulan: 'Apr', harga: 6500, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 5500, indeks_daya_beli: 85 },
      { bulan: 'Jun', harga: 4800, indeks_daya_beli: 74 },
      { bulan: 'Jul', harga: 4500, indeks_daya_beli: 68 },
      { bulan: 'Ags', harga: 4500, indeks_daya_beli: 68 },
      { bulan: 'Sep', harga: 4800, indeks_daya_beli: 74 },
      { bulan: 'Okt', harga: 5000, indeks_daya_beli: 78 },
      { bulan: 'Nov', harga: 5200, indeks_daya_beli: 80 },
      { bulan: 'Des', harga: 5500, indeks_daya_beli: 85 }
    ]
  },
  {
    komoditas: 'Terong',
    kategori: 'Sayuran',
    icon: '🍆',
    harga_saat_ini: 9000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.2,
    musim_puncak: 'Ramadhan & Idul Fitri',
    bulan_harga_tertinggi: ['Maret', 'April', 'November', 'Desember'],
    alasan_permintaan: 'Bahan utama lauk rumah tangga dan warung makan di seluruh pelosok Indonesia. Permintaan meningkat signifikan saat puasa Ramadhan dan lebaran.',
    rekomendasi_waktu_tanam: 'Tanam pada Januari-Februari untuk panen April-Mei di puncak permintaan Lebaran. Bisa dilakukan di lahan tadah hujan dengan mulsa perak.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 8000, indeks_daya_beli: 70 },
      { bulan: 'Feb', harga: 9500, indeks_daya_beli: 83 },
      { bulan: 'Mar', harga: 11000, indeks_daya_beli: 96 },
      { bulan: 'Apr', harga: 11500, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 9000, indeks_daya_beli: 78 },
      { bulan: 'Jun', harga: 7500, indeks_daya_beli: 64 },
      { bulan: 'Jul', harga: 7000, indeks_daya_beli: 60 },
      { bulan: 'Ags', harga: 7500, indeks_daya_beli: 64 },
      { bulan: 'Sep', harga: 8000, indeks_daya_beli: 70 },
      { bulan: 'Okt', harga: 9000, indeks_daya_beli: 78 },
      { bulan: 'Nov', harga: 10500, indeks_daya_beli: 91 },
      { bulan: 'Des', harga: 10000, indeks_daya_beli: 87 }
    ]
  },
  {
    komoditas: 'Timun / Mentimun',
    kategori: 'Sayuran',
    icon: '🥒',
    harga_saat_ini: 7500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.9,
    musim_puncak: 'Ramadhan (Lalapan & Acar) & Musim Pernikahan',
    bulan_harga_tertinggi: ['Maret', 'April', 'Mei'],
    alasan_permintaan: 'Lalapan, acar, dan salad timun menjadi menu wajib di warung makan dan katering pernikahan. Siklus tanam cepat (35-45 HST) menguntungkan petani.',
    rekomendasi_waktu_tanam: 'Tanam pada Januari-Februari untuk panen acar Ramadhan. Dapat ditanam 2-3 siklus dalam setahun dengan modal rendah dan pasar lokal jelas.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 7000, indeks_daya_beli: 75 },
      { bulan: 'Feb', harga: 8000, indeks_daya_beli: 85 },
      { bulan: 'Mar', harga: 9500, indeks_daya_beli: 100 },
      { bulan: 'Apr', harga: 9000, indeks_daya_beli: 96 },
      { bulan: 'Mei', harga: 8500, indeks_daya_beli: 90 },
      { bulan: 'Jun', harga: 7000, indeks_daya_beli: 75 },
      { bulan: 'Jul', harga: 6000, indeks_daya_beli: 62 },
      { bulan: 'Ags', harga: 6500, indeks_daya_beli: 68 },
      { bulan: 'Sep', harga: 7000, indeks_daya_beli: 75 },
      { bulan: 'Okt', harga: 7500, indeks_daya_beli: 80 },
      { bulan: 'Nov', harga: 8000, indeks_daya_beli: 85 },
      { bulan: 'Des', harga: 8500, indeks_daya_beli: 90 }
    ]
  },

  // ==================== BUAH-BUAHAN ====================
  {
    komoditas: 'Jeruk (Siam / Keprok)',
    kategori: 'Buah-Buahan',
    icon: '🍊',
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
    komoditas: 'Pisang',
    kategori: 'Buah-Buahan',
    icon: '🍌',
    harga_saat_ini: 8000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.1,
    musim_puncak: 'Ramadhan (Takjil) & Sepanjang Tahun',
    bulan_harga_tertinggi: ['Maret', 'April', 'Desember'],
    alasan_permintaan: 'Pisang menjadi buah paling banyak dikonsumsi di Indonesia. Industri keripik pisang, olahan bolu, dan pasar tradisional menyerap panen dalam volume besar.',
    rekomendasi_waktu_tanam: 'Pisang adalah tanaman tahunan produktif 2-3 tahun. Lakukan panen selektif tandan dan pemeliharaan anakan untuk pasokan kontinu sepanjang tahun.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 7500, indeks_daya_beli: 76 },
      { bulan: 'Feb', harga: 7800, indeks_daya_beli: 78 },
      { bulan: 'Mar', harga: 9000, indeks_daya_beli: 92 },
      { bulan: 'Apr', harga: 9500, indeks_daya_beli: 96 },
      { bulan: 'Mei', harga: 8500, indeks_daya_beli: 85 },
      { bulan: 'Jun', harga: 7500, indeks_daya_beli: 76 },
      { bulan: 'Jul', harga: 7000, indeks_daya_beli: 70 },
      { bulan: 'Ags', harga: 7000, indeks_daya_beli: 70 },
      { bulan: 'Sep', harga: 7500, indeks_daya_beli: 76 },
      { bulan: 'Okt', harga: 8000, indeks_daya_beli: 80 },
      { bulan: 'Nov', harga: 8500, indeks_daya_beli: 85 },
      { bulan: 'Des', harga: 9500, indeks_daya_beli: 96 }
    ]
  },
  {
    komoditas: 'Mangga',
    kategori: 'Buah-Buahan',
    icon: '🥭',
    harga_saat_ini: 22000,
    tren_mingguan: 'Naik',
    persentase_tren: 7.5,
    musim_puncak: 'Oktober - Desember (Musim Panen Raya Mangga)',
    bulan_harga_tertinggi: ['Januari', 'Maret', 'April', 'Oktober'],
    alasan_permintaan: 'Mangga Harum Manis dan Gedong Gincu menjadi komoditas buah premium ekspor ke Jepang, China, dan Timur Tengah dengan harga USD/kg yang menggiurkan.',
    rekomendasi_waktu_tanam: 'Lakukan pemupukan kalium dan fosfor sebelum musim berbunga (Agustus-September) untuk memaksimalkan produksi buah musim puncak Oktober-Desember.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 30000, indeks_daya_beli: 96 },
      { bulan: 'Feb', harga: 28000, indeks_daya_beli: 90 },
      { bulan: 'Mar', harga: 32000, indeks_daya_beli: 100 },
      { bulan: 'Apr', harga: 30000, indeks_daya_beli: 96 },
      { bulan: 'Mei', harga: 25000, indeks_daya_beli: 80 },
      { bulan: 'Jun', harga: 20000, indeks_daya_beli: 64 },
      { bulan: 'Jul', harga: 18000, indeks_daya_beli: 56 },
      { bulan: 'Ags', harga: 16000, indeks_daya_beli: 50 },
      { bulan: 'Sep', harga: 18000, indeks_daya_beli: 56 },
      { bulan: 'Okt', harga: 22000, indeks_daya_beli: 70 },
      { bulan: 'Nov', harga: 25000, indeks_daya_beli: 80 },
      { bulan: 'Des', harga: 28000, indeks_daya_beli: 90 }
    ]
  },
  {
    komoditas: 'Semangka',
    kategori: 'Buah-Buahan',
    icon: '🍉',
    harga_saat_ini: 5500,
    tren_mingguan: 'Naik',
    persentase_tren: 6.2,
    musim_puncak: 'Ramadhan (Takjil) & Musim Panas Kemarau',
    bulan_harga_tertinggi: ['Maret', 'April', 'Juni', 'Juli'],
    alasan_permintaan: 'Semangka menjadi buah takjil Ramadhan paling populer dan konsumsinya melonjak di musim panas. Semangka tanpa biji premium dibayar lebih tinggi oleh supermarket.',
    rekomendasi_waktu_tanam: 'Tanam pada Januari-Februari di lahan tadah hujan atau berpasir ringan untuk panen tepat Ramadhan. Gunakan plastik mulsa perak untuk menekan gulma.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 5000, indeks_daya_beli: 72 },
      { bulan: 'Feb', harga: 5500, indeks_daya_beli: 79 },
      { bulan: 'Mar', harga: 6500, indeks_daya_beli: 94 },
      { bulan: 'Apr', harga: 7000, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 6000, indeks_daya_beli: 86 },
      { bulan: 'Jun', harga: 6500, indeks_daya_beli: 94 },
      { bulan: 'Jul', harga: 6500, indeks_daya_beli: 94 },
      { bulan: 'Ags', harga: 5500, indeks_daya_beli: 79 },
      { bulan: 'Sep', harga: 4800, indeks_daya_beli: 68 },
      { bulan: 'Okt', harga: 4500, indeks_daya_beli: 64 },
      { bulan: 'Nov', harga: 5000, indeks_daya_beli: 72 },
      { bulan: 'Des', harga: 5500, indeks_daya_beli: 79 }
    ]
  },
  {
    komoditas: 'Melon',
    kategori: 'Buah-Buahan',
    icon: '🍈',
    harga_saat_ini: 12000,
    tren_mingguan: 'Stabil',
    persentase_tren: 3.4,
    musim_puncak: 'Ramadhan & Musim Kemarau',
    bulan_harga_tertinggi: ['Maret', 'April', 'Mei', 'Juli'],
    alasan_permintaan: 'Melon premium (melon hijau & kuning Jepang) dibayar mahal oleh supermarket dan hotel bintang. Melon golden menjadi buah premium tersendiri di pasar modern.',
    rekomendasi_waktu_tanam: 'Tanam menggunakan greenhouse atau naungan plastik UV di musim hujan untuk meningkatkan kualitas buah dan mencegah penyakit busuk buah.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 11000, indeks_daya_beli: 78 },
      { bulan: 'Feb', harga: 12500, indeks_daya_beli: 88 },
      { bulan: 'Mar', harga: 14000, indeks_daya_beli: 100 },
      { bulan: 'Apr', harga: 13500, indeks_daya_beli: 96 },
      { bulan: 'Mei', harga: 13000, indeks_daya_beli: 92 },
      { bulan: 'Jun', harga: 12000, indeks_daya_beli: 85 },
      { bulan: 'Jul', harga: 13000, indeks_daya_beli: 92 },
      { bulan: 'Ags', harga: 12000, indeks_daya_beli: 85 },
      { bulan: 'Sep', harga: 11000, indeks_daya_beli: 78 },
      { bulan: 'Okt', harga: 10500, indeks_daya_beli: 74 },
      { bulan: 'Nov', harga: 11000, indeks_daya_beli: 78 },
      { bulan: 'Des', harga: 12000, indeks_daya_beli: 85 }
    ]
  },
  {
    komoditas: 'Anggur',
    kategori: 'Buah-Buahan',
    icon: '🍇',
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
  },
  {
    komoditas: 'Pepaya',
    kategori: 'Buah-Buahan',
    icon: '🍐',
    harga_saat_ini: 6500,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.0,
    musim_puncak: 'Ramadhan & Sepanjang Tahun (Buah Sehat)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Oktober', 'November'],
    alasan_permintaan: 'Pepaya California menjadi buah favorit kesehatan masyarakat perkotaan. Industri jus papaya, olahan kulit, dan daun pepaya untuk katering herbal mendukung harga stabil.',
    rekomendasi_waktu_tanam: 'Pepaya bisa mulai berbuah hanya 8-10 bulan setelah tanam dan terus produktif 2-3 tahun. Sangat ideal untuk lahan pekarangan semi-komersial.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 6500, indeks_daya_beli: 80 },
      { bulan: 'Feb', harga: 6800, indeks_daya_beli: 83 },
      { bulan: 'Mar', harga: 7500, indeks_daya_beli: 92 },
      { bulan: 'Apr', harga: 8000, indeks_daya_beli: 98 },
      { bulan: 'Mei', harga: 7000, indeks_daya_beli: 86 },
      { bulan: 'Jun', harga: 6000, indeks_daya_beli: 74 },
      { bulan: 'Jul', harga: 5500, indeks_daya_beli: 68 },
      { bulan: 'Ags', harga: 5800, indeks_daya_beli: 72 },
      { bulan: 'Sep', harga: 6200, indeks_daya_beli: 76 },
      { bulan: 'Okt', harga: 7200, indeks_daya_beli: 88 },
      { bulan: 'Nov', harga: 7800, indeks_daya_beli: 96 },
      { bulan: 'Des', harga: 7500, indeks_daya_beli: 92 }
    ]
  },
  {
    komoditas: 'Jambu Biji',
    kategori: 'Buah-Buahan',
    icon: '🍏',
    harga_saat_ini: 9000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.1,
    musim_puncak: 'Musim Demam Berdarah (Pamor DBD Naik)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'November', 'Desember'],
    alasan_permintaan: 'Lonjakan penjualan jus jambu merah meningkat pesat saat musim DBD (Demam Berdarah Dengue) karena dipercaya meningkatkan trombosit. Pasar jus segar tumbuh sangat cepat.',
    rekomendasi_waktu_tanam: 'Tanam bibit cangkok atau okulasi untuk berbuah lebih cepat (1-1.5 tahun) dan produktif terus selama 10+ tahun dengan perawatan minimal.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 11000, indeks_daya_beli: 92 },
      { bulan: 'Feb', harga: 12000, indeks_daya_beli: 100 },
      { bulan: 'Mar', harga: 10000, indeks_daya_beli: 83 },
      { bulan: 'Apr', harga: 9000, indeks_daya_beli: 75 },
      { bulan: 'Mei', harga: 8000, indeks_daya_beli: 67 },
      { bulan: 'Jun', harga: 7500, indeks_daya_beli: 62 },
      { bulan: 'Jul', harga: 7500, indeks_daya_beli: 62 },
      { bulan: 'Ags', harga: 8000, indeks_daya_beli: 67 },
      { bulan: 'Sep', harga: 8500, indeks_daya_beli: 70 },
      { bulan: 'Okt', harga: 9500, indeks_daya_beli: 79 },
      { bulan: 'Nov', harga: 11000, indeks_daya_beli: 92 },
      { bulan: 'Des', harga: 11500, indeks_daya_beli: 96 }
    ]
  },

  // ==================== REMPAH & BUMBU ====================
  {
    komoditas: 'Jahe Merah',
    kategori: 'Rempah & Bumbu',
    icon: '🫚',
    harga_saat_ini: 28000,
    tren_mingguan: 'Naik',
    persentase_tren: 8.5,
    musim_puncak: 'Musim Hujan & Pandemi/Flu (Kebutuhan Herbal Melonjak)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Juni', 'Juli'],
    alasan_permintaan: 'Industri minuman herbal jahe merah (wedang jahe, jahe instan sachet) tumbuh sangat pesat. Ekspor ke Korea dan Jepang untuk suplemen kesehatan membuka pasar premium.',
    rekomendasi_waktu_tanam: 'Tanam di lahan naungan parsial pada April-Mei untuk panen bibit segar Desember atau panen simplisia jahe kering April tahun berikutnya.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 35000, indeks_daya_beli: 100 },
      { bulan: 'Feb', harga: 32000, indeks_daya_beli: 91 },
      { bulan: 'Mar', harga: 28000, indeks_daya_beli: 80 },
      { bulan: 'Apr', harga: 25000, indeks_daya_beli: 70 },
      { bulan: 'Mei', harga: 24000, indeks_daya_beli: 68 },
      { bulan: 'Jun', harga: 30000, indeks_daya_beli: 86 },
      { bulan: 'Jul', harga: 32000, indeks_daya_beli: 91 },
      { bulan: 'Ags', harga: 28000, indeks_daya_beli: 80 },
      { bulan: 'Sep', harga: 26000, indeks_daya_beli: 74 },
      { bulan: 'Okt', harga: 27000, indeks_daya_beli: 77 },
      { bulan: 'Nov', harga: 28000, indeks_daya_beli: 80 },
      { bulan: 'Des', harga: 30000, indeks_daya_beli: 86 }
    ]
  },
  {
    komoditas: 'Kunyit',
    kategori: 'Rempah & Bumbu',
    icon: '🌿',
    harga_saat_ini: 12000,
    tren_mingguan: 'Stabil',
    persentase_tren: 3.2,
    musim_puncak: 'Ramadhan (Bumbu Olahan) & Sepanjang Tahun (Industri Farmasi)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Oktober', 'November'],
    alasan_permintaan: 'Industri jamu tradisional, obat herbal kemasan modern, dan bumbu masak olahan menjadi pendorong permintaan kunyit yang stabil dan terus tumbuh.',
    rekomendasi_waktu_tanam: 'Tanam di akhir musim hujan (Maret-April) di lahan naungan sebagian. Panen 8-10 bulan kemudian saat rimpang sudah besar dan kurkumin optimal.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 11000, indeks_daya_beli: 78 },
      { bulan: 'Feb', harga: 12000, indeks_daya_beli: 85 },
      { bulan: 'Mar', harga: 14000, indeks_daya_beli: 100 },
      { bulan: 'Apr', harga: 13500, indeks_daya_beli: 96 },
      { bulan: 'Mei', harga: 12000, indeks_daya_beli: 85 },
      { bulan: 'Jun', harga: 10500, indeks_daya_beli: 75 },
      { bulan: 'Jul', harga: 10000, indeks_daya_beli: 70 },
      { bulan: 'Ags', harga: 10500, indeks_daya_beli: 75 },
      { bulan: 'Sep', harga: 11000, indeks_daya_beli: 78 },
      { bulan: 'Okt', harga: 13000, indeks_daya_beli: 92 },
      { bulan: 'Nov', harga: 13500, indeks_daya_beli: 96 },
      { bulan: 'Des', harga: 12000, indeks_daya_beli: 85 }
    ]
  },
  {
    komoditas: 'Kencur',
    kategori: 'Rempah & Bumbu',
    icon: '🌿',
    harga_saat_ini: 35000,
    tren_mingguan: 'Naik',
    persentase_tren: 10.2,
    musim_puncak: 'Musim Hujan & Sepanjang Tahun (Jamu & Bumbu Balita)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Kencur adalah bahan wajib jamu beras kencur dan campuran bumbu masak. Kelangkaan produksi lokal membuat harga kencur seringkali 3x lebih mahal dari kunyit.',
    rekomendasi_waktu_tanam: 'Tanam pada Maret-April di tanah gembur ber-pH 6-7 dengan naungan 30%. Panen 8-10 bulan kemudian. Pasar lokal jamu selalu menyerap habis produksi.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 42000, indeks_daya_beli: 100 },
      { bulan: 'Feb', harga: 40000, indeks_daya_beli: 95 },
      { bulan: 'Mar', harga: 35000, indeks_daya_beli: 83 },
      { bulan: 'Apr', harga: 32000, indeks_daya_beli: 76 },
      { bulan: 'Mei', harga: 30000, indeks_daya_beli: 70 },
      { bulan: 'Jun', harga: 32000, indeks_daya_beli: 76 },
      { bulan: 'Jul', harga: 35000, indeks_daya_beli: 83 },
      { bulan: 'Ags', harga: 35000, indeks_daya_beli: 83 },
      { bulan: 'Sep', harga: 33000, indeks_daya_beli: 78 },
      { bulan: 'Okt', harga: 35000, indeks_daya_beli: 83 },
      { bulan: 'Nov', harga: 38000, indeks_daya_beli: 90 },
      { bulan: 'Des', harga: 42000, indeks_daya_beli: 100 }
    ]
  },
  {
    komoditas: 'Lengkuas',
    kategori: 'Rempah & Bumbu',
    icon: '🌿',
    harga_saat_ini: 15000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.8,
    musim_puncak: 'Ramadhan & Lebaran (Bumbu Rendang & Gulai Meningkat)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Desember'],
    alasan_permintaan: 'Bahan utama rendang, gulai, dan sup bumbu Indonesia yang dikonsumsi masif saat hari raya. Industri bumbu instan kemasan membutuhkan pasokan lengkuas segar konsisten.',
    rekomendasi_waktu_tanam: 'Tanam di lahan kebun basah atau pinggiran kolam air. Panen 10-12 bulan setelah tanam. Sangat mudah budidaya karena tahan hama dan penyakit.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 14000, indeks_daya_beli: 78 },
      { bulan: 'Feb', harga: 15000, indeks_daya_beli: 83 },
      { bulan: 'Mar', harga: 18000, indeks_daya_beli: 100 },
      { bulan: 'Apr', harga: 17000, indeks_daya_beli: 94 },
      { bulan: 'Mei', harga: 15000, indeks_daya_beli: 83 },
      { bulan: 'Jun', harga: 13000, indeks_daya_beli: 72 },
      { bulan: 'Jul', harga: 12000, indeks_daya_beli: 67 },
      { bulan: 'Ags', harga: 12500, indeks_daya_beli: 70 },
      { bulan: 'Sep', harga: 13500, indeks_daya_beli: 75 },
      { bulan: 'Okt', harga: 14000, indeks_daya_beli: 78 },
      { bulan: 'Nov', harga: 15000, indeks_daya_beli: 83 },
      { bulan: 'Des', harga: 17000, indeks_daya_beli: 94 }
    ]
  },

  // ==================== PERKEBUNAN ====================
  {
    komoditas: 'Cokelat / Kakao',
    kategori: 'Perkebunan',
    icon: '🍫',
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
    komoditas: 'Kelapa Sawit',
    kategori: 'Perkebunan',
    icon: '🌴',
    harga_saat_ini: 2800,
    tren_mingguan: 'Naik',
    persentase_tren: 5.8,
    musim_puncak: 'Maret - Mei & September - November (Panen Puncak)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Oktober', 'November'],
    alasan_permintaan: 'Permintaan minyak sawit global stabil tinggi dari industri pangan, biodiesel, dan oleochemical. Harga CPO dunia menentukan langsung harga TBS petani plasma.',
    rekomendasi_waktu_tanam: 'Tanam bibit DxP unggul bersertifikasi PPKS/Lonsum. Mulai berbuah 3-4 tahun setelah tanam dan produktif selama 20-25 tahun.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 2600, indeks_daya_beli: 80 },
      { bulan: 'Feb', harga: 2700, indeks_daya_beli: 84 },
      { bulan: 'Mar', harga: 3100, indeks_daya_beli: 96 },
      { bulan: 'Apr', harga: 3200, indeks_daya_beli: 100 },
      { bulan: 'Mei', harga: 3000, indeks_daya_beli: 94 },
      { bulan: 'Jun', harga: 2800, indeks_daya_beli: 88 },
      { bulan: 'Jul', harga: 2700, indeks_daya_beli: 84 },
      { bulan: 'Ags', harga: 2650, indeks_daya_beli: 82 },
      { bulan: 'Sep', harga: 2900, indeks_daya_beli: 90 },
      { bulan: 'Okt', harga: 3000, indeks_daya_beli: 94 },
      { bulan: 'Nov', harga: 2900, indeks_daya_beli: 90 },
      { bulan: 'Des', harga: 2700, indeks_daya_beli: 84 }
    ]
  },
  {
    komoditas: 'Kopi Arabika',
    kategori: 'Perkebunan',
    icon: '☕',
    harga_saat_ini: 85000,
    tren_mingguan: 'Naik',
    persentase_tren: 15.2,
    musim_puncak: 'Mei - Oktober (Panen Raya Kopi)',
    bulan_harga_tertinggi: ['Mei', 'Juni', 'Juli', 'Agustus'],
    alasan_permintaan: 'Harga kopi dunia mencapai tertinggi sepanjang masa. Kopi Arabika specialty Indonesia (Gayo, Toraja, Flores) diserap langsung oleh roaster internasional dengan harga USD premium.',
    rekomendasi_waktu_tanam: 'Tanam di dataran >700 mdpl dengan naungan pohon penaung. Butuh 3-4 tahun untuk panen perdana tetapi bernilai jangka panjang selama 20+ tahun.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 75000, indeks_daya_beli: 80 },
      { bulan: 'Feb', harga: 78000, indeks_daya_beli: 83 },
      { bulan: 'Mar', harga: 80000, indeks_daya_beli: 85 },
      { bulan: 'Apr', harga: 82000, indeks_daya_beli: 87 },
      { bulan: 'Mei', harga: 94000, indeks_daya_beli: 100 },
      { bulan: 'Jun', harga: 92000, indeks_daya_beli: 98 },
      { bulan: 'Jul', harga: 90000, indeks_daya_beli: 96 },
      { bulan: 'Ags', harga: 88000, indeks_daya_beli: 94 },
      { bulan: 'Sep', harga: 86000, indeks_daya_beli: 91 },
      { bulan: 'Okt', harga: 84000, indeks_daya_beli: 89 },
      { bulan: 'Nov', harga: 80000, indeks_daya_beli: 85 },
      { bulan: 'Des', harga: 78000, indeks_daya_beli: 83 }
    ]
  },
  {
    komoditas: 'Kopi Robusta',
    kategori: 'Perkebunan',
    icon: '☕',
    harga_saat_ini: 48000,
    tren_mingguan: 'Naik',
    persentase_tren: 11.8,
    musim_puncak: 'Juni - September (Panen Raya Robusta)',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Agustus', 'September'],
    alasan_permintaan: 'Industri kopi instan, kopi sachet 3in1, dan kopi kemasan meningkat pesat. Robusta Lampung dan Bengkulu menjadi bahan utama blend espresso internasional.',
    rekomendasi_waktu_tanam: 'Cocok di dataran 200-600 mdpl. Tanam bibit sambung pucuk klon BP 308 atau BP 42 untuk berbuah 2 tahun lebih cepat dari biji.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 42000, indeks_daya_beli: 80 },
      { bulan: 'Feb', harga: 44000, indeks_daya_beli: 84 },
      { bulan: 'Mar', harga: 46000, indeks_daya_beli: 88 },
      { bulan: 'Apr', harga: 47000, indeks_daya_beli: 90 },
      { bulan: 'Mei', harga: 48000, indeks_daya_beli: 92 },
      { bulan: 'Jun', harga: 52000, indeks_daya_beli: 100 },
      { bulan: 'Jul', harga: 51000, indeks_daya_beli: 98 },
      { bulan: 'Ags', harga: 50000, indeks_daya_beli: 96 },
      { bulan: 'Sep', harga: 50000, indeks_daya_beli: 96 },
      { bulan: 'Okt', harga: 48000, indeks_daya_beli: 92 },
      { bulan: 'Nov', harga: 46000, indeks_daya_beli: 88 },
      { bulan: 'Des', harga: 44000, indeks_daya_beli: 84 }
    ]
  },
  {
    komoditas: 'Karet',
    kategori: 'Perkebunan',
    icon: '🌳',
    harga_saat_ini: 18500,
    tren_mingguan: 'Naik',
    persentase_tren: 7.2,
    musim_puncak: 'Januari - Maret & Oktober - Desember (Produksi Industri Otomotif)',
    bulan_harga_tertinggi: ['Maret', 'April', 'Oktober', 'November'],
    alasan_permintaan: 'Permintaan karet alam dari industri ban otomotif global meningkat seiring pertumbuhan kendaraan EV yang juga membutuhkan karet berkualitas tinggi.',
    rekomendasi_waktu_tanam: 'Tanam klon unggul IRR 112 atau PB 260. Sadap pertama dimulai setelah lilit batang 50 cm (5-7 tahun). Produktif disadap selama 25-30 tahun.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 20000, indeks_daya_beli: 95 },
      { bulan: 'Feb', harga: 18500, indeks_daya_beli: 88 },
      { bulan: 'Mar', harga: 21000, indeks_daya_beli: 100 },
      { bulan: 'Apr', harga: 20500, indeks_daya_beli: 98 },
      { bulan: 'Mei', harga: 19000, indeks_daya_beli: 90 },
      { bulan: 'Jun', harga: 17000, indeks_daya_beli: 80 },
      { bulan: 'Jul', harga: 16500, indeks_daya_beli: 78 },
      { bulan: 'Ags', harga: 17000, indeks_daya_beli: 80 },
      { bulan: 'Sep', harga: 17500, indeks_daya_beli: 83 },
      { bulan: 'Okt', harga: 19500, indeks_daya_beli: 93 },
      { bulan: 'Nov', harga: 20000, indeks_daya_beli: 95 },
      { bulan: 'Des', harga: 19500, indeks_daya_beli: 93 }
    ]
  },
  {
    komoditas: 'Tembakau',
    kategori: 'Perkebunan',
    icon: '🌿',
    harga_saat_ini: 55000,
    tren_mingguan: 'Stabil',
    persentase_tren: 3.5,
    musim_puncak: 'Juli - September (Panen Raya Tembakau)',
    bulan_harga_tertinggi: ['Juli', 'Agustus', 'September', 'Oktober'],
    alasan_permintaan: 'Industri rokok kretek nasional menyerap tembakau Temanggung, Madura, dan Virginia Lombok dalam volume besar. Tembakau rajangan premium diekspor ke Timur Tengah.',
    rekomendasi_waktu_tanam: 'Tanam pada April-Mei di lahan dataran sedang-tinggi bertanah andosol untuk panen Juli-September saat industri rokok membutuhkan pasokan segar.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 42000, indeks_daya_beli: 65 },
      { bulan: 'Feb', harga: 40000, indeks_daya_beli: 62 },
      { bulan: 'Mar', harga: 42000, indeks_daya_beli: 65 },
      { bulan: 'Apr', harga: 45000, indeks_daya_beli: 70 },
      { bulan: 'Mei', harga: 48000, indeks_daya_beli: 74 },
      { bulan: 'Jun', harga: 52000, indeks_daya_beli: 80 },
      { bulan: 'Jul', harga: 65000, indeks_daya_beli: 100 },
      { bulan: 'Ags', harga: 68000, indeks_daya_beli: 100 },
      { bulan: 'Sep', harga: 65000, indeks_daya_beli: 100 },
      { bulan: 'Okt', harga: 58000, indeks_daya_beli: 89 },
      { bulan: 'Nov', harga: 50000, indeks_daya_beli: 77 },
      { bulan: 'Des', harga: 45000, indeks_daya_beli: 70 }
    ]
  },

  // ==================== TANAMAN OBAT ====================
  {
    komoditas: 'Lidah Buaya',
    kategori: 'Tanaman Obat',
    icon: '🌵',
    harga_saat_ini: 8000,
    tren_mingguan: 'Naik',
    persentase_tren: 9.5,
    musim_puncak: 'Sepanjang Tahun (Industri Kosmetik & Kesehatan)',
    bulan_harga_tertinggi: ['Januari', 'Juni', 'Juli', 'Desember'],
    alasan_permintaan: 'Industri skincare dan kosmetik herbal Indonesia meledak permintaannya. Gel aloe vera murni diekspor ke Korea, Jepang, dan Tiongkok sebagai bahan utama produk perawatan kulit.',
    rekomendasi_waktu_tanam: 'Tanam di tanah berpasir berdrainage baik. Sangat tahan kekeringan. Panen perdana 8-12 bulan dan terus produktif 3-5 tahun.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 9000, indeks_daya_beli: 90 },
      { bulan: 'Feb', harga: 8500, indeks_daya_beli: 85 },
      { bulan: 'Mar', harga: 8000, indeks_daya_beli: 80 },
      { bulan: 'Apr', harga: 7500, indeks_daya_beli: 75 },
      { bulan: 'Mei', harga: 7500, indeks_daya_beli: 75 },
      { bulan: 'Jun', harga: 9000, indeks_daya_beli: 90 },
      { bulan: 'Jul', harga: 10000, indeks_daya_beli: 100 },
      { bulan: 'Ags', harga: 9500, indeks_daya_beli: 95 },
      { bulan: 'Sep', harga: 8500, indeks_daya_beli: 85 },
      { bulan: 'Okt', harga: 8000, indeks_daya_beli: 80 },
      { bulan: 'Nov', harga: 8500, indeks_daya_beli: 85 },
      { bulan: 'Des', harga: 9500, indeks_daya_beli: 95 }
    ]
  },
  {
    komoditas: 'Temulawak',
    kategori: 'Tanaman Obat',
    icon: '🌿',
    harga_saat_ini: 18000,
    tren_mingguan: 'Naik',
    persentase_tren: 7.8,
    musim_puncak: 'Musim Hujan (Imun Booster) & Ramadhan (Jamu Tradisional)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Temulawak ditetapkan sebagai herbal unggulan nasional untuk imunitas. Permintaan dari pabrik jamu skala besar (Sido Muncul, Jamu Jago) sangat konsisten dan terus tumbuh.',
    rekomendasi_waktu_tanam: 'Tanam bersama kunyit di lahan naungan pada Maret-April. Panen 10-12 bulan kemudian. Sangat cocok untuk diversifikasi produk petani tanaman obat.',
    historis_bulanan: [
      { bulan: 'Jan', harga: 22000, indeks_daya_beli: 100 },
      { bulan: 'Feb', harga: 21000, indeks_daya_beli: 95 },
      { bulan: 'Mar', harga: 20000, indeks_daya_beli: 90 },
      { bulan: 'Apr', harga: 17000, indeks_daya_beli: 77 },
      { bulan: 'Mei', harga: 16000, indeks_daya_beli: 72 },
      { bulan: 'Jun', harga: 17000, indeks_daya_beli: 77 },
      { bulan: 'Jul', harga: 18000, indeks_daya_beli: 82 },
      { bulan: 'Ags', harga: 17000, indeks_daya_beli: 77 },
      { bulan: 'Sep', harga: 16000, indeks_daya_beli: 72 },
      { bulan: 'Okt', harga: 17000, indeks_daya_beli: 77 },
      { bulan: 'Nov', harga: 19000, indeks_daya_beli: 86 },
      { bulan: 'Des', harga: 21000, indeks_daya_beli: 95 }
    ]
  }
];

export function calculateProfitProjection(luasM2: number, komoditas: string) {
  // Estimasi yield rata-rata per m2 berdasarkan komoditas
  const yieldPerM2: Record<string, { kg: number, biayaPerM2: number, hargaDefault: number }> = {
    // Tanaman Pangan
    'Padi Sawah': { kg: 0.6, biayaPerM2: 4500, hargaDefault: 7200 },
    'Padi': { kg: 0.6, biayaPerM2: 4500, hargaDefault: 7200 },
    'Padi Sawah (Ciherang/Inpari)': { kg: 0.6, biayaPerM2: 4500, hargaDefault: 7200 },
    'Jagung Manis': { kg: 1.8, biayaPerM2: 8000, hargaDefault: 9500 },
    'Jagung': { kg: 1.8, biayaPerM2: 8000, hargaDefault: 9500 },
    'Ubi Kayu / Singkong': { kg: 3.5, biayaPerM2: 3000, hargaDefault: 3200 },
    'Ubi Jalar': { kg: 2.8, biayaPerM2: 5000, hargaDefault: 5500 },
    'Kedelai': { kg: 0.5, biayaPerM2: 6000, hargaDefault: 11500 },
    'Kacang Tanah': { kg: 0.4, biayaPerM2: 8000, hargaDefault: 18000 },
    // Sayuran
    'Cabai Rawit Merah': { kg: 0.9, biayaPerM2: 24000, hargaDefault: 75000 },
    'Cabai': { kg: 0.9, biayaPerM2: 24000, hargaDefault: 75000 },
    'Cabai Merah Besar': { kg: 1.2, biayaPerM2: 22000, hargaDefault: 52000 },
    'Bawang Merah': { kg: 1.2, biayaPerM2: 22000, hargaDefault: 42000 },
    'Bawang Putih': { kg: 0.8, biayaPerM2: 28000, hargaDefault: 38000 },
    'Tomat Sayur': { kg: 2.5, biayaPerM2: 20000, hargaDefault: 18000 },
    'Tomat': { kg: 2.5, biayaPerM2: 20000, hargaDefault: 18000 },
    'Kentang': { kg: 2.0, biayaPerM2: 18000, hargaDefault: 16000 },
    'Wortel': { kg: 2.5, biayaPerM2: 12000, hargaDefault: 12000 },
    'Kubis / Kol': { kg: 3.0, biayaPerM2: 10000, hargaDefault: 8500 },
    'Kol': { kg: 3.0, biayaPerM2: 10000, hargaDefault: 8500 },
    'Buncis': { kg: 1.5, biayaPerM2: 15000, hargaDefault: 14000 },
    'Kangkung': { kg: 2.0, biayaPerM2: 3000, hargaDefault: 4500 },
    'Bayam': { kg: 1.8, biayaPerM2: 3500, hargaDefault: 5000 },
    'Terong': { kg: 3.0, biayaPerM2: 12000, hargaDefault: 9000 },
    'Timun / Mentimun': { kg: 4.0, biayaPerM2: 8000, hargaDefault: 7500 },
    'Timun': { kg: 4.0, biayaPerM2: 8000, hargaDefault: 7500 },
    'Mentimun': { kg: 4.0, biayaPerM2: 8000, hargaDefault: 7500 },
    // Buah-Buahan
    'Jeruk (Siam / Keprok)': { kg: 1.5, biayaPerM2: 7000, hargaDefault: 16500 },
    'Jeruk': { kg: 1.5, biayaPerM2: 7000, hargaDefault: 16500 },
    'Pisang': { kg: 3.5, biayaPerM2: 5000, hargaDefault: 8000 },
    'Mangga': { kg: 0.8, biayaPerM2: 4000, hargaDefault: 22000 },
    'Semangka': { kg: 5.0, biayaPerM2: 9000, hargaDefault: 5500 },
    'Melon': { kg: 2.5, biayaPerM2: 18000, hargaDefault: 12000 },
    'Anggur': { kg: 1.2, biayaPerM2: 28000, hargaDefault: 65000 },
    'Pepaya': { kg: 4.0, biayaPerM2: 4000, hargaDefault: 6500 },
    'Jambu Biji': { kg: 2.0, biayaPerM2: 4500, hargaDefault: 9000 },
    // Rempah & Bumbu
    'Jahe Merah': { kg: 1.5, biayaPerM2: 12000, hargaDefault: 28000 },
    'Kunyit': { kg: 2.0, biayaPerM2: 8000, hargaDefault: 12000 },
    'Kencur': { kg: 1.2, biayaPerM2: 10000, hargaDefault: 35000 },
    'Lengkuas': { kg: 2.5, biayaPerM2: 6000, hargaDefault: 15000 },
    // Perkebunan
    'Cokelat / Kakao': { kg: 0.25, biayaPerM2: 5000, hargaDefault: 82000 },
    'Cokelat': { kg: 0.25, biayaPerM2: 5000, hargaDefault: 82000 },
    'Kakao': { kg: 0.25, biayaPerM2: 5000, hargaDefault: 82000 },
    'Kelapa Sawit': { kg: 2.0, biayaPerM2: 2500, hargaDefault: 2800 },
    'Kopi Arabika': { kg: 0.3, biayaPerM2: 8000, hargaDefault: 85000 },
    'Kopi Robusta': { kg: 0.4, biayaPerM2: 6000, hargaDefault: 48000 },
    'Karet': { kg: 0.15, biayaPerM2: 3500, hargaDefault: 18500 },
    'Tembakau': { kg: 0.3, biayaPerM2: 12000, hargaDefault: 55000 },
    // Tanaman Obat
    'Lidah Buaya': { kg: 4.0, biayaPerM2: 5000, hargaDefault: 8000 },
    'Temulawak': { kg: 1.8, biayaPerM2: 8000, hargaDefault: 18000 },
  };

  const item = yieldPerM2[komoditas] || { kg: 1.0, biayaPerM2: 10000, hargaDefault: 15000 };
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

// ============================================================
// MARKET INTELLIGENCE ENGINE
// ============================================================

export type RisikoLevel = 'Rendah' | 'Sedang' | 'Tinggi';

export interface MarketIntelligenceScore {
  komoditas: string;
  icon: string;
  kategori: CommodityCategory;
  // Skor 0-100
  skorPermintaan: number;      // seberapa banyak dicari / dibeli
  skorTrenHarga: number;       // apakah harga sedang naik
  skorStabilitas: number;      // seberapa stabil harga (tidak fluktuatif)
  skorProfitPotensial: number; // potensi margin keuntungan
  skorTotal: number;           // composite score 0-100
  // Label & insight
  risikoLevel: RisikoLevel;
  labelRekomendasi: string;    // "Tanam Sekarang" / "Pertimbangkan" / "Tunda Dulu"
  hargaSaatIni: number;
  trenMingguan: string;
  persentaseTren: number;
  alasanSingkat: string;       // 1 kalimat kenapa recommended/tidak
  bulanPuncakBerikutnya: string;
  // Estimasi finansial untuk lahan tertentu (diisi oleh getSmartRecommendations)
  estimasiLabaBersih?: number;
  roi?: number;
}

/**
 * Hitung varians harga bulanan (makin rendah = makin stabil)
 */
function hitungStabilitas(historis: { harga: number }[]): number {
  const harga = historis.map(h => h.harga);
  const avg = harga.reduce((a, b) => a + b, 0) / harga.length;
  const variance = harga.reduce((sum, h) => sum + Math.pow(h - avg, 2), 0) / harga.length;
  const cv = Math.sqrt(variance) / avg; // coefficient of variation
  // cv rendah = stabil. cv > 0.4 = sangat fluktuatif
  return Math.max(0, Math.min(100, Math.round((1 - cv / 0.5) * 100)));
}

/**
 * Hitung seberapa dekat bulan puncak permintaan berikutnya (0-100)
 */
function hitungKedekatanMusimPuncak(bulanPuncak: string[]): { skor: number; labelBulan: string } {
  const bulanMap: Record<string, number> = {
    'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4,
    'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8,
    'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
  };
  const now = new Date().getMonth() + 1; // 1-12
  let minGap = 12;
  let labelBulan = bulanPuncak[0] || '-';
  for (const b of bulanPuncak) {
    for (const [key, val] of Object.entries(bulanMap)) {
      if (b.toLowerCase().includes(key.toLowerCase())) {
        const gap = ((val - now + 12) % 12);
        if (gap < minGap) { minGap = gap; labelBulan = key; }
      }
    }
  }
  // gap=0 (bulan ini) = 100, gap=6 = 50, gap=11 = 9
  const skor = Math.max(10, Math.round(100 - (minGap / 12) * 90));
  return { skor, labelBulan };
}

/**
 * Hitung skor permintaan dari indeks daya beli rata-rata 3 bulan terakhir
 */
function hitungSkorPermintaan(historis: { indeks_daya_beli: number }[]): number {
  const recent = historis.slice(-3);
  const avg = recent.reduce((s, h) => s + h.indeks_daya_beli, 0) / recent.length;
  return Math.round(avg);
}

/**
 * Hitung skor tren harga
 */
function hitungSkorTren(tren: string, persen: number): number {
  if (tren === 'Naik') return Math.min(100, 60 + persen * 2.5);
  if (tren === 'Turun') return Math.max(0, 40 - persen * 2);
  return 55; // Stabil
}

/**
 * Hitung potensi profit score berdasarkan ROI rata-rata per 10.000 m²
 */
function hitungSkorProfit(komoditas: string): number {
  const proj = calculateProfitProjection(10000, komoditas);
  const roi = proj.roi;
  // ROI 0% = 30, ROI 100% = 80, ROI 200%+ = 100
  return Math.min(100, Math.max(10, Math.round(30 + roi * 0.35)));
}

/**
 * Generate label rekomendasi berdasarkan skor dan risiko
 */
function getLabelRekomendasi(skor: number, risiko: RisikoLevel, musimDekat: boolean): string {
  if (skor >= 72 && risiko === 'Rendah') return '🟢 Tanam Sekarang';
  if (skor >= 72 && musimDekat) return '🟢 Segera Tanam';
  if (skor >= 55 && risiko !== 'Tinggi') return '🟡 Pertimbangkan';
  if (risiko === 'Tinggi') return '🔴 Hati-Hati';
  return '🟡 Pantau Dulu';
}

/**
 * Generate kalimat alasan singkat
 */
function getAlasanSingkat(item: MarketCommodityTrendExtended, skor: number, stabilitas: number): string {
  if (item.tren_mingguan === 'Naik' && item.persentase_tren >= 8)
    return `Harga naik ${item.persentase_tren}% minggu ini — permintaan pasar sedang tinggi.`;
  if (stabilitas >= 75)
    return `Harga relatif stabil sepanjang tahun, risiko kerugian harga rendah.`;
  if (skor >= 70)
    return `Potensi profit tinggi dengan margin keuntungan yang kompetitif.`;
  if (item.tren_mingguan === 'Turun')
    return `Harga sedang turun — sebaiknya tunggu sinyal pembalikan pasar.`;
  return `Pasar sedang normal, cocok untuk petani berpengalaman di sektor ini.`;
}

/**
 * Fungsi utama: hitung Market Intelligence Score untuk semua komoditas
 */
export function calculateAllMarketScores(luasM2: number = 10000): MarketIntelligenceScore[] {
  return COMMODITY_TRENDS.map(item => {
    const skorPermintaan = hitungSkorPermintaan(item.historis_bulanan);
    const skorTren = hitungSkorTren(item.tren_mingguan, item.persentase_tren);
    const stabilitas = hitungStabilitas(item.historis_bulanan);
    const skorProfit = hitungSkorProfit(item.komoditas);
    const { skor: skorMusim, labelBulan } = hitungKedekatanMusimPuncak(item.bulan_harga_tertinggi);

    // Composite score (weighted)
    const skorTotal = Math.round(
      skorPermintaan * 0.30 +
      skorTren       * 0.30 +
      stabilitas     * 0.20 +
      skorProfit     * 0.15 +
      skorMusim      * 0.05
    );

    // Risk level
    let risiko: RisikoLevel;
    if (skorTotal >= 68 && stabilitas >= 60) risiko = 'Rendah';
    else if (skorTotal >= 48) risiko = 'Sedang';
    else risiko = 'Tinggi';

    const musimDekat = skorMusim >= 70;
    const label = getLabelRekomendasi(skorTotal, risiko, musimDekat);
    const alasan = getAlasanSingkat(item, skorTotal, stabilitas);

    // Profit estimate untuk luas lahan spesifik
    const proj = calculateProfitProjection(luasM2, item.komoditas);

    return {
      komoditas: item.komoditas,
      icon: item.icon,
      kategori: item.kategori,
      skorPermintaan,
      skorTrenHarga: Math.round(skorTren),
      skorStabilitas: stabilitas,
      skorProfitPotensial: skorProfit,
      skorTotal,
      risikoLevel: risiko,
      labelRekomendasi: label,
      hargaSaatIni: item.harga_saat_ini,
      trenMingguan: item.tren_mingguan,
      persentaseTren: item.persentase_tren,
      alasanSingkat: alasan,
      bulanPuncakBerikutnya: labelBulan,
      estimasiLabaBersih: proj.labaBersih,
      roi: proj.roi,
    };
  }).sort((a, b) => b.skorTotal - a.skorTotal);
}

/**
 * Ambil top N rekomendasi terbaik (filter "Tanam" / "Pertimbangkan" saja)
 */
export function getTopRecommendations(luasM2: number, topN = 3): MarketIntelligenceScore[] {
  return calculateAllMarketScores(luasM2)
    .filter(s => !s.labelRekomendasi.includes('Hati-Hati'))
    .slice(0, topN);
}

/**
 * Ambil 3 market pulse highlights
 */
export function getMarketPulse(): {
  mostDemanded: MarketIntelligenceScore;
  fastestRising: MarketIntelligenceScore;
  mostStable: MarketIntelligenceScore;
} {
  const all = calculateAllMarketScores(10000);
  const mostDemanded = [...all].sort((a, b) => b.skorPermintaan - a.skorPermintaan)[0];
  const fastestRising = [...all].sort((a, b) => {
    const scoreA = a.trenMingguan === 'Naik' ? a.persentaseTren : -99;
    const scoreB = b.trenMingguan === 'Naik' ? b.persentaseTren : -99;
    return scoreB - scoreA;
  })[0];
  const mostStable = [...all].sort((a, b) => b.skorStabilitas - a.skorStabilitas)[0];
  return { mostDemanded, fastestRising, mostStable };
}
