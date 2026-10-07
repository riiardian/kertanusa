export interface CropInfo {
  nama: string;
  kategori: 'Hortikultura' | 'Pangan' | 'Palawija' | 'Perkebunan';
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
  'Nanas (Madu Subang / Honi)': {
    nama: 'Nanas (Madu Subang / Honi)',
    kategori: 'Hortikultura',
    umur_panen_hari: 285, // Riset lapangan hortikultura: 270 - 300 HST (rata-rata 285 HST)
    ph_optimal_min: 4.5,
    ph_optimal_max: 5.5,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 2.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit & Tunas Akar', rentang_hari: [1, 60], panduan: 'Bibit tunas batang/ratoon berakar di tanah. Jaga drainase bedengan agar pangkal bibit tidak busuk.' },
      { nama: 'Vegetatif Aktif Daun Sukulen', rentang_hari: [61, 180], panduan: 'Pembentukan roset daun sukulen berlilin. Pemupukan NPK 15-15-15 untuk menambah jumlah daun produktif (minimal 35 daun).' },
      { nama: 'Induksi Pembungaan (Forcing)', rentang_hari: [181, 220], panduan: 'Lakukan induksi pembungaan (etilen/kalsium karbit di titik tumbuh). Kuncup bunga merah muncul di pusat tajuk.' },
      { nama: 'Pembesaran Buah & Mahkota', rentang_hari: [221, 260], panduan: 'Buah nanas membesar padat. Berikan pupuk Kalium (KNO3 Putih) dan lindungi dari sengatan matahari berlebih (sunscald).' },
      { nama: 'Pematangan Mata & Panen Petik', rentang_hari: [261, 285], panduan: '25%–50% mata nanas di pangkal buah berubah kuning keemasan (~285 HST). Petik dengan tangkai 2 cm di pagi hari.' }
    ]
  },
  'Durian (Montong / Bawor / Musang King)': {
    nama: 'Durian (Montong / Bawor / Musang King)',
    kategori: 'Hortikultura',
    umur_panen_hari: 120, // Siklus bunga anthesis ke buah masak petik/jatuh: 110 - 130 HST (rata-rata 120 HST)
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 80,
    suhu_optimal_min: 25,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 5.0,
    tahap_pertumbuhan: [
      { nama: 'Inisiasi Kuncup Bunga di Dahan', rentang_hari: [1, 25], panduan: 'Mata kepiting kuncup bunga membesar di dahan utama. Hentikan pemupukan nitrogen dan jaga kelembapan tanah sedang.' },
      { nama: 'Bunga Mekar (Anthesis) & Penyerbukan', rentang_hari: [26, 45], panduan: 'Bunga durian mekar malam hari dan dibantu lebah/kelelawar. Semprot Boron + Kalsium agar tangkai bunga tidak rontok.' },
      { nama: 'Pentil Duri & Seleksi Buah', rentang_hari: [46, 75], panduan: 'Pentil durian sebesar telur/bola tenis. Lakukan penjarangan buah (fruit thinning): sisakan 2–3 buah terbaik per dompolan.' },
      { nama: 'Pembesaran Buah & Pengikatan Tali', rentang_hari: [76, 105], panduan: 'Buah durian membesar pesat. Pasang tali pengikat dahan dan buah ke batang utama agar dahan tidak patah menopang bobot.' },
      { nama: 'Pematangan Daging Buah & Panen', rentang_hari: [106, 120], panduan: 'Juring durian mengembang, duri lentur, dan tercium aroma harum khas. Panen petik bertali atau tunggu masak jatuh alami.' }
    ]
  },
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
  'Cabai Merah Besar': {
    nama: 'Cabai Merah Besar',
    kategori: 'Hortikultura',
    umur_panen_hari: 85,
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 55,
    kelembapan_optimal_max: 70,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 4.0,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif Awal', rentang_hari: [1, 25], panduan: 'Perakaran bibit di bedengan mulsa. Berikan pupuk starter NPK seimbang.' },
      { nama: 'Percabangan Y & Tajuk', rentang_hari: [26, 48], panduan: 'Muncul cabang Y pertama. Pasang ajir dan tali gawar penopang.' },
      { nama: 'Pembungaan & Buah Hijau', rentang_hari: [49, 70], panduan: 'Semprot Kalsium Nitrat rutin tiap minggu untuk mencegah patek antraknosa.' },
      { nama: 'Pematangan Buah Merah Padat', rentang_hari: [71, 85], panduan: 'Buah cabai merah mengkilap dan padat. Panen bertahap tiap 4-5 hari sekali.' }
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
  'Bawang Putih': {
    nama: 'Bawang Putih',
    kategori: 'Hortikultura',
    umur_panen_hari: 100,
    ph_optimal_min: 6.0,
    ph_optimal_max: 7.2,
    kelembapan_optimal_min: 55,
    kelembapan_optimal_max: 70,
    suhu_optimal_min: 18,
    suhu_optimal_max: 26,
    kebutuhan_air_harian_liter_m2: 3.8,
    tahap_pertumbuhan: [
      { nama: 'Pertunasan Siung Bibit', rentang_hari: [1, 20], panduan: 'Siung bibit bertunas di lahan dataran tinggi. Jaga tanah gembur tanpa genangan.' },
      { nama: 'Vegetatif & Pembentukan Daun', rentang_hari: [21, 55], panduan: 'Pertumbuhan anakan daun tegak. Pemupukan susulan NPK berimbang.' },
      { nama: 'Pembentukan Siung Umbi', rentang_hari: [56, 85], panduan: 'Umbi mulai membelah membentuk siung-siung padat. Tingkatkan Kalium.' },
      { nama: 'Daun Mengering & Panen Cabut', rentang_hari: [86, 100], panduan: 'Daun bawah menguning kering 70%. Cabut umbi dan jemur tiris.' }
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
      { nama: 'Pembungaan & Pentil', rentang_hari: [31, 50], panduan: 'Perempelan tunas air (wiwil) dan semprot kalsium boron cegah busuk pantat buah.' },
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
    umur_panen_hari: 75,
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
      { nama: 'Pengisian Biji & Panen', rentang_hari: [56, 75], panduan: 'Rambut tongkol berwarna cokelat tua. Petik saat biji masak susu untuk rasa manis maksimal.' }
    ]
  },
  'Kacang Tanah': {
    nama: 'Kacang Tanah',
    kategori: 'Palawija',
    umur_panen_hari: 95, // 90 - 100 HST
    ph_optimal_min: 5.8,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 55,
    kelembapan_optimal_max: 70,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 3.2,
    tahap_pertumbuhan: [
      { nama: 'Perkecambahan & Vegetatif Awal', rentang_hari: [1, 25], panduan: 'Tunas tumbuh subur dengan daun majemuk. Lakukan penyiangan gulma di sekitar lubang.' },
      { nama: 'Pembungaan & Ginofor Masuk Tanah', rentang_hari: [26, 50], panduan: 'Bunga kuning mekar dan jarum ginofor menusuk ke dalam tanah. Lakukan pembumbunan tanah gembur.' },
      { nama: 'Pembentukan Polong Biji', rentang_hari: [51, 75], panduan: 'Polong kacang membesar di dalam tanah. Kebutuhan kalsium tinggi untuk mencegah polong hampa.' },
      { nama: 'Pematangan Polong & Panen Cabut', rentang_hari: [76, 95], panduan: 'Daun mulai menguning dan rontok. Cek sampel polong: kulit dalam berwarna cokelat berserat. Cabut dan jemur.' }
    ]
  },
  'Singkong / Ubi Kayu': {
    nama: 'Singkong / Ubi Kayu',
    kategori: 'Pangan',
    umur_panen_hari: 270, // 8 - 10 bulan (~270 HST)
    ph_optimal_min: 5.0,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 70,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 2.8,
    tahap_pertumbuhan: [
      { nama: 'Pertunasan Stek Batang', rentang_hari: [1, 30], panduan: 'Tunas daun menyembul dari mata stek. Jaga tanah cukup lembap di awal.' },
      { nama: 'Vegetatif & Pembentukan Tajuk', rentang_hari: [31, 120], panduan: 'Tajuk daun rimbun dan akar mulai berdiferensiasi menjadi bakal umbi.' },
      { nama: 'Pembesaran Umbi & Akumulasi Pati', rentang_hari: [121, 240], panduan: 'Umbi singkong membesar padat di dalam tanah. Pemupukan Kalium tinggi.' },
      { nama: 'Kemasakan Pati Maksimal & Panen Cabut', rentang_hari: [241, 270], panduan: 'Daun bawah rontok alami dan kadar pati umbi mencapai puncak. Cabut di pagi hari.' }
    ]
  },
  'Kentang': {
    nama: 'Kentang',
    kategori: 'Hortikultura',
    umur_panen_hari: 90,
    ph_optimal_min: 5.2,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 80,
    suhu_optimal_min: 16,
    suhu_optimal_max: 22,
    kebutuhan_air_harian_liter_m2: 4.5,
    tahap_pertumbuhan: [
      { nama: 'Pertunasan Umbi Bibit', rentang_hari: [1, 20], panduan: 'Tunas muncul dari tanah guludan andosol. Jaga tanah gembur porous.' },
      { nama: 'Vegetatif & Pembumbunan 1', rentang_hari: [21, 40], panduan: 'Bumbun tanah guludan agar stolon terbentuk banyak dan berikan NPK.' },
      { nama: 'Inisiasi & Pembesaran Calon Umbi', rentang_hari: [41, 70], panduan: 'Stolon membengkak menjadi umbi. Waspadai jamur busuk daun lodoh Phytophthora.' },
      { nama: 'Pematangan Kulit & Panen Gali', rentang_hari: [71, 90], panduan: 'Potong tajuk atas 7 hari sebelum gali agar kulit umbi mengeras dan tidak lecet.' }
    ]
  },
  'Apel (Manalagi / Rome Beauty)': {
    nama: 'Apel (Manalagi / Rome Beauty)',
    kategori: 'Hortikultura',
    umur_panen_hari: 130, // 120 - 140 hari pasca perompesan daun
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 16,
    suhu_optimal_max: 26,
    kebutuhan_air_harian_liter_m2: 4.8,
    tahap_pertumbuhan: [
      { nama: 'Perompesan Daun (Dormansi Buatan)', rentang_hari: [1, 15], panduan: 'Rontokkan daun tua serentak untuk memicu tunas bunga serempak.' },
      { nama: 'Mekar Bunga (Anthesis)', rentang_hari: [16, 40], panduan: 'Bunga apel mekar lebat. Semprot Kalsium-Boron dan hindari pestisida keras saat lebah aktif.' },
      { nama: 'Pentil Buah & Penjarangan', rentang_hari: [41, 70], panduan: 'Sisakan 1–2 pentil terbaik per dompolan untuk kualitas Grade A.' },
      { nama: 'Pembesaran Buah & Pembungkusan', rentang_hari: [71, 110], panduan: 'Bungkus buah dengan kertas khusus cegah sengatan lalat buah.' },
      { nama: 'Pematangan Warna & Panen Petik', rentang_hari: [111, 130], panduan: 'Warna buah bersemu oranye/merah harum merata. Petik dengan tangkai utuh.' }
    ]
  },
  'Jeruk (Siam / Keprok)': {
    nama: 'Jeruk (Siam / Keprok)',
    kategori: 'Hortikultura',
    umur_panen_hari: 210, // ~7 bulan siklus bunga ke masak sari
    ph_optimal_min: 5.8,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 4.2,
    tahap_pertumbuhan: [
      { nama: 'Tunas Baru & Flush Daun', rentang_hari: [1, 25], panduan: 'Pangkas cabang air dan berikan pupuk NPK berimbang di lingkar tajuk.' },
      { nama: 'Inisiasi Bunga Putih Harum', rentang_hari: [26, 55], panduan: 'Bunga mekar. Siram stabil di parit lingkar luar dan cegah stres air.' },
      { nama: 'Pentil Buah & Seleksi Gugur Alami', rentang_hari: [56, 100], panduan: 'Aplikasi Kalsium Nitrat untuk mencegah kulit buah pecah.' },
      { nama: 'Pembesaran Buah & Pengisian Sari', rentang_hari: [101, 175], panduan: 'Bulir sari terisi cairan manis vitamin C. Berikan Kalium Sulfat ZK.' },
      { nama: 'Pematangan Kulit & Panen Gunting', rentang_hari: [176, 210], panduan: 'Kulit buah melunak kenyal dan bersemu kuning cerah. Potong tangkai dengan gunting.' }
    ]
  },
  'Mangga (Harum Manis / Gedong Gincu)': {
    nama: 'Mangga (Harum Manis / Gedong Gincu)',
    kategori: 'Hortikultura',
    umur_panen_hari: 120, // 110 - 130 hari siklus bunga ke petik
    ph_optimal_min: 5.5,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 26,
    suhu_optimal_max: 34,
    kebutuhan_air_harian_liter_m2: 3.5,
    tahap_pertumbuhan: [
      { nama: 'Muncul Malai Bunga (Flushing Bunga)', rentang_hari: [1, 20], panduan: 'Malai bunga mekar di ujung ranting saat awal musim kering.' },
      { nama: 'Penyerbukan & Bakal Pentil', rentang_hari: [21, 45], panduan: 'Pentil mangga sebesar kelereng. Semprot fungisida nabati anti antraknosa bunga.' },
      { nama: 'Pembesaran Buah Mangga', rentang_hari: [46, 95], panduan: 'Buah membesar padat. Bungkus buah dengan kertas semen/koran cegah lalat buah.' },
      { nama: 'Pematangan Daging & Panen Petik', rentang_hari: [96, 120], panduan: 'Pangkal buah mekar rata dan berbedak putih lilin. Petik dengan tangkai 3 cm.' }
    ]
  },
  'Pisang (Cavendish / Raja)': {
    nama: 'Pisang (Cavendish / Raja)',
    kategori: 'Hortikultura',
    umur_panen_hari: 270, // 9 bulan dari anakan sampai panen tandan
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 85,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 5.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Anakan & Tunas Daun', rentang_hari: [1, 60], panduan: 'Anakan pisang tumbuh tegak. Berikan pupuk kandang matang dan jaga parit drainase.' },
      { nama: 'Pertumbuhan Batang Semu & Daun Lebar', rentang_hari: [61, 180], panduan: 'Batang semu membesar kokoh. Bersihkan daun tua kering yang menempel.' },
      { nama: 'Muncul Jantung Pisang (Ontong)', rentang_hari: [181, 210], panduan: 'Jantung pisang keluar dan mekar menjadi sisir buah. Potong ujung jantung 3 sisir terakhir.' },
      { nama: 'Pembesaran & Brongsong Tandan', rentang_hari: [211, 250], panduan: 'Bungkus tandan dengan plastik biru dan sangga batang dengan bambu penopang.' },
      { nama: 'Pematangan Jari Pisang & Panen', rentang_hari: [251, 270], panduan: 'Sudut jari pisang membulat dan daun bendera menguning. Potong tandan hati-hati.' }
    ]
  },
  'Kopi Arabika': {
    nama: 'Kopi Arabika',
    kategori: 'Perkebunan',
    umur_panen_hari: 220, // Siklus bunga mekar ke ceri merah: 210 - 240 HST
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 80,
    suhu_optimal_min: 16,
    suhu_optimal_max: 24,
    kebutuhan_air_harian_liter_m2: 4.0,
    tahap_pertumbuhan: [
      { nama: 'Bunga Bintang Putih Mekar Serempak', rentang_hari: [1, 20], panduan: 'Bunga kopi mekar harum serempak setelah hujan pertama pasca kemarau.' },
      { nama: 'Pentil Ceri Hijau & Pembesaran', rentang_hari: [21, 110], panduan: 'Calon buah ceri hijau terbentuk di ruas cabang primer. Berikan pupuk NPK berimbang.' },
      { nama: 'Pengisian Biji Kopi (Endosperma)', rentang_hari: [111, 175], panduan: 'Biji kopi mengeras di dalam buah. Berikan pupuk Kalium untuk bobot biji padat.' },
      { nama: 'Pematangan Ceri Merah Marun & Panen', rentang_hari: [176, 220], panduan: 'Ceri berubah merah marun matang optimal (petik merah 100%).' }
    ]
  },
  'Cokelat / Kakao': {
    nama: 'Cokelat / Kakao',
    kategori: 'Perkebunan',
    umur_panen_hari: 165, // 150 - 180 HST siklus buah matang
    ph_optimal_min: 6.0,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 70,
    kelembapan_optimal_max: 85,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 4.5,
    tahap_pertumbuhan: [
      { nama: 'Bunga Batang (Kauliflori) Mekar', rentang_hari: [1, 20], panduan: 'Bunga kecil mekar di bantalan batang utama dan cabang primer.' },
      { nama: 'Pentil Buah (Cherelle) & Seleksi Alami', rentang_hari: [21, 60], panduan: 'Pentil buah terbentuk. Waspadai cherelle wilt (gugur pentil alami) dan jamur VSD.' },
      { nama: 'Pembesaran Polong Kakao & Kondomisasi', rentang_hari: [61, 130], panduan: 'Polong kakao membesar. Pasang sarung plastik (kondomisasi) cegah hama PBK.' },
      { nama: 'Pematangan Kulit Buah Kuning & Panen', rentang_hari: [131, 165], panduan: 'Alur kulit buah berubah warna kuning/oranye cerah. Panen gunting tangkai buah.' }
    ]
  }
};

