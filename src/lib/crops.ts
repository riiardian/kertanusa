export interface CropInfo {
  nama: string;
  kategori: 'Hortikultura' | 'Pangan' | 'Palawija' | 'Perkebunan';
  umur_panen_hari: number; // HST dari tanam bibit hingga PERTAMA KALI panen
  // Untuk tanaman pohon/tahunan (durian, mangga, jeruk, dll) ini adalah
  // hari hingga pertama kali berbuah dari bibit. Berbeda dengan tanaman
  // semusim yang panen sekali habis.
  is_tanaman_tahunan?: boolean; // true = pohon tahunan (berbuah berulang setelah dewasa)
  siklus_buah_hari?: number;   // Hanya untuk tanaman tahunan: durasi bunga mekar → buah masak (misal durian 110-130 HST)
  keterangan_umur?: string;    // Keterangan lebih lengkap tentang siklus tanam
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
    // KOREKSI AGRONOMI: Dari BIBIT SAMBUNG PUCUK ditanam hingga PERTAMA KALI BERBUAH = 4-6 TAHUN
    // Referensi: Balitbangtan / Kontan / pertanian.go.id - rata-rata 5 tahun (1825 hari)
    // Catatan: 110-130 HST adalah siklus BUNGA MEKAR → BUAH MASAK (hanya untuk pohon SUDAH DEWASA)
    umur_panen_hari: 1825, // 5 tahun dari bibit sambung pucuk hingga panen perdana
    is_tanaman_tahunan: true,
    siklus_buah_hari: 120, // Siklus bunga anthesis ke buah matang petik/jatuh: 110-130 HST per musim
    keterangan_umur: 'Bibit sambung pucuk: 4–6 tahun hingga panen perdana. Dari biji: 8–15 tahun. Siklus per musim buah (bunga mekar → masak): 110–130 HST. Pohon produktif berbuah 1–2 kali per tahun.',
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 80,
    suhu_optimal_min: 25,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 5.0,
    tahap_pertumbuhan: [
      // Tahapan DARI TANAM BIBIT sampai PERTAMA KALI BERBUAH (siklus pohon penuh)
      { nama: 'Adaptasi Bibit & Perakaran Awal (Tahun 1)', rentang_hari: [1, 365], panduan: 'Bibit sambung pucuk bersertifikat ditanam dengan jarak 10×10 m di lubang 60×60×60 cm. Pupuk kandang matang 20 kg/lubang. Jaga tanah lembap tanpa tergenang. Pasang ajir penyangga dan naungan sementara.' },
      { nama: 'Pembentukan Tajuk & Cabang Primer (Tahun 2)', rentang_hari: [366, 730], panduan: 'Pembentukan arsitektur tajuk piramida. Pangkas cabang yang saling silang atau tumbuh ke bawah. NPK 15-15-15 dosis 200 g/pohon tiap 3 bulan. Waspadai penggerek batang (Batocera sp.) sejak dini.' },
      { nama: 'Pertumbuhan Vegetatif Aktif & Penguatan Batang (Tahun 3)', rentang_hari: [731, 1095], panduan: 'Pohon membesar pesat. Tingkatkan dosis pupuk NPK menjadi 500 g/pohon/3 bulan. Lakukan aplikasi pupuk mikro Boron dan Zink agar bunga nanti kompak. Mulai kurangi nitrogen secara bertahap di akhir tahun ke-3.' },
      { nama: 'Inisiasi Generatif & Percobaan Bunga Pertama (Tahun 4-5)', rentang_hari: [1096, 1825], panduan: 'Pohon siap memasuki fase generatif. Lakukan stres air (water stress) selama 3–4 minggu di musim kemarau untuk merangsang inisiasi bunga. Berikan pupuk tinggi Kalium dan Fosfat. Kuncup bunga (mata kepiting) mulai muncul di dahan utama.' },
      { nama: 'Panen Perdana & Siklus Buah Rutin (Tahun 5+)', rentang_hari: [1826, 99999], panduan: 'Bunga mekar → buah masak membutuhkan 110–130 hari (siklus per musim). Lakukan penjarangan buah (sisakan 2–3 terbaik per dahan). Pasang tali pengikat dahan. Panen petik bertali atau tunggu masak jatuh alami. Pohon produktif 20–50 tahun.' }
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
    umur_panen_hari: 1200, // ~3-4 tahun dari bibit okulasi hingga panen perdana
    is_tanaman_tahunan: true,
    siklus_buah_hari: 130, // 120 - 140 hari siklus bunga ke matang petik setelah perompesan daun
    keterangan_umur: 'Bibit okulasi: 3–4 tahun (1.095–1.460 HST) hingga panen perdana. Siklus per musim buah dewasa setelah rompes daun: 120–140 HST. Pohon produktif tahunan.',
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 16,
    suhu_optimal_max: 26,
    kebutuhan_air_harian_liter_m2: 4.8,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit Okulasi (Tahun 1)', rentang_hari: [1, 365], panduan: 'Bibit okulasi ditanam di bedengan tanah andosol dataran tinggi. Pasang ajir dan jaga kelembapan.' },
      { nama: 'Pembentukan Tajuk & Cabang Primer (Tahun 2)', rentang_hari: [366, 730], panduan: 'Bentuk cabang utama menyerupai cawan terbuka (open center). Pemupukan NPK berimbang.' },
      { nama: 'Pertumbuhan Vegetatif & Pematangan Dahan (Tahun 3)', rentang_hari: [731, 1095], panduan: 'Dahan pokok mengeras. Persiapan cabang produktif untuk inisiasi bunga.' },
      { nama: 'Panen Perdana & Siklus Rutin Rompes Daun (Tahun 4+)', rentang_hari: [1096, 99999], panduan: 'Rompes daun tua serentak memicu bunga mekar serempak. Siklus mekar → petik masak: 120–140 hari.' }
    ]
  },
  'Alpukat (Miki / Aligator)': {
    nama: 'Alpukat (Miki / Aligator)',
    kategori: 'Hortikultura',
    umur_panen_hari: 1200, // 3 - 4 tahun dari bibit sambung pucuk
    is_tanaman_tahunan: true,
    siklus_buah_hari: 195, // 6 - 7 bulan siklus bunga ke petik tua
    keterangan_umur: 'Bibit sambung pucuk/okulasi: 3–4 tahun (1.095–1.460 HST) hingga panen perdana. Dari biji: 7–10 tahun. Siklus bunga ke buah masak: 180–210 HST.',
    ph_optimal_min: 5.6,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 20,
    suhu_optimal_max: 30,
    kebutuhan_air_harian_liter_m2: 4.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit Sambung (Tahun 1)', rentang_hari: [1, 365], panduan: 'Tanam bibit sambung pucuk varietas unggul (Miki/Aligator). Pupuk kandang matang 20 kg.' },
      { nama: 'Pembentukan Tajuk & Ranting Primer (Tahun 2)', rentang_hari: [366, 730], panduan: 'Pangkas pucuk (topping) untuk merangsang percabangan mendatar yang produktif.' },
      { nama: 'Pematangan Dahan & Inisiasi Bunga (Tahun 3)', rentang_hari: [731, 1095], panduan: 'Berikan pupuk tinggi Kalium dan Fosfat (MKP) menjelang musim kemarau.' },
      { nama: 'Panen Perdana & Pohon Produktif (Tahun 4+)', rentang_hari: [1096, 99999], panduan: 'Bunga mekar → buah tua petik membutuhkan 6–7 bulan. Pohon produktif hingga 25–40 tahun.' }
    ]
  },
  'Jeruk (Siam / Keprok)': {
    nama: 'Jeruk (Siam / Keprok)',
    kategori: 'Hortikultura',
    umur_panen_hari: 900, // ~2.5 - 3 tahun dari bibit okulasi hingga panen perdana
    is_tanaman_tahunan: true,
    siklus_buah_hari: 210, // ~7 bulan siklus bunga ke masak sari
    keterangan_umur: 'Bibit okulasi: 2.5–3 tahun hingga panen perdana. Siklus per musim buah (bunga mekar → panen petik): 210–240 HST. Pohon produktif berbuah 1–2 kali per tahun.',
    ph_optimal_min: 5.8,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 4.2,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit Okulasi di Lapangan (Tahun 1)', rentang_hari: [1, 365], panduan: 'Bibit okulasi bebas CVPD ditanam berjarak 5×5 m. Pupuk kandang matang 15 kg/lubang. Jaga drainase tanah bebas genangan.' },
      { nama: 'Pembentukan Tajuk 1-3-9 & Cabang Air (Tahun 2)', rentang_hari: [366, 730], panduan: 'Pangkas cabang air di tengah tajuk. Bentuk tajuk 1-3-9. Berikan pupuk NPK berimbang + hara mikro Seng (Zn) dan Besi (Fe).' },
      { nama: 'Inisiasi Bunga & Panen Perdana (Tahun 2.5–3)', rentang_hari: [731, 900], panduan: 'Bunga putih harum mekar serempak. Panen perdana buah jeruk tiba di umur 2.5–3 tahun (~900 HST).' },
      { nama: 'Pohon Dewasa Produktif (Tahun 3+)', rentang_hari: [901, 99999], panduan: 'Pohon berbuah rutin tahunan. Siklus bunga mekar → petik masak sari manis: 210–240 hari. Aplikasi Kalium Sulfat ZK untuk kemanisan prima.' }
    ]
  },
  'Mangga (Harum Manis / Gedong Gincu)': {
    nama: 'Mangga (Harum Manis / Gedong Gincu)',
    kategori: 'Hortikultura',
    umur_panen_hari: 1200, // ~3-4 tahun dari bibit okulasi hingga panen perdana
    is_tanaman_tahunan: true,
    siklus_buah_hari: 120, // 110 - 130 hari siklus bunga ke petik
    keterangan_umur: 'Bibit okulasi: 3–4 tahun (1.095–1.460 HST) hingga panen perdana. Siklus per musim buah dewasa (bunga mekar → masak petik): 110–130 HST. Pohon produktif tahunan.',
    ph_optimal_min: 5.5,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 26,
    suhu_optimal_max: 34,
    kebutuhan_air_harian_liter_m2: 3.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit Okulasi & Bentuk Cabang Y (Tahun 1)', rentang_hari: [1, 365], panduan: 'Bibit okulasi ditanam di lubang 60×60×60 cm. Pangkas pucuk pada tinggi 80 cm untuk memicu 3 cabang primer seimbang.' },
      { nama: 'Percabangan Sekunder 1-3-9 (Tahun 2)', rentang_hari: [366, 730], panduan: 'Pangkas cabang primer agar bercabang 3 (pola 1-3-9). NPK 15-15-15 dosis 250 g/pohon tiap 3 bulan.' },
      { nama: 'Penguatan Dahan & Inisiasi Malai Bunga (Tahun 3)', rentang_hari: [731, 1095], panduan: 'Stres air 1 bulan di musim kemarau dan pupuk MKP memicu munculnya malai bunga perdana.' },
      { nama: 'Panen Perdana & Pohon Produktif (Tahun 4+)', rentang_hari: [1096, 99999], panduan: 'Pohon berbuah rutin tahunan (September-November). Siklus bunga mekar → petik masak: 110–130 hari. Brongsong buah saat sebesar telur.' }
    ]
  },
  'Pisang (Cavendish / Raja)': {
    nama: 'Pisang (Cavendish / Raja)',
    kategori: 'Hortikultura',
    umur_panen_hari: 300, // 9 - 11 bulan (rata-rata 10 bulan / 300 HST dari anakan sampai panen tandan)
    keterangan_umur: 'Bibit anakan/kultur jaringan: 9–11 bulan (270–330 HST) hingga panen tandan buah pertama.',
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 85,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 5.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Anakan & Tunas Daun', rentang_hari: [1, 60], panduan: 'Anakan pisang tumbuh tegak. Berikan pupuk kandang matang dan jaga parit drainase.' },
      { nama: 'Pertumbuhan Batang Semu & Daun Lebar', rentang_hari: [61, 190], panduan: 'Batang semu membesar kokoh. Bersihkan daun tua kering yang menempel.' },
      { nama: 'Muncul Jantung Pisang (Ontong)', rentang_hari: [191, 230], panduan: 'Jantung pisang keluar dan mekar menjadi sisir buah. Potong ujung jantung 3 sisir terakhir.' },
      { nama: 'Pembesaran & Brongsong Tandan', rentang_hari: [231, 280], panduan: 'Bungkus tandan dengan plastik biru dan sangga batang dengan bambu penopang.' },
      { nama: 'Pematangan Jari Pisang & Panen', rentang_hari: [281, 300], panduan: 'Sudut jari pisang membulat dan daun bendera menguning. Potong tandan hati-hati.' }
    ]
  },
  'Pepaya (Calina / California)': {
    nama: 'Pepaya (Calina / California)',
    kategori: 'Hortikultura',
    umur_panen_hari: 240, // 7 - 8 bulan dari semaian bibit sampai buah masak
    keterangan_umur: 'Bibit semaian: 7–8 bulan (210–240 HST) hingga panen perdana. Panen rutin berlanjut tiap 5–7 hari selama 2–3 tahun.',
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 60,
    kelembapan_optimal_max: 75,
    suhu_optimal_min: 22,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 4.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit Semaian', rentang_hari: [1, 45], panduan: 'Bibit ditanam di guludan tinggi. Pepaya rentan busuk akar jika tergenang air.' },
      { nama: 'Vegetatif & Seleksi Bunga Sempurna', rentang_hari: [46, 100], panduan: 'Seleksi tanaman hermaprodit (bunga sempurna bentuk lonjong) untuk kualitas buah super.' },
      { nama: 'Pembentukan Buah & Penjarangan', rentang_hari: [101, 180], panduan: 'Buah berderet padat di batang. Jarangkan buah cacat/tumpang tindih. Pupuk Kalium tinggi.' },
      { nama: 'Pematangan & Panen Petik Berulang', rentang_hari: [181, 240], panduan: 'Ujung buah bersemu semburat kuning 1–2 jari. Petik dengan cara diputar lembut.' }
    ]
  },
  'Buah Naga Merah': {
    nama: 'Buah Naga Merah',
    kategori: 'Hortikultura',
    umur_panen_hari: 330, // 10 - 12 bulan dari stek batang
    keterangan_umur: 'Stek cabang: 10–12 bulan (300–365 HST) hingga buah perdana. Pohon produktif berbuah musiman hingga 15–20 tahun.',
    ph_optimal_min: 5.5,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 25,
    suhu_optimal_max: 35,
    kebutuhan_air_harian_liter_m2: 2.8,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Stek & Tunas Merambat', rentang_hari: [1, 90], panduan: 'Ikat sulur stek ke tiang panjat beton/kayu kuat. Rawat 1–2 cabang primer tegak lurus.' },
      { nama: 'Pembentukan Mahkota Tajuk di Ban Penyangga', rentang_hari: [91, 220], panduan: 'Pangkas ujung saat mencapai ban atas agar cabang menjuntai ke bawah (weeping habit).' },
      { nama: 'Inisiasi Kuncup Bunga Malam (Night Bloom)', rentang_hari: [221, 290], panduan: 'Bunga raksasa mekar di malam hari. Bantu penyerbukan lebah atau kuas manual.' },
      { nama: 'Pematangan Kulit Merah & Panen Petik', rentang_hari: [291, 330], panduan: 'Sisik buah mengembang dan kulit merah marun penuh. Gunting pangkal tangkai buah.' }
    ]
  },
  'Anggur': {
    nama: 'Anggur',
    kategori: 'Hortikultura',
    umur_panen_hari: 330, // 10 - 12 bulan dari bibit stek/grafting
    is_tanaman_tahunan: true,
    siklus_buah_hari: 105, // 90 - 110 hari pasca pemangkasan pembuahan
    keterangan_umur: 'Bibit stek/grafting: 10–12 bulan hingga pembuahan perdana (pruning). Pohon produktif bertahun-tahun dengan pemangkasan rutin 2 kali setahun.',
    ph_optimal_min: 6.0,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 25,
    suhu_optimal_max: 33,
    kebutuhan_air_harian_liter_m2: 3.5,
    tahap_pertumbuhan: [
      { nama: 'Pertumbuhan Batang Primer & Sekunder', rentang_hari: [1, 150], panduan: 'Rambatkan batang utama ke para-para/trellis. Pupuk NPK seimbang + asam humat.' },
      { nama: 'Pembentukan Cabang Tersier & Pematangan Dahan', rentang_hari: [151, 270], panduan: 'Cabang tersier dicokelatkan (lignifikasi) dan pangkas ujung daun air.' },
      { nama: 'Pemangkasan Pembuahan (Pruning) & Bunga', rentang_hari: [271, 305], panduan: 'Potong cabang tersier di mata tunas gemuk. Bunga brokoli muncul serentak.' },
      { nama: 'Penjarangan Beri & Panen Dompolan Masak', rentang_hari: [306, 330], panduan: 'Gunting beri rapat (berry thinning). Petik saat brix kemanisan >18 dan aroma harum.' }
    ]
  },
  'Semangka': {
    nama: 'Semangka',
    kategori: 'Hortikultura',
    umur_panen_hari: 60, // 55 - 65 HST
    keterangan_umur: 'Tanaman semusim merambat: 55–65 HST dari benih/semai hingga panen buah masak.',
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 25,
    suhu_optimal_max: 33,
    kebutuhan_air_harian_liter_m2: 3.5,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif & Sulur Merambat', rentang_hari: [1, 25], panduan: 'Atur sulur utama di atas jerami/mulsa. Berikan pupuk NPK starter.' },
      { nama: 'Pembungaan & Penyerbukan', rentang_hari: [26, 40], panduan: 'Lakukan kawin silang bunga jantan ke betina di pagi hari (ruas ke-12 s/d 16).' },
      { nama: 'Pembesaran Buah & Pembalikan', rentang_hari: [41, 52], panduan: 'Sisakan 1–2 buah super per pohon. Balik posisi buah agar warna kulit merata.' },
      { nama: 'Pematangan & Panen Petik', rentang_hari: [53, 60], panduan: 'Sungkup tangkai mengering dan sulur depan buah mati. Petik di siang hari terik.' }
    ]
  },
  'Melon': {
    nama: 'Melon',
    kategori: 'Hortikultura',
    umur_panen_hari: 65, // 60 - 70 HST
    keterangan_umur: 'Tanaman semusim merambat: 60–70 HST dari bibit hingga buah matang berjaring penuh.',
    ph_optimal_min: 6.0,
    ph_optimal_max: 6.8,
    kelembapan_optimal_min: 50,
    kelembapan_optimal_max: 65,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 3.5,
    tahap_pertumbuhan: [
      { nama: 'Vegetatif & Pengikatan Tali Ajir', rentang_hari: [1, 25], panduan: 'Lilitkan batang melon ke tali ajir vertikal. Buang cabang samping ruas 1–8.' },
      { nama: 'Polinasi Bunga Betina (Ruas 9–12)', rentang_hari: [26, 38], panduan: 'Kawinkan bunga betina. Gantung bakal buah dengan tali rapiah.' },
      { nama: 'Pembesaran Buah & Pembentukan Jaring (Netting)', rentang_hari: [39, 55], panduan: 'Jaring melon terbentuk rapat. Pupuk Kalium tinggi untuk rasa manis legit.' },
      { nama: 'Pematangan Aroma & Panen Gunting', rentang_hari: [56, 65], panduan: 'Retakan cincin di tangkai buah sempurna dan tercium wangi melon khas.' }
    ]
  },
  'Kopi Arabika': {
    nama: 'Kopi Arabika',
    kategori: 'Perkebunan',
    umur_panen_hari: 900, // ~2.5 - 3 tahun dari bibit hingga panen perdana
    is_tanaman_tahunan: true,
    siklus_buah_hari: 220, // Siklus bunga mekar ke ceri merah: 210 - 240 HST
    keterangan_umur: 'Bibit semaian/sambung: 2.5–3 tahun hingga panen perdana. Siklus bunga mekar → ceri merah matang: 210–240 HST.',
    ph_optimal_min: 5.5,
    ph_optimal_max: 6.5,
    kelembapan_optimal_min: 65,
    kelembapan_optimal_max: 80,
    suhu_optimal_min: 16,
    suhu_optimal_max: 24,
    kebutuhan_air_harian_liter_m2: 4.0,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit di Bawah Pohon Naungan (Tahun 1)', rentang_hari: [1, 365], panduan: 'Bibit kopi ditanam di bawah naungan lamtoro berjarak 2.5×2.5 m. Pupuk kandang matang 10 kg/lubang. Lindungi dari terik matahari langsung.' },
      { nama: 'Pembentukan Cabang Primer & Topping (Tahun 2)', rentang_hari: [366, 730], panduan: 'Pangkas pucuk (topping) setinggi 1.8 m untuk merangsang cabang primer mendatar. Buang wiwil tunas air tegak lurus.' },
      { nama: 'Inisiasi Bunga Bintang & Panen Ceri Perdana (Tahun 2.5–3)', rentang_hari: [731, 900], panduan: 'Bunga putih harum mekar serempak pasca hujan pertama kemarau. Panen perdana ceri merah tiba di umur 2.5–3 tahun (~900 HST).' },
      { nama: 'Pohon Produktif — Panen Raya Petik Merah (Tahun 3+)', rentang_hari: [901, 99999], panduan: 'Pohon berbuah rutin tiap musim raya (Mei-Agustus). Siklus bunga mekar → ceri merah matang: 210–240 hari. Hanya petik ceri merah 100%.' }
    ]
  },
  'Cokelat / Kakao': {
    nama: 'Cokelat / Kakao',
    kategori: 'Perkebunan',
    umur_panen_hari: 800, // ~2 - 2.5 tahun dari bibit sambung pucuk hingga panen perdana
    is_tanaman_tahunan: true,
    siklus_buah_hari: 165, // 150 - 180 HST siklus buah matang
    keterangan_umur: 'Bibit sambung pucuk: 2–2.5 tahun (730–900 HST) hingga panen perdana. Siklus bunga → polong masak: 150–180 HST. Pohon produktif tahunan.',
    ph_optimal_min: 6.0,
    ph_optimal_max: 7.0,
    kelembapan_optimal_min: 70,
    kelembapan_optimal_max: 85,
    suhu_optimal_min: 24,
    suhu_optimal_max: 32,
    kebutuhan_air_harian_liter_m2: 4.5,
    tahap_pertumbuhan: [
      { nama: 'Adaptasi Bibit Sambung di Bawah Naungan (Tahun 1)', rentang_hari: [1, 365], panduan: 'Bibit klon MCC 02 ditanam di bawah naungan kelapa/lamtoro berjarak 3×3 m. Jaga tanah lembap kaya serasah organik.' },
      { nama: 'Pembentukan Tajuk Jorket & Cabang Kipas (Tahun 2)', rentang_hari: [366, 730], panduan: 'Atur 3–4 cabang jorket kokoh. Pangkas cabang cacing dan tunas air berkala. Pupuk NPK berimbang tiap 3 bulan.' },
      { nama: 'Bunga Batang Kauliflori & Panen Perdana (Tahun 2–2.5)', rentang_hari: [731, 800], panduan: 'Bunga mekar di bantalan batang utama (kauliflori). Pasang sarung plastik (kondomisasi) pada pentil buah untuk cegah PBK (~800 HST).' },
      { nama: 'Pohon Dewasa Produktif — Panen Rutin (Tahun 2.5+)', rentang_hari: [801, 99999], panduan: 'Pohon kakao berbuah rutin sepanjang tahun. Siklus bunga → polong masak: 150–180 hari. Petik polong saat alur kulit berubah kuning cerah.' }
    ]
  }
};

