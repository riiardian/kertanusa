import { MarketCommodityTrend } from './types';

export type CommodityCategory =
  | 'Tanaman Pangan'
  | 'Sayuran'
  | 'Buah-Buahan'
  | 'Rempah & Bumbu'
  | 'Perkebunan'
  | 'Tanaman Obat';

export interface MarketCommodityTrendExtended extends MarketCommodityTrend {
  kategori: CommodityCategory;
  icon: string;
  karakteristik_tanah?: string;
  ph_ideal?: string;
  umur_panen?: string;
  potensi_hasil_per_ha?: string;
  estimasi_biaya_per_ha?: number;
  tips_agronomis?: string;
}

// Helper untuk membuat kurva 12 bulan yang mulus dan realistis
function make12MonthCurve(basePrice: number, peakMonths: number[], variancePct: number = 0.18): Array<{ bulan: string; harga: number; indeks_daya_beli: number }> {
  const bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return bulanList.map((bulan, idx) => {
    const monthNum = idx + 1;
    const isPeak = peakMonths.includes(monthNum);
    const distanceToPeak = Math.min(...peakMonths.map(p => Math.abs(monthNum - p)));
    const factor = isPeak ? 1 + variancePct : Math.max(1 - variancePct, 1 - (distanceToPeak * 0.04));
    const harga = Math.round((basePrice * factor) / 100) * 100;
    const indeks = Math.min(100, Math.max(50, Math.round(50 + (harga / basePrice) * 35)));
    return { bulan, harga, indeks_daya_beli: indeks };
  });
}