export const SUPPORTED_CROP_NAMES: string[] = Object.keys(CROPS_CATALOG);

/**
 * Mencari data agronomis tanaman terdaftar berdasarkan pencarian nama atau sinonim
 */
export function getCropInfo(namaTanaman: string): CropInfo {
  const q = (namaTanaman || '').toLowerCase().trim();
  if (!q) return CROPS_CATALOG['Bawang Merah'];

  // 1. Direct key match
  const directMatch = Object.keys(CROPS_CATALOG).find(k => k.toLowerCase() === q);
  if (directMatch) return CROPS_CATALOG[directMatch];

  // 2. Keyword detection spesifik tanaman Indonesia
  if (q.includes('nanas') || q.includes('nenas') || q.includes('pineapple')) return CROPS_CATALOG['Nanas (Madu Subang / Honi)'];
  if (q.includes('durian') || q.includes('duren')) return CROPS_CATALOG['Durian (Montong / Bawor / Musang King)'];
  if (q.includes('kacang tanah')) return CROPS_CATALOG['Kacang Tanah'];
  if (q.includes('singkong') || q.includes('ubi kayu') || q.includes('ketela')) return CROPS_CATALOG['Singkong / Ubi Kayu'];
  if (q.includes('pisang')) return CROPS_CATALOG['Pisang (Cavendish / Raja)'];
  if (q.includes('mangga')) return CROPS_CATALOG['Mangga (Harum Manis / Gedong Gincu)'];
  if (q.includes('jeruk') || q.includes('citrus') || q.includes('lemon')) return CROPS_CATALOG['Jeruk (Siam / Keprok)'];
  if (q.includes('apel') || q.includes('apple')) return CROPS_CATALOG['Apel (Manalagi / Rome Beauty)'];
  if (q.includes('kentang')) return CROPS_CATALOG['Kentang'];
  if (q.includes('kopi')) return CROPS_CATALOG['Kopi Arabika'];
  if (q.includes('kakao') || q.includes('cokelat')) return CROPS_CATALOG['Cokelat / Kakao'];
  if (q.includes('bawang putih')) return CROPS_CATALOG['Bawang Putih'];
  if (q.includes('bawang')) return CROPS_CATALOG['Bawang Merah'];
  if (q.includes('cabai rawit') || q.includes('cabe rawit') || q.includes('rawit')) return CROPS_CATALOG['Cabai Rawit Merah'];
  if (q.includes('cabai') || q.includes('cabe') || q.includes('lombok')) return CROPS_CATALOG['Cabai Merah Besar'];
  if (q.includes('tomat')) return CROPS_CATALOG['Tomat'];
  if (q.includes('padi') || q.includes('gabah') || q.includes('beras')) return CROPS_CATALOG['Padi Sawah (Ciherang/Inpari)'];
  if (q.includes('jagung')) return CROPS_CATALOG['Jagung Manis'];

  // 3. Partial substring match
  const partial = Object.keys(CROPS_CATALOG).find(k => 
    q.includes(k.toLowerCase()) || k.toLowerCase().includes(q)
  );
  if (partial) return CROPS_CATALOG[partial];

  // Fallback default tanaman hortikultura acuan standar
  return CROPS_CATALOG['Bawang Merah'];
}

/**
 * Validasi apakah nama input benar-benar komoditas tanaman budidaya yang dikenali sistem
 */
export function isRecognizedCrop(namaTanaman: string): boolean {
  const q = (namaTanaman || '').toLowerCase().trim();
  if (!q) return false;

  const validKeywords = [
    'padi', 'beras', 'gabah', 'jagung', 'bawang', 'cabai', 'cabe', 'lombok',
    'tomat', 'nanas', 'nenas', 'durian', 'duren', 'mangga', 'pisang', 'jeruk',
    'apel', 'kentang', 'wortel', 'singkong', 'ubi', 'kacang', 'kedelai', 'kopi',
    'kakao', 'cokelat', 'tebu', 'teh', 'tembakau', 'sawit', 'karet', 'jahe',
    'kunyit', 'kencur', 'kapulaga', 'vanili', 'porang', 'sorgum', 'semangka',
    'melon', 'pepaya', 'alpukat', 'bayam', 'kangkung', 'terong', 'kubis', 'kol'
  ];

  return validKeywords.some(kw => q.includes(kw));
}