export const SUPPORTED_CROP_NAMES: string[] = Object.keys(CROPS_CATALOG);

export interface CropSuggestion {
  name: string;
  category: string;
  umur_panen_hari: number;
  is_tanaman_tahunan?: boolean;
  siklus_buah_hari?: number;
  keterangan_umur?: string;
}

/**
 * Mencari saran komoditas secara responsif berdasarkan input teks
 */
export function searchCropSuggestions(query: string, limit = 8): CropSuggestion[] {
  const q = (query || '').toLowerCase().trim();
  const allList: CropSuggestion[] = Object.values(CROPS_CATALOG).map(c => ({
    name: c.nama,
    category: c.kategori,
    umur_panen_hari: c.umur_panen_hari,
    is_tanaman_tahunan: c.is_tanaman_tahunan,
    siklus_buah_hari: c.siklus_buah_hari,
    keterangan_umur: c.keterangan_umur
  }));

  if (!q) return allList.slice(0, limit);

  const matched: CropSuggestion[] = [];
  const seen = new Set<string>();

  // 1. Exact or startsWith match (prioritas teratas)
  for (const item of allList) {
    const n = item.name.toLowerCase();
    if (n.startsWith(q)) {
      matched.push(item);
      seen.add(item.name);
    }
  }

  // 2. Keyword / Substring match (contoh: "durian" cocok dengan "Durian (Montong...)")
  for (const item of allList) {
    if (seen.has(item.name)) continue;
    const n = item.name.toLowerCase();
    if (n.includes(q)) {
      matched.push(item);
      seen.add(item.name);
    }
  }

  // 3. Synonym matching untuk istilah tani umum
  if ((q.includes('duren') || q.includes('durian')) && !seen.has('Durian (Montong / Bawor / Musang King)')) {
    const c = CROPS_CATALOG['Durian (Montong / Bawor / Musang King)'];
    if (c) {
      matched.push({ name: c.nama, category: c.kategori, umur_panen_hari: c.umur_panen_hari, is_tanaman_tahunan: c.is_tanaman_tahunan, siklus_buah_hari: c.siklus_buah_hari, keterangan_umur: c.keterangan_umur });
      seen.add(c.nama);
    }
  }
  if ((q.includes('nenas') || q.includes('nanas')) && !seen.has('Nanas (Madu Subang / Honi)')) {
    const c = CROPS_CATALOG['Nanas (Madu Subang / Honi)'];
    if (c) {
      matched.push({ name: c.nama, category: c.kategori, umur_panen_hari: c.umur_panen_hari, is_tanaman_tahunan: c.is_tanaman_tahunan, siklus_buah_hari: c.siklus_buah_hari, keterangan_umur: c.keterangan_umur });
      seen.add(c.nama);
    }
  }
  if (q.includes('tanah') && !seen.has('Kacang Tanah')) {
    const c = CROPS_CATALOG['Kacang Tanah'];
    if (c) {
      matched.push({ name: c.nama, category: c.kategori, umur_panen_hari: c.umur_panen_hari });
      seen.add(c.nama);
    }
  }

  return matched.slice(0, limit);
}

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
  if (q.includes('mangga')) return CROPS_CATALOG['Mangga (Harum Manis / Gedong Gincu)'];
  if (q.includes('alpukat') || q.includes('avocado')) return CROPS_CATALOG['Alpukat (Miki / Aligator)'];
  if (q.includes('pepaya') || q.includes('papaya')) return CROPS_CATALOG['Pepaya (Calina / California)'];
  if (q.includes('naga')) return CROPS_CATALOG['Buah Naga Merah'];
  if (q.includes('anggur') || q.includes('grape')) return CROPS_CATALOG['Anggur'];
  if (q.includes('semangka') || q.includes('watermelon')) return CROPS_CATALOG['Semangka'];
  if (q.includes('melon')) return CROPS_CATALOG['Melon'];
  if (q.includes('pisang')) return CROPS_CATALOG['Pisang (Cavendish / Raja)'];
  if (q.includes('jeruk') || q.includes('citrus') || q.includes('lemon')) return CROPS_CATALOG['Jeruk (Siam / Keprok)'];
  if (q.includes('apel') || q.includes('apple')) return CROPS_CATALOG['Apel (Manalagi / Rome Beauty)'];
  if (q.includes('kacang tanah')) return CROPS_CATALOG['Kacang Tanah'];
  if (q.includes('singkong') || q.includes('ubi kayu') || q.includes('ketela')) return CROPS_CATALOG['Singkong / Ubi Kayu'];
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

