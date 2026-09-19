export interface CropInfo {
  nama: string;
  kategori: 'Hortikultura' | 'Pangan' | 'Palawija';
  umur_panen_hari: number;
  ph_optimal_min: number;
  ph_optimal_max: number;
  kelembapan_optimal_min: number;
  kelembapan_optimal_max: number;
  suhu_optimal_min: number;
  suhu_optimal_max: number;
  kebutuhan_air_harian_liter_m2: number;
  tahap_pertumbuhan: {
    nama: string;
    rentang_hari: [number, number];
    panduan: string;
  }[];
}

export const CROPS_CATALOG: Record<string, CropInfo> = {
  'Cabai Rawit Merah': {
    nama: 'Cabai Rawit Merah',
    kategori: 'Hortikultura',
    umur_panen_hari: 80,
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 55,
    kelembapan_optimal_max: 70,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 3.8,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif Awal', rentang_hari: [1, 25], panduan: 'Fokus pembentukan akar dan tunas daun. Berikan pupuk N tinggi (Urea/KNO3 Merah).' },
      { nama: 'Vegetatif Aktif', rentang_hari: [26, 45], panduan: 'Percabangan tajuk utama. Jaga kelembapan 65%, pasang ajir/penyangga bambu.' },
      { nama: 'Generatif/Berbunga', rentang_hari: [46, 65], panduan: 'Pembentukan bunga dan pentil buah. Tingkatkan Kalium dan Fosfat (MKP), kurangi nitrogen.' },
      { nama: 'Pematangan Buah & Panen', rentang_hari: [66, 80], panduan: 'Cabai mulai memerah penuh. Panen pagi hari saat embun kering (kualitas Grade A).' }
    ]
  },
  'Bawang Merah': {
    nama: 'Bawang Merah',
    kategori: 'Hortikultura',
    umur_panen_hari: 60,
    ph_optimal_min: 6.0,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 25,
    suhu_optimal_max: 33,
    kebutuhan_air_harian_liter_m2: 4.2,
    tahap_pertumbuhan: [
      { nama: 'Pertunasan Awal', rentang_hari: [1, 15], panduan: 'Penyiraman rutin pagi-sore secukupnya, cegah busuk umbi benih.' },
      { nama: 'Vegetatif Lanjut', rentang_hari: [16, 35], panduan: 'Pembentukan anakan daun. Pemupukan susulan 1 (NPK + ZA).' },
      { nama: 'Pembesaran Umbi', rentang_hari: [36, 50], panduan: 'Umbi mulai menggembung dan berwarna merah ungu. Hindari genangan air berlebih.' },
      { nama: 'Siap Panen', rentang_hari: [51, 60], panduan: '60% daun rebah dan pucuk menguning. Hentikan penyiraman 3 hari sebelum panen.' }
    ]
  },
  'Tomat': {
    nama: 'Tomat',
    kategori: 'Hortikultura',
    umur_panen_hari: 70,
    ph_optimal_min: 5.8,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 20,
    suhu_optimal_max: 28,
    kebutuhan_air_harian_liter_m2: 4.5,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif', rentang_hari: [1, 30], panduan: 'Pemberian pupuk kandang matang dan pengajiran kuat.' },
      { nama: 'Pembungaan & Pentil', rentang_hari: [31, 50], panduan: 'Perempelan tunas air (*wiwil*) dan semprot kalsium boron cegah busuk pantat buah.' },
      { nama: 'Pematangan Buah', rentang_hari: [51, 70], panduan: 'Petik saat semburat oranye jika untuk pasar jauh, atau merah merata untuk pasar lokal.' }
    ]
  },
  'Padi Sawah (Ciherang/Inpari)': {
    nama: 'Padi Sawah (Ciherang/Inpari)',
    kategori: 'Pangan',
    umur_panen_hari: 115,
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 80,
    kelembapan_optimal_max: 95,
    suhu_optimal_min: 24,
    suhu_optimal_max: 33,
    kebutuhan_air_harian_liter_m2: 6.0,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif Awal', rentang_hari: [1, 35], panduan: 'Genangan dangkal 2-3 cm untuk merangsang anakan produktif.' },
      { nama: 'Bunting & Pengisian Bulir', rentang_hari: [36, 85], panduan: 'Jaga air macak-macak, semprot insektisida nabati anti walang sangit.' },
      { nama: 'Pematangan Bulir', rentang_hari: [86, 115], panduan: 'Bulir padi merunduk menguning 85%. Keringkan sawah 10 hari sebelum panen.' }
    ]
  },
  'Jagung Manis': {
    nama: 'Jagung Manis',
    kategori: 'Palawija',
    umur_panen_hari: 72,
    ph_optimal_min: 5.8,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 70,
    suhu_optimal_min: 22,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 3.5,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif', rentang_hari: [1, 30], panduan: 'Bumbun tanah di sekitar pangkal batang untuk memperkokoh akar.' },
      { nama: 'Keluar Bunga Jantan & Rambut Tongkol', rentang_hari: [31, 55], panduan: 'Periode kritis air. Pastikan tanah lembap saat penyerbukan.' },
      { nama: 'Pengisian Biji & Panen', rentang_hari: [56, 72], panduan: 'Rambut tongkol berwarna cokelat tua. Petik saat biji masak susu untuk rasa manis maksimal.' }
    ]
  }
};

export function getCropInfo(namaTanaman: string): CropInfo {
  const match = Object.keys(CROPS_CATALOG).find(k => 
    namaTanaman.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(namaTanaman.toLowerCase())
  );
  return match ? CROPS_CATALOG[match] : CROPS_CATALOG['Cabai Rawit Merah'];
}
