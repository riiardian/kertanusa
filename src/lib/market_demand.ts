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
    umur_panen: 'Tahun ke-2.5 mulai panen produktif',
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
    umur_panen: '8 - 10 Bulan mulai pembuahan perdana (pruning)',
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
    umur_panen: '9 - 11 Bulan setelah tanam',
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
    umur_panen: 'Tahun ke-3 mulai berbuah produktif',
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
    umur_panen: '7 - 8 Bulan mulai panen rutin mingguan',
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
    umur_panen: 'Tahun ke-3 mulai berbuah produktif',
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
    umur_panen: '10 - 12 Bulan setelah tanam stek',
    potensi_hasil_per_ha: '20 - 35 Ton Buah Segar',
    estimasi_biaya_per_ha: 45000000,
    tips_agronomis: 'Gunakan lampu penerangan LED di malam hari saat musim non-bunga untuk memacu pembungaan di luar musim (off-season).'
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
    umur_panen: '110 - 130 HST (Siklus Buah 3.5 - 4 Bulan)',
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
    umur_panen: '240 - 270 HST (Siklus Polong Matang 8 - 9 Bulan)',
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
    umur_panen: '150 - 180 HST (Siklus Buah 5 - 6 Bulan)',
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
    umur_panen: '210 - 240 HST (Siklus Ceri Merah 7 - 8 Bulan)',
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
    umur_panen: '180 - 210 HST (Siklus Panen Raya 6 - 7 Bulan)',
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
    umur_panen: 'Tahun ke-3 mulai panen TBS rutin tiap 2 minggu',
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
    umur_panen: 'Tahun ke-5 mulai buka sadap lateks',
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

function getLabelRekomendasiClean(skor: number, risiko: RisikoLevel, musimDekat: boolean): string {
  if (skor >= 72 && risiko === 'Rendah') return 'Tanam Sekarang';
  if (skor >= 72 && musimDekat) return 'Segera Tanam';
  if (skor >= 55 && risiko !== 'Tinggi') return 'Pertimbangkan';
  if (risiko === 'Tinggi') return 'Waspada Risiko';
  return 'Pantau Pasar';
}

function getAlasanSingkat(item: MarketCommodityTrendExtended, skor: number, stabilitas: number): string {
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

export function calculateAllMarketScores(luasM2: number = 10000): MarketIntelligenceScore[] {
  return COMMODITY_TRENDS.map(item => {
    const skorPermintaan = hitungSkorPermintaan(item.historis_bulanan);
    const skorTren = hitungSkorTren(item.tren_mingguan, item.persentase_tren);
    const stabilitas = hitungStabilitas(item.historis_bulanan);
    const skorProfit = hitungSkorProfit(item.komoditas);
    const { skor: skorMusim, labelBulan } = hitungKedekatanMusimPuncak(item.bulan_harga_tertinggi);

    const skorTotal = Math.round(
      skorPermintaan * 0.30 +
      skorTren       * 0.30 +
      stabilitas     * 0.20 +
      skorProfit     * 0.15 +
      skorMusim      * 0.05
    );

    let risiko: RisikoLevel;
    if (skorTotal >= 68 && stabilitas >= 60) risiko = 'Rendah';
    else if (skorTotal >= 48) risiko = 'Sedang';
    else risiko = 'Tinggi';

    const musimDekat = skorMusim >= 70;
    const label = getLabelRekomendasiClean(skorTotal, risiko, musimDekat);
    const alasan = getAlasanSingkat(item, skorTotal, stabilitas);
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
      tips_agronomis: item.tips_agronomis
    };
  }).sort((a, b) => b.skorTotal - a.skorTotal);
}

export function getTopRecommendations(luasM2: number, topN = 3): MarketIntelligenceScore[] {
  return calculateAllMarketScores(luasM2)
    .filter(s => !s.labelRekomendasi.includes('Waspada'))
    .slice(0, topN);
}

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

  // 2. Jika tidak ada di list statis, generate agronomical data cerdas berbasis botani
  let category: CommodityCategory = 'Sayuran';
  let basePrice = 25000;
  let harvestAge = '70 - 90 HST';
  let ph = 'pH 6.0 - 6.8';
  let yieldStr = '10 - 18 Ton / Ha';
  let soil = 'Tanah gembur lempung berpasir, drainase baik, kaya bahan organik';
  let tips = 'Berikan pupuk kandang matang saat olah tanah dan jaga kelembapan tanah teratur.';

  if (lower.includes('apel') || lower.includes('apple')) {
    category = 'Buah-Buahan';
    basePrice = 32000;
    harvestAge = '120 - 140 HST (Siklus Buah 4 - 5 Bulan)';
    ph = 'pH 5.5 - 6.5';
    yieldStr = '15 - 25 Ton / Ha per tahun';
    soil = 'Tanah andosol / lempung berpasir vulkanik pegunungan, ketinggian 700-1200 mdpl';
    tips = 'Lakukan perompesan daun secara serentak untuk merangsang tunas bunga serempak dan pembesaran buah optimal.';
  } else if (lower.includes('buah') || lower.includes('naga') || lower.includes('berry') || lower.includes('durian') || lower.includes('mangga')) {
    category = 'Buah-Buahan';
    basePrice = 32000;
    harvestAge = '120 - 150 HST (Siklus Buah 4 - 5 Bulan)';
    ph = 'pH 5.8 - 6.8';
    yieldStr = '12 - 22 Ton / Ha per tahun';
    soil = 'Tanah subur gembur berpasir tebal, tidak tergenang air, sinar matahari penuh';
    tips = 'Gunakan bibit vegetatif sambung pucuk atau okulasi dan lakukan pemangkasan cabang teratur.';
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
  } else if (lower.includes('kopi') || lower.includes('sawit') || lower.includes('karet') || lower.includes('tebu') || lower.includes('tembakau') || lower.includes('teh')) {
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