export const COMMODITY_TRENDS: MarketCommodityTrendExtended[] = [
  // ==================== TANAMAN PANGAN ====================
  {
    komoditas: 'Padi Sawah',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 7200,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.3,
    musim_puncak: 'Desember - Februari & Menjelang Hari Raya',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Kebutuhan pangan pokok nasional dengan serapan Bulog dan pasar konsumen rumah tangga yang stabil tinggi.',
    rekomendasi_waktu_tanam: 'Tanam serentak pada awal musim hujan (November) untuk panen raya Februari-Maret dengan harga gabah optimal.',
    historis_bulanan: make12MonthCurve(7200, [1, 2, 12], 0.08),
    karakteristik_tanah: 'Lempung berlumpur (alluvial/grumusol), lapisan kedap air di kedalaman 20-30 cm, drainase terkontrol',
    ph_ideal: 'pH 5.5 - 7.0',
    umur_panen: '105 - 120 HST',
    potensi_hasil_per_ha: '6.5 - 9.0 Ton Gabah Kering Panen (GKP)',
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: 'Terapkan sistem tanam jajar legowo 2:1 atau 4:1 untuk meningkatkan populasi tanaman dan memperlancar sirkulasi udara.'
  },
  {
    komoditas: 'Padi Gogo (Lahan Kering)',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 7800,
    tren_mingguan: 'Naik',
    persentase_tren: 3.5,
    musim_puncak: 'Desember - Maret (Musim Paceklik Sawah Irigasi)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Padi beras merah dan hitam gogo memiliki nilai pasar premium di kalangan konsumen perkotaan dan penderita diabetes.',
    rekomendasi_waktu_tanam: 'Tanam pada awal musim hujan pertama (Oktober-November) saat curah hujan mulai mencukupi kelembapan tanah.',
    historis_bulanan: make12MonthCurve(7800, [1, 2, 12], 0.12),
    karakteristik_tanah: 'Tanah tegalan gembur berpasir atau latosol dengan kandungan bahan organik cukup',
    ph_ideal: 'pH 5.0 - 6.5',
    umur_panen: '110 - 130 HST',
    potensi_hasil_per_ha: '4.0 - 6.0 Ton GKP',
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: 'Gunakan varietas tahan kekeringan seperti Inpago 8, 9, atau 12 dan beri pupuk kandang matang saat olah tanah.'
  },
  {
    komoditas: 'Jagung Manis',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 9500,
    tren_mingguan: 'Naik',
    persentase_tren: 5.0,
    musim_puncak: 'Desember (Tahun Baru & Wisata Kuliner)',
    bulan_harga_tertinggi: ['Desember', 'Januari', 'Juli'],
    alasan_permintaan: 'Permintaan jagung bakar wisata, pasar modern, dan horeka (hotel, restoran, kafe) meningkat drastis di akhir tahun.',
    rekomendasi_waktu_tanam: 'Tanam pada minggu ketiga Oktober agar tongkol masak susu siap petik di minggu terakhir Desember.',
    historis_bulanan: make12MonthCurve(9500, [7, 12, 1], 0.25),
    karakteristik_tanah: 'Lempung berpasir gembur kaya hara, drainase cepat tanpa genangan air',
    ph_ideal: 'pH 5.8 - 6.8',
    umur_panen: '68 - 75 HST',
    potensi_hasil_per_ha: '12 - 16 Ton Tongkol Segar',
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: 'Panen tepat saat biji masak susu di pagi hari sebelum matahari terik agar kadar gula tetap maksimal manis.'
  },
  {
    komoditas: 'Jagung Hibrida (Pakan)',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 5600,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.8,
    musim_puncak: 'Oktober - Desember (Kebutuhan Industri Pakan Ternak)',
    bulan_harga_tertinggi: ['Oktober', 'November', 'Desember'],
    alasan_permintaan: 'Pabrik pakan ternak (feedmill) nasional membutuhkan pasokan pipil kering kadar air 14% dalam volume tanpa batas.',
    rekomendasi_waktu_tanam: 'Tanam di musim kemarau kedua (MK2) Juli-Agustus jika ada sumur bor, atau awal musim hujan.',
    historis_bulanan: make12MonthCurve(5600, [10, 11, 12], 0.10),
    karakteristik_tanah: 'Tanah alluvial, andosol, atau latosol berdrainase lancar',
    ph_ideal: 'pH 5.6 - 7.2',
    umur_panen: '100 - 115 HST',
    potensi_hasil_per_ha: '8.0 - 11.5 Ton Pipil Kering',
    estimasi_biaya_per_ha: 13500000,
    tips_agronomis: 'Pastikan penjemuran pipilan mencapai kadar air 14-15% agar tidak ditolak pabrik pakan dan harga jual maksimal.'
  },
  {
    komoditas: 'Ubi Kayu / Singkong',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 3200,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Sepanjang Tahun (Industri Tapioka & Bioetanol)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Juli', 'Agustus'],
    alasan_permintaan: 'Pabrik tapioka, mocaf, dan bahan baku pakan menyerap pasokan singkong secara rutin dengan risiko pasar minim.',
    rekomendasi_waktu_tanam: 'Tanam awal musim hujan (Oktober-November) untuk panen 8-10 bulan kemudian.',
    historis_bulanan: make12MonthCurve(3200, [1, 7, 8], 0.08),
    karakteristik_tanah: 'Tanah gembur berpasir tebal, tidak berbatu agar umbi tumbuh lurus dan besar',
    ph_ideal: 'pH 5.0 - 6.5',
    umur_panen: '8 - 11 Bulan',
    potensi_hasil_per_ha: '25 - 45 Ton Umbi Basah',
    estimasi_biaya_per_ha: 11000000,
    tips_agronomis: 'Gunakan bibit stek varietas Gajah, Garuda, atau Kasces dengan kemiringan tancap 45 derajat.'
  },
  {
    komoditas: 'Ubi Jalar',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 5500,
    tren_mingguan: 'Naik',
    persentase_tren: 3.2,
    musim_puncak: 'Oktober - Januari (Musim Hujan & Kuliner Olahan)',
    bulan_harga_tertinggi: ['Oktober', 'November', 'Desember', 'Januari'],
    alasan_permintaan: 'Ubi madu Cilembu dan ubi ungu diminati pasar ekspor Singapura/Malaysia serta industri tepung pangan fungsional.',
    rekomendasi_waktu_tanam: 'Tanam pada Juli-Agustus untuk panen raya pada Oktober-Desember saat permintaan olahan kue tinggi.',
    historis_bulanan: make12MonthCurve(5500, [10, 11, 12, 1], 0.15),
    karakteristik_tanah: 'Tanah lempung berpasir gembur dengan guludan tinggi 30-40 cm',
    ph_ideal: 'pH 5.5 - 6.8',
    umur_panen: '3.5 - 4.5 Bulan',
    potensi_hasil_per_ha: '18 - 28 Ton Umbi',
    estimasi_biaya_per_ha: 13000000,
    tips_agronomis: 'Pembalikan batang sulur rutin tiap 3 minggu agar akar tidak tumbuh di ruas dan nutrisi terfokus ke umbi utama.'
  },
  {
    komoditas: 'Kedelai',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 11500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.2,
    musim_puncak: 'Sepanjang Tahun (Kebutuhan Pengrajin Tahu & Tempe)',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Agustus', 'Desember'],
    alasan_permintaan: 'Ketergantungan impor tinggi menjadikan kedelai lokal berbiji besar sangat dicari pengrajin tahu-tempe higienis.',
    rekomendasi_waktu_tanam: 'Tanam pada awal musim kemarau (Maret-April) setelah panen padi pertama.',
    historis_bulanan: make12MonthCurve(11500, [6, 7, 12], 0.09),
    karakteristik_tanah: 'Lempung berpasir alluvial, drainase baik, tidak tahan genangan air',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '75 - 85 HST',
    potensi_hasil_per_ha: '2.2 - 3.2 Ton Biji Kering',
    estimasi_biaya_per_ha: 9500000,
    tips_agronomis: 'Inokulasi benih dengan bakteri Rhizobium (Legin) sebelum tanam untuk mengikat nitrogen bebas dari udara.'
  },
  {
    komoditas: 'Kacang Tanah',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 18500,
    tren_mingguan: 'Naik',
    persentase_tren: 2.8,
    musim_puncak: 'Menjelang Lebaran & Akhir Tahun',
    bulan_harga_tertinggi: ['Maret', 'April', 'November', 'Desember'],
    alasan_permintaan: 'Bahan baku bumbu pecel, bumbu gado-gado, dan camilan kacang asin kemasan konsumsi masal.',
    rekomendasi_waktu_tanam: 'Tanam di akhir musim hujan (Februari-Maret) agar pembentukan polong terjadi pada kondisi tanah remah.',
    historis_bulanan: make12MonthCurve(18500, [3, 4, 11, 12], 0.16),
    karakteristik_tanah: 'Tanah berpasir gembur ringan agar ginofor mudah masuk ke dalam tanah',
    ph_ideal: 'pH 5.8 - 6.8',
    umur_panen: '90 - 100 HST',
    potensi_hasil_per_ha: '3.0 - 4.5 Ton Polong Basah (1.8 Ton Kering)',
    estimasi_biaya_per_ha: 11500000,
    tips_agronomis: 'Lakukan penyiangan dan pembumbunan tanah saat tanaman mulai berbunga agar ginofor tertutup tanah gembur.'
  },
  {
    komoditas: 'Porang (Amorphophallus muelleri)',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 6500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.8,
    musim_puncak: 'Mei - Juli (Musim Dorman Panen Umbi)',
    bulan_harga_tertinggi: ['Mei', 'Juni', 'Juli'],
    alasan_permintaan: 'Kandungan glukomanan tinggi untuk tepung shirataki, beras konyaku diet, dan bahan industri perekat ramah lingkungan ekspor.',
    rekomendasi_waktu_tanam: 'Tanam katak/umbi di awal musim hujan (Oktober-November) di bawah tegakan naungan ringan.',
    historis_bulanan: make12MonthCurve(6500, [5, 6, 7], 0.22),
    karakteristik_tanah: 'Tanah gembur berhumus tebal, porous, naungan 30-40% (agroforestri/pepohonan)',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '5 - 6 Bulan per musim (dorman)',
    potensi_hasil_per_ha: '25 - 40 Ton Umbi Basah per musim kedua',
    estimasi_biaya_per_ha: 32000000,
    tips_agronomis: 'Manfaatkan naungan pohon sengon, jati, atau pisang. Panen hanya saat daun sudah rebah kuning alami (fase dormansi).'
  },
  {
    komoditas: 'Sorgum',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 6800,
    tren_mingguan: 'Naik',
    persentase_tren: 3.0,
    musim_puncak: 'Juni - September (Kemarau & Ketahanan Pangan Kering)',
    bulan_harga_tertinggi: ['Juli', 'Agustus', 'September'],
    alasan_permintaan: 'Toleran kekeringan ekstrem, bebas gluten untuk tepung sehat, dan biomasa batangnya diserap peternak untuk pakan silase.',
    rekomendasi_waktu_tanam: 'Tanam pada akhir musim hujan (April-Mei) saat tanaman lain tidak mampu bertahan tanpa irigasi.',
    historis_bulanan: make12MonthCurve(6800, [7, 8, 9], 0.14),
    karakteristik_tanah: 'Mampu tumbuh di tanah marjinal, liat berat, tanah berpasir, dan minim unsur hara',
    ph_ideal: 'pH 5.5 - 7.8',
    umur_panen: '95 - 110 HST',
    potensi_hasil_per_ha: '5.0 - 8.0 Ton Biji Kering + 30 Ton Biomasa',
    estimasi_biaya_per_ha: 8500000,
    tips_agronomis: 'Sorgum dapat diratun (dipangkas pangkal batangnya) setelah panen pertama untuk panen kedua tanpa perlu olah tanah lagi.'
  },
  {
    komoditas: 'Talas / Keladi',
    kategori: 'Tanaman Pangan',
    icon: '',
    harga_saat_ini: 8500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Desember - Februari (Kebutuhan Camilan Musim Dingin)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Talas Pratama dan Talas Bogor sangat diminati industri kuliner kue lapis talas dan pasar ekspor Jepang (Satoimo).',
    rekomendasi_waktu_tanam: 'Tanam awal musim hujan dengan ketersediaan air melimpah namun tidak menggenang lama.',
    historis_bulanan: make12MonthCurve(8500, [1, 2, 12], 0.12),
    karakteristik_tanah: 'Lempung berpasir gembur kaya bahan organik dan lembap sepanjang pertumbuhan',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: '6 - 8 Bulan',
    potensi_hasil_per_ha: '20 - 35 Ton Umbi',
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: 'Beri pupuk kandang matang dosis tinggi dan lakukan penyiangan gulma hati-hati agar umbi samping tidak terluka.'
  },

  // ==================== SAYURAN ====================
  {
    komoditas: 'Bawang Merah',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 42000,
    tren_mingguan: 'Naik',
    persentase_tren: 8.5,
    musim_puncak: 'Ramadhan, Idul Fitri & Desember (Musim Rendengan Banjir)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'April', 'Desember'],
    alasan_permintaan: 'Bumbu dapur utama rumah tangga dan industri bumbu instan dengan fluktuasi pasokan tinggi akibat cuaca basah.',
    rekomendasi_waktu_tanam: 'Tanam di musim kemarau (Mei-Juni) di sentra irigasi, atau akhir musim hujan untuk panen harga tinggi.',
    historis_bulanan: make12MonthCurve(42000, [1, 3, 4, 12], 0.35),
    karakteristik_tanah: 'Lempung berpasir gembur, struktur remah, aerasi baik, guludan 30 cm',
    ph_ideal: 'pH 6.0 - 6.8',
    umur_panen: '55 - 65 HST',
    potensi_hasil_per_ha: '12 - 18 Ton Umbi Basah (8-12 Ton Kering)',
    estimasi_biaya_per_ha: 45000000,
    tips_agronomis: 'Gunakan bibit umbi bersertifikat varietas Bima Brebes atau Tajuk yang sudah dorman 2 bulan agar tunas serempak.'
  },
  {
    komoditas: 'Bawang Putih',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 38000,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Menjelang Hari Raya & Sepanjang Tahun',
    bulan_harga_tertinggi: ['Maret', 'April', 'Desember'],
    alasan_permintaan: 'Kebutuhan bumbu harian tinggi; varietas lokal aroma tajam memiliki pembeli setia di pasar tradisional.',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi (>800 mdpl) pada awal musim kemarau (Mei-Juni) dengan ketersediaan air irigasi.',
    historis_bulanan: make12MonthCurve(38000, [3, 4, 12], 0.15),
    karakteristik_tanah: 'Tanah andosol dataran tinggi, gembur, drainase lancar, kaya belerang alami',
    ph_ideal: 'pH 6.2 - 7.0',
    umur_panen: '95 - 120 HST',
    potensi_hasil_per_ha: '8 - 12 Ton Umbi Kering',
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: 'Hanya optimal di dataran tinggi sejuk (hawa pegunungan) agar umbi pecah siung sempurna.'
  },
  {
    komoditas: 'Bawang Daun / Prei',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.0,
    musim_puncak: 'Musim Hujan & Masa Hajatan/Kuliner',
    bulan_harga_tertinggi: ['November', 'Desember', 'Januari'],
    alasan_permintaan: 'Konsumsi warung bakso, martabak, mie ayam, dan bumbu dapur harian dengan siklus perputaran uang cepat.',
    rekomendasi_waktu_tanam: 'Tanam sistem tumpangsari atau monokultur pada tanah guludan gembur sepanjang tahun.',
    historis_bulanan: make12MonthCurve(14000, [11, 12, 1], 0.20),
    karakteristik_tanah: 'Lempung berpasir gembur dengan pembumbunan rutin agar batang putih lebih panjang',
    ph_ideal: 'pH 6.0 - 6.8',
    umur_panen: '60 - 75 HST',
    potensi_hasil_per_ha: '14 - 20 Ton Batang Segar',
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: 'Lakukan penimbunan pangkal batang (bumbun) bertahap tiap 2 minggu agar menghasilkan batang semu putih yang panjang dan renyah.'
  },
  {
    komoditas: 'Cabai Rawit Merah',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 75000,
    tren_mingguan: 'Naik',
    persentase_tren: 12.0,
    musim_puncak: 'Desember - Februari (Musim Hujan Basah / Serangan Antraknosa)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Pasokan sentra anjlok akibat curah hujan lebat dan penyakit patek, sementara konsumsi cabai pedas nusantara tidak pernah turun.',
    rekomendasi_waktu_tanam: 'Tanam pada akhir musim hujan (Maret-April) untuk biaya perawatan fungisida murah, atau tanam sistem greenhouse di musim basah.',
    historis_bulanan: make12MonthCurve(75000, [1, 2, 12], 0.40),
    karakteristik_tanah: 'Tanah andosol atau latosol remah, tidak becek, guludan tinggi 40 cm dilapisi mulsa plastik',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '80 - 90 HST (panen petik berulang hingga 6 bulan)',
    potensi_hasil_per_ha: '10 - 15 Ton Cabai Segar',
    estimasi_biaya_per_ha: 42000000,
    tips_agronomis: 'Gunakan naungan paranet/rain shelter di musim hujan dan semprot fungisida tembaga secara preventif sebelum hujan deras.'
  },
  {
    komoditas: 'Cabai Merah Besar',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 52000,
    tren_mingguan: 'Naik',
    persentase_tren: 7.2,
    musim_puncak: 'Menjelang Idul Fitri & Akhir Tahun',
    bulan_harga_tertinggi: ['Maret', 'April', 'Desember'],
    alasan_permintaan: 'Bahan bumbu balado, rendang, dan industri saus sambal dengan volume pembelian partai besar di pasar induk.',
    rekomendasi_waktu_tanam: 'Tanam pada bulan Juli-Agustus untuk panen raya harga tinggi di November-Desember.',
    historis_bulanan: make12MonthCurve(52000, [3, 4, 12], 0.30),
    karakteristik_tanah: 'Lempung berpasir gembur, kaya kalsium agar kulit buah tebal dan tidak mudah busuk',
    ph_ideal: 'pH 6.0 - 6.8',
    umur_panen: '75 - 85 HST',
    potensi_hasil_per_ha: '12 - 18 Ton Buah Segar',
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: 'Cukupi kebutuhan kalsium (kalsium nitrat) saat fase pembentukan buah untuk mencegah penyakit pantat busuk (blossom end rot).'
  },
  {
    komoditas: 'Tomat Sayur',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: 'Naik',
    persentase_tren: 6.5,
    musim_puncak: 'Januari - Maret & Hari Raya',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret'],
    alasan_permintaan: 'Kebutuhan harian bumbu dapur, restoran, dan industri sari tomat dengan perputaran penjualan sangat cepat.',
    rekomendasi_waktu_tanam: 'Tanam pada akhir musim hujan (April-Mei) agar bunga tidak rontok terkena tetesan air hujan deras.',
    historis_bulanan: make12MonthCurve(18000, [1, 2, 3], 0.28),
    karakteristik_tanah: 'Tanah gembur kaya humus dengan drainase sangat baik, guludan mulsa perak',
    ph_ideal: 'pH 5.8 - 6.8',
    umur_panen: '60 - 70 HST',
    potensi_hasil_per_ha: '25 - 35 Ton Buah Segar',
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: 'Pangkas tunas air (wiwil) dan ikat batang utama pada ajir bambu setinggi 1.5 meter agar tanaman tegak dan sirkulasi angin lancar.'
  },
  {
    komoditas: 'Kentang',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 16000,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.8,
    musim_puncak: 'Liburan Sekolah, Ramadhan & Akhir Tahun',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Desember'],
    alasan_permintaan: 'Kebutuhan industri keripik olahan dan konsumsi sup rumah tangga di perkotaan stabil sepanjang tahun.',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi (>1.000 mdpl) pada akhir musim hujan (April-Mei).',
    historis_bulanan: make12MonthCurve(16000, [6, 7, 12], 0.15),
    karakteristik_tanah: 'Tanah andosol vulkanik pegunungan, gembur, subur, kaya hara kalium',
    ph_ideal: 'pH 5.0 - 6.5',
    umur_panen: '90 - 110 HST',
    potensi_hasil_per_ha: '20 - 30 Ton Umbi Grade A/B',
    estimasi_biaya_per_ha: 48000000,
    tips_agronomis: 'Gunakan bibit kentang G2/G3 bersertifikat bebas virus dan bumbun tanah 2-3 kali untuk mencegah umbi menghijau terkena matahari.'
  },
  {
    komoditas: 'Wortel',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.0,
    musim_puncak: 'Sepanjang Tahun (Konsumsi Harian Sehat)',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: 'Sayuran wajib kuliner sup dan jus kesehatan keluarga dengan daya simpan lebih tahan lama dibanding sayuran daun.',
    rekomendasi_waktu_tanam: 'Tanam bergelombang tiap bulan di dataran medium-tinggi dengan irigasi teratur.',
    historis_bulanan: make12MonthCurve(12000, [1, 7, 12], 0.14),
    karakteristik_tanah: 'Tanah berpasir dalam gembur bebas batu agar umbi tumbuh lurus sempurna tanpa cabang',
    ph_ideal: 'pH 6.0 - 6.8',
    umur_panen: '90 - 100 HST',
    potensi_hasil_per_ha: '20 - 32 Ton Umbi',
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: 'Olah tanah hingga kedalaman 35 cm dan saring batu-batu kerikil agar umbi wortel tidak bercabang atau bengkok.'
  },
  {
    komoditas: 'Kubis / Kol',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 8500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.5,
    musim_puncak: 'Musim Hujan Dataran Rendah (Pasokan Pegunungan Terbatas)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Kebutuhan pasar sayur segar, olahan lalapan, dan pasar ekspor ke Taiwan/Malaysia.',
    rekomendasi_waktu_tanam: 'Tanam pada akhir musim hujan di dataran tinggi untuk menghindari busuk basah bakteri krop.',
    historis_bulanan: make12MonthCurve(8500, [1, 2, 12], 0.22),
    karakteristik_tanah: 'Lempung andosol kaya hara, drainase sangat lancar',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '70 - 85 HST',
    potensi_hasil_per_ha: '25 - 40 Ton Krop Segar',
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: 'Kendalikan ulat krop Plutella xylostella secara terpadu dengan bioinsektisida Bacillus thuringiensis sejak awal pembentukan krop.'
  },
  {
    komoditas: 'Buncis',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: 'Naik',
    persentase_tren: 3.8,
    musim_puncak: 'Hari Raya & Musim Resepsi Pernikahan',
    bulan_harga_tertinggi: ['April', 'Mei', 'Juli', 'Desember'],
    alasan_permintaan: 'Buncis tegak maupun rambat (baby buncis) memiliki pasar supermarket premium dan pasar katering pesta yang stabil.',
    rekomendasi_waktu_tanam: 'Tanam pada awal musim kemarau dengan mulsa dan ajir rambat tegak.',
    historis_bulanan: make12MonthCurve(14000, [4, 5, 12], 0.18),
    karakteristik_tanah: 'Lempung gembur remah dengan drainase sempurna',
    ph_ideal: 'pH 5.8 - 6.8',
    umur_panen: '45 - 55 HST',
    potensi_hasil_per_ha: '12 - 18 Ton Polong Muda',
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: 'Petik polong saat masih muda dan biji belum menonjol agar tekstur renyah manis dan dihargai grade A.'
  },
  {
    komoditas: 'Kangkung',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 4500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.0,
    musim_puncak: 'Sepanjang Tahun (Siklus Cepat Cashflow Harian)',
    bulan_harga_tertinggi: ['Januari', 'Desember'],
    alasan_permintaan: 'Sayuran rakyat paling populer dengan siklus tanam tercepat (21-25 hari) untuk menjaga arus kas harian petani.',
    rekomendasi_waktu_tanam: 'Bisa ditanam bergilir setiap minggu sepanjang tahun di lahan sawah maupun tegalan.',
    historis_bulanan: make12MonthCurve(4500, [1, 12], 0.10),
    karakteristik_tanah: 'Mampu tumbuh di semua jenis tanah alluvial atau lempung basah',
    ph_ideal: 'pH 5.5 - 7.0',
    umur_panen: '21 - 25 HST',
    potensi_hasil_per_ha: '15 - 20 Ton (Dua kali tanam sebulan)',
    estimasi_biaya_per_ha: 6000000,
    tips_agronomis: 'Gunakan metode cabut akar dan siram teratur di sore hari untuk menjaga kesegaran daun sebelum dikirim ke pasar pagi.'
  },
  {
    komoditas: 'Bayam',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 5000,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.2,
    musim_puncak: 'Sepanjang Tahun',
    bulan_harga_tertinggi: ['Januari', 'Desember'],
    alasan_permintaan: 'Sumber zat besi utama konsumsi harian keluarga Indonesia dengan permintaan konstan di seluruh pasar tradisional.',
    rekomendasi_waktu_tanam: 'Tanam bergilir secara berkelanjutan dengan bedengan dinaikkan 20 cm.',
    historis_bulanan: make12MonthCurve(5000, [1, 12], 0.10),
    karakteristik_tanah: 'Tanah gembur remah, kaya nitrogen organik alami',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '25 - 30 HST',
    potensi_hasil_per_ha: '12 - 16 Ton',
    estimasi_biaya_per_ha: 6500000,
    tips_agronomis: 'Tabur benih campur pasir halus agar persebaran rata dan tidak berdesakan saat kecambah tumbuh.'
  },
  {
    komoditas: 'Terong',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 9000,
    tren_mingguan: 'Naik',
    persentase_tren: 3.5,
    musim_puncak: 'Ramadhan & Musim Pesta',
    bulan_harga_tertinggi: ['Maret', 'April', 'November'],
    alasan_permintaan: 'Terong ungu panjang diserap warung lalapan, restoran padang, dan catering dengan masa panen panjang hingga 5 bulan.',
    rekomendasi_waktu_tanam: 'Tanam di awal musim kemarau dengan pengairan leb berkala.',
    historis_bulanan: make12MonthCurve(9000, [3, 4, 11], 0.16),
    karakteristik_tanah: 'Lempung berpasir subur, drainase bebas genangan',
    ph_ideal: 'pH 5.8 - 6.8',
    umur_panen: '55 - 65 HST (panen petik tiap 4 hari)',
    potensi_hasil_per_ha: '25 - 40 Ton Buah',
    estimasi_biaya_per_ha: 17000000,
    tips_agronomis: 'Petik buah sebelum biji di dalamnya mengeras dan kulit buah mulai kusam agar tetap segar mengkilap.'
  },
  {
    komoditas: 'Timun / Mentimun',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 7500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.0,
    musim_puncak: 'Bulan Puasa Ramadhan & Musim Kemarau Panas',
    bulan_harga_tertinggi: ['Maret', 'April', 'Agustus'],
    alasan_permintaan: 'Kebutuhan es timun serut segar saat buka puasa dan lalapan harian melonjak tinggi di bulan Ramadhan.',
    rekomendasi_waktu_tanam: 'Tanam 35 hari sebelum awal bulan Ramadhan agar puncak panen tepat di minggu pertama puasa.',
    historis_bulanan: make12MonthCurve(7500, [3, 4, 8], 0.24),
    karakteristik_tanah: 'Tanah lempung gembur dengan para-para atau ajir bambu',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '35 - 40 HST (panen petik tiap 2 hari)',
    potensi_hasil_per_ha: '30 - 45 Ton Buah Segar',
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: 'Irigasi rutin tiap pagi hari saat pembesaran buah agar buah timun lurus, berair manis, dan tidak berasa pahit.'
  },
  {
    komoditas: 'Jamur Tiram',
    kategori: 'Sayuran',
    icon: '',
    harga_saat_ini: 17500,
    tren_mingguan: 'Naik',
    persentase_tren: 3.0,
    musim_puncak: 'Sepanjang Tahun (Tidak Terpengaruh Cuaca Ekstrem)',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: 'Tren kuliner jamur krispi dan pengganti daging vegetarian; budidaya di dalam kumbung tertutup tahan anomali cuaca.',
    rekomendasi_waktu_tanam: 'Inokulasi baglog dapat dilakukan kapan saja dalam rumah kumbung dengan pengkabutan air berkala.',
    historis_bulanan: make12MonthCurve(17500, [1, 7, 12], 0.12),
    karakteristik_tanah: 'Media tanam baglog serbuk kayu sengon/karet + bekatul + kapur pertanian dalam ruangan kumbung',
    ph_ideal: 'Suhu 24-28 C, Kelembapan 80-90%',
    umur_panen: '35 - 45 Hari setelah inokulasi (panen berulang)',
    potensi_hasil_per_ha: '0.4 - 0.6 kg per baglog (Skala 10.000 baglog = 4-6 Ton)',
    estimasi_biaya_per_ha: 25000000,
    tips_agronomis: 'Jaga sirkulasi ventilasi udara kumbung dan gunakan nozzle kabut halus saat cuaca terik di siang hari.'
  },

  // ==================== BUAH-BUAHAN ====================
  {
    komoditas: 'Apel (Manalagi / Rome Beauty)',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 32000,
    tren_mingguan: 'Naik',
    persentase_tren: 5.2,
    musim_puncak: 'Liburan Sekolah, Hari Raya & Musim Wisata Petik Apel (Juni-Juli & Des)',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Desember', 'Januari'],
    alasan_permintaan: 'Apel khas dataran tinggi nusantara (Manalagi manis harum dan Rome Beauty renyah) memiliki pasar wisata kuliner, industri olahan sari apel/keripik, dan ritel premium yang sangat tinggi.',
    rekomendasi_waktu_tanam: 'Lakukan perompesan daun pada awal Maret untuk panen raya liburan Juli, atau rompes bulan Agustus untuk panen akhir tahun Desember.',
    historis_bulanan: make12MonthCurve(32000, [6, 7, 12, 1], 0.22),
    karakteristik_tanah: 'Tanah andosol vulkanis pegunungan, gembur berpasir kaya bahan organik, drainase lancar, ketinggian 700 - 1.200 mdpl',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: 'Bibit Okulasi: 3–4 Tahun (~1.200 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (fase bunga ke buah matang ±120–140 hari)',
    potensi_hasil_per_ha: '18 - 28 Ton Buah Segar per tahun',
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: 'Terapkan perompesan daun serentak (defoliasi buatan) pasca pemangkasan tajuk, penjarangan pentil 1-2 buah per dompolan, dan pembungkusan buah untuk mencegah sengatan lalat buah.'
  },
  {
    komoditas: 'Jeruk (Siam / Keprok)',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 16500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.8,
    musim_puncak: 'Tahun Baru Imlek (Jan-Feb) & Ramadhan',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Buah meja harian kaya vitamin C dengan konsumsi massal rumah tangga dan seserahan tradisi Imlek.',
    rekomendasi_waktu_tanam: 'Tanam bibit okulasi awal musim hujan; atur pembuahan dengan stress air terencana.',
    historis_bulanan: make12MonthCurve(16500, [1, 2, 12], 0.22),
    karakteristik_tanah: 'Lempung berpasir gembur tebal, tidak tergenang, air tanah kedalaman > 1.5 meter',
    ph_ideal: 'pH 5.8 - 6.5',
    umur_panen: 'Bibit Okulasi: 2.5–3 Tahun (~900 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (fase bunga ke buah matang ±210–240 hari)',
    potensi_hasil_per_ha: '18 - 30 Ton / Ha per tahun',
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: 'Gunakan bibit bebas penyakit CVPD bersertifikat dan pangkas bentuk tajuk 1-3-9 sejak dini.'
  },
  {
    komoditas: 'Anggur',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 65000,
    tren_mingguan: 'Naik',
    persentase_tren: 6.0,
    musim_puncak: 'Akhir Tahun & Hari Raya Keagamaan',
    bulan_harga_tertinggi: ['November', 'Desember', 'Januari'],
    alasan_permintaan: 'Anggur meja varietas impor adaptif (Transfigurasi, Jupiter, Akademik) sangat diminati dengan harga premium lokal.',
    rekomendasi_waktu_tanam: 'Tanam bibit grafting berakar kuat di bawah naungan atap plastik UV pada awal kemarau.',
    historis_bulanan: make12MonthCurve(65000, [11, 12, 1], 0.25),
    karakteristik_tanah: 'Porous berpasir dicampur kompos matang, sekam bakar, dan kapur dolomit',
    ph_ideal: 'pH 6.5 - 7.2',
    umur_panen: 'Stek/Grafting: 10–12 Bulan (~330 HST) hingga Pembuahan Perdana',
    potensi_hasil_per_ha: '8 - 14 Ton Buah Segar',
    estimasi_biaya_per_ha: 75000000,
    tips_agronomis: 'Terapkan atap UV sederhana dan lakukan pemangkasan pembuahan (pruning) setelah cabang tersier cokelat berkayu.'
  },
  {
    komoditas: 'Pisang Cavendish',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 8500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Sepanjang Tahun (Konsumsi Buah Meja Harian)',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: 'Pasokan jaringan ritel modern, pasar induk, dan katering buah sehat dengan permintaan stabil tanpa henti.',
    rekomendasi_waktu_tanam: 'Tanam bibit kultur jaringan di awal musim hujan dengan jarak tanam teratur 2x2.5 meter.',
    historis_bulanan: make12MonthCurve(8500, [1, 7, 12], 0.10),
    karakteristik_tanah: 'Tanah alluvial atau latosol subur tebal gembur, tidak tergenang',
    ph_ideal: 'pH 5.5 - 6.8',
    umur_panen: 'Bibit Anakan: 9–11 Bulan (~300 HST) hingga Panen Tandan',
    potensi_hasil_per_ha: '35 - 55 Ton Tandan Buah Segar',
    estimasi_biaya_per_ha: 26000000,
    tips_agronomis: 'Bungkus (brongsong) tandan buah pisang dengan plastik biru sejak jantung merunduk untuk mencegah luka lalat buah.'
  },
  {
    komoditas: 'Mangga',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.0,
    musim_puncak: 'September - November (Musim Mangga Harum Manis & Gedong Gincu)',
    bulan_harga_tertinggi: ['September', 'Oktober', 'November'],
    alasan_permintaan: 'Buah musiman ikonik nusantara dengan serapan tinggi pasar domestik dan ekspor ke Singapura/Timur Tengah.',
    rekomendasi_waktu_tanam: 'Tanam pada awal musim hujan di wilayah kering beriklim tipe D/E (Jawa Timur, Pantura, NTB).',
    historis_bulanan: make12MonthCurve(22000, [9, 10, 11], 0.32),
    karakteristik_tanah: 'Lempung berpasir tanah kering dengan musim kemarau tegas 3-4 bulan untuk merangsang bunga',
    ph_ideal: 'pH 5.5 - 7.0',
    umur_panen: 'Bibit Okulasi: 3–4 Tahun (~1.200 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (fase bunga ke buah matang ±110–130 hari)',
    potensi_hasil_per_ha: '15 - 25 Ton per tahun',
    estimasi_biaya_per_ha: 30000000,
    tips_agronomis: 'Memerlukan musim kemarau kering selama 2-3 bulan agar pucuk vegetatif berhenti dan berganti menjadi bunga serempak.'
  },
  {
    komoditas: 'Semangka',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 5500,
    tren_mingguan: 'Naik',
    persentase_tren: 5.5,
    musim_puncak: 'Musim Kemarau Terik (Agustus - Oktober) & Ramadhan',
    bulan_harga_tertinggi: ['Maret', 'April', 'September', 'Oktober'],
    alasan_permintaan: 'Minuman dan buah segar pelepas dahaga nomor satu di musim panas dan bulan puasa.',
    rekomendasi_waktu_tanam: 'Tanam pada bulan Mei-Juni di lahan sawah pasca panen padi (musim kemarau MK1).',
    historis_bulanan: make12MonthCurve(5500, [3, 4, 9, 10], 0.28),
    karakteristik_tanah: 'Lempung berpasir gembur subur, saluran drainase dalam (parit 50 cm)',
    ph_ideal: 'pH 6.0 - 6.8',
    umur_panen: '55 - 65 HST',
    potensi_hasil_per_ha: '30 - 45 Ton Buah Segar',
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: 'Pilih 1 atau 2 bakal buah terbaik pada ruas ke-12 ke atas dan buang calon buah lainnya agar ukuran buah maksimal besar.'
  },
  {
    komoditas: 'Melon',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: 'Naik',
    persentase_tren: 6.2,
    musim_puncak: 'Bulan Puasa Ramadhan & Akhir Tahun',
    bulan_harga_tertinggi: ['Maret', 'April', 'Desember'],
    alasan_permintaan: 'Melon Golden, Cantaloupe, dan Rock Melon dihargai premium di pasar buah modern dan parcel hari raya.',
    rekomendasi_waktu_tanam: 'Tanam di musim kemarau cerah atau sistem green house hidroponik sepanjang tahun.',
    historis_bulanan: make12MonthCurve(12000, [3, 4, 12], 0.26),
    karakteristik_tanah: 'Lempung berpasir porous kaya kalium dan kalsium alami',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: '60 - 70 HST',
    potensi_hasil_per_ha: '25 - 35 Ton Buah Grade A',
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: 'Kurangi penyiraman 10 hari menjelang panen untuk menaikkan kadar brix (kemanisan) buah melon di atas 13 brix.'
  },
  {
    komoditas: 'Pepaya',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 6500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.8,
    musim_puncak: 'Sepanjang Tahun',
    bulan_harga_tertinggi: ['Januari', 'Desember'],
    alasan_permintaan: 'Pepaya California manis berukuran sedang adalah buah pencuci mulut harian terpopuler di warung dan rumah tangga.',
    rekomendasi_waktu_tanam: 'Tanam di awal musim hujan pada guludan tanah bebas banjir.',
    historis_bulanan: make12MonthCurve(6500, [1, 12], 0.12),
    karakteristik_tanah: 'Lempung berpasir subur, gembur, tidak boleh ada air menggenang lebih dari 12 jam',
    ph_ideal: 'pH 6.0 - 6.7',
    umur_panen: 'Semaian Bibit: 7–8 Bulan (~240 HST) mulai Panen Rutin Mingguan',
    potensi_hasil_per_ha: '50 - 75 Ton per tahun',
    estimasi_biaya_per_ha: 24000000,
    tips_agronomis: 'Buat guludan tinggi dan parit drainase dalam. Akar pepaya sangat rentan busuk Phytophthora jika tergenang air.'
  },
  {
    komoditas: 'Alpukat (Miki / Aligator)',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 32000,
    tren_mingguan: 'Naik',
    persentase_tren: 5.0,
    musim_puncak: 'Sepanjang Tahun (Tren Makanan Sehat & Jus Buah)',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: 'Tren gaya hidup sehat bebas kolesterol menjadikan alpukat buah favorit dengan serapan tinggi di ritel modern.',
    rekomendasi_waktu_tanam: 'Tanam awal musim hujan pada jarak tanam 6x6 atau 7x7 meter.',
    historis_bulanan: make12MonthCurve(32000, [1, 7, 12], 0.18),
    karakteristik_tanah: 'Tanah andosol atau latosol gembur berpasir kaya hara organik',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: 'Bibit Okulasi: 3–4 Tahun (~1.200 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (fase bunga ke buah matang ±180–210 hari)',
    potensi_hasil_per_ha: '15 - 25 Ton per tahun saat dewasa',
    estimasi_biaya_per_ha: 36000000,
    tips_agronomis: 'Gunakan bibit sambung pucuk varietas Miki (tahan ulat buah) atau Aligator untuk bobot besar berdaging pulen mentega.'
  },
  {
    komoditas: 'Buah Naga Merah',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 18500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.5,
    musim_puncak: 'Tahun Baru Imlek (Januari - Februari) & Akhir Tahun',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Wajib ada pada ritual perayaan Imlek sebagai simbol kemakmuran dan bahan baku jus buah segar modern.',
    rekomendasi_waktu_tanam: 'Tanam stek batang tua pada tiang panjat beton di awal musim hujan.',
    historis_bulanan: make12MonthCurve(18500, [1, 2, 12], 0.28),
    karakteristik_tanah: 'Tanah berpasir porous, tahan kering, butuh sinar matahari penuh 100%',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: 'Stek Batang: 10–12 Bulan (~330 HST) hingga Panen Perdana',
    potensi_hasil_per_ha: '20 - 35 Ton Buah Segar',
    estimasi_biaya_per_ha: 45000000,
    tips_agronomis: 'Gunakan lampu penerangan LED di malam hari saat musim non-bunga untuk memacu pembungaan di luar musim (off-season).'
  },
  {
    komoditas: 'Nanas (Madu Subang / Honi)',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 9500,
    tren_mingguan: 'Naik',
    persentase_tren: 4.8,
    musim_puncak: 'Juni - Agustus (Musim Kemarau/Piknik) & Desember (Tahun Baru)',
    bulan_harga_tertinggi: ['Juni', 'Juli', 'Agustus', 'Desember'],
    alasan_permintaan: 'Nanas madu memiliki serapan industri olahan selai, keripik buah, sari buah kemasan, konsumsi buah potong segar, dan pasar ekspor nanas kaleng yang stabil tinggi.',
    rekomendasi_waktu_tanam: 'Tanam bibit tunas batang (suckers) atau tunas buah (slips) pada awal musim hujan agar perakaran kuat sebelum fase induksi pembungaan.',
    historis_bulanan: make12MonthCurve(9500, [6, 7, 8, 12], 0.22),
    karakteristik_tanah: 'Tanah lempung berpasir gembur tebal kaya bahan organik, drainase sangat lancar tanpa genangan air, toleran lahan masam khas tropis',
    ph_ideal: 'pH 4.5 - 5.5',
    umur_panen: '270 - 300 HST (Rata-rata 285 HST / 9 - 10 Bulan)',
    potensi_hasil_per_ha: '45 - 65 Ton Buah Segar',
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: 'Lakukan induksi pembungaan (forcing dengan zat etilen/karbit) pada umur 6-7 bulan setelah kanopi memiliki minimal 35 helai daun aktif. Panen petik dilakukan tepat saat 25%-50% mata nanas di pangkal buah berubah kuning keemasan (285 HST) untuk rasa manis brix optimal.'
  },
  {
    komoditas: 'Durian (Montong / Bawor / Musang King)',
    kategori: 'Buah-Buahan',
    icon: '',
    harga_saat_ini: 65000,
    tren_mingguan: 'Naik',
    persentase_tren: 6.5,
    musim_puncak: 'November - Februari (Musim Panen Raya Durian Nusantara & Liburan Tahun Baru)',
    bulan_harga_tertinggi: ['Desember', 'Januari', 'Februari', 'Juli'],
    alasan_permintaan: 'Sebagai "Raja Buah" (King of Fruits), durian memiliki nilai ekonomi sangat tinggi dengan pasar domestik tak terbatas dan prospek ekspor buah beku/pasta ke Tiongkok dan Singapura.',
    rekomendasi_waktu_tanam: 'Tanam bibit okulasi unggul bersertifikat di awal musim hujan dengan jarak tanam 10x10 meter. Induksi pembungaan pohon dewasa dilakukan dengan periode pengeringan tanah (water stress) selama 3-4 minggu di musim kemarau.',
    historis_bulanan: make12MonthCurve(65000, [12, 1, 2, 7], 0.35),
    karakteristik_tanah: 'Tanah latosol atau andosol subur gembur kaya humus, lapisan tanah dalam (>1.5 m), lereng berdrainase prima tanpa air menggenang',
    ph_ideal: 'pH 6.0 - 6.8',
    umur_panen: 'Bibit Sambung Pucuk: 4–6 Tahun (~1.825 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (fase bunga mekar ke buah matang ±110–130 hari)',
    potensi_hasil_per_ha: '10 - 18 Ton Buah Durian per Ha per tahun pada tanaman dewasa produktif',
    estimasi_biaya_per_ha: 45000000,
    tips_agronomis: 'Lakukan penjarangan buah (fruit thinning) dengan menyisakan 2-3 buah terbaik per dahan saat pentil sebesar bola tenis. Pasang tali pengikat dahan dan buah agar dahan tidak patah serta buah tidak jatuh membentur tanah saat masak fisiologis.'
  },

  // ==================== REMPAH & BUMBU ====================
  {
    komoditas: 'Jahe Merah',
    kategori: 'Rempah & Bumbu',
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.5,
    musim_puncak: 'Musim Hujan Dingin (November - Februari) & Pabrik Jamu',
    bulan_harga_tertinggi: ['November', 'Desember', 'Januari', 'Februari'],
    alasan_permintaan: 'Bahan baku utama jamu herbal, suplemen imunitas tubuh, dan minuman hangat seduh dengan serapan stabil tinggi.',
    rekomendasi_waktu_tanam: 'Tanam di awal musim hujan (Oktober-November) dalam bedengan atau karung polybag.',
    historis_bulanan: make12MonthCurve(28000, [11, 12, 1, 2], 0.20),
    karakteristik_tanah: 'Lempung berpasir gembur kaya kompos matang, drainase lancar tanpa genangan',
    ph_ideal: 'pH 5.5 - 6.8',
    umur_panen: '9 - 11 Bulan',
    potensi_hasil_per_ha: '15 - 25 Ton Rimpang Segar',
    estimasi_biaya_per_ha: 32000000,
    tips_agronomis: 'Bumbun tanah berkala tiap 2 bulan agar rimpang bertingkat ke atas dan terlindung dari terik matahari langsung.'
  },
  {
    komoditas: 'Kunyit',
    kategori: 'Rempah & Bumbu',
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: 'Stabil',
    persentase_tren: 2.0,
    musim_puncak: 'Sepanjang Tahun (Industri Jamu & Bumbu Dapur)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Juli'],
    alasan_permintaan: 'Kandungan kurkumin alami dibutuhkan industri farmasi, bumbu gulai/kari, dan minuman kesehatan kunyit asam.',
    rekomendasi_waktu_tanam: 'Tanam di awal musim hujan secara monokultur atau tumpangsari di bawah pohon buah.',
    historis_bulanan: make12MonthCurve(12000, [1, 2, 7], 0.12),
    karakteristik_tanah: 'Tanah gembur tebal subur, toleran naungan ringan hingga 30%',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: '9 - 10 Bulan (saat daun mulai menguning gugur)',
    potensi_hasil_per_ha: '18 - 28 Ton Rimpang',
    estimasi_biaya_per_ha: 19000000,
    tips_agronomis: 'Panen tepat saat daun mulai layu dan mengering alami menandakan kandungan zat kurkumin sudah maksimal.'
  },
  {
    komoditas: 'Kencur',
    kategori: 'Rempah & Bumbu',
    icon: '',
    harga_saat_ini: 35000,
    tren_mingguan: 'Naik',
    persentase_tren: 5.0,
    musim_puncak: 'Musim Hujan & Masa Hajatan',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Rempah khusus bumbu seblak viral, beras kencur tradisional, dan industri jamu batuk herbal.',
    rekomendasi_waktu_tanam: 'Tanam pada awal musim hujan pada guludan yang diberi mulsa jerami padi.',
    historis_bulanan: make12MonthCurve(35000, [1, 2, 12], 0.22),
    karakteristik_tanah: 'Lempung berpasir gembur kaya bahan organik, drainase cepat',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: '8 - 10 Bulan',
    potensi_hasil_per_ha: '10 - 15 Ton Rimpang',
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: 'Tutup bedengan dengan jerami padi setelah tanam untuk menjaga kelembapan tanah dan menekan pertumbuhan rumput liar.'
  },
  {
    komoditas: 'Kapulaga Jawa',
    kategori: 'Rempah & Bumbu',
    icon: '',
    harga_saat_ini: 85000,
    tren_mingguan: 'Naik',
    persentase_tren: 6.5,
    musim_puncak: 'Musim Dingin Global & Ekspor Timur Tengah',
    bulan_harga_tertinggi: ['Oktober', 'November', 'Desember', 'Januari'],
    alasan_permintaan: 'Salah satu rempah termahal di dunia untuk minyak atsiri wewangian, bumbu kari Arab, dan farmasi herbal ekspor.',
    rekomendasi_waktu_tanam: 'Tanam anakan rumpun di bawah naungan pohon hutan rakyat pada awal musim hujan.',
    historis_bulanan: make12MonthCurve(85000, [10, 11, 12, 1], 0.25),
    karakteristik_tanah: 'Tanah hutan subur, lembap, naungan 40-60%, tidak tahan matahari terik langsung',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: 'Bibit Rumpun: 1.5–2 Tahun (~730 HST) hingga Panen Perdana | Siklus Buah Dewasa: 110–130 HST',
    potensi_hasil_per_ha: '2.5 - 4.5 Ton Buah Kering',
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: 'Bersihkan daun-daun kering di pangkal rumpun secara teratur agar sinar matahari menembus bunga dan memicu pembuahan.'
  },
  {
    komoditas: 'Vanili',
    kategori: 'Rempah & Bumbu',
    icon: '',
    harga_saat_ini: 250000,
    tren_mingguan: 'Naik',
    persentase_tren: 7.0,
    musim_puncak: 'Sepanjang Tahun (Pasar Ekspor Premium & Industri Bakery)',
    bulan_harga_tertinggi: ['Mei', 'Juni', 'Juli', 'Desember'],
    alasan_permintaan: 'Dikenal sebagai emas hijau; pasokan polong vanili kering berkualitas tinggi selalu kurang untuk pasar aroma makanan global.',
    rekomendasi_waktu_tanam: 'Tanam sulur pada pohon panjat tegak di awal musim hujan dengan naungan paranet 50%.',
    historis_bulanan: make12MonthCurve(250000, [5, 6, 7, 12], 0.20),
    karakteristik_tanah: 'Tanah kaya serasah organik gembur, aerasi tinggi, tidak boleh tergenang air',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: 'Sulur Tanam: 2–3 Tahun (~900 HST) hingga Panen Perdana | Siklus Polong: 240–270 HST',
    potensi_hasil_per_ha: '800 - 1.500 kg Polong Kering Grade A',
    estimasi_biaya_per_ha: 85000000,
    tips_agronomis: 'Lakukan penyerbukan bunga secara manual dengan lidi pada pagi hari (pukul 06.00-10.00) saat kepala putik terbuka sempurna.'
  },

  // ==================== PERKEBUNAN ====================
  {
    komoditas: 'Cokelat / Kakao',
    kategori: 'Perkebunan',
    icon: '',
    harga_saat_ini: 82000,
    tren_mingguan: 'Naik',
    persentase_tren: 15.0,
    musim_puncak: 'Defisit Biji Kakao Global (Harga Tertinggi Dekade Ini)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Maret', 'Desember'],
    alasan_permintaan: 'Gagal panen kakao di Afrika Barat memicu krisis pasokan global, pabrik pengolahan cokelat bersaing membeli biji kakao kering.',
    rekomendasi_waktu_tanam: 'Tanam bibit sambung samping klon MCC 02 pada awal musim hujan di bawah naungan pohon lamtoro/kelapa.',
    historis_bulanan: make12MonthCurve(82000, [1, 2, 3, 12], 0.28),
    karakteristik_tanah: 'Lempung liat berpasir tebal minimal 1.5 meter, kaya bahan organik, drainase lancar',
    ph_ideal: 'pH 6.0 - 7.0',
    umur_panen: 'Bibit Sambung: 2–3 Tahun (~800 HST) hingga Panen Perdana | Siklus Buah Dewasa: 150–180 HST',
    potensi_hasil_per_ha: '1.8 - 2.5 Ton Biji Kering Fermentasi',
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: 'Lakukan fermentasi biji dalam kotak kayu selama 5 hari untuk mengeluarkan aroma khas cokelat premium dan harga jual tertinggi.'
  },
  {
    komoditas: 'Kopi Arabika',
    kategori: 'Perkebunan',
    icon: '',
    harga_saat_ini: 85000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.2,
    musim_puncak: 'Mei - Agustus (Panen Raya Specialty Coffee)',
    bulan_harga_tertinggi: ['Mei', 'Juni', 'Juli', 'Agustus'],
    alasan_permintaan: 'Booming kedai kopi specialty domestik dan pasar ekspor biji green bean petik merah (single origin).',
    rekomendasi_waktu_tanam: 'Tanam di dataran tinggi pegunungan (>1.000 mdpl) awal musim hujan.',
    historis_bulanan: make12MonthCurve(85000, [5, 6, 7, 8], 0.16),
    karakteristik_tanah: 'Tanah andosol vulkanik pegunungan subur tebal gembur',
    ph_ideal: 'pH 5.0 - 6.5',
    umur_panen: 'Bibit Tanam: 2.5–3 Tahun (~900 HST) hingga Panen Perdana | Siklus Ceri Merah: 210–240 HST',
    potensi_hasil_per_ha: '1.2 - 2.0 Ton Green Bean',
    estimasi_biaya_per_ha: 32000000,
    tips_agronomis: 'Hanya petik buah ceri yang sudah 100% merah matang pohon untuk mendapatkan skor cupping di atas 84 (grade specialty).'
  },
  {
    komoditas: 'Kopi Robusta',
    kategori: 'Perkebunan',
    icon: '',
    harga_saat_ini: 48000,
    tren_mingguan: 'Naik',
    persentase_tren: 5.8,
    musim_puncak: 'Mei - Juli (Kebutuhan Kopi Instan & Ekspor)',
    bulan_harga_tertinggi: ['Mei', 'Juni', 'Juli'],
    alasan_permintaan: 'Kebutuhan industri kopi sachet dan cafe es kopi susu kekinian meningkat pesat di seluruh nusantara.',
    rekomendasi_waktu_tanam: 'Tanam di dataran medium (300-800 mdpl) pada awal musim hujan.',
    historis_bulanan: make12MonthCurve(48000, [5, 6, 7], 0.18),
    karakteristik_tanah: 'Latosol atau andosol gembur berdrainase baik',
    ph_ideal: 'pH 5.5 - 6.5',
    umur_panen: 'Bibit Tanam: 2.5–3 Tahun (~900 HST) hingga Panen Perdana | Siklus Panen Raya: 180–210 HST',
    potensi_hasil_per_ha: '1.8 - 3.0 Ton Green Bean',
    estimasi_biaya_per_ha: 26000000,
    tips_agronomis: 'Lakukan pemangkasan cabang tua dan wiwil tunas air setelah panen raya agar cabang baru pembawa bunga tumbuh lebat.'
  },
  {
    komoditas: 'Kelapa Sawit',
    kategori: 'Perkebunan',
    icon: '',
    harga_saat_ini: 2800,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.2,
    musim_puncak: 'Sepanjang Tahun (Tandan Buah Segar Pabrik PKS)',
    bulan_harga_tertinggi: ['Januari', 'Februari', 'Desember'],
    alasan_permintaan: 'Kebutuhan minyak goreng dan program mandatori biodiesel B35/B40 nasional menyerap TBS secara konsisten.',
    rekomendasi_waktu_tanam: 'Tanam bibit bersertifikat PPKS pada awal musim hujan dengan jarak tanam segitiga 9x9x9 meter.',
    historis_bulanan: make12MonthCurve(2800, [1, 2, 12], 0.10),
    karakteristik_tanah: 'Tanah alluvial, podsolik, atau gambut dangkal teregulasi airnya',
    ph_ideal: 'pH 4.0 - 6.0',
    umur_panen: 'Bibit Tanam: 3–4 Tahun (~1.200 HST) hingga Panen TBS Perdana',
    potensi_hasil_per_ha: '20 - 28 Ton TBS / Ha / Tahun',
    estimasi_biaya_per_ha: 40000000,
    tips_agronomis: 'Wajib gunakan bibit resmi bersertifikat dari sumber terpercaya (PPKS Medan, Socfindo, Dami Mas) agar produktivitas tidak anjlok.'
  },
  {
    komoditas: 'Karet',
    kategori: 'Perkebunan',
    icon: '',
    harga_saat_ini: 18500,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.0,
    musim_puncak: 'Musim Sadap Normal (Kemarau Basah)',
    bulan_harga_tertinggi: ['Februari', 'Maret', 'Oktober'],
    alasan_permintaan: 'Industri ban otomotif dan sarung tangan medis internasional menyerap lateks beku (bokar).',
    rekomendasi_waktu_tanam: 'Tanam okulasi klonal awal musim hujan.',
    historis_bulanan: make12MonthCurve(18500, [2, 3, 10], 0.10),
    karakteristik_tanah: 'Latosol atau podsolik merah kuning dalam',
    ph_ideal: 'pH 4.5 - 6.0',
    umur_panen: 'Bibit Okulasi: 5–6 Tahun (~1.825 HST) hingga Buka Sadap Lateks Perdana',
    potensi_hasil_per_ha: '1.5 - 2.2 Ton Karet Kering / Ha / Tahun',
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: 'Sadap pohon pada pagi subuh (pukul 05.00-07.00) saat tekanan turgor sel lateks berada di titik tertinggi.'
  },
  {
    komoditas: 'Tembakau',
    kategori: 'Perkebunan',
    icon: '',
    harga_saat_ini: 55000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.8,
    musim_puncak: 'Agustus - Oktober (Musim Panen Kemarau Kering)',
    bulan_harga_tertinggi: ['Agustus', 'September', 'Oktober'],
    alasan_permintaan: 'Pabrik rokok kretek menyerap rajangan tembakau aromatik kering berkualitas tinggi dengan harga tinggi.',
    rekomendasi_waktu_tanam: 'Tanam di awal musim kemarau (Mei-Juni) di lahan tegalan atau sawah bera.',
    historis_bulanan: make12MonthCurve(55000, [8, 9, 10], 0.30),
    karakteristik_tanah: 'Lempung berpasir gembur berdrainase baik, tidak mengandung klorida tinggi',
    ph_ideal: 'pH 5.5 - 6.8',
    umur_panen: '65 - 80 HST',
    potensi_hasil_per_ha: '1.5 - 2.5 Ton Rajangan Kering',
    estimasi_biaya_per_ha: 25000000,
    tips_agronomis: 'Hindari penggunaan pupuk berklorida tinggi (seperti KCl) agar aroma daun tembakau dan daya bakarnya terjaga prima.'
  },

  // ==================== TANAMAN OBAT & HERBAL ====================
  {
    komoditas: 'Lidah Buaya (Aloe Vera)',
    kategori: 'Tanaman Obat',
    icon: '',
    harga_saat_ini: 8000,
    tren_mingguan: 'Stabil',
    persentase_tren: 1.5,
    musim_puncak: 'Sepanjang Tahun (Industri Kosmetik & Minuman Nata)',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: 'Pabrik kosmetik perawatan kulit, gel pelembap, dan minuman nata de aloe vera menyerap pelepah segar secara rutin.',
    rekomendasi_waktu_tanam: 'Tanam anakan di awal musim hujan pada guludan berpasir.',
    historis_bulanan: make12MonthCurve(8000, [1, 7, 12], 0.10),
    karakteristik_tanah: 'Tanah gambut berpasir atau tanah liat berdrainase sangat lancar, tidak tahan becek',
    ph_ideal: 'pH 6.0 - 7.2',
    umur_panen: '8 - 10 Bulan mulai panen pelepah luar',
    potensi_hasil_per_ha: '40 - 65 Ton Pelepah Segar per tahun',
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: 'Gunakan varietas Pontianak Chinensis yang menghasilkan pelepah tebal dengan bobot mencapai 0.8 - 1.2 kg per pelepah.'
  },
  {
    komoditas: 'Stevia (Pemanis Alami)',
    kategori: 'Tanaman Obat',
    icon: '',
    harga_saat_ini: 45000,
    tren_mingguan: 'Naik',
    persentase_tren: 5.5,
    musim_puncak: 'Sepanjang Tahun (Tren Diet Sehat & Gula Nol Kalori)',
    bulan_harga_tertinggi: ['Maret', 'Juli', 'Oktober', 'Desember'],
    alasan_permintaan: 'Tingkat kemanisan 200-300 kali gula tebu tanpa kalori, sangat diburu industri minuman diet dan penderita diabetes.',
    rekomendasi_waktu_tanam: 'Tanam stek berakar di dataran medium-tinggi sejuk awal musim hujan.',
    historis_bulanan: make12MonthCurve(45000, [3, 7, 10, 12], 0.20),
    karakteristik_tanah: 'Tanah gembur kaya bahan organik, lembap namun berdrainase bebas genangan',
    ph_ideal: 'pH 6.0 - 7.5',
    umur_panen: '40 - 50 HST (panen petik pucuk daun berulang tiap bulan)',
    potensi_hasil_per_ha: '4 - 7 Ton Daun Kering per tahun',
    estimasi_biaya_per_ha: 30000000,
    tips_agronomis: 'Panen pucuk daun tepat sebelum bunga mekar karena kadar glikosida steviol tertinggi ada pada fase vegetatif akhir.'
  },
  {
    komoditas: 'Daun Kelor (Moringa)',
    kategori: 'Tanaman Obat',
    icon: '',
    harga_saat_ini: 25000,
    tren_mingguan: 'Naik',
    persentase_tren: 4.0,
    musim_puncak: 'Sepanjang Tahun (Suplemen Nutrisi & Ekspor Serbuk)',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: 'Dijuluki superfood dunia dengan antioksidan tinggi, diserap industri teh herbal, kapsul ekstrak, dan penanganan stunting.',
    rekomendasi_waktu_tanam: 'Tanam stek batang atau benih di awal musim hujan dengan jarak tanam rapat untuk pemangkasan pucuk.',
    historis_bulanan: make12MonthCurve(25000, [1, 7, 12], 0.15),
    karakteristik_tanah: 'Tahan di segala kondisi tanah kering, tanah marjinal, tidak tahan genangan air',
    ph_ideal: 'pH 6.0 - 7.5',
    umur_panen: '60 - 75 HST (panen potong pucuk tiap 35 hari)',
    potensi_hasil_per_ha: '6 - 10 Ton Daun Segar (1.5 Ton Serbuk Kering)',
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: 'Keringkan daun di ruangan berventilasi teduh tanpa kena sinar matahari langsung agar warna hijau klorofil dan vitamin C tidak rusak.'
  }
,

  // ==================== DATASET TAMBAHAN LENGKAP NUSANTARA ====================
  {
    komoditas: "Rambutan (Binjai / Rapiah)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 16000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Desember - Februari (Musim Panen Raya Buah Tropis)",
    bulan_harga_tertinggi: ["Desember","Januari","Februari"],
    alasan_permintaan: "Permintaan konsumsi buah meja segar dan hajatan keluarga melonjak saat musim panen raya akhir tahun.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi bersertifikat pada awal musim hujan (Oktober-November) dengan jarak 10x10 meter.",
    historis_bulanan: make12MonthCurve(16000, [12,1,2], 0.22),
    karakteristik_tanah: "Tanah latosol atau lempung berpasir gembur kaya humus dengan drainase baik tanpa genangan air.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Okulasi: 3–4 Tahun (~1.200 HST) menuju panen perdana | Siklus Bunga ke Masak: 100–120 HST",
    potensi_hasil_per_ha: "8 - 14 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Pangkas cabang air dan cabang kering setelah panen raya untuk merangsang pembungaan serentak di musim berikutnya."
  },
  {
    komoditas: "Manggis (Ratu Buah Nusantara)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 32000,
    tren_mingguan: "Naik",
    persentase_tren: 4.8,
    musim_puncak: "November - Februari (Musim Ekspor Premium Tiongkok & Timur Tengah)",
    bulan_harga_tertinggi: ["November","Desember","Januari","Februari"],
    alasan_permintaan: "Komoditas ekspor buah tropis unggulan bernilai devisa tinggi dengan permintaan pasar Tiongkok yang konsisten masif.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung pucuk bersertifikat dengan naungan peneduh sementara di 2 tahun pertama.",
    historis_bulanan: make12MonthCurve(32000, [11,12,1,2], 0.25),
    karakteristik_tanah: "Tanah lempung berliat kaya bahan organik dengan kelembapan tanah stabil dan aerasi baik.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "Bibit Sambung Pucuk: 5–7 Tahun (~2.000 HST) menuju panen perdana | Siklus Bunga ke Masak: 105–115 HST",
    potensi_hasil_per_ha: "10 - 18 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: "Gunakan jaring panen bertangkai agar getah kuning tidak mencemari kulit buah dan merusak grade ekspor."
  },
  {
    komoditas: "Salak (Pondoh / Madu / Gula Pasir)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Puncak Panen: November - Januari)",
    bulan_harga_tertinggi: ["Mei","Juni","Desember"],
    alasan_permintaan: "Konsumsi buah meja harian, oleh-oleh khas daerah, dan daya simpan buah bersisik yang relatif lama.",
    rekomendasi_waktu_tanam: "Tanam anakan rimpang atau bibit polybag di bawah pohon peneduh ringan pada awal musim hujan.",
    historis_bulanan: make12MonthCurve(14000, [5,6,12], 0.15),
    karakteristik_tanah: "Tanah vulkanik andosol atau regosol gembur dengan ketersediaan air tanah dangkal.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "Bibit Anakan: 2.5–3 Tahun (~900 HST) menuju panen perdana | Panen rutin tiap 15-20 hari",
    potensi_hasil_per_ha: "15 - 25 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Lakukan penyerbukan buatan manual (bunga jantan dioleskan ke bunga betina) untuk memastikan buah terbentuk sempurna dan padat."
  },
  {
    komoditas: "Kelengkeng (Itoh / Kateki / New Kristal)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 35000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Agustus - Oktober (Musim Panen Kelengkeng Dataran Rendah)",
    bulan_harga_tertinggi: ["Agustus","September","Oktober","Desember"],
    alasan_permintaan: "Rasa daging buah manis renyah dengan biji kecil menjadikannya buah meja favorit di supermarket dan pasar modern.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi dataran rendah di awal musim hujan dengan jarak tanam 8x8 meter.",
    historis_bulanan: make12MonthCurve(35000, [8,9,10,12], 0.2),
    karakteristik_tanah: "Tanah lempung liat berpasir kaya hara, drainase lancar, tidak tahan genangan air lama.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "Bibit Okulasi: 2.5–3 Tahun (~900 HST) menuju panen perdana | Bunga ke Masak: 120–140 HST",
    potensi_hasil_per_ha: "12 - 20 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: "Aplikasi booster kalium klorat (KClO3) pada pohon dewasa berumur 3 tahun ke atas untuk menginduksi pembungaan serentak di luar musim."
  },
  {
    komoditas: "Jambu Kristal (Guava Non-Biji)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 16000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.2,
    musim_puncak: "Sepanjang Tahun (Permintaan Horeka & Jus Buah Sehat)",
    bulan_harga_tertinggi: ["Januari","Juli","Desember"],
    alasan_permintaan: "Daging buah renyah seperti apel dengan biji kurang dari 3%, sangat disukai pasar modern dan gerai jus kekinian.",
    rekomendasi_waktu_tanam: "Tanam bibit cangkok di awal musim hujan pada guludan dengan jarak 3x3 meter.",
    historis_bulanan: make12MonthCurve(16000, [1,7,12], 0.12),
    karakteristik_tanah: "Lempung gembur berpasir kaya bahan organik dengan sinar matahari penuh sepanjang hari.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Cangkok: 8–10 Bulan (~270 HST) mulai panen perdana | Panen rutin setiap minggu",
    potensi_hasil_per_ha: "20 - 35 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: "Bungkus pentil buah berukuran diameter 2 cm dengan plastik bening dan kertas koran untuk mencegah serangan lalat buah (Bactrocera)."
  },
  {
    komoditas: "Jambu Air (Citra / Madu Deli Hijau)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 24000,
    tren_mingguan: "Naik",
    persentase_tren: 3.8,
    musim_puncak: "Musim Kemarau (Juli - September) saat Tingkat Kemanisan Maksimal",
    bulan_harga_tertinggi: ["Juli","Agustus","September"],
    alasan_permintaan: "Kandungan air tinggi dengan rasa super manis segar, sangat diburu konsumen saat cuaca terik musim kemarau.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi pada awal musim hujan dengan penyiraman terkontrol saat fase generatif.",
    historis_bulanan: make12MonthCurve(24000, [7,8,9], 0.22),
    karakteristik_tanah: "Tanah aluvial atau andosol gembur lembap dengan suplai air melimpah.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "Bibit Okulasi: 1.5–2 Tahun (~600 HST) menuju panen perdana | Panen 3 kali setahun",
    potensi_hasil_per_ha: "15 - 22 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Lakukan penjarangan dompolan bunga (sisakan 3-4 bunga terbaik per dompol) dan bungkus rapat sebelum warna memerah/menghijau."
  },
  {
    komoditas: "Sirsak (Ratu / Madu)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 15000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Industri Jus, Selai, & Herbal Farmasi)",
    bulan_harga_tertinggi: ["April","Agustus","Desember"],
    alasan_permintaan: "Kebutuhan pabrik puree buah, industri minuman kemasan, dan bahan herbal anti-kanker menyerap pasokan stabil.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung pucuk atau okulasi di musim hujan pada lahan pekarangan atau kebun.",
    historis_bulanan: make12MonthCurve(15000, [4,8,12], 0.14),
    karakteristik_tanah: "Tanah berpasir atau lempung berdrainase bebas genangan.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Okulasi: 2.5–3 Tahun (~900 HST) menuju panen perdana",
    potensi_hasil_per_ha: "12 - 18 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Petik buah saat duri kulit mulai meregang dan warna kulit hijau kusam menjelang lunak agar aroma harum maksimal."
  },
  {
    komoditas: "Belimbing Dewa (Demak / Depok)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Panen Berulang 4 - 5 Kali Setahun)",
    bulan_harga_tertinggi: ["Februari","Juni","Oktober"],
    alasan_permintaan: "Buah meja kaya vitamin C dan serat, serapan pasar tradisional dan supermarket sangat stabil sepanjang tahun.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi pada lubang tanam 60x60x60 cm berpupuk kandang matang.",
    historis_bulanan: make12MonthCurve(18000, [2,6,10], 0.15),
    karakteristik_tanah: "Lempung gembur subur dengan air tanah dangkal (kedalaman 50-100 cm).",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Okulasi: 1.5–2 Tahun (~600 HST) menuju panen perdana | Bunga ke Masak: 65–75 HST",
    potensi_hasil_per_ha: "25 - 40 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: "Bungkus buah dengan kertas semen atau plastik sejak pentil seukuran jempol tangan untuk menghasilkan warna kuning mulus bebas ulat."
  },
  {
    komoditas: "Nangka (Mini / Madu / Dulang)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.2,
    musim_puncak: "Sepanjang Tahun (Nangka Muda Masakan Gudeg & Nangka Masak Segar)",
    bulan_harga_tertinggi: ["Mei","Oktober","Desember"],
    alasan_permintaan: "Kebutuhan dobel: buah muda untuk industri kuliner gudeg dan sayur gulai, buah tua masak untuk konsumsi segar dan keripik nangka.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung nangka mini di musim hujan dengan jarak tanam 7x7 meter.",
    historis_bulanan: make12MonthCurve(12000, [5,10,12], 0.12),
    karakteristik_tanah: "Tanah liat berpasir dalam, toleran kekeringan sedang.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "Bibit Okulasi: 2.5–3 Tahun (~900 HST) mulai berbuah | Bunga ke Masak: 110–130 HST",
    potensi_hasil_per_ha: "20 - 30 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Oleskan insektisida nabati atau bungkus buah di batang utama untuk mencegah lalat buah dan busuk basah Rhizopus."
  },
  {
    komoditas: "Sukun (Artocarpus altilis)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 10000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Mei - Juli & November - Desember",
    bulan_harga_tertinggi: ["Mei","Juni","Desember"],
    alasan_permintaan: "Sumber pangan karbohidrat gluten-free sehat, industri keripik sukun gurih, dan gorengan jalanan perkotaan.",
    rekomendasi_waktu_tanam: "Tanam tunas akar atau stek akar di awal musim hujan pada batas lahan atau kebun terbuka.",
    historis_bulanan: make12MonthCurve(10000, [5,6,12], 0.15),
    karakteristik_tanah: "Lempung gembur liat berdrainase baik, tahan tanah marjinal.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "Bibit Stek Akar: 3–4 Tahun (~1.200 HST) menuju panen perdana | Pohon produktif puluhan tahun",
    potensi_hasil_per_ha: "15 - 25 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Gunakan bibit dari tunas akar alami yang telah dipelihara di polybag berakar kuat sebelum pindah tanam."
  },
  {
    komoditas: "Sawo (Manila / Jumbo)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 20000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "April - Juli (Musim Panen Sawo Tropis)",
    bulan_harga_tertinggi: ["April","Mei","Juni"],
    alasan_permintaan: "Buah manis bergetah kaya mineral, disukai untuk buah pencuci mulut dan campuran es buah tradisional.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung atau cangkok di awal musim hujan.",
    historis_bulanan: make12MonthCurve(20000, [4,5,6], 0.16),
    karakteristik_tanah: "Lempung berpasir gembur tahan kekeringan, tahan salinitas ringan.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "Bibit Cangkok/Sambung: 3–4 Tahun (~1.200 HST) menuju panen perdana | Bunga ke Masak: 180 HST",
    potensi_hasil_per_ha: "12 - 20 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Cuci buah pascapanen dalam air bersih berbusa sabun lembut untuk menghilangkan kotoran dan getah putih di kulit."
  },
  {
    komoditas: "Kedondong (Karimunjawa / Mini)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: "Stabil",
    persentase_tren: 1,
    musim_puncak: "Sepanjang Tahun (Kebutuhan Rujak Buah & Asinan)",
    bulan_harga_tertinggi: ["Maret","Juli","Oktober"],
    alasan_permintaan: "Bahan baku utama rujak manis, rujak uleg, asinan buah Bogor, dan manisan kedondong renyah.",
    rekomendasi_waktu_tanam: "Tanam bibit cangkok di awal musim hujan pada tempat berjemur sinar matahari penuh.",
    historis_bulanan: make12MonthCurve(12000, [3,7,10], 0.12),
    karakteristik_tanah: "Tanah berpasir atau lempung gembur dengan pengairan teratur.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Cangkok: 1–1.5 Tahun (~450 HST) mulai berbuah | Panen kontinu",
    potensi_hasil_per_ha: "15 - 25 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Lakukan pemangkasan pucuk secara teratur agar pohon tidak menjulang tinggi dan percabangan buah menjadi lebat."
  },
  {
    komoditas: "Markisa (Kuning / Ungu / Konyal)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: "Naik",
    persentase_tren: 4.2,
    musim_puncak: "Juli - Oktober (Industri Sirup Markisa Medan & Malino)",
    bulan_harga_tertinggi: ["Juli","Agustus","September"],
    alasan_permintaan: "Aroma asam manis harum yang khas, sangat dibutuhkan industri sirup markisa premium dan minuman saribuah.",
    rekomendasi_waktu_tanam: "Tanam bibit biji/stek berakar pada para-para bambu/kawat di awal musim hujan.",
    historis_bulanan: make12MonthCurve(28000, [7,8,9], 0.24),
    karakteristik_tanah: "Tanah andosol gembur berdrainase bebas genangan, dataran tinggi sejuk (600-1.200 mdpl).",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "Bibit Stek/Biji: 8–10 Bulan (~270 HST) mulai panen pertama | Panen bertahap",
    potensi_hasil_per_ha: "18 - 28 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 26000000,
    tips_agronomis: "Bangun tiang rambatan para-para yang kokoh setinggi 1.8 meter agar sirkulasi udara baik dan bunga mudah diserbuki kumbang lebah."
  },
  {
    komoditas: "Cempedak (Artocarpus integer)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Naik",
    persentase_tren: 3,
    musim_puncak: "Desember - Februari (Musim Buah Cempedak Wangi)",
    bulan_harga_tertinggi: ["Desember","Januari","Februari"],
    alasan_permintaan: "Aroma sangat wangi menusuk dengan daging buah lembut manis, digemari untuk gorengan cempedak goreng dan konsumsi segar.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung pucuk awal musim hujan dengan jarak 9x9 meter.",
    historis_bulanan: make12MonthCurve(22000, [12,1,2], 0.28),
    karakteristik_tanah: "Latosol atau podsolik merah kuning dalam yang kaya humus.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Okulasi: 3–4 Tahun (~1.200 HST) menuju panen perdana | Bunga ke Masak: 90–110 HST",
    potensi_hasil_per_ha: "12 - 18 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Bungkus buah dengan anyaman daun kelapa atau karung kain di dahan bawah untuk mencegah busuk buah dan serangan kera/lalat."
  },
  {
    komoditas: "Duku (Palembang / Komering) / Langsat",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 26000,
    tren_mingguan: "Naik",
    persentase_tren: 4.5,
    musim_puncak: "Januari - Maret (Musim Raya Duku Sumatera & Jawa)",
    bulan_harga_tertinggi: ["Januari","Februari","Maret"],
    alasan_permintaan: "Daging bening manis tanpa getah dengan biji kempes kecil, buah meja musiman yang sangat dinantikan masyarakat.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung pucuk bersertifikat di bawah naungan pohon sengon/kelapa.",
    historis_bulanan: make12MonthCurve(26000, [1,2,3], 0.35),
    karakteristik_tanah: "Tanah lempung berliat lembap kaya bahan organik dengan air tanah cukup.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "Bibit Sambung Pucuk: 5–7 Tahun (~2.000 HST) menuju panen perdana | Bunga ke Masak: 110–120 HST",
    potensi_hasil_per_ha: "10 - 16 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 25000000,
    tips_agronomis: "Hindari mematahkan tangkai tandan saat panen petik, karena bunga musim depan akan muncul di bekas ruas tangkai yang sama."
  },
  {
    komoditas: "Matoa (Pometia pinnata)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 45000,
    tren_mingguan: "Naik",
    persentase_tren: 5,
    musim_puncak: "September - November (Panen Buah Eksotis Papua)",
    bulan_harga_tertinggi: ["September","Oktober","November"],
    alasan_permintaan: "Perpaduan rasa unik antara durian, kelengkeng, dan rambutan bernilai eksotis tinggi dengan harga jual mahal.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi atau cangkok pada awal musim hujan dengan jarak tanam 10x10 meter.",
    historis_bulanan: make12MonthCurve(45000, [9,10,11], 0.28),
    karakteristik_tanah: "Tanah aluvial atau latosol yang subur dan gembur dengan lapisan tanah dalam.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "Bibit Okulasi: 4–5 Tahun (~1.500 HST) menuju panen perdana | Bunga ke Masak: 90–110 HST",
    potensi_hasil_per_ha: "8 - 14 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Pohon berukuran tajuk besar, tanam di batas kebun atau agroforestri agar dapat berfungsi ganda sebagai peneduh dan pelindung angin."
  },
  {
    komoditas: "Stroberi (Ciwidey / Bedugul)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 55000,
    tren_mingguan: "Naik",
    persentase_tren: 4,
    musim_puncak: "Juni - September & Libur Akhir Tahun (Wisata Agro & Supermarket)",
    bulan_harga_tertinggi: ["Juni","Juli","Desember"],
    alasan_permintaan: "Pasar modern perkotaan, industri cake/pastry, dan gerai pariwisata petik stroberi menyerap buah segar berkualitas Grade A.",
    rekomendasi_waktu_tanam: "Tanam bibit stolon berakar di bedengan mulsa hitam perak atau polybag bertingkat di dataran tinggi (>1.000 mdpl).",
    historis_bulanan: make12MonthCurve(55000, [6,7,12], 0.25),
    karakteristik_tanah: "Andosol gembur kaya kompos, porous, sejuk suhu malam 14-18°C.",
    ph_ideal: "pH 5.8 - 6.5",
    umur_panen: "75 - 90 HST mulai petik buah pertama | Panen rutin tiap 3 hari sekali",
    potensi_hasil_per_ha: "12 - 20 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 65000000,
    tips_agronomis: "Gunakan naungan rain shelter plastik UV untuk melindungi bunga dan buah stroberi dari hempasan hujan lebat yang memicu busuk kapang Botrytis."
  },
  {
    komoditas: "Jeruk Nipis (Citrus aurantifolia)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.5,
    musim_puncak: "Sepanjang Tahun (Kebutuhan Harian Soto, Seafood, & Minuman)",
    bulan_harga_tertinggi: ["Januari","Mei","Desember"],
    alasan_permintaan: "Bumbu wajib penawar amis kuliner soto, ikan bakar, seafood, dan bahan baku industri sabun pencuci piring.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi bebas penyakit di awal musim hujan dengan jarak 4x4 meter.",
    historis_bulanan: make12MonthCurve(18000, [1,5,12], 0.18),
    karakteristik_tanah: "Lempung berpasir gembur kaya bahan organik, bebas genangan air.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "Bibit Okulasi: 1.5–2 Tahun (~600 HST) menuju panen perdana | Panen kontinu sepanjang tahun",
    potensi_hasil_per_ha: "18 - 28 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: "Pangkas cabang bagian tengah tajuk agar sinar matahari masuk leluasa dan menekan serangan kutu loncat Diaphorina citri penyebar CVPD."
  },
  {
    komoditas: "Jeruk Lemon (California / Eureka)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Sepanjang Tahun (Gaya Hidup Diet Sehat, Detox, & Horeka)",
    bulan_harga_tertinggi: ["Februari","Juli","Oktober"],
    alasan_permintaan: "Kandungan asam sitrat dan vitamin C tinggi untuk infused water harian, restoran kafe, dan bahan kosmetik.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi di dataran medium hingga tinggi (400-1.000 mdpl).",
    historis_bulanan: make12MonthCurve(22000, [2,7,10], 0.16),
    karakteristik_tanah: "Tanah subur gembur berdrainase baik, tidak tahan tanah becek.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "Bibit Okulasi: 1.5–2 Tahun (~600 HST) menuju panen perdana | Berbuah kontinu",
    potensi_hasil_per_ha: "20 - 32 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 24000000,
    tips_agronomis: "Berikan pupuk Kalium dan Kalsium tinggi saat buah membesar untuk mencegah kulit lemon pecah dan meningkatkan kadar air bulir."
  },
  {
    komoditas: "Jeruk Bali (Pamelo Madu)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: "Naik",
    persentase_tren: 4,
    musim_puncak: "Januari - Februari (Tahun Baru Imlek) & Hari Raya Idul Fitri",
    bulan_harga_tertinggi: ["Januari","Februari","Mei"],
    alasan_permintaan: "Simbol keberuntungan dalam perayaan Tahun Baru Imlek, bulir besar manis tanpa rasa getir khas jeruk pamelo Magetan/Pati.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi pada awal musim hujan dengan jarak tanam 8x8 meter.",
    historis_bulanan: make12MonthCurve(28000, [1,2,5], 0.3),
    karakteristik_tanah: "Tanah aluvial atau latosol berlempung liat dalam dengan ketersediaan air cukup.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "Bibit Okulasi: 2.5–3 Tahun (~900 HST) menuju panen perdana | Bunga ke Masak: 180–210 HST",
    potensi_hasil_per_ha: "25 - 40 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 26000000,
    tips_agronomis: "Bungkus buah dengan kain atau karung sejak diameter 8 cm untuk mencegah gigitan lalat buah dan menjaga kulit tetap hijau mulus bersih."
  },
  {
    komoditas: "Jeruk Purut (Citrus hystrix)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 25000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Kebutuhan Daun Aromatik Soto & Kulit Buah)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Daun beraroma tajam harum untuk bumbu rempah rendang, soto, sambal matah, dan kulit buah berkerut untuk minyak aromaterapi.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi awal musim hujan dengan jarak tanam rapat jika fokus panen daun (2x2 meter).",
    historis_bulanan: make12MonthCurve(25000, [3,7,12], 0.15),
    karakteristik_tanah: "Lempung berpasir subur kaya bahan organik.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Okulasi: 1.5–2 Tahun untuk buah | Panen petik daun mulai 8 bulan HST",
    potensi_hasil_per_ha: "12 - 18 Ton Buah (atau 6 Ton Daun Segar) / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Pangkas cabang secara berkala untuk memicu pertumbuhan tunas ranting baru yang menghasilkan daun muda harum segar melimpah."
  },
  {
    komoditas: "Pisang Kepok Kuning",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: "Naik",
    persentase_tren: 3.2,
    musim_puncak: "Sepanjang Tahun (Industri Keripik Pisang, Gorengan, & Kue Tradisional)",
    bulan_harga_tertinggi: ["Februari","Mei","Oktober"],
    alasan_permintaan: "Bahan baku utama industri keripik pisang Lampung dan gorengan pisang crispy di seluruh warung kuliner Indonesia.",
    rekomendasi_waktu_tanam: "Tanam anakan pedang sehat bebas layu darah di awal musim hujan dengan jarak 3x3 meter.",
    historis_bulanan: make12MonthCurve(14000, [2,5,10], 0.14),
    karakteristik_tanah: "Tanah liat lempung tebal kaya humus dengan drainase baik tanpa air menggenang.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "10 - 12 Bulan (~330 HST) per tandan panen | Ratoon berlanjut",
    potensi_hasil_per_ha: "25 - 40 Ton Tandan Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Waspadai penyakit layu bakteri darah (Blood Disease Bacterium) dengan memotong jantung pisang segera setelah sisir buah terakhir mekar."
  },
  {
    komoditas: "Pisang Raja Bulu",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 25000,
    tren_mingguan: "Naik",
    persentase_tren: 4.5,
    musim_puncak: "Bulan Musim Hajatan Pernikahan (Syawal, Dzulhijjah, Besar) & Hari Raya",
    bulan_harga_tertinggi: ["Mei","Juni","Juli","Desember"],
    alasan_permintaan: "Pisang meja kelas premium dengan nilai adat tinggi untuk seserahan lamaran, hajatan manten Jawa/Sunda, dan pisang aroma harum manis.",
    rekomendasi_waktu_tanam: "Tanam anakan bersertifikat bebas virus di awal musim hujan.",
    historis_bulanan: make12MonthCurve(25000, [5,6,7,12], 0.32),
    karakteristik_tanah: "Tanah gembur dalam kaya kalium organik, lembap berdrainase baik.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "11 - 13 Bulan (~360 HST) per tandan panen",
    potensi_hasil_per_ha: "18 - 28 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Bungkus tandan pisang dengan karung selongsong biru khusus saat bunga menunduk untuk menghindari burik kulit akibat thrips."
  },
  {
    komoditas: "Pisang Ambon Lumut",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 16000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Konsumsi Buah Meja Harian Rumah Tangga)",
    bulan_harga_tertinggi: ["Januari","Juli","Desember"],
    alasan_permintaan: "Daging buah harum manis lembut tanpa biji, buah meja primadona konsumsi harian keluarga dan pasien rumah sakit.",
    rekomendasi_waktu_tanam: "Tanam anakan kultur jaringan bebas penyakit pada awal musim hujan.",
    historis_bulanan: make12MonthCurve(16000, [1,7,12], 0.12),
    karakteristik_tanah: "Lempung gembur subur berdrainase lancar, membutuhkan sinar matahari penuh.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "10 - 12 Bulan (~340 HST) per tandan panen",
    potensi_hasil_per_ha: "22 - 35 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 17000000,
    tips_agronomis: "Gunakan bibit hasil kultur jaringan untuk mendapatkan tanaman yang seragam, panen serempak, dan bebas penularan penyakit layu Fusarium."
  },
  {
    komoditas: "Kurma Tropis (Barhee KL1)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 90000,
    tren_mingguan: "Naik",
    persentase_tren: 5.5,
    musim_puncak: "Menjelang & Selama Bulan Ramadhan (Kurma Muda Rutob)",
    bulan_harga_tertinggi: ["Februari","Maret","April"],
    alasan_permintaan: "Kurma muda segar berkhasiat tinggi untuk promil (program kehamilan) dan agrowisata kurma tropis bernilai ekonomi fantastis.",
    rekomendasi_waktu_tanam: "Tanam bibit kultur jaringan betina terverifikasi pada awal musim hujan dengan jarak tanam 8x8 meter.",
    historis_bulanan: make12MonthCurve(90000, [2,3,4], 0.35),
    karakteristik_tanah: "Tanah berpasir porous atau lempung berpasir dengan sinar matahari penuh terik dan air tanah mencukupi.",
    ph_ideal: "pH 6.5 - 7.5",
    umur_panen: "Bibit Kultur Jaringan: 3–4 Tahun (~1.200 HST) menuju panen perdana | Berbuah rutin tahunan",
    potensi_hasil_per_ha: "10 - 18 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 55000000,
    tips_agronomis: "Wajib lakukan penyerbukan manual dengan serbuk sari jantan kurma agar mayang betina menghasilkan butir kurma yang padat berisi."
  },
  {
    komoditas: "Srikaya (Annona squamosa)",
    kategori: "Buah-Buahan",
    icon: '',
    harga_saat_ini: 30000,
    tren_mingguan: "Naik",
    persentase_tren: 3.2,
    musim_puncak: "Januari - Maret (Musim Panen Buah Srikaya Manis)",
    bulan_harga_tertinggi: ["Januari","Februari","Maret"],
    alasan_permintaan: "Daging buah sangat manis lembut bertekstur krimi, buah bernilai nostalgia dan camilan buah meja istimewa.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi atau cangkok awal musim hujan pada lahan tegalan kering.",
    historis_bulanan: make12MonthCurve(30000, [1,2,3], 0.22),
    karakteristik_tanah: "Lempung berpasir gembur tahan kekeringan, tidak tahan tanah tergenang air.",
    ph_ideal: "pH 6.0 - 7.5",
    umur_panen: "Bibit Okulasi: 2–3 Tahun (~800 HST) menuju panen perdana | Bunga ke Masak: 110–120 HST",
    potensi_hasil_per_ha: "8 - 14 Ton Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Bungkus buah saat ruas kulit mulai merekah untuk mencegah serangan kutu putih Planococcus dan ulat penggerek buah."
  },
  {
    komoditas: "Cabai Keriting Merah",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 45000,
    tren_mingguan: "Naik",
    persentase_tren: 6.5,
    musim_puncak: "Hari Raya Idul Fitri, Idul Adha, & Tahun Baru",
    bulan_harga_tertinggi: ["April","Mei","Desember"],
    alasan_permintaan: "Komoditas wajib kuliner masakan Padang, balado, dan aneka sambal tradisional dengan perputaran harian sangat cepat.",
    rekomendasi_waktu_tanam: "Tanam bibit semai umur 21 hari di awal musim kemarau dengan sistem irigasi tetes untuk menekan antraknosa.",
    historis_bulanan: make12MonthCurve(45000, [4,5,12], 0.38),
    karakteristik_tanah: "Lempung berpasir gembur kaya bahan organik dengan bedengan tinggi 40 cm bermulsa.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "80 - 90 HST (panen petik berulang tiap 4-5 hari)",
    potensi_hasil_per_ha: "14 - 20 Ton Cabai Segar",
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: "Gunakan varietas tahan virus kuning Gemini (seperti Kawat / PM 999) dan pasang perangkap kuning likat untuk mengendalikan kutu kebul."
  },
  {
    komoditas: "Cabai Rawit Hijau",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 38000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.8,
    musim_puncak: "Sepanjang Tahun (Pedagang Gorengan & Rumah Makan Sambal Ijo)",
    bulan_harga_tertinggi: ["Januari","Mei","Desember"],
    alasan_permintaan: "Kebutuhan masif pedagang gorengan pinggir jalan, tahu gejrot, dan restoran Padang untuk sambal lado mudo.",
    rekomendasi_waktu_tanam: "Tanam pada akhir musim hujan di bedengan dengan drainase lancar.",
    historis_bulanan: make12MonthCurve(38000, [1,5,12], 0.28),
    karakteristik_tanah: "Tanah gembur lempung berpasir dengan aerasi perakaran yang bebas air menggenang.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "75 - 85 HST (panen petik hijau padat berulang)",
    potensi_hasil_per_ha: "12 - 16 Ton Cabai Hijau",
    estimasi_biaya_per_ha: 30000000,
    tips_agronomis: "Petik saat buah masih hijau tua padat mengkilap dengan tangkai utuh agar daya simpan tahan 7-10 hari tanpa layu."
  },
  {
    komoditas: "Kacang Panjang",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 9000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Sepanjang Tahun (Sayuran Wajib Warteg, Pecel, & Katering)",
    bulan_harga_tertinggi: ["Januari","Mei","Oktober"],
    alasan_permintaan: "Sayuran polong harian paling populer di pasar tradisional, warung makan Tegal, dan hidangan pecel.",
    rekomendasi_waktu_tanam: "Tanam langsung benih di lubang tanam dengan lanjaran bambu segitiga (ajir).",
    historis_bulanan: make12MonthCurve(9000, [1,5,10], 0.15),
    karakteristik_tanah: "Lempung berpasir subur yang mudah meresapkan air.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "45 - 50 HST (panen petik tiap 2 hari sekali selama 15-20 kali petik)",
    potensi_hasil_per_ha: "18 - 25 Ton Polong Segar",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Semprotkan kalsium nitrat pada fase berbunga untuk mencegah ujung polong menguning atau rontok akibat kekurangan hara mikro."
  },
  {
    komoditas: "Pakcoy / Sawi Sendok",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 8000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Restoran Chinese Food & Sayur Hidroponik)",
    bulan_harga_tertinggi: ["Februari","Juli","Desember"],
    alasan_permintaan: "Tekstur renyah juicy dan waktu panen sangat cepat (1 bulan), favorit petani konvensional dan instalasi hidroponik.",
    rekomendasi_waktu_tanam: "Tanam bibit semai umur 10-12 hari di bedengan atau talang hidroponik NFT.",
    historis_bulanan: make12MonthCurve(8000, [2,7,12], 0.14),
    karakteristik_tanah: "Tanah gembur kaya kompos atau nutrisi AB Mix hidroponik EC 1.8 - 2.2.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "30 - 35 HST (cepat panen)",
    potensi_hasil_per_ha: "20 - 30 Ton Daun Segar",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Gunakan naungan jaring serangga (insect net) untuk mencegah serangan ulat daun Plutella xylostella tanpa pestisida kimia berlebih."
  },
  {
    komoditas: "Sawi Hijau / Caisim",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 7500,
    tren_mingguan: "Stabil",
    persentase_tren: 1.2,
    musim_puncak: "Sepanjang Tahun (Pelengkap Wajib Bakso & Mie Ayam Nasional)",
    bulan_harga_tertinggi: ["Januari","Juli","Desember"],
    alasan_permintaan: "Sayuran pokok dengan serapan tanpa henti dari jutaan pedagang mie ayam, bakso, capcay, dan nasi goreng gerobak.",
    rekomendasi_waktu_tanam: "Tanam bedengan dengan jarak tanam 15x15 cm dengan pengairan rutin 2 kali sehari.",
    historis_bulanan: make12MonthCurve(7500, [1,7,12], 0.12),
    karakteristik_tanah: "Lempung gembur subur dengan kelembapan tanah terjaga.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "28 - 35 HST (panen cabut akar bersih)",
    potensi_hasil_per_ha: "22 - 32 Ton Daun Segar",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Panen tepat saat daun mencapai 6-8 helai sebelum batang mengeluarkan kuncup bunga kuning agar tekstur tetap renyah tidak berserat."
  },
  {
    komoditas: "Sawi Putih / Petsai",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 9000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Horeka Capcay, Sup Lodeh, & Kimchi)",
    bulan_harga_tertinggi: ["Februari","Juni","Desember"],
    alasan_permintaan: "Krop padat manis berair, dibutuhkan restoran masakan oriental, sup katering hajatan, dan tren pembuatan kimchi Korea lokal.",
    rekomendasi_waktu_tanam: "Tanam di dataran medium-tinggi (>600 mdpl) pada bedengan gembur berdrainase baik.",
    historis_bulanan: make12MonthCurve(9000, [2,6,12], 0.16),
    karakteristik_tanah: "Tanah andosol subur dingin dengan kelembapan tinggi bebas jamur akar gada.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "45 - 55 HST",
    potensi_hasil_per_ha: "30 - 45 Ton Krop Segar",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Aplikasi dolomit/kapur pertanian 2 ton/ha sebelum tanam untuk mencegah penyakit akar gada (Plasmodiophora brassicae) di tanah masam."
  },
  {
    komoditas: "Brokoli",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: "Naik",
    persentase_tren: 4.5,
    musim_puncak: "Sepanjang Tahun (Pasar Modern & Konsumsi Sayur Sehat Anak)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Superfood sayuran hijau tinggi antioksidan sulforafan, nilai jual tinggi di supermarket dan restoran keluarga.",
    rekomendasi_waktu_tanam: "Tanam di dataran tinggi sejuk (>800 mdpl) dengan bedengan mulsa hitam perak.",
    historis_bulanan: make12MonthCurve(28000, [3,7,12], 0.22),
    karakteristik_tanah: "Tanah andosol gembur berdrainase sangat lancar dengan suhu 16-22°C.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "60 - 70 HST",
    potensi_hasil_per_ha: "15 - 22 Ton Krop Bunga",
    estimasi_biaya_per_ha: 26000000,
    tips_agronomis: "Potong krop bunga utama di pagi hari saat kuntum masih rapat kencang padat sebelum ada kuntum yang mulai mekar kekuningan."
  },
  {
    komoditas: "Kembang Kol",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.5,
    musim_puncak: "Sepanjang Tahun (Menu Wajib Capcay Restoran & Sup Sehat)",
    bulan_harga_tertinggi: ["Februari","Juli","Desember"],
    alasan_permintaan: "Bunga krop putih padat renyah yang disukai luas untuk masakan capcay, sup ayam, dan olahan vegetarian.",
    rekomendasi_waktu_tanam: "Tanam di dataran medium hingga tinggi pada bedengan bermulsa.",
    historis_bulanan: make12MonthCurve(22000, [2,7,12], 0.18),
    karakteristik_tanah: "Lempung subur gembur kaya unsur hara makro dan mikro Boron.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "55 - 65 HST",
    potensi_hasil_per_ha: "18 - 25 Ton Bunga Segar",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Ikat daun terluar menutupi bunga krop (blanching) saat berukuran bola tenis agar kembang kol tetap berwarna putih bersih bebas noda matahari."
  },
  {
    komoditas: "Selada Bokor (Head Lettuce / Romaine)",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 20000,
    tren_mingguan: "Naik",
    persentase_tren: 3.2,
    musim_puncak: "Sepanjang Tahun (Burger, Sandwich Kafe, & Salad Bar)",
    bulan_harga_tertinggi: ["Januari","Juni","Desember"],
    alasan_permintaan: "Permintaan tinggi dari jaringan restoran cepat saji (QSR burger), hotel berbintang, dan kafe salad sehat kekinian.",
    rekomendasi_waktu_tanam: "Tanam bibit umur 14 hari di dataran tinggi sejuk pada bedengan bertutup jaring peneduh.",
    historis_bulanan: make12MonthCurve(20000, [1,6,12], 0.18),
    karakteristik_tanah: "Tanah andosol atau kompos porous berpasir halus yang tidak mudah memadat.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "35 - 45 HST",
    potensi_hasil_per_ha: "15 - 24 Ton Daun Segar",
    estimasi_biaya_per_ha: 24000000,
    tips_agronomis: "Siram pada media tanah tanpa membasahi tajuk krop bagian dalam untuk mencegah pembusukan bakteri lunak Erwinia."
  },
  {
    komoditas: "Labu Siam / Jipang",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 7000,
    tren_mingguan: "Stabil",
    persentase_tren: 1,
    musim_puncak: "Sepanjang Tahun (Lodeh, Sayur Asem, & Lalapan Segar)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Sayuran buah merambat dengan daya simpan panjang hingga 2-3 minggu, serapan stabil di seluruh warung makan nusantara.",
    rekomendasi_waktu_tanam: "Tanam buah bertunas pada lubang tanam di bawah para-para kawat setinggi 2 meter.",
    historis_bulanan: make12MonthCurve(7000, [3,7,12], 0.1),
    karakteristik_tanah: "Tanah subur gembur lembap di dataran tinggi sejuk (>600 mdpl).",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "60 - 75 HST mulai panen perdana | Panen petik berulang tiap 3 hari hingga 3 tahun",
    potensi_hasil_per_ha: "40 - 70 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Pangkas sulur yang tidak produktif dan berikan pupuk kandang matang di pangkal batang tiap 3 bulan untuk menjaga umur produktif para-para."
  },
  {
    komoditas: "Pare / Paria (Momordica charantia)",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 10000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Sepanjang Tahun (Siomay Bandung & Masakan Tumis Pahit Gurih)",
    bulan_harga_tertinggi: ["Januari","Juni","Oktober"],
    alasan_permintaan: "Kebutuhan masif pedagang siomay kukus, masakan tumis pare teri, dan khasiat penurun kadar gula darah.",
    rekomendasi_waktu_tanam: "Tanam benih bernas di bedengan bermulsa dengan tiang lanjaran bambu miring.",
    historis_bulanan: make12MonthCurve(10000, [1,6,10], 0.14),
    karakteristik_tanah: "Lempung berpasir subur kaya bahan organik, sinar matahari penuh.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "45 - 55 HST (panen petik berulang tiap 3 hari)",
    potensi_hasil_per_ha: "20 - 30 Ton Buah Pare",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Bungkus buah pare muda dengan kertas atau kantong plastik berlubang agar kulit buah tidak bopeng disengat lalat buah."
  },
  {
    komoditas: "Gambas / Oyong",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 9500,
    tren_mingguan: "Stabil",
    persentase_tren: 1.2,
    musim_puncak: "Sepanjang Tahun (Sup Bening Sayur Rumah Tangga)",
    bulan_harga_tertinggi: ["Februari","Mei","November"],
    alasan_permintaan: "Sayuran sup bening dengan rasa manis sejuk alami yang disukai anak-anak dan penurun panas alami.",
    rekomendasi_waktu_tanam: "Tanam benih langsung dengan sistem lanjaran rambatan para-para.",
    historis_bulanan: make12MonthCurve(9500, [2,5,11], 0.12),
    karakteristik_tanah: "Tanah gembur lempung berpasir kaya hara, drainase lancar.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "40 - 50 HST (panen petik berkala)",
    potensi_hasil_per_ha: "18 - 26 Ton Buah Segar",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Petik buah saat masih muda berlingkar sedang sebelum serat buah menjadi kaku dan mengeras (menjadi spons luffa)."
  },
  {
    komoditas: "Labu Kuning / Waluh",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 6500,
    tren_mingguan: "Naik",
    persentase_tren: 5.5,
    musim_puncak: "Bulan Ramadhan & Hari Raya Idul Fitri (Bahan Baku Kolak)",
    bulan_harga_tertinggi: ["Maret","April","Mei"],
    alasan_permintaan: "Kebutuhan kolak labu kuning, kue basah, puding, dan roti memuncak drastis saat bulan puasa Ramadhan.",
    rekomendasi_waktu_tanam: "Tanam benih di tegalan luas pada awal musim hujan (Desember-Januari) agar panen tepat di bulan Ramadhan.",
    historis_bulanan: make12MonthCurve(6500, [3,4,5], 0.4),
    karakteristik_tanah: "Lempung liat atau tegalan berpasir yang leluasa untuk menjalarkan batang di tanah.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "85 - 100 HST",
    potensi_hasil_per_ha: "25 - 45 Ton Buah Waluh",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Alasi buah yang membesar di tanah dengan jerami kering agar kulit labu tidak lembek berjamur akibat kelembapan tanah basah."
  },
  {
    komoditas: "Jamur Kuping",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 32000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Sup Kimlo Katering, Capcay, & Masakan Oriental)",
    bulan_harga_tertinggi: ["Januari","Juni","Desember"],
    alasan_permintaan: "Kebutuhan industri makanan katering hajatan, sup manten kimlo, dan masakan oriental bertekstur kenyal khas.",
    rekomendasi_waktu_tanam: "Inokulasi baglog serbuk gergaji kayu di kumbung bersuhu sejuk 22-28°C berkelembapan 85%.",
    historis_bulanan: make12MonthCurve(32000, [1,6,12], 0.15),
    karakteristik_tanah: "Media baglog steril serbuk gergaji kayu sengon/karet + dedak bekatul + kapur.",
    ph_ideal: "pH 6.5 - 7.5",
    umur_panen: "45 HST mulai panen pertama | Panen berulang tiap 15-20 hari hingga 4 kali gelombang",
    potensi_hasil_per_ha: "12 - 18 Ton Jamur Basah / Kumbung Standar",
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: "Jaga kelembapan kumbung dengan kabut sprayer halus 3-4 kali sehari saat cuaca panas untuk mencegah badan buah mengeriting kerdil."
  },
  {
    komoditas: "Jamur Merang",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Sepanjang Tahun (Restoran Chinese Food & Jamur Tumis Segar)",
    bulan_harga_tertinggi: ["Februari","Mei","November"],
    alasan_permintaan: "Tekstur padat gurih premium dengan aroma khas tanah yang lezat, bernilai jual lebih tinggi dibanding jamur tiram.",
    rekomendasi_waktu_tanam: "Budidaya di kumbung hangat (suhu 30-35°C) menggunakan media jerami padi dan limbah kapas.",
    historis_bulanan: make12MonthCurve(28000, [2,5,11], 0.18),
    karakteristik_tanah: "Media jerami padi terfermentasi + ampas kapas + bekatul + kalsium karbonat.",
    ph_ideal: "pH 6.8 - 7.8",
    umur_panen: "14 - 18 HST (panen sangat cepat siklus perputaran modal)",
    potensi_hasil_per_ha: "8 - 14 Ton Jamur Merang Segar per siklus kumbung",
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: "Petik jamur saat masih berbentuk kancing bulat sebelum tudung terbuka mekar agar mendapatkan harga jual kelas Grade A tertinggi."
  },
  {
    komoditas: "Rebung Bambu Tabah",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Musim Hujan (November - Februari) & Kebutuhan Lumpia Semarang",
    bulan_harga_tertinggi: ["Desember","Januari","Februari"],
    alasan_permintaan: "Bahan baku wajib industri kuliner lumpia Semarang, gulai rebung Padang, dan sayur rebung tanpa aroma pesing.",
    rekomendasi_waktu_tanam: "Tanam bibit rimpang bambu tabah (Gigantochloa nigrociliata) awal musim hujan di tepi lahan atau lereng.",
    historis_bulanan: make12MonthCurve(14000, [12,1,2], 0.16),
    karakteristik_tanah: "Lempung berpasir subur lembap dekat sumber air atau tebing jurang untuk penahan erosi.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "1.5–2 Tahun menuju panen perdana | Panen rutin tunas rebung tiap musim hujan",
    potensi_hasil_per_ha: "15 - 25 Ton Rebung Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Timbun pangkal rebung yang baru muncul dengan serasah daun bambu kering agar rebung tetap berwarna putih pucat dan tidak terasa pahit."
  },
  {
    komoditas: "Daun Singkong / Ubi Kayu Sayur",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 6000,
    tren_mingguan: "Stabil",
    persentase_tren: 1,
    musim_puncak: "Sepanjang Tahun (Restoran Padang, Warung Nasi, & Lalapan)",
    bulan_harga_tertinggi: ["Januari","Mei","Oktober"],
    alasan_permintaan: "Lauk sayur pendamping wajib di seluruh rumah makan Padang dan warung makan Sunda dengan konsumsi ribuan ikat per hari.",
    rekomendasi_waktu_tanam: "Tanam stek batang singkong sayur daun keriting/manis dengan jarak tanam rapat 40x40 cm.",
    historis_bulanan: make12MonthCurve(6000, [1,5,10], 0.1),
    karakteristik_tanah: "Toleran di segala jenis tanah marjinal, tidak memerlukan perawatan rumit.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "45 - 60 HST mulai panen petik pucuk | Panen berulang tiap 15-20 hari",
    potensi_hasil_per_ha: "25 - 40 Ton Pucuk Daun Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 9000000,
    tips_agronomis: "Lakukan pemangkasan pucuk secara teratur agar tanaman bercabang rimbun pendek dan daun tetap lembut lunak saat direbus."
  },
  {
    komoditas: "Daun Pepaya Jepang (Chaya)",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 8000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Tren Sayuran Hijau Bebas Rasa Pahit)",
    bulan_harga_tertinggi: ["Februari","Juli","November"],
    alasan_permintaan: "Daun hijau kaya zat besi dan kalsium yang gurih renyah tanpa rasa pahit sama sekali, sangat digemari keluarga modern.",
    rekomendasi_waktu_tanam: "Tanam stek batang tua di pekarangan atau bedengan kebun awal musim hujan.",
    historis_bulanan: make12MonthCurve(8000, [2,7,11], 0.12),
    karakteristik_tanah: "Lempung berpasir gembur tahan kekeringan sedang.",
    ph_ideal: "pH 5.8 - 7.0",
    umur_panen: "45 - 60 HST mulai petik | Panen berulang tiap 2 minggu",
    potensi_hasil_per_ha: "20 - 35 Ton Daun Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 11000000,
    tips_agronomis: "Wajib dimasak matang (rebus/tumis minimal 5 menit) sebelum dikonsumsi untuk menghilangkan senyawa glikosida alami pada getah daun."
  },
  {
    komoditas: "Asparagus",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 85000,
    tren_mingguan: "Naik",
    persentase_tren: 4,
    musim_puncak: "Sepanjang Tahun (Hotel Bintang Lima, Restoran Steak, & Ekspor)",
    bulan_harga_tertinggi: ["Januari","Juli","Desember"],
    alasan_permintaan: "Sayuran rebung hijau kelas gourmet bernilai ekonomi sangat tinggi dengan serapan pasar horeka mewah dan pasar ekspor.",
    rekomendasi_waktu_tanam: "Tanam bibit mahkota akar (crown) di guludan tinggi berpasir kaya kompos di dataran tinggi sejuk.",
    historis_bulanan: make12MonthCurve(85000, [1,7,12], 0.18),
    karakteristik_tanah: "Tanah berpasir gembur dalam kaya bahan organik bebas batu dengan aerasi sempurna.",
    ph_ideal: "pH 6.5 - 7.5",
    umur_panen: "8 - 12 Bulan (~300 HST) menuju panen perdana | Rumpun produktif hingga 10-15 tahun",
    potensi_hasil_per_ha: "6 - 12 Ton Rebung Asparagus Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 75000000,
    tips_agronomis: "Panen rebung asparagus saat tinggi 20-25 cm dengan memotong 2 cm di bawah permukaan tanah menggunakan pisau khusus bersudut tajam."
  },
  {
    komoditas: "Paprika (Merah / Kuning / Hijau)",
    kategori: "Sayuran",
    icon: '',
    harga_saat_ini: 45000,
    tren_mingguan: "Naik",
    persentase_tren: 4.8,
    musim_puncak: "Sepanjang Tahun (Pizza, Steakhouse, & Supermarket Modern)",
    bulan_harga_tertinggi: ["Februari","Juli","Desember"],
    alasan_permintaan: "Bahan baku masakan barat, topping pizza, dan salad mewah dengan harga jual premium stabil di pasar modern perkotaan.",
    rekomendasi_waktu_tanam: "Budidaya dalam greenhouse dataran tinggi (>800 mdpl) menggunakan irigasi fertigasi tetes.",
    historis_bulanan: make12MonthCurve(45000, [2,7,12], 0.25),
    karakteristik_tanah: "Media arang sekam steril atau tanah andosol porous gembur bersuhu 18-25°C.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "75 - 90 HST untuk paprika hijau | 100 - 110 HST untuk warna merah/kuning penuh",
    potensi_hasil_per_ha: "30 - 55 Ton Buah Segar / Ha Greenhouse",
    estimasi_biaya_per_ha: 85000000,
    tips_agronomis: "Lakukan pewiwilan tunas air dan pertahankan hanya 2 cabang utama berbentuk huruf V yang diikat dengan tali gantung penyangga tajuk."
  },
  {
    komoditas: "Padi Ketan Putih",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 9500,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Menjelang Hari Raya Idul Fitri, Maulid Nabi, & Musim Hajatan",
    bulan_harga_tertinggi: ["Maret","April","Mei"],
    alasan_permintaan: "Bahan baku industri kue tradisional, dodol Garut, lemper, uli ketan, dan tape ketan dengan harga gabah lebih tinggi dari beras biasa.",
    rekomendasi_waktu_tanam: "Tanam serempak di sawah irigasi teknis pada awal musim hujan.",
    historis_bulanan: make12MonthCurve(9500, [3,4,5], 0.2),
    karakteristik_tanah: "Lempung berlumpur aluvial dengan lapisan kedap air teratur.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "110 - 120 HST",
    potensi_hasil_per_ha: "5.5 - 7.5 Ton GKP / Ha",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Isolasi penanaman minimal 10 meter dari hamparan padi biasa agar tidak terjadi persilangan serbuk sari yang menurunkan kadar amilopektin ketan."
  },
  {
    komoditas: "Padi Beras Merah / Beras Hitam Organik",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: "Naik",
    persentase_tren: 3.8,
    musim_puncak: "Sepanjang Tahun (Pasar Makanan Sehat, Diet Organik, & Penderita Diabetes)",
    bulan_harga_tertinggi: ["Januari","Juni","Oktober"],
    alasan_permintaan: "Kandungan antosianin dan serat tinggi dengan indeks glikemik rendah, sangat diburu konsumen kelas menengah atas.",
    rekomendasi_waktu_tanam: "Tanam di sawah irigasi semi-teknis atau gogo rancah awal musim hujan.",
    historis_bulanan: make12MonthCurve(14000, [1,6,10], 0.15),
    karakteristik_tanah: "Tanah subur gembur kaya bahan organik kompos matang tanpa pestisida kimia sintetis.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "115 - 125 HST",
    potensi_hasil_per_ha: "4.5 - 6.5 Ton GKP / Ha",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Gunakan pupuk kompos jerami terfermentasi dan agen hayati Trichoderma untuk mendapatkan sertifikasi organik berharga jual tinggi."
  },
  {
    komoditas: "Jagung Pulut / Ketan",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 11000,
    tren_mingguan: "Naik",
    persentase_tren: 4.2,
    musim_puncak: "Sepanjang Tahun (Jagung Rebus Pulen Sulawesi & Kuliner Khas)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Tekstur biji sangat pulen gurih lengket seperti ketan, camilan rebus primadona di Sulawesi, NTT, Jawa, dan pasar tradisional.",
    rekomendasi_waktu_tanam: "Tanam di lahan sawah bera setelah panen padi atau tegalan awal musim hujan.",
    historis_bulanan: make12MonthCurve(11000, [3,7,12], 0.22),
    karakteristik_tanah: "Lempung berpasir gembur kaya hara, drainase bebas genangan.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "65 - 72 HST",
    potensi_hasil_per_ha: "10 - 15 Ton Tongkol Segar",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Panen tepat saat tongkol masak susu di umur 68 HST sebelum kulit biji mengeras agar tekstur ketan tetap empuk lembut saat direbus."
  },
  {
    komoditas: "Kedelai Edamame",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: "Naik",
    persentase_tren: 4.5,
    musim_puncak: "Sepanjang Tahun (Ekspor Jepang & Camilan Sehat Kafe)",
    bulan_harga_tertinggi: ["Februari","Juli","Oktober"],
    alasan_permintaan: "Kedelai polong hijau berukuran besar kaya protein nabati, komoditas ekspor bernilai tinggi ke Jepang dan supermarket nasional.",
    rekomendasi_waktu_tanam: "Tanam di lahan sawah berdrainase lancar pada awal musim kemarau dengan jarak 20x20 cm.",
    historis_bulanan: make12MonthCurve(18000, [2,7,10], 0.18),
    karakteristik_tanah: "Tanah aluvial atau regosol gembur berdrainase sempurna, tidak tahan air tergenang.",
    ph_ideal: "pH 6.0 - 6.8",
    umur_panen: "65 - 70 HST (panen polong segar)",
    potensi_hasil_per_ha: "9 - 13 Ton Polong Segar",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Inokulasi benih dengan bakteri Rhizobium leguminosarum sebelum tanam untuk memaksimalkan bintil akar pengikat nitrogen bebas."
  },
  {
    komoditas: "Kacang Hijau",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 16500,
    tren_mingguan: "Stabil",
    persentase_tren: 2.2,
    musim_puncak: "Musim Kemarau (Juli - September) saat Panen Raya Palawija",
    bulan_harga_tertinggi: ["April","Agustus","Desember"],
    alasan_permintaan: "Bahan baku bubur kacang ijo, kecambah tauge harian, isian bakpia Pathok, onde-onde, dan sari kacang hijau.",
    rekomendasi_waktu_tanam: "Tanam di sawah bera pada musim kemarau (MK II) tanpa olah tanah (TOT) setelah panen padi kedua.",
    historis_bulanan: make12MonthCurve(16500, [4,8,12], 0.16),
    karakteristik_tanah: "Lempung liat berpasir yang memanfaatkan sisa kelembapan tanah sawah.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "60 - 65 HST (panen serempak varietas Vima)",
    potensi_hasil_per_ha: "1.6 - 2.4 Ton Biji Kering",
    estimasi_biaya_per_ha: 8500000,
    tips_agronomis: "Gunakan varietas Vima 1, 2, atau 3 yang memiliki keunggulan polong masak serempak sehingga panen cukup dilakukan satu kali."
  },
  {
    komoditas: "Ubi Cilembu (Madu Oven)",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Sepanjang Tahun (Oleh-oleh Khas Sumedang & Ubi Bakar Wisata)",
    bulan_harga_tertinggi: ["Januari","Juli","Desember"],
    alasan_permintaan: "Mengeluarkan cairan madu manis legit saat dioven, komoditas khas Sumedang yang telah dikenal luas hingga pasar ekspor Singapura.",
    rekomendasi_waktu_tanam: "Tanam stek pucuk di guludan tinggi pada tanah berpasir gembur awal musim hujan.",
    historis_bulanan: make12MonthCurve(12000, [1,7,12], 0.18),
    karakteristik_tanah: "Tanah latosol atau andosol gembur berpasir kaya hara mikro, khas dataran tinggi Cilembu Sumedang.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "120 - 150 HST",
    potensi_hasil_per_ha: "20 - 32 Ton Umbi Segar",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Simpan umbi di tempat kering teduh selama 7-14 hari pascapanen (curing) agar pati terhidrolisis sempurna menjadi gula madu yang meleleh saat dipanggang."
  },
  {
    komoditas: "Ubi Jalar Ungu",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 9000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Industri Es Krim, Pasta Kue, & Pewarna Alami)",
    bulan_harga_tertinggi: ["Februari","Juni","Oktober"],
    alasan_permintaan: "Kandungan antosianin alami yang sangat pekat, diserap pabrik mie sehat, es krim, bakpia ungu, dan olahan tepung.",
    rekomendasi_waktu_tanam: "Tanam stek pucuk di guludan dengan jarak tanam 30 cm dalam barisan.",
    historis_bulanan: make12MonthCurve(9000, [2,6,10], 0.14),
    karakteristik_tanah: "Tanah gembur berpasir yang tidak memadat agar umbi dapat membesar lurus tanpa terhambat.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "105 - 120 HST",
    potensi_hasil_per_ha: "22 - 35 Ton Umbi Segar",
    estimasi_biaya_per_ha: 13000000,
    tips_agronomis: "Balik sulur batang ubi pada umur 60 HST agar akar liar di ruas daun tidak membentuk umbi kerdil yang mengurangi ukuran umbi utama."
  },
  {
    komoditas: "Talas Pratama / Bogor",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: "Naik",
    persentase_tren: 3,
    musim_puncak: "Sepanjang Tahun (Kue Lapis Bogor, Keripik Talas, & Ekspor Umbi)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Bahan baku industri kue lapis talas Bogor, keripik stik talas gurih, dan ekspor umbi beku ke Jepang.",
    rekomendasi_waktu_tanam: "Tanam anakan umbi di awal musim hujan pada guludan berdrainase lancar.",
    historis_bulanan: make12MonthCurve(12000, [3,7,12], 0.16),
    karakteristik_tanah: "Latosol gembur kaya humus dengan suplai air tanah cukup, tidak tahan air menggenang.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "180 - 240 HST (6 - 8 Bulan)",
    potensi_hasil_per_ha: "25 - 40 Ton Umbi Talas",
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: "Bumbun tanah ke pangkal batang talas tiap 2 bulan untuk menutup umbi yang membesar agar tidak terkena sinar matahari yang memicu rasa gatal."
  },
  {
    komoditas: "Garut (Maranta arundinacea)",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 15000,
    tren_mingguan: "Naik",
    persentase_tren: 4.8,
    musim_puncak: "Sepanjang Tahun (Tepung Bebas Gluten & Obat Alami Asam Lambung/GERD)",
    bulan_harga_tertinggi: ["Februari","Juli","November"],
    alasan_permintaan: "Pati garut terbukti efektif melapisi dinding lambung penderita maag/GERD, sangat diburu pasar herbal dan tepung bayi.",
    rekomendasi_waktu_tanam: "Tanam ujung rimpang berakar di awal musim hujan di bawah tegakan pohon perkebunan.",
    historis_bulanan: make12MonthCurve(15000, [2,7,11], 0.2),
    karakteristik_tanah: "Tanah gembur kaya bahan organik, toleran naungan hingga 40%.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "240 - 300 HST (8 - 10 Bulan)",
    potensi_hasil_per_ha: "15 - 25 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Panen saat daun mulai menguning dan rebah mengering di musim kemarau karena saat itulah rendemen pati rimpang berada di titik maksimal."
  },
  {
    komoditas: "Ganyong (Canna edulis)",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 11000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Juli - Oktober (Musim Panen Umbi Palawija Tradisional)",
    bulan_harga_tertinggi: ["Juli","Agustus","September"],
    alasan_permintaan: "Sumber pati alternatif dengan butiran pati berukuran besar yang sangat mudah dicerna balita dan lansia.",
    rekomendasi_waktu_tanam: "Tanam rimpang anakan di awal musim hujan pada lahan tegalan atau pekarangan.",
    historis_bulanan: make12MonthCurve(11000, [7,8,9], 0.14),
    karakteristik_tanah: "Tahan di berbagai jenis tanah marjinal, toleran kekeringan tinggi.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "240 - 270 HST (8 - 9 Bulan)",
    potensi_hasil_per_ha: "20 - 35 Ton Umbi Segar",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Ganyong sangat tangguh terhadap hama dan penyakit, cocok dijadikan tanaman tumpang sari pelindung lereng dari erosi air hujan."
  },
  {
    komoditas: "Suweg / Iles-Iles",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 8500,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Juni - Agustus (Musim Dorman Kemarau)",
    bulan_harga_tertinggi: ["Juni","Juli","Agustus"],
    alasan_permintaan: "Pangan tradisional bebas gluten dengan indeks glikemik sangat rendah, makanan pokok sehat pengganti nasi.",
    rekomendasi_waktu_tanam: "Tanam umbi bibit di awal musim hujan di bawah naungan pohon kebun.",
    historis_bulanan: make12MonthCurve(8500, [6,7,8], 0.15),
    karakteristik_tanah: "Tanah gembur lempung berhumus tebal, porous tanpa genangan air.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "180 - 210 HST per siklus musim hujan | Umbi membesar optimal di tahun ke-2",
    potensi_hasil_per_ha: "20 - 30 Ton Umbi Segar",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Rebus umbi dengan sedikit abu dapur atau garam untuk mengikat kalsium oksalat agar umbi tidak terasa gatal di lidah saat dikonsumsi."
  },
  {
    komoditas: "Jelai / Hanjeli (Coix lacryma-jobi)",
    kategori: "Tanaman Pangan",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Naik",
    persentase_tren: 4,
    musim_puncak: "Sepanjang Tahun (Sereal Sehat, Pengganti Beras, & Anti-Kanker)",
    bulan_harga_tertinggi: ["Januari","Juli","Oktober"],
    alasan_permintaan: "Biji sereal bernutrisi tinggi dengan kalsium dan antioksidan berlimpah, bahan baku bubur hanjeli dan tepung sereal diet sehat.",
    rekomendasi_waktu_tanam: "Tanam benih di tegalan atau lahan kering berbukit pada awal musim hujan.",
    historis_bulanan: make12MonthCurve(22000, [1,7,10], 0.2),
    karakteristik_tanah: "Tanah lempung berpasir atau tanah liat berdrainase baik, tahan tanah kurus.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "150 - 180 HST (5 - 6 Bulan)",
    potensi_hasil_per_ha: "3.5 - 5.5 Ton Biji Kering",
    estimasi_biaya_per_ha: 11000000,
    tips_agronomis: "Gunakan varietas hanjeli pulut (bercangkang lunak) yang mudah digiling dan disosoh menjadi beras hanjeli siap masak."
  },
  {
    komoditas: "Lada Hitam (Lampung Black Pepper)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 68000,
    tren_mingguan: "Naik",
    persentase_tren: 5.2,
    musim_puncak: "Juni - September (Musim Panen Raya Lada Sumatera)",
    bulan_harga_tertinggi: ["Juni","Juli","Agustus","September"],
    alasan_permintaan: "Komoditas rempah ekspor legendaris Indonesia dengan permintaan bumbu pedas aromatik global yang tidak pernah surut.",
    rekomendasi_waktu_tanam: "Tanam bibit sulur panjat bersertifikat pada tiang panjat hidup (tajar kelor/gamal) di awal musim hujan.",
    historis_bulanan: make12MonthCurve(68000, [6,7,8,9], 0.28),
    karakteristik_tanah: "Latosol atau podsolik merah kuning gembur kaya bahan organik, lereng berdrainase lancar.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Sulur Panjat: 2.5–3 Tahun (~900 HST) menuju panen perdana | Petik bulir tua hijau untuk lada hitam",
    potensi_hasil_per_ha: "2.0 - 3.5 Ton Lada Hitam Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: "Celupkan bulir lada hijau ke dalam air panas bersuhu 80°C selama 2-3 menit sebelum dijemur matahari agar kulit buah berubah hitam keriput mengkilap sempurna."
  },
  {
    komoditas: "Lada Putih (Muntok White Pepper)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 95000,
    tren_mingguan: "Naik",
    persentase_tren: 5.8,
    musim_puncak: "Juli - Oktober (Pasar Bumbu Dapur Global & Industri Daging Olahan)",
    bulan_harga_tertinggi: ["Juli","Agustus","September","Oktober"],
    alasan_permintaan: "Lada putih Muntok Bangka diakui dunia sebagai lada putih berkualitas terbaik dengan kadar piperin dan kepedasan khas.",
    rekomendasi_waktu_tanam: "Tanam bibit sulur di lahan tegalan Bangka atau Kalimantan dengan tiang panjat kokoh.",
    historis_bulanan: make12MonthCurve(95000, [7,8,9,10], 0.3),
    karakteristik_tanah: "Tanah podsolik berpasir kaya hara mikro dengan drainase tanpa genangan.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "2.5–3 Tahun menuju panen perdana | Petik bulir masak merah penuh untuk lada putih",
    potensi_hasil_per_ha: "1.8 - 3.0 Ton Lada Putih Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 40000000,
    tips_agronomis: "Rendam karung berisi bulir lada masak merah dalam aliran air bersih mengalir selama 10-14 hari untuk melunakkan dan mengelupas kulit luar secara alami."
  },
  {
    komoditas: "Cengkeh (Zanzibar / Siputih)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 125000,
    tren_mingguan: "Naik",
    persentase_tren: 6,
    musim_puncak: "Juni - September (Musim Petik Bunga Cengkeh & Serapan Pabrik Rokok)",
    bulan_harga_tertinggi: ["Juni","Juli","Agustus","September"],
    alasan_permintaan: "Kebutuhan utama pabrik rokok kretek nasional yang menyerap ribuan ton bunga kering dan industri minyak atsiri eugenol farmasi.",
    rekomendasi_waktu_tanam: "Tanam bibit polybag berumur 1 tahun di awal musim hujan dengan jarak tanam 8x8 meter.",
    historis_bulanan: make12MonthCurve(125000, [6,7,8,9], 0.35),
    karakteristik_tanah: "Tanah andosol atau latosol berlempung liat dalam di dataran bergelombang (200-600 mdpl).",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Tanam: 4–6 Tahun (~1.800 HST) menuju panen perdana | Bunga dipetik sebelum mekar",
    potensi_hasil_per_ha: "1.5 - 2.5 Ton Bunga Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: "Petik bunga cengkeh tepat saat kepala bunga menggelembung kemerahan tapi belum mekar (fase masak petik) untuk menghasilkan rendemen minyak tertinggi."
  },
  {
    komoditas: "Pala & Fuli (Banda / Siau)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 85000,
    tren_mingguan: "Naik",
    persentase_tren: 4.8,
    musim_puncak: "Sepanjang Tahun (Puncak Panen: Juli - September & Januari - Maret)",
    bulan_harga_tertinggi: ["Februari","Agustus","Desember"],
    alasan_permintaan: "Biji pala dan fuli (selaput merah) adalah rempah aromatik termahal dunia asal Kepulauan Maluku, komoditas ekspor bernilai devisa tinggi.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung pucuk pohon betina awal musim hujan di bawah naungan pohon kelapa/hutan.",
    historis_bulanan: make12MonthCurve(85000, [2,8,12], 0.25),
    karakteristik_tanah: "Tanah vulkanik gembur kaya humus dengan kelembapan tinggi khas iklim kepulauan.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "Bibit Sambung: 4–6 Tahun menuju panen perdana (Bibit Biji: 7–9 Tahun) | Pohon produktif hingga 50 tahun",
    potensi_hasil_per_ha: "1.8 - 3.0 Ton Biji Kering + 400 Kg Fuli Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 32000000,
    tips_agronomis: "Segera pisahkan fuli merah dari biji pala setelah panen dan keringkan terpisah di bawah naungan agar warna merah mengkilapnya tidak kusam."
  },
  {
    komoditas: "Kayu Manis (Cinnamomum burmannii)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 48000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.5,
    musim_puncak: "Sepanjang Tahun (Ekspor Kulit Batang Gulung Cassiavera Kerinci)",
    bulan_harga_tertinggi: ["Maret","Juli","Oktober"],
    alasan_permintaan: "Industri bakery kue kering Eropa/Amerika, bumbu kari, dan farmasi herbal penstabil insulin darah.",
    rekomendasi_waktu_tanam: "Tanam anakan biji di dataran tinggi sejuk (600-1.500 mdpl) di awal musim hujan.",
    historis_bulanan: make12MonthCurve(48000, [3,7,10], 0.16),
    karakteristik_tanah: "Tanah andosol atau latosol subur gembur berdrainase baik.",
    ph_ideal: "pH 5.0 - 6.5",
    umur_panen: "6 - 8 Tahun untuk panen kupas kulit batang pertama | Pohon ditebang dan trubus kembali",
    potensi_hasil_per_ha: "3.0 - 5.0 Ton Kulit Kering / Ha",
    estimasi_biaya_per_ha: 25000000,
    tips_agronomis: "Kupas kulit batang saat cuaca cerah dan segera jemur di bawah terik matahari agar kulit menggulung rapi berbentuk pipa stik (quill)."
  },
  {
    komoditas: "Temulawak (Curcuma xanthorrhiza)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: "Naik",
    persentase_tren: 3.8,
    musim_puncak: "Sepanjang Tahun (Pabrik Jamu, Suplemen Nafsu Makan, & Perlindungan Hati)",
    bulan_harga_tertinggi: ["Februari","Juli","November"],
    alasan_permintaan: "Bahan baku utama industri jamu tradisional Indonesia, sirup multivitamin anak, dan fitofarmaka hepatoprotektor (pelindung organ hati).",
    rekomendasi_waktu_tanam: "Tanam rimpang rimpangan tua di awal musim hujan pada guludan berpasir.",
    historis_bulanan: make12MonthCurve(18000, [2,7,11], 0.18),
    karakteristik_tanah: "Lempung berpasir gembur kaya bahan organik, aerasi tanah bebas genangan.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "240 - 270 HST (8 - 9 Bulan)",
    potensi_hasil_per_ha: "18 - 28 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Panen saat seluruh daun telah menguning dan mengering alami di awal musim kemarau agar kadar kurkuminoid dan minyak atsiri berada di level puncak."
  },
  {
    komoditas: "Lengkuas / Laos",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 12000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Menjelang Hari Raya Idul Fitri & Idul Adha (Bumbu Masak Daging & Rendang)",
    bulan_harga_tertinggi: ["April","Mei","Juni"],
    alasan_permintaan: "Bumbu rempah dapur wajib untuk masakan rendang Padang, soto ayam, gulai, dan penawar amis daging sapi/ayam.",
    rekomendasi_waktu_tanam: "Tanam potongan rimpang bertunas di awal musim hujan pada guludan tanah gembur.",
    historis_bulanan: make12MonthCurve(12000, [4,5,6], 0.22),
    karakteristik_tanah: "Lempung berpasir gembur kaya hara yang tidak liat memadat.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "240 - 270 HST (8 - 9 Bulan)",
    potensi_hasil_per_ha: "20 - 32 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Bumbun guludan tanah setinggi 30 cm agar rimpang lengkuas leluasa membesar ke samping tanpa terjepit tanah padat."
  },
  {
    komoditas: "Serai Dapur / Serai Wangi",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 9000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Sepanjang Tahun (Bumbu Soto Horeka & Minyak Atsiri Citronella)",
    bulan_harga_tertinggi: ["Januari","Mei","Oktober"],
    alasan_permintaan: "Kebutuhan dapur harian rumah tangga, restoran soto/rawon, dan penyulingan minyak serai wangi pengusir serangga.",
    rekomendasi_waktu_tanam: "Tanam anakan rimpang berakar pada lubang tanam dengan jarak 1x1 meter.",
    historis_bulanan: make12MonthCurve(9000, [1,5,10], 0.12),
    karakteristik_tanah: "Latosol atau tegalan tanah liat berpasir yang terkena sinar matahari penuh.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "90 - 120 HST mulai panen potong batang | Panen pangkas berulang tiap 60 hari",
    potensi_hasil_per_ha: "25 - 40 Ton Batang Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Potong rumpun serai menyisakan 5 cm di atas permukaan tanah agar tunas baru cepat bersemi lebat kembali."
  },
  {
    komoditas: "Ketumbar",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 26000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Bumbu Marinasi Daging, Tahu, & Tempe Goreng)",
    bulan_harga_tertinggi: ["Februari","Juni","November"],
    alasan_permintaan: "Bumbu rempah harian nomor satu untuk ungkep ayam goreng, tempe mendoan, tahu goreng, dan dendeng daging.",
    rekomendasi_waktu_tanam: "Tanam benih di bedengan halus dataran tinggi sejuk (500-1.200 mdpl) di awal musim kemarau.",
    historis_bulanan: make12MonthCurve(26000, [2,6,11], 0.15),
    karakteristik_tanah: "Tanah lempung berpasir subur kaya bahan organik berdrainase lancar.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "90 - 105 HST (saat bulir biji menguning kecokelatan)",
    potensi_hasil_per_ha: "1.8 - 2.8 Ton Biji Kering",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Panen di pagi hari saat udara masih lembap agar bulir biji ketumbar tidak mudah rontok berhamburan saat dipotong sabit."
  },
  {
    komoditas: "Kemiri (Aleurites moluccanus)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 38000,
    tren_mingguan: "Naik",
    persentase_tren: 3.2,
    musim_puncak: "Sepanjang Tahun (Bumbu Pengental Gulai Nusantara & Minyak Rambut)",
    bulan_harga_tertinggi: ["Januari","Mei","Desember"],
    alasan_permintaan: "Kandungan minyak tinggi yang berfungsi mengentalkan dan melezatkan kuah santan gulai, opor, serta industri minyak rambut.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi atau semai biji bertunas awal musim hujan di lahan kebun miring.",
    historis_bulanan: make12MonthCurve(38000, [1,5,12], 0.18),
    karakteristik_tanah: "Tanah berkapur atau latosol berbatu dengan drainase baik, tahan tanah tandus.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "Bibit Okulasi: 3–4 Tahun (~1.200 HST) menuju panen buah pertama | Berbuah puluhan tahun",
    potensi_hasil_per_ha: "8 - 14 Ton Biji Gelondong / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Rebus biji kemiri gelondong sebentar lalu celupkan ke air dingin untuk mempermudah pemecahan cangkang keras tanpa merusak keutuhan inti biji putih."
  },
  {
    komoditas: "Andaliman (Merica Batak)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 90000,
    tren_mingguan: "Naik",
    persentase_tren: 6.5,
    musim_puncak: "Bulan Musim Upacara Adat Batak & Perayaan Natal/Tahun Baru",
    bulan_harga_tertinggi: ["Juli","Oktober","Desember"],
    alasan_permintaan: "Rempah unik beraroma jeruk dengan sensasi getir pedas kebas di lidah, bumbu wajib masakan khas Batak (arsik ikan mas & sangsang).",
    rekomendasi_waktu_tanam: "Tanam bibit stek atau anakan di dataran tinggi sejuk kawasan Danau Toba (1.200-1.500 mdpl).",
    historis_bulanan: make12MonthCurve(90000, [7,10,12], 0.38),
    karakteristik_tanah: "Tanah andosol vulkanik gembur sejuk berhumus tebal di bawah naungan pohon peneduh.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Stek: 1.5–2 Tahun (~600 HST) menuju panen buah pertama | Panen rutin",
    potensi_hasil_per_ha: "2.5 - 4.5 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: "Petik buah saat masih hijau tua bergerombol padat menggunakan sarung tangan tebal untuk menghindari duri tajam di batang tanaman."
  },
  {
    komoditas: "Asam Jawa (Tamarindus indica)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 25000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Juli - Oktober (Musim Panen Polong Asam Tua)",
    bulan_harga_tertinggi: ["Juli","Agustus","September"],
    alasan_permintaan: "Bumbu wajib sayur asem, kuah cuko pempek, saus asam manis, permen asam jadul, dan obat sariawan tradisional.",
    rekomendasi_waktu_tanam: "Tanam bibit okulasi atau cangkok di awal musim hujan pada lahan tegalan kering.",
    historis_bulanan: make12MonthCurve(25000, [7,8,9], 0.15),
    karakteristik_tanah: "Lempung berpasir tahan kekeringan ekstrim dan tanah berbatu.",
    ph_ideal: "pH 6.0 - 7.5",
    umur_panen: "Bibit Okulasi: 4–6 Tahun (~1.800 HST) menuju panen buah polong perdana",
    potensi_hasil_per_ha: "12 - 20 Ton Polong Buah / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Kupas kulit polong dan buang seratnya lalu padatkan daging asam bersama garam dapur 5% agar awet disimpan bertahun-tahun tanpa pengawet kimia."
  },
  {
    komoditas: "Bunga Lawang / Pekak",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 65000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Sepanjang Tahun (Bumbu Sup Buntut, Rawon, & Industri Kari)",
    bulan_harga_tertinggi: ["Februari","Juli","Desember"],
    alasan_permintaan: "Bunga berbentuk bintang delapan bersudut harum anetol pekat, rempah wajib sup buntut, gulai daging, dan teh rempah hangat.",
    rekomendasi_waktu_tanam: "Tanam bibit pohon di dataran tinggi sejuk beriklim basah.",
    historis_bulanan: make12MonthCurve(65000, [2,7,12], 0.2),
    karakteristik_tanah: "Tanah subur gembur kaya humus dengan kelembapan tinggi.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "Bibit Tanam: 6–8 Tahun menuju panen perdana | Bunga dipetik sebelum mekar penuh",
    potensi_hasil_per_ha: "2.0 - 3.5 Ton Bunga Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: "Keringkan bunga lawang di lantai jemur beralas terpal bersih hingga kadar air di bawah 12% agar aroma manis adas manisnya terkunci sempurna."
  },
  {
    komoditas: "Daun Salam (Syzygium polyanthum)",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 14000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.2,
    musim_puncak: "Sepanjang Tahun (Bumbu Daun Wajib Masakan Rumahan & Rumah Makan)",
    bulan_harga_tertinggi: ["Januari","Mei","Oktober"],
    alasan_permintaan: "Daun aromatik penyeimbang bau amis daging dan penyedap kuah sayur asam, lodeh, dan aneka tumisan di seluruh dapur nusantara.",
    rekomendasi_waktu_tanam: "Tanam bibit cangkok di batas kebun atau pekarangan rumah awal musim hujan.",
    historis_bulanan: make12MonthCurve(14000, [1,5,10], 0.12),
    karakteristik_tanah: "Lempung berpasir yang subur dan mudah meresapkan air.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "1.5–2 Tahun menuju panen petik daun rimbun | Panen daun kontinu",
    potensi_hasil_per_ha: "10 - 18 Ton Daun Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Petik daun tua berwarna hijau gelap yang beraroma wangi kuat saat diremas, lalu angin-anginkan di tempat teduh agar kering tanpa berubah cokelat layu."
  },
  {
    komoditas: "Jahe Gajah / Badak",
    kategori: "Rempah & Bumbu",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Musim Hujan (November - Februari) & Permintaan Ekspor Rimpang Segar",
    bulan_harga_tertinggi: ["November","Desember","Januari","Februari"],
    alasan_permintaan: "Rimpang gemuk tebal berserat halus dengan rasa pedas lembut, disukai untuk ekspor segar, jahe instan, dan minuman wedang jahe susu.",
    rekomendasi_waktu_tanam: "Tanam bibit rimpang bertunas di awal musim hujan pada guludan berpasir atau karung vertikultur.",
    historis_bulanan: make12MonthCurve(22000, [11,12,1,2], 0.24),
    karakteristik_tanah: "Lempung berpasir gembur kaya bahan organik kompos, drainase sangat lancar bebas genangan.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "270 - 300 HST (9 - 10 Bulan)",
    potensi_hasil_per_ha: "25 - 40 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 32000000,
    tips_agronomis: "Lakukan penimbunan tanah/pembumbunan bertahap sebanyak 3-4 kali mengikuti pertumbuhan rimpang ke atas agar ukuran jahe gajah mencapai bobot maksimal."
  },
  {
    komoditas: "Teh (Hitam / Hijau / Oolong)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Pabrik Minuman Teh Kemasan RTD & Ekspor)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Budaya minum teh nasional, industri minuman teh botol/cup kemasan siap minum, dan ekspor daun teh premium ke Eropa/Asia.",
    rekomendasi_waktu_tanam: "Tanam bibit klonal stek di dataran tinggi sejuk pegunungan (>800 mdpl) di awal musim hujan.",
    historis_bulanan: make12MonthCurve(28000, [3,7,12], 0.15),
    karakteristik_tanah: "Tanah andosol asam kaya bahan organik dengan curah hujan tinggi tanpa bulan kering panjang.",
    ph_ideal: "pH 4.5 - 5.5",
    umur_panen: "2.5–3 Tahun menuju pemetikan pertama | Pemetikan pucuk peko (pecco) rutin tiap 7-10 hari",
    potensi_hasil_per_ha: "2.5 - 4.0 Ton Teh Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 35000000,
    tips_agronomis: "Petik hanya pucuk p+2 atau p+3 (satu pucuk dengan dua atau tiga daun muda teratas) di pagi hari untuk menghasilkan mutu teh Grade One."
  },
  {
    komoditas: "Tebu (Saccharum officinarum)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 1100,
    tren_mingguan: "Naik",
    persentase_tren: 4.2,
    musim_puncak: "Musim Giling Pabrik Gula (Mei - Oktober)",
    bulan_harga_tertinggi: ["Juni","Juli","Agustus","September"],
    alasan_permintaan: "Kebutuhan swasembada gula konsumsi nasional dan pasokan pabrik gula tebu BUMN/swasta di Jawa dan luar Jawa.",
    rekomendasi_waktu_tanam: "Tanam bibit bagal (stek batang berkuncup) di juringan sawah/tegalan pada awal musim kemarau atau awal hujan.",
    historis_bulanan: make12MonthCurve(1100, [6,7,8,9], 0.25),
    karakteristik_tanah: "Tanah aluvial atau grumusol berliat tebal dengan ketersediaan air cukup saat fase vegetatif.",
    ph_ideal: "pH 6.0 - 7.5",
    umur_panen: "10 - 12 Bulan (~330 HST)",
    potensi_hasil_per_ha: "80 - 120 Ton Batang Tebu Segar / Ha (Rendemen 7-9%)",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Lakukan klentek (pembuangan daun kering) 2-3 kali sebelum tebang giling untuk mempermudah panen dan meningkatkan kadar brix nira tebu."
  },
  {
    komoditas: "Kelapa Kopyor",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 25000,
    tren_mingguan: "Naik",
    persentase_tren: 5,
    musim_puncak: "Sepanjang Tahun (Restoran Mewah, Hotel, & Es Kopyor Sultan)",
    bulan_harga_tertinggi: ["Februari","Mei","Desember"],
    alasan_permintaan: "Daging buah terlepas lembut empuk dengan rasa gurih manis istimewa bernilai jual hingga Rp 40.000–50.000 per butir di restoran.",
    rekomendasi_waktu_tanam: "Tanam bibit kelapa kopyor kultur embrio terisolasi dengan jarak 9x9 meter.",
    historis_bulanan: make12MonthCurve(25000, [2,5,12], 0.28),
    karakteristik_tanah: "Tanah aluvial atau lempung berpasir subur dekat pesisir dengan penyinaran matahari penuh.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "Bibit Kultur Embrio: 3.5–4 Tahun menuju panen perdana | Panen rutin tiap bulan",
    potensi_hasil_per_ha: "8.000 - 12.000 Butir Kelapa Kopyor / Ha / Tahun",
    estimasi_biaya_per_ha: 45000000,
    tips_agronomis: "Gunakan bibit hasil penyelamatan embrio (embryo rescue) bersertifikat agar peluang menghasilkan buah kopyor mencapai 90-100% per tandan."
  },
  {
    komoditas: "Kelapa Pandan Wangi",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 35000,
    tren_mingguan: "Naik",
    persentase_tren: 4.5,
    musim_puncak: "Sepanjang Tahun (Restoran Seafood, Wisata Pantai, & Hotel Mewah)",
    bulan_harga_tertinggi: ["Januari","Juli","Desember"],
    alasan_permintaan: "Air kelapa beraroma wangi daun pandan alami dengan rasa manis menyegarkan (brix 7-8%), kelapa eksotis primadona wisata.",
    rekomendasi_waktu_tanam: "Tanam bibit kelapa genjah bersertifikat di awal musim hujan dengan jarak 6x6 meter.",
    historis_bulanan: make12MonthCurve(35000, [1,7,12], 0.22),
    karakteristik_tanah: "Tanah berpasir subur atau lempung aluvial dengan air tanah dangkal (1-2 meter).",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "3–3.5 Tahun pohon genjah pendek mulai berbuah lebat | Panen kontinu bulanan",
    potensi_hasil_per_ha: "12.000 - 18.000 Butir Kelapa Muda / Ha / Tahun",
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: "Panen kelapa pada umur 6.5 - 7 bulan saat daging buah masih tipis berlendir agar aroma wangi pandan dan rasa manis berada di tingkat terbaik."
  },
  {
    komoditas: "Kelapa Dalam / Hibrida",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 5500,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Menjelang Hari Raya Idul Fitri & Natal (Kebutuhan Santan Rendang/Opor)",
    bulan_harga_tertinggi: ["April","Mei","Desember"],
    alasan_permintaan: "Kebutuhan santan harian rumah tangga, kelapa parut pasar basah, pabrik santan instan, dan kopra kering minyak kelapa.",
    rekomendasi_waktu_tanam: "Tanam bibit kecambah kelapa pilihan di awal musim hujan dengan jarak 9x9 meter segitiga.",
    historis_bulanan: make12MonthCurve(5500, [4,5,12], 0.2),
    karakteristik_tanah: "Tanah pesisir berpasir atau aluvial dengan sinar matahari penuh sepanjang hari.",
    ph_ideal: "pH 5.5 - 7.5",
    umur_panen: "Bibit Dalam: 5–6 Tahun (Hibrida: 3.5–4 Tahun) | Panen rutin tiap 45-60 hari",
    potensi_hasil_per_ha: "5.000 - 8.000 Butir / Ha / Tahun",
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: "Berikan pupuk garam kasar (NaCl) 1-1.5 kg per pohon per tahun untuk merangsang pembungaan dan mempertebal daging buah kelapa."
  },
  {
    komoditas: "Aren / Enau (Arenga pinnata)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Naik",
    persentase_tren: 3.8,
    musim_puncak: "Sepanjang Tahun (Tren Kopi Susu Gula Aren Kekinian & Kolang-Kaling)",
    bulan_harga_tertinggi: ["Februari","Maret","Mei"],
    alasan_permintaan: "Booming kedai kopi susu kekinian yang mewajibkan gula aren cair murni, industri gula semut ekspor, dan kolang-kaling Ramadhan.",
    rekomendasi_waktu_tanam: "Tanam bibit aren genjah atau aren dalam di lereng perbukitan awal musim hujan.",
    historis_bulanan: make12MonthCurve(22000, [2,3,5], 0.25),
    karakteristik_tanah: "Tanah latosol atau andosol lereng bukit dengan drainase bebas genangan.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "Aren Genjah: 5–7 Tahun (Aren Dalam: 8–10 Tahun) mulai sadap nira mayang jantan",
    potensi_hasil_per_ha: "20 - 35 Liter Nira per pohon per hari (Hasil 3 - 5 Ton Gula Aren / Ha / Tahun)",
    estimasi_biaya_per_ha: 28000000,
    tips_agronomis: "Ayundengkan mayang bunga jantan selama 3 minggu sebelum disadap untuk melancarkan pembuluh tapis getah nira mengalir deras."
  },
  {
    komoditas: "Nilam (Pogostemon cablin)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 15000,
    tren_mingguan: "Naik",
    persentase_tren: 5.5,
    musim_puncak: "Sepanjang Tahun (Minyak Atsiri Nilam Ekspor Bahan Parfum Mewah)",
    bulan_harga_tertinggi: ["Januari","Juli","Oktober"],
    alasan_permintaan: "Minyak nilam (Patchouli oil) Indonesia menguasai 85% pasar dunia sebagai fiksatif pengikat aroma parfum mewah yang tak tergantikan.",
    rekomendasi_waktu_tanam: "Tanam stek cabang berakar pada bedengan gembur berparit drainase dalam di awal musim hujan.",
    historis_bulanan: make12MonthCurve(15000, [1,7,10], 0.22),
    karakteristik_tanah: "Tanah andosol atau latosol gembur kaya humus dengan kelembapan tinggi, tidak tahan becek.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "180 HST (6 Bulan) panen pertama | Panen pangkas berulang tiap 3-4 bulan",
    potensi_hasil_per_ha: "12 - 18 Ton Terna Daun Basah (atau 500 - 800 Kg Minyak Nilam / Ha / Tahun)",
    estimasi_biaya_per_ha: 24000000,
    tips_agronomis: "Angin-anginkan daun nilam di lantai jemur berventilasi teduh selama 2-3 hari sebelum disuling agar rendemen minyak mencapai 2.5 - 3.2%."
  },
  {
    komoditas: "Jambu Mete / Cashew",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 45000,
    tren_mingguan: "Naik",
    persentase_tren: 4,
    musim_puncak: "Agustus - November (Musim Panen Raya Mete NTT, Sultra, & Wonogiri)",
    bulan_harga_tertinggi: ["Agustus","September","Oktober","November"],
    alasan_permintaan: "Kacang mete goreng gurih renyah bernilai ekonomi sangat tinggi untuk cemilan premium hari raya dan bahan baku cokelat.",
    rekomendasi_waktu_tanam: "Tanam bibit sambung pucuk bersertifikat di lahan tegalan kering dengan jarak 10x10 meter.",
    historis_bulanan: make12MonthCurve(45000, [8,9,10,11], 0.3),
    karakteristik_tanah: "Tanah mediteran merah, grumusol, atau tanah berbatu kering, sangat tahan kemarau panjang.",
    ph_ideal: "pH 5.5 - 7.5",
    umur_panen: "Bibit Sambung Pucuk: 2.5–3 Tahun (~900 HST) menuju panen perdana | Bunga ke Masak: 60–70 HST",
    potensi_hasil_per_ha: "1.2 - 2.5 Ton Gelondong Mete Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Jemur gelondong mete hingga kadar air di bawah 9% (biji berbunyi nyaring saat diguncang) agar inti kacang tidak berjamur saat disimpan."
  },
  {
    komoditas: "Pinang (Areca catechu)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 16000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.5,
    musim_puncak: "Sepanjang Tahun (Ekspor Biji Kering ke India, Pakistan, & Nepal)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Komoditas ekspor andalan Sumatera dan Jambi untuk industri permen pan masala, kosmetik, dan pewarna alami Asia Selatan.",
    rekomendasi_waktu_tanam: "Tanam bibit pinang betara bersertifikat dengan jarak 2.7x2.7 meter di awal musim hujan.",
    historis_bulanan: make12MonthCurve(16000, [3,7,12], 0.18),
    karakteristik_tanah: "Tanah aluvial, latosol, atau gambut dangkal yang kaya bahan organik.",
    ph_ideal: "pH 5.0 - 6.8",
    umur_panen: "Bibit Pinang Betara: 4–5 Tahun (~1.500 HST) menuju panen perdana | Panen rutin tiap 2 minggu",
    potensi_hasil_per_ha: "4.0 - 6.5 Ton Biji Pinang Kering Belah / Ha / Tahun",
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: "Gunakan varietas Pinang Betara yang memiliki tandan buah pendek lebat dengan butir buah besar dan mulai berbuah lebih cepat."
  },
  {
    komoditas: "Lada Perdu",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 75000,
    tren_mingguan: "Naik",
    persentase_tren: 4.5,
    musim_puncak: "Sepanjang Tahun (Budidaya Pekarangan & Tabulampot Modern)",
    bulan_harga_tertinggi: ["Februari","Juli","Oktober"],
    alasan_permintaan: "Inovasi budidaya lada tanpa tiang panjat, hemat lahan, mudah dipanen, dan sangat cocok untuk perkebunan intensif pekarangan.",
    rekomendasi_waktu_tanam: "Tanam bibit stek cabang buah (bukan sulur panjat) dengan jarak tanam 1.5x1.5 meter.",
    historis_bulanan: make12MonthCurve(75000, [2,7,10], 0.2),
    karakteristik_tanah: "Lempung gembur subur kaya humus dengan bedengan drainase baik.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "1.5–2 Tahun (~550 HST) mulai berbuah lebat | Panen kontinu",
    potensi_hasil_per_ha: "2.5 - 4.0 Ton Lada Kering / Ha / Tahun (Populasi 4.000 pohon/ha)",
    estimasi_biaya_per_ha: 38000000,
    tips_agronomis: "Lakukan pemangkasan tajuk secara berkala agar tanaman membentuk sosok perdu membulat yang rimbun dengan percabangan buah merata."
  },
  {
    komoditas: "Gambir (Uncaria gambir)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 42000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.2,
    musim_puncak: "Sepanjang Tahun (Ekspor Ekstrak Katekin Sumatera Barat ke India)",
    bulan_harga_tertinggi: ["Januari","Juni","Oktober"],
    alasan_permintaan: "Ekstrak getah daun gambir mengandung katekin tinggi untuk bahan menyirih, penyamak kulit, pewarna tekstil, dan industri farmasi.",
    rekomendasi_waktu_tanam: "Tanam bibit stek atau biji di lereng perbukitan Sumatera Barat/Sumatera Selatan awal musim hujan.",
    historis_bulanan: make12MonthCurve(42000, [1,6,10], 0.16),
    karakteristik_tanah: "Tanah podsolik merah kuning di perbukitan beriklim tropis basah.",
    ph_ideal: "pH 4.5 - 6.0",
    umur_panen: "1.5–2 Tahun menuju panen pangkas perdana | Pangkas ranting daun tiap 4 bulan",
    potensi_hasil_per_ha: "1.8 - 3.2 Ton Getah Gambir Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 22000000,
    tips_agronomis: "Kempa dan cetak pasta rebusan getah daun gambir dalam bentuk silinder/kepingan saat masih hangat sebelum dikeringkan di tungku pengasapan."
  },
  {
    komoditas: "Kayu Putih (Melaleuca cajuputi)",
    kategori: "Perkebunan",
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Musim Kemarau (Juli - Oktober) saat Rendemen Minyak Sineol Tertinggi",
    bulan_harga_tertinggi: ["Juli","Agustus","September"],
    alasan_permintaan: "Bahan baku penyulingan minyak kayu putih aromatik keluarga Indonesia dengan kandungan zat aktif sineol penawar masuk angin.",
    rekomendasi_waktu_tanam: "Tanam semai bibit di awal musim hujan pada lahan tegalan kering atau batas hutan.",
    historis_bulanan: make12MonthCurve(18000, [7,8,9], 0.14),
    karakteristik_tanah: "Tahan di tanah berpasir, tanah berbatu kapur, dan tanah marjinal tahan kekeringan.",
    ph_ideal: "pH 5.0 - 7.5",
    umur_panen: "2–3 Tahun mulai panen pangkas daun pertama | Pangkas rutin tiap 6-8 bulan",
    potensi_hasil_per_ha: "10 - 18 Ton Daun Segar (Hasil 80 - 150 Liter Minyak / Ha / Tahun)",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Pangkas tajuk pohon setinggi 1 meter (sistem pangkas kepras) untuk memudahkan pemetikan daun dan merangsang tunas daun baru bersemi lebat."
  },
  {
    komoditas: "Temu Kunci (Boesenbergia rotunda)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 19000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Sayur Bening Bayam & Herbal Pelancar ASI)",
    bulan_harga_tertinggi: ["Januari","Mei","Oktober"],
    alasan_permintaan: "Aroma segar khas untuk bumbu sayur bening bayam, jamu tradisional pelancar ASI ibu menyusui, dan penurun panas alami.",
    rekomendasi_waktu_tanam: "Tanam rimpang bertunas vertikal di guludan gembur pada awal musim hujan.",
    historis_bulanan: make12MonthCurve(19000, [1,5,10], 0.15),
    karakteristik_tanah: "Lempung berpasir gembur kaya humus di tempat teduh ringan (naungan 30%).",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "240 - 270 HST (8 - 9 Bulan)",
    potensi_hasil_per_ha: "12 - 18 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Tanam rimpang secara vertikal (akar menghadap ke bawah) dengan kedalaman 5 cm agar anakan rimpang baru tumbuh lurus dan padat berisi."
  },
  {
    komoditas: "Bangle (Zingiber montanum)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 20000,
    tren_mingguan: "Stabil",
    persentase_tren: 2.2,
    musim_puncak: "Sepanjang Tahun (Jamu Pelangsing Tradisional & Parem Pasca Melahirkan)",
    bulan_harga_tertinggi: ["Februari","Juli","November"],
    alasan_permintaan: "Rimpang beraroma getir aromatik untuk ramuan jamu galian singset, tapel perut pasca melahirkan, dan anti-inflamasi bengkak.",
    rekomendasi_waktu_tanam: "Tanam rimpang bertunas pada guludan tegalan awal musim hujan.",
    historis_bulanan: make12MonthCurve(20000, [2,7,11], 0.16),
    karakteristik_tanah: "Tanah gembur lempung berliat yang kaya bahan organik.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "240 - 300 HST (8 - 10 Bulan)",
    potensi_hasil_per_ha: "15 - 22 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Panen saat daun tanaman mulai rebah layu mengering di musim kemarau agar kandungan minyak atsiri dan senyawa aktifnya maksimal."
  },
  {
    komoditas: "Temu Ireng / Hitam",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 17000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Jamu Cekok Tradisional & Obat Cacing Alami)",
    bulan_harga_tertinggi: ["Maret","Agustus","Desember"],
    alasan_permintaan: "Daging rimpang berlingkar ungu kehitaman, bahan utama jamu cekok anak penambah nafsu makan dan pembersih darah kotor.",
    rekomendasi_waktu_tanam: "Tanam rimpang tua di guludan awal musim hujan di bawah naungan ringan.",
    historis_bulanan: make12MonthCurve(17000, [3,8,12], 0.14),
    karakteristik_tanah: "Lempung berpasir gembur berdrainase baik tanpa genangan air.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "270 - 300 HST (9 - 10 Bulan)",
    potensi_hasil_per_ha: "14 - 20 Ton Rimpang Segar",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Pilih bibit dari rimpang induk (empu) yang berlingkar biru-ungu jelas pekat untuk memastikan kualitas genetika tanaman obat prima."
  },
  {
    komoditas: "Kumis Kucing (Orthosiphon aristatus)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 25000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Sepanjang Tahun (Herbal Teruji Klinis Peluruh Batu Ginjal & Infeksi Kemih)",
    bulan_harga_tertinggi: ["Januari","Juni","Oktober"],
    alasan_permintaan: "Senyawa sinensetin terbukti secara ilmiah sebagai diuretik peluruh batu ginjal, diserap masif pabrik kapsul ekstrak dan teh herbal.",
    rekomendasi_waktu_tanam: "Tanam stek batang berakar di guludan gembur awal musim hujan dengan jarak 40x40 cm.",
    historis_bulanan: make12MonthCurve(25000, [1,6,10], 0.16),
    karakteristik_tanah: "Lempung subur gembur kaya humus dengan pengairan teratur, menyukai tempat agak lembap.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "60 - 75 HST mulai petik pucuk | Panen petik berulang tiap 30-40 hari",
    potensi_hasil_per_ha: "8 - 14 Ton Daun Segar (2 - 3.5 Ton Daun Kering) / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Petik pucuk daun saat kuncup bunga putih keunguan baru akan mekar sebelum membuka penuh untuk mempertahankan kadar kalium dan glikosida tertinggi."
  },
  {
    komoditas: "Sambiloto (Andrographis paniculata)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 28000,
    tren_mingguan: "Naik",
    persentase_tren: 4.2,
    musim_puncak: "Sepanjang Tahun (Raja Pahit Penurun Glukosa Darah & Antivirus)",
    bulan_harga_tertinggi: ["Februari","Juli","Desember"],
    alasan_permintaan: "Kandungan andrografolida tinggi untuk obat herbal penurun diabetes, anti-inflamasi, penurun demam, dan penguat daya tahan tubuh.",
    rekomendasi_waktu_tanam: "Tanam semai benih di bedengan halus bermulsa di awal musim hujan.",
    historis_bulanan: make12MonthCurve(28000, [2,7,12], 0.2),
    karakteristik_tanah: "Tanah lempung berpasir gembur dengan penyinaran matahari penuh.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "75 - 90 HST (dipanen sebelum bunga mekar penuh)",
    potensi_hasil_per_ha: "6 - 10 Ton Herba Kering / Ha / Tahun",
    estimasi_biaya_per_ha: 15000000,
    tips_agronomis: "Panen seluruh herba batang dan daun saat tanaman mulai membentuk kuncup bunga pertama kali karena kandungan zat pahit andrografolida berada di level puncak."
  },
  {
    komoditas: "Meniran (Phyllanthus niruri)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 24000,
    tren_mingguan: "Naik",
    persentase_tren: 3.8,
    musim_puncak: "Sepanjang Tahun (Imunomodulator Fitofarmaka Peningkat Imun Tubuh)",
    bulan_harga_tertinggi: ["Januari","Juli","November"],
    alasan_permintaan: "Bahan baku fitofarmaka resmi Indonesia (seperti Stimuno) yang teruji klinis meningkatkan kekebalan daya tahan tubuh dari infeksi.",
    rekomendasi_waktu_tanam: "Sebar benih di bedengan lembap gembur awal musim hujan.",
    historis_bulanan: make12MonthCurve(24000, [1,7,11], 0.18),
    karakteristik_tanah: "Tanah berpasir atau lempung lembap kaya bahan organik.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "60 - 75 HST",
    potensi_hasil_per_ha: "5 - 9 Ton Herba Basah / Ha",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Cabut herba bersama akarnya saat butir buah kecil di bawah daun telah terbentuk lebat, lalu cuci bersih dan keringkan di ruangan berventilasi baik."
  },
  {
    komoditas: "Pegagan / Antanan (Centella asiatica)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 30000,
    tren_mingguan: "Naik",
    persentase_tren: 5,
    musim_puncak: "Sepanjang Tahun (Tren Kosmetik Skincare Cica & Nutrisi Otak)",
    bulan_harga_tertinggi: ["Februari","Juni","Oktober"],
    alasan_permintaan: "Bahan aktif utama (Centella asiatica / Cica) dalam industri kosmetik perawatan jerawat dan herbal peningkat daya ingat memori otak.",
    rekomendasi_waktu_tanam: "Tanam stolon berakar pada bedengan lembap berkanopi paranet ringan (naungan 25%).",
    historis_bulanan: make12MonthCurve(30000, [2,6,10], 0.22),
    karakteristik_tanah: "Tanah lempung liat lembap kaya bahan organik dengan ketersediaan air melimpah, tidak tergenang.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "60 - 80 HST mulai panen pertama | Panen pangkas berulang tiap 30-40 hari",
    potensi_hasil_per_ha: "8 - 15 Ton Daun Basah / Ha / Tahun",
    estimasi_biaya_per_ha: 18000000,
    tips_agronomis: "Jaga kelembapan tanah selalu basah lembap tapi tidak banjir agar daun pegagan tumbuh melebar hijau segar dengan tangkai yang renyah."
  },
  {
    komoditas: "Sirih Merah (Piper ornatum)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 40000,
    tren_mingguan: "Naik",
    persentase_tren: 4,
    musim_puncak: "Sepanjang Tahun (Herbal Antiseptik Alami, Diabetes, & Tanaman Hias)",
    bulan_harga_tertinggi: ["Maret","Juli","Desember"],
    alasan_permintaan: "Kandungan flavonoid dan alkaloid tinggi untuk pengobatan radang, penurun gula darah, antiseptik, serta tanaman hias bernilai tinggi.",
    rekomendasi_waktu_tanam: "Tanam stek batang bersulur di para-para bertiang bambu di bawah naungan paranet 50%.",
    historis_bulanan: make12MonthCurve(40000, [3,7,12], 0.2),
    karakteristik_tanah: "Media porous campuran tanah gembur, kompos matang, dan arang sekam.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "90 - 120 HST mulai petik daun tua berurat merah mengkilap | Panen kontinu",
    potensi_hasil_per_ha: "6 - 10 Ton Daun Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 26000000,
    tips_agronomis: "Wajib gunakan paranet peneduh 50-60% karena daun sirih merah akan terbakar menguning jika terpapar sinar matahari terik langsung."
  },
  {
    komoditas: "Sirih Hijau (Piper betle)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 15000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Sepanjang Tahun (Antiseptik Tradisional, Mimisan, & Perlengkapan Adat)",
    bulan_harga_tertinggi: ["Januari","Mei","November"],
    alasan_permintaan: "Kebutuhan harian menyirih lansia, bahan pasta gigi antiseptik, sabun pembersih kewanitaan, dan upacara adat perkawinan Melayu/Jawa.",
    rekomendasi_waktu_tanam: "Tanam stek batang sulur pada tiang panjat pohon kelor atau bambu di awal musim hujan.",
    historis_bulanan: make12MonthCurve(15000, [1,5,11], 0.12),
    karakteristik_tanah: "Tanah subur gembur kaya bahan organik dengan kelembapan udara sedang.",
    ph_ideal: "pH 6.0 - 7.0",
    umur_panen: "90 - 120 HST mulai petik daun | Panen kontinu tiap 15 hari",
    potensi_hasil_per_ha: "12 - 20 Ton Daun Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Petik daun nomor 3 sampai 6 dari pucuk ranting karena daun pada ruas tersebut memiliki kadar kavikol dan eugenol tertinggi."
  },
  {
    komoditas: "Mahkota Dewa (Phaleria macrocarpa)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 35000,
    tren_mingguan: "Stabil",
    persentase_tren: 2,
    musim_puncak: "Sepanjang Tahun (Rebusan Buah Kering Anti-Hipertensi & Asam Urat)",
    bulan_harga_tertinggi: ["Februari","Juli","Oktober"],
    alasan_permintaan: "Rajangan buah merah kering untuk jamu herbal penurun tekanan darah tinggi, pembersih asam urat, dan penangkal sel tumor.",
    rekomendasi_waktu_tanam: "Tanam bibit biji/cangkok di awal musim hujan pada lahan pekarangan atau kebun obat.",
    historis_bulanan: make12MonthCurve(35000, [2,7,10], 0.15),
    karakteristik_tanah: "Lempung liat berpasir gembur berdrainase baik.",
    ph_ideal: "pH 5.5 - 6.5",
    umur_panen: "1–2 Tahun (~450 HST) mulai berbuah lebat | Panen petik buah merah masak rutin",
    potensi_hasil_per_ha: "8 - 15 Ton Buah Segar (Hasil 2 - 4 Ton Rajangan Kering) / Ha / Tahun",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Wajib buang biji buah mahkota dewa sebelum dirajang dan dikeringkan karena bijinya mengandung racun alkaloid yang berbahaya bagi pencernaan."
  },
  {
    komoditas: "Brotowali (Tinospora crispa)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 18000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.5,
    musim_puncak: "Sepanjang Tahun (Jamu Pahitan Tradisional & Pengendali Diabetes)",
    bulan_harga_tertinggi: ["Januari","Juni","Oktober"],
    alasan_permintaan: "Bahan pokok jamu gendong pahitan tradisional, rebusan penurun kadar gula darah, dan antiseptik luka kulit/gatal.",
    rekomendasi_waktu_tanam: "Tanam stek batang berbintil di dekat pagar atau pohon rambatan di awal musim hujan.",
    historis_bulanan: make12MonthCurve(18000, [1,6,10], 0.12),
    karakteristik_tanah: "Tahan di segala kondisi tanah gembur, liat, maupun marjinal.",
    ph_ideal: "pH 5.5 - 7.0",
    umur_panen: "6 - 9 Bulan mulai panen pangkas batang berbintil | Panen berkala puluhan tahun",
    potensi_hasil_per_ha: "10 - 18 Ton Batang Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 10000000,
    tips_agronomis: "Pilih batang tua berdiameter minimal 1 cm yang memiliki bintil-bintil rapat menonjol jelas karena di sanalah letak senyawa pahit pikroretin tertinggi."
  },
  {
    komoditas: "Mengkudu / Pace (Morinda citrifolia)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 8000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.2,
    musim_puncak: "Sepanjang Tahun (Jus Fermentasi Noni & Herbal Penurun Tensi)",
    bulan_harga_tertinggi: ["Februari","Juli","November"],
    alasan_permintaan: "Kebutuhan pabrik fermentasi jus noni, suplemen pereda hipertensi, dan anti-kolesterol alami.",
    rekomendasi_waktu_tanam: "Tanam bibit biji atau stek awal musim hujan di batas kebun atau pekarangan.",
    historis_bulanan: make12MonthCurve(8000, [2,7,11], 0.1),
    karakteristik_tanah: "Tahan di berbagai jenis tanah marjinal, tanah pesisir berkapur, dan tanah berbatu.",
    ph_ideal: "pH 5.5 - 7.5",
    umur_panen: "1.5–2 Tahun mulai panen buah matang keputihan | Berbuah tanpa henti sepanjang tahun",
    potensi_hasil_per_ha: "25 - 45 Ton Buah Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 12000000,
    tips_agronomis: "Petik buah saat warna kulit berubah menjadi putih kekuningan transparan sebelum jatuh ke tanah agar steril untuk proses fermentasi jus noni."
  },
  {
    komoditas: "Kejibeling (Strobilanthes crispa)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 22000,
    tren_mingguan: "Stabil",
    persentase_tren: 1.8,
    musim_puncak: "Sepanjang Tahun (Herbal Penghancur Batu Kandung Kemih & Ginjal)",
    bulan_harga_tertinggi: ["Januari","Mei","Oktober"],
    alasan_permintaan: "Kandungan kalium dan asam silikat tinggi yang ampuh melarutkan endapan kristal kalsium oksalat di saluran kemih.",
    rekomendasi_waktu_tanam: "Tanam stek batang pada guludan tanah gembur subur awal musim hujan.",
    historis_bulanan: make12MonthCurve(22000, [1,5,10], 0.14),
    karakteristik_tanah: "Lempung berpasir gembur kaya bahan organik, drainase lancar.",
    ph_ideal: "pH 5.8 - 6.8",
    umur_panen: "75 - 90 HST mulai panen petik daun | Panen pangkas berulang tiap 30-45 hari",
    potensi_hasil_per_ha: "8 - 14 Ton Daun Segar / Ha / Tahun",
    estimasi_biaya_per_ha: 14000000,
    tips_agronomis: "Petik daun yang sudah mekar sempurna bertekstur kasar dan keringkan di bawah naungan angin untuk mempertahankan kandungan mineral kalium alami."
  },
  {
    komoditas: "Rosella Merah (Hibiscus sabdariffa)",
    kategori: "Tanaman Obat",
    icon: '',
    harga_saat_ini: 45000,
    tren_mingguan: "Naik",
    persentase_tren: 3.5,
    musim_puncak: "Sepanjang Tahun (Teh Herbal Asam Segar Kaya Vitamin C & Antioksidan)",
    bulan_harga_tertinggi: ["Maret","Agustus","Desember"],
    alasan_permintaan: "Kelopak bunga merah asam segar untuk teh herbal celup, sirup kesehatan penurun kolesterol, dan pewarna alami minuman.",
    rekomendasi_waktu_tanam: "Tanam biji langsung di bedengan tegalan terbuka awal musim hujan.",
    historis_bulanan: make12MonthCurve(45000, [3,8,12], 0.22),
    karakteristik_tanah: "Lempung berpasir subur yang terkena terik sinar matahari penuh.",
    ph_ideal: "pH 5.5 - 6.8",
    umur_panen: "90 - 120 HST (panen petik kelopak bunga tebal)",
    potensi_hasil_per_ha: "8 - 14 Ton Kelopak Basah (1.5 - 2.5 Ton Kelopak Kering) / Ha",
    estimasi_biaya_per_ha: 16000000,
    tips_agronomis: "Keluarkan biji buah di dalam kelopak menggunakan alat pencongkel silinder segera setelah petik, lalu jemur kelopak merahnya hingga benar-benar kering renyah."
  }
];

// ============================================================
// KALKULATOR PROFIT PROJECTION & UNIVERSAL FALLBACK
// ============================================================

export function calculateProfitProjection(luasM2: number, komoditas: string) {
  const normalized = (komoditas || '').toLowerCase();

  // Cari di dataset statis
  const match = COMMODITY_TRENDS.find(c => c.komoditas.toLowerCase() === normalized);
  
  let kgPerM2 = 1.0;
  let biayaPerM2 = 12000;
  let hargaDefault = match ? match.harga_saat_ini : 20000;

  if (match) {
    if (match.kategori === 'Tanaman Pangan') {
      if (normalized.includes('singkong') || normalized.includes('ubi')) { kgPerM2 = 3.5; biayaPerM2 = 4000; }
      else if (normalized.includes('jagung')) { kgPerM2 = 1.3; biayaPerM2 = 5000; }
      else if (normalized.includes('porang')) { kgPerM2 = 3.0; biayaPerM2 = 9000; }
      else { kgPerM2 = 0.7; biayaPerM2 = 4500; }
    } else if (match.kategori === 'Sayuran') {
      if (normalized.includes('cabai') || normalized.includes('cabe')) { kgPerM2 = 1.1; biayaPerM2 = 18000; }
      else if (normalized.includes('bawang')) { kgPerM2 = 1.2; biayaPerM2 = 16000; }
      else if (normalized.includes('tomat') || normalized.includes('terong')) { kgPerM2 = 2.8; biayaPerM2 = 12000; }
      else if (normalized.includes('timun') || normalized.includes('kubis')) { kgPerM2 = 3.5; biayaPerM2 = 8000; }
      else { kgPerM2 = 2.0; biayaPerM2 = 7000; }
    } else if (match.kategori === 'Buah-Buahan') {
      if (normalized.includes('semangka') || normalized.includes('melon')) { kgPerM2 = 3.8; biayaPerM2 = 8500; }
      else if (normalized.includes('anggur')) { kgPerM2 = 1.2; biayaPerM2 = 25000; }
      else { kgPerM2 = 2.0; biayaPerM2 = 9000; }
    } else if (match.kategori === 'Rempah & Bumbu') {
      if (normalized.includes('vanili')) { kgPerM2 = 0.12; biayaPerM2 = 22000; }
      else if (normalized.includes('kapulaga')) { kgPerM2 = 0.35; biayaPerM2 = 14000; }
      else { kgPerM2 = 1.6; biayaPerM2 = 12000; }
    } else if (match.kategori === 'Perkebunan') {
      if (normalized.includes('kopi') || normalized.includes('cokelat') || normalized.includes('kakao')) { kgPerM2 = 0.25; biayaPerM2 = 6000; }
      else { kgPerM2 = 1.5; biayaPerM2 = 4000; }
    } else {
      kgPerM2 = 1.2; biayaPerM2 = 8000;
    }
  } else {
    // Cerdas fallback untuk tanaman apa saja yang diketik user
    if (normalized.includes('buah') || normalized.includes('apel') || normalized.includes('berry')) {
      kgPerM2 = 1.5; biayaPerM2 = 12000; hargaDefault = 35000;
    } else if (normalized.includes('daun') || normalized.includes('sayur') || normalized.includes('jamur')) {
      kgPerM2 = 2.5; biayaPerM2 = 8000; hargaDefault = 16000;
    } else if (normalized.includes('rempah') || normalized.includes('akar') || normalized.includes('bumbu')) {
      kgPerM2 = 1.0; biayaPerM2 = 14000; hargaDefault = 45000;
    } else {
      kgPerM2 = 1.2; biayaPerM2 = 10000; hargaDefault = 25000;
    }
  }

  const totalPanenKg = Math.round(luasM2 * kgPerM2);
  const totalBiayaProduksi = Math.round(luasM2 * biayaPerM2);
  const totalOmset = Math.round(totalPanenKg * hargaDefault);
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
// MARKET INTELLIGENCE SCORING & RECOMMENDATION ENGINE
// ============================================================

export type RisikoLevel = 'Rendah' | 'Sedang' | 'Tinggi';

export interface MarketIntelligenceScore {
  komoditas: string;
  icon: string;
  kategori: CommodityCategory;
  skorPermintaan: number;
  skorTrenHarga: number;
  skorStabilitas: number;
  skorProfitPotensial: number;
  skorTotal: number;
  risikoLevel: RisikoLevel;
  labelRekomendasi: string;
  hargaSaatIni: number;
  trenMingguan: string;
  persentaseTren: number;
  alasanSingkat: string;
  bulanPuncakBerikutnya: string;
  estimasiLabaBersih?: number;
  roi?: number;
  karakteristik_tanah?: string;
  ph_ideal?: string;
  umur_panen?: string;
  tips_agronomis?: string;
  isHarvestProfitable?: boolean;
  harvestDeltaPct?: number;
  isRegionalMatch?: boolean;
}

function parseHarvestDaysApprox(umurPanenStr?: string, komoditasName?: string): number {
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
    if (hstMatch[2]) return Math.round((Number(hstMatch[1]) + Number(hstMatch[2])) / 2);
    return Number(hstMatch[1]);
  }

  const hariMatch = umurPanenStr.match(/(\d+)\s*-\s*(\d+)\s*Hari/i) || umurPanenStr.match(/(\d+)\s*Hari/i);
  if (hariMatch) {
    if (hariMatch[2]) return Math.round((Number(hariMatch[1]) + Number(hariMatch[2])) / 2);
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

const HIGHLAND_REGIONS = [
  'malang', 'batu', 'pujon', 'bromo', 'tengger', 'semeru', 'ijen',
  'dieng', 'wonosobo', 'banjarnegara', 'temanggung', 'bandungan', 'selo', 'tawangmangu', 'karanganyar',
  'lembang', 'bandung', 'ciwidey', 'pangalengan', 'garut', 'cikajang', 'puncak', 'cipanas', 'cisarua', 'kuningan',
  'karo', 'berastagi', 'simalungun', 'dairi', 'tapanuli', 'kerinci', 'sungai penuh',
  'alahan panjang', 'bukittinggi', 'agam', 'tanah datar', 'padang panjang', 'solok selatan',
  'pagar alam', 'curup', 'rejang lebong', 'toraja', 'tana toraja', 'enrekang', 'malino', 'tomohon', 'modoinding',
  'bedugul', 'kintamani', 'sembalun', 'bajawa', 'ruteng', 'manggarai', 'takengon', 'bener meriah', 'gayo'
];

const HIGHLAND_ONLY_CROPS = [
  'stevia',
  'apel',
  'kentang',
  'kubis',
  'kol',
  'kopi arabika',
  'kapulaga',
  'wortel',
  'stroberi',
  'strawberry',
  'teh',
  'brokoli',
  'paprika',
  'bawang prei'
];

const HOT_LOWLAND_ONLY_CROPS = [
  'tembakau',
  'semangka',
  'melon'
];

export function isCommoditySuitableForRegion(commodityName: string, regionName?: string): boolean {
  if (!regionName) return true;
  const regLower = regionName.toLowerCase();
  const commLower = commodityName.toLowerCase();

  const isHighland = HIGHLAND_REGIONS.some(k => regLower.includes(k));
  const isLowland = !isHighland;

  // Tanaman dataran tinggi sejuk (wajib 500-1.500 mdpl, suhu sejuk 18-24°C)
  // Kurang optimal / berisiko gagal di dataran rendah tropis panas (seperti Tangerang, Banten, Jakarta, Pantura, Surabaya, dll)
  if (isLowland && HIGHLAND_ONLY_CROPS.some(h => commLower.includes(h))) {
    return false;
  }

  // Tanaman pesisir / kemarau terik dataran rendah
  if (isHighland && HOT_LOWLAND_ONLY_CROPS.some(h => commLower.includes(h))) {
    return false;
  }

  return true;
}

export function getRegionSuitabilityDetails(commodityName: string, regionName?: string): {
  isSuitable: boolean;
  isHighland: boolean;
  alasan?: string;
} {
  if (!regionName) return { isSuitable: true, isHighland: false };
  const suitable = isCommoditySuitableForRegion(commodityName, regionName);
  const regLower = regionName.toLowerCase();
  const isHighland = HIGHLAND_REGIONS.some(k => regLower.includes(k));

  if (!suitable) {
    if (!isHighland) {
      return {
        isSuitable: false,
        isHighland: false,
        alasan: `${commodityName} secara botani membutuhkan agroklimat dataran tinggi sejuk (ketinggian 500–1.500 mdpl, suhu harian 20–24°C). Wilayah ${regionName} berada di dataran rendah tropis (suhu 27–34°C). Kondisi panas ini memicu stres fisiologis, penurunan kadar senyawa aktif/manis (glikosida), pembungaan dini prematur, dan pertumbuhan daun kurang optimal.`
      };
    } else {
      return {
        isSuitable: false,
        isHighland: true,
        alasan: `${commodityName} membutuhkan radiasi matahari terik penuh dan musim kemarau tegas dataran rendah. Di dataran tinggi sejuk berkabut ${regionName}, kelembapan berlebih memicu serangan jamur/busuk batang dan kadar gula hasil panen kurang pekat.`
      };
    }
  }

  return { isSuitable: true, isHighland };
}

function hitungStabilitas(historis: { harga: number }[]): number {
  const harga = historis.map(h => h.harga);
  const avg = harga.reduce((a, b) => a + b, 0) / harga.length;
  const variance = harga.reduce((sum, h) => sum + Math.pow(h - avg, 2), 0) / harga.length;
  const cv = Math.sqrt(variance) / avg;
  return Math.max(0, Math.min(100, Math.round((1 - cv / 0.5) * 100)));
}

function hitungKedekatanMusimPuncak(bulanPuncak: string[]): { skor: number; labelBulan: string } {
  const bulanMap: Record<string, number> = {
    'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4,
    'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8,
    'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
  };
  const now = new Date().getMonth() + 1;
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
  const skor = Math.max(10, Math.round(100 - (minGap / 12) * 90));
  return { skor, labelBulan };
}

function hitungSkorPermintaan(historis: { indeks_daya_beli: number }[]): number {
  const recent = historis.slice(-3);
  const avg = recent.reduce((s, h) => s + h.indeks_daya_beli, 0) / recent.length;
  return Math.round(avg);
}

function hitungSkorTren(tren: string, persen: number): number {
  if (tren === 'Naik') return Math.min(100, 60 + persen * 2.5);
  if (tren === 'Turun') return Math.max(0, 40 - persen * 2);
  return 55;
}

function hitungSkorProfit(komoditas: string): number {
  const proj = calculateProfitProjection(10000, komoditas);
  return Math.min(100, Math.max(10, Math.round(30 + proj.roi * 0.35)));
}

function getLabelRekomendasiClean(skor: number, risiko: RisikoLevel, musimDekat: boolean, isHarvestProfitable: boolean): string {
  if (!isHarvestProfitable) return 'Waspada Siklus Turun';
  if (skor >= 72 && risiko === 'Rendah') return 'Tanam Sekarang';
  if (skor >= 72 && musimDekat) return 'Segera Tanam';
  if (skor >= 55 && risiko !== 'Tinggi') return 'Pertimbangkan';
  if (risiko === 'Tinggi') return 'Waspada Risiko';
  return 'Pantau Pasar';
}

function getAlasanSingkat(item: MarketCommodityTrendExtended, skor: number, stabilitas: number, isHarvestProfitable: boolean): string {
  if (!isHarvestProfitable)
    return `Saat ini harga tinggi, namun harga saat estimasi panen diproyeksikan terkoreksi turun. Tunda siklus.`;
  if (item.tren_mingguan === 'Naik' && item.persentase_tren >= 8)
    return `Harga naik +${item.persentase_tren}% minggu ini akibat tingginya serapan pasar.`;
  if (stabilitas >= 75)
    return `Harga sangat stabil sepanjang tahun, meminimalkan risiko kerugian fluktuasi pasar.`;
  if (skor >= 70)
    return `Margin profit dan estimasi ROI kompetitif untuk diversifikasi lahan produktif.`;
  if (item.tren_mingguan === 'Turun')
    return `Harga sedang terkoreksi sesaat, tunggu sinyal stabilisasi sebelum tanam serentak.`;
  return `Pasokan pasar stabil dan memiliki serapan konsumen rumah tangga teratur.`;
}

export function calculateAllMarketScores(luasM2: number = 10000, regionName?: string): MarketIntelligenceScore[] {
  const nowMonth = new Date().getMonth();

  return COMMODITY_TRENDS.map(item => {
    const harvestDays = parseHarvestDaysApprox(item.umur_panen, item.komoditas);
    const isPerennial = harvestDays >= 365;
    const harvestMonthOffset = Math.max(1, Math.round(harvestDays / 30));
    let harvestMonth = (nowMonth + harvestMonthOffset) % 12;

    if (isPerennial && item.bulan_harga_tertinggi && item.bulan_harga_tertinggi.length > 0) {
      const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const peakIdx = bulanList.findIndex(b =>
        item.bulan_harga_tertinggi.some(p => p.toLowerCase().startsWith(b.slice(0, 3).toLowerCase()))
      );
      if (peakIdx >= 0) {
        harvestMonth = peakIdx;
      }
    }

    const priceAtPlant = item.historis_bulanan[nowMonth]?.harga || item.harga_saat_ini;
    const priceAtHarvest = item.historis_bulanan[harvestMonth]?.harga || item.harga_saat_ini;
    const harvestDeltaPct = priceAtPlant > 0 ? Math.round(((priceAtHarvest - priceAtPlant) / priceAtPlant) * 100) : 0;
    const isHarvestProfitable = harvestDeltaPct >= 0;
    const isRegionalMatch = isCommoditySuitableForRegion(item.komoditas, regionName);

    const skorPermintaan = hitungSkorPermintaan(item.historis_bulanan);
    const skorTren = hitungSkorTren(item.tren_mingguan, item.persentase_tren);
    const stabilitas = hitungStabilitas(item.historis_bulanan);
    const skorProfit = hitungSkorProfit(item.komoditas);
    const { skor: skorMusim, labelBulan } = hitungKedekatanMusimPuncak(item.bulan_harga_tertinggi);

    let penaltiPanen = 0;
    if (!isHarvestProfitable) penaltiPanen -= 20; // Jangan jadikan top pick jika harga anjlok saat panen
    if (!isRegionalMatch) penaltiPanen -= 30; // Penalti jika tidak cocok dengan iklim/tanah wilayah

    const skorTotal = Math.max(10, Math.min(100, Math.round(
      skorPermintaan * 0.25 +
      skorTren       * 0.25 +
      stabilitas     * 0.20 +
      skorProfit     * 0.15 +
      skorMusim      * 0.05 +
      penaltiPanen
    )));

    let risiko: RisikoLevel;
    if (skorTotal >= 68 && stabilitas >= 60 && isHarvestProfitable) risiko = 'Rendah';
    else if (skorTotal >= 48) risiko = 'Sedang';
    else risiko = 'Tinggi';

    const musimDekat = skorMusim >= 70;
    const label = getLabelRekomendasiClean(skorTotal, risiko, musimDekat, isHarvestProfitable);
    const alasan = getAlasanSingkat(item, skorTotal, stabilitas, isHarvestProfitable);
    const proj = calculateProfitProjection(luasM2, item.komoditas);

    return {
      komoditas: item.komoditas,
      icon: '',
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
      karakteristik_tanah: item.karakteristik_tanah,
      ph_ideal: item.ph_ideal,
      umur_panen: item.umur_panen,
      tips_agronomis: item.tips_agronomis,
      isHarvestProfitable,
      harvestDeltaPct,
      isRegionalMatch
    };
  }).sort((a, b) => b.skorTotal - a.skorTotal);
}

export function getTopRecommendations(luasM2: number, topN = 3, regionName?: string): MarketIntelligenceScore[] {
  return calculateAllMarketScores(luasM2, regionName)
    .filter(s => {
      if (regionName && !isCommoditySuitableForRegion(s.komoditas, regionName)) return false;
      if (!s.isHarvestProfitable) return false;
      return !s.labelRekomendasi.includes('Waspada');
    })
    .slice(0, topN);
}

export function getMarketPulse(regionName?: string): {
  mostDemanded: MarketIntelligenceScore;
  fastestRising: MarketIntelligenceScore;
  mostStable: MarketIntelligenceScore;
} {
  const all = calculateAllMarketScores(10000, regionName);
  const regionalPool = regionName ? all.filter(c => isCommoditySuitableForRegion(c.komoditas, regionName)) : all;
  const pool = regionalPool.length > 0 ? regionalPool : all;

  // 1. Most Demanded HARUS komoditas yang siklus panennya menguntungkan di bulan tanam saat ini
  // Jangan merekomendasikan komoditas yang harga panennya anjlok (Waspada Siklus Turun)
  const profitablePool = pool.filter(c => c.isHarvestProfitable && (c.harvestDeltaPct ?? 0) >= 0 && !c.labelRekomendasi.includes('Waspada'));
  const demandCandidatePool = profitablePool.length > 0 ? profitablePool : pool;
  const mostDemanded = [...demandCandidatePool].sort((a, b) => b.skorPermintaan - a.skorPermintaan)[0];

  // 2. Kenaikan Tercepat juga prioritaskan yang hasil panennya menguntungkan
  const risingProfitablePool = pool.filter(c => c.isHarvestProfitable && c.trenMingguan === 'Naik');
  const risingPool = risingProfitablePool.length > 0 ? risingProfitablePool : pool;
  const fastestRising = [...risingPool].sort((a, b) => {
    const scoreA = a.trenMingguan === 'Naik' ? a.persentaseTren : -99;
    const scoreB = b.trenMingguan === 'Naik' ? b.persentaseTren : -99;
    return scoreB - scoreA;
  })[0];

  // 3. Paling Stabil prioritaskan yang siklus panennya stabil/menguntungkan
  const stableProfitablePool = pool.filter(c => c.isHarvestProfitable);
  const stablePool = stableProfitablePool.length > 0 ? stableProfitablePool : pool;
  const mostStable = [...stablePool].sort((a, b) => b.skorStabilitas - a.skorStabilitas)[0];

  return { mostDemanded, fastestRising, mostStable };
}

// ============================================================
// UNIVERSAL DATASET ENGINE: MENAMPILKAN DATA UNTUK INPUT APAPUN
// ============================================================

export function getUniversalCommodityData(searchTerm: string): MarketCommodityTrendExtended {
  const query = (searchTerm || '').trim();
  const lower = query.toLowerCase();

  // 1. Cek kecocokan langsung di dataset komprehensif
  const direct = COMMODITY_TRENDS.find(c => 
    c.komoditas.toLowerCase() === lower ||
    c.komoditas.toLowerCase().includes(lower) ||
    lower.includes(c.komoditas.toLowerCase())
  );
  if (direct) return direct;

  // 2. Validasi apakah input berkaitan dengan istilah botani/pertanian.
  // Jika input sama sekali bukan komoditas pertanian (misal: "cacing", "mobil", "laptop"),
  // kembalikan komoditas patokan default terpercaya dan JANGAN memalsukan data.
  const isBotanical = 
    lower.includes('buah') || lower.includes('sayur') || lower.includes('padi') ||
    lower.includes('bawang') || lower.includes('cabai') || lower.includes('cabe') ||
    lower.includes('kopi') || lower.includes('teh') || lower.includes('kakao') ||
    lower.includes('sawit') || lower.includes('singkong') || lower.includes('ubi') ||
    lower.includes('jagung') || lower.includes('tomat') || lower.includes('kentang') ||
    lower.includes('nanas') || lower.includes('durian') || lower.includes('mangga') ||
    lower.includes('pisang') || lower.includes('jeruk') || lower.includes('apel') ||
    lower.includes('daun') || lower.includes('akar') || lower.includes('umbi') ||
    lower.includes('kacang') || lower.includes('rempah') || lower.includes('obat') ||
    lower.includes('tanaman') || lower.includes('herbal') || lower.includes('bunga');

  if (!isBotanical) {
    return COMMODITY_TRENDS.find(c => c.komoditas === 'Bawang Merah') || COMMODITY_TRENDS[0];
  }

  // 3. Jika botani belum ada di list statis, generate agronomical data cerdas berbasis botani
  let category: CommodityCategory = 'Sayuran';
  let basePrice = 25000;
  let harvestAge = '70 - 90 HST';
  let ph = 'pH 6.0 - 6.8';
  let yieldStr = '10 - 18 Ton / Ha';
  let soil = 'Tanah gembur lempung berpasir, drainase baik, kaya bahan organik';
  let tips = 'Berikan pupuk kandang matang saat olah tanah dan jaga kelembapan tanah teratur.';

  if (lower.includes('durian') || lower.includes('duren')) {
    category = 'Buah-Buahan';
    basePrice = 65000;
    harvestAge = 'Bibit Sambung Pucuk: 4–6 Tahun (~1.825 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (siklus bunga-buah ±110–130 hari)';
    ph = 'pH 6.0 - 6.8';
    yieldStr = '10 - 18 Ton / Ha per tahun';
    soil = 'Tanah latosol atau andosol subur gembur kaya humus, lapisan tanah dalam (>1.5 m)';
    tips = 'Gunakan bibit sambung pucuk varietas unggul bersertifikat, jaga drainase prima, dan lakukan pemangkasan bentuk tajuk piramida.';
  } else if (lower.includes('mangga') || lower.includes('alpukat') || lower.includes('apel')) {
    category = 'Buah-Buahan';
    basePrice = 30000;
    harvestAge = 'Bibit Okulasi: 3–4 Tahun (~1.200 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (siklus bunga-buah ±120–140 hari)';
    ph = 'pH 5.5 - 6.8';
    yieldStr = '15 - 25 Ton / Ha per tahun';
    soil = 'Tanah gembur lempung berpasir subur, tidak tergenang air';
    tips = 'Pangkas cabang air secara teratur dan lakukan induksi pembungaan terencana saat memasuki musim kemarau.';
  } else if (lower.includes('jeruk') || lower.includes('citrus') || lower.includes('lemon')) {
    category = 'Buah-Buahan';
    basePrice = 18000;
    harvestAge = 'Bibit Okulasi: 2.5–3 Tahun (~900 HST) hingga Panen Perdana | Pohon Produktif: Panen raya tahunan (siklus bunga-buah ±210–240 hari)';
    ph = 'pH 5.8 - 6.8';
    yieldStr = '18 - 30 Ton / Ha per tahun';
    soil = 'Lempung berpasir gembur tebal, tidak tergenang, air tanah kedalaman > 1.5 meter';
    tips = 'Gunakan bibit bebas CVPD bersertifikat dan pangkas bentuk tajuk 1-3-9 sejak dini.';
  } else if (lower.includes('naga') || lower.includes('anggur')) {
    category = 'Buah-Buahan';
    basePrice = 35000;
    harvestAge = 'Stek/Grafting: 10–12 Bulan (~330 HST) hingga Pembuahan Perdana';
    ph = 'pH 6.0 - 7.0';
    yieldStr = '10 - 20 Ton / Ha';
    soil = 'Tanah berpasir porous gembur dicampur kompos matang, tiang rambatan/trellis kuat';
    tips = 'Rawat sulur ke tiang panjat atau trellis dan lakukan pemangkasan pembuahan setelah cabang tersier berkayu.';
  } else if (lower.includes('pisang')) {
    category = 'Buah-Buahan';
    basePrice = 9000;
    harvestAge = 'Bibit Anakan: 9–11 Bulan (~300 HST) hingga Panen Tandan';
    ph = 'pH 5.5 - 6.8';
    yieldStr = '35 - 50 Ton / Ha';
    soil = 'Tanah alluvial/latosol tebal gembur kaya humus, drainase lancar';
    tips = 'Bungkus tandan dengan plastik brongsong sejak jantung merunduk dan sangga batang dengan bambu.';
  } else if (lower.includes('pepaya')) {
    category = 'Buah-Buahan';
    basePrice = 7000;
    harvestAge = 'Semaian: 7–8 Bulan (~240 HST) mulai Panen Rutin';
    ph = 'pH 6.0 - 6.8';
    yieldStr = '50 - 70 Ton / Ha per tahun';
    soil = 'Lempung berpasir gembur pada guludan tinggi bebas genangan air';
    tips = 'Buat parit drainase dalam karena perakaran pepaya sangat sensitif terhadap kelebihan air.';
  } else if (lower.includes('nanas')) {
    category = 'Buah-Buahan';
    basePrice = 9500;
    harvestAge = '270 - 300 HST (Rata-rata 285 HST / 9 - 10 Bulan)';
    ph = 'pH 4.5 - 5.5';
    yieldStr = '45 - 65 Ton / Ha';
    soil = 'Tanah lempung berpasir gembur tebal tanpa genangan air';
    tips = 'Lakukan induksi pembungaan (forcing) pada umur 6-7 bulan saat kanopi memiliki minimal 35 daun aktif.';
  } else if (lower.includes('semangka') || lower.includes('melon')) {
    category = 'Buah-Buahan';
    basePrice = 10000;
    harvestAge = '55 - 65 HST (Tanaman Semusim Merambat)';
    ph = 'pH 6.0 - 6.8';
    yieldStr = '25 - 40 Ton / Ha';
    soil = 'Lempung berpasir gembur subur, saluran parit drainase dalam';
    tips = 'Pilih 1–2 bakal buah terbaik pada ruas ke-10 ke atas dan kurangi air 10 hari menjelang panen.';
  } else if (lower.includes('buah') || lower.includes('berry')) {
    category = 'Buah-Buahan';
    basePrice = 28000;
    harvestAge = 'Bibit Tanam: 1–2 Tahun (~365–730 HST) hingga Panen Perdana';
    ph = 'pH 5.8 - 6.8';
    yieldStr = '12 - 22 Ton / Ha per tahun';
    soil = 'Tanah subur gembur berpasir tebal, tidak tergenang air, sinar matahari penuh';
    tips = 'Gunakan bibit vegetatif sambung pucuk atau okulasi dan lakukan pemangkasan cabang teratur.';
  } else if (lower.includes('karet')) {
    category = 'Perkebunan';
    basePrice = 18500;
    harvestAge = 'Bibit Okulasi: 5–6 Tahun (~1.825 HST) hingga Buka Sadap Lateks';
    ph = 'pH 4.5 - 6.0';
    yieldStr = '1.5 - 2.2 Ton / Ha per tahun';
    soil = 'Latosol atau podsolik merah kuning dalam';
    tips = 'Sadap pohon pada pagi subuh saat tekanan turgor sel lateks di titik tertinggi.';
  } else if (lower.includes('sawit')) {
    category = 'Perkebunan';
    basePrice = 2800;
    harvestAge = 'Bibit Sawit: 3–4 Tahun (~1.200 HST) hingga Panen TBS Perdana';
    ph = 'pH 4.0 - 6.0';
    yieldStr = '20 - 28 Ton TBS / Ha / tahun';
    soil = 'Tanah alluvial atau podsolik lapisan olah dalam';
    tips = 'Gunakan bibit resmi bersertifikat PPKS dan terapkan kastrasi bunga pasir di umur 14-20 bulan.';
  } else if (lower.includes('kopi') || lower.includes('kakao') || lower.includes('cokelat')) {
    category = 'Perkebunan';
    basePrice = 60000;
    harvestAge = 'Bibit Tanam: 2.5–3 Tahun (~800–900 HST) hingga Panen Perdana';
    ph = 'pH 5.5 - 6.5';
    yieldStr = '1.5 - 3.0 Ton / Ha per tahun';
    soil = 'Tanah andosol atau latosol gembur berdrainase baik';
    tips = 'Tanam tanaman naungan sementara dan pangkas cabang air secara teratur.';
  } else if (lower.includes('jahe') || lower.includes('kunyit') || lower.includes('rempah') || lower.includes('lada') || lower.includes('cengkeh') || lower.includes('kayu manis') || lower.includes('akar')) {
    category = 'Rempah & Bumbu';
    basePrice = 45000;
    harvestAge = '240 - 270 HST (8 - 9 Bulan)';
    ph = 'pH 5.5 - 6.5';
    yieldStr = '8 - 15 Ton / Ha';
    soil = 'Lempung berpasir gembur tebal kaya serasah hutan atau kompos';
    tips = 'Bumbun tanah secara bertahap agar rimpang atau umbi leluasa berkembang tanpa terkena panas langsung.';
  } else if (lower.includes('obat') || lower.includes('herbal') || lower.includes('kelor') || lower.includes('stevia') || lower.includes('ginseng') || lower.includes('jamu')) {
    category = 'Tanaman Obat';
    basePrice = 38000;
    harvestAge = '90 - 120 HST (3 - 4 Bulan)';
    ph = 'pH 6.0 - 7.0';
    yieldStr = '5 - 10 Ton / Ha';
    soil = 'Tanah porous berhumus tinggi, naungan ringan 20-30%';
    tips = 'Petik daun atau rimpang pada pagi hari saat kandungan minyak atsiri dan senyawa aktif berada di puncak.';
  } else if (lower.includes('tebu') || lower.includes('tembakau') || lower.includes('teh')) {
    category = 'Perkebunan';
    basePrice = 50000;
    harvestAge = '180 - 240 HST (Siklus Panen 6 - 8 Bulan)';
    ph = 'pH 5.0 - 6.5';
    yieldStr = '2 - 5 Ton / Ha';
    soil = 'Tanah lapisan olah dalam (kedalaman > 1 meter), bebas padas keras';
    tips = 'Tanam tanaman penutup tanah (legume cover crop) untuk menekan gulma dan menahan erosi tanah.';
  } else if (lower.includes('padi') || lower.includes('jagung') || lower.includes('singkong') || lower.includes('ubi') || lower.includes('sorgum') || lower.includes('gandum') || lower.includes('kacang')) {
    category = 'Tanaman Pangan';
    basePrice = 12000;
    harvestAge = '95 - 115 HST (3 - 4 Bulan)';
    ph = 'pH 5.5 - 7.0';
    yieldStr = '6 - 12 Ton / Ha';
    soil = 'Lempung subur berdrainase baik atau tanah sawah irigasi';
    tips = 'Gunakan benih bersertifikat murni dengan daya tumbuh di atas 85% dan lakukan rotasi tanaman.';
  }

  // Format capitalized name
  const formattedName = query
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    komoditas: formattedName,
    kategori: category,
    icon: '',
    harga_saat_ini: basePrice,
    tren_mingguan: 'Naik',
    persentase_tren: 4.2,
    musim_puncak: 'Menjelang Musim Panen Raya & Kebutuhan Pasar Spesifik',
    bulan_harga_tertinggi: ['Januari', 'Juli', 'Desember'],
    alasan_permintaan: `Memiliki segmen pasar pembeli khusus dengan prospek nilai jual menguntungkan bagi petani lokal.`,
    rekomendasi_waktu_tanam: 'Tanam pada awal musim hujan atau musim kemarau dengan fasilitas irigasi terkontrol.',
    historis_bulanan: make12MonthCurve(basePrice, [1, 7, 12], 0.18),
    karakteristik_tanah: soil,
    ph_ideal: ph,
    umur_panen: harvestAge,
    potensi_hasil_per_ha: yieldStr,
    estimasi_biaya_per_ha: 20000000,
    tips_agronomis: tips
  };
}
