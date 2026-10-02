export interface SeedVariety {
  id: string;
  nama_varietas: string;
  komoditas: 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur';
  pemulia_resmi: string; // BRIN / Balitpa / Balitjestro / Puslitkoka / East West Seed, etc.
  potensi_hasil: string; // e.g. '8.5 - 10.5 Ton/Ha'
  rata_rata_hasil: string; // e.g. '7.2 Ton/Ha'
  umur_panen: string; // e.g. '112 - 118 Hari'
  tekstur_atau_kualitas: string; // e.g. 'Pulen Lembut, Rendemen Giling Tinggi (68%)'
  
  // Kesesuaian Lingkungan
  ketinggian_cocok: ('rendah' | 'sedang' | 'tinggi')[];
  tipe_lahan_cocok: ('irigasi_teknis' | 'tadah_hujan' | 'rawa_pasangsurut' | 'lahan_kering')[];
  musim_optimal: ('hujan' | 'kemarau' | 'pancaroba')[];
  rentang_ph_optimal: [number, number]; // e.g. [5.5, 7.0]
  
  // Karakteristik Agronomis & Ketahanan
  ketahanan_hama_penyakit: string[];
  keunggulan_utama: string;
  alasan_rekomendasi: string;
  
  // Daya Serap Pasar
  kategori_pasar: 'Pasar Umum / Massal' | 'Segmen Premium / Restoran' | 'Grosir Luar Pulau / Ekspor' | 'Industri Olahan';
  estimasi_harga_jual: string; // e.g. 'Rp 6.800 - 7.500 / kg (GKP)'
  daya_serap_pasar: 'Sangat Tinggi' | 'Tinggi' | 'Khusus/Niche';
  
  // Skor kecocokan dinamis (dihitung runtime)
  skor_kecocokan?: number;
  label_peringkat?: string;
  alasan_cocok_wilayah?: string;
}

export interface LandConditionInput {
  daerahNama?: string;
  komoditas: 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' | 'Jeruk' | 'Cokelat / Kakao' | 'Anggur';
  ketinggian: 'rendah' | 'sedang' | 'tinggi'; // rendah: 0-400 mdpl, sedang: 400-700 mdpl, tinggi: >700 mdpl
  tipe_lahan: 'irigasi_teknis' | 'tadah_hujan' | 'rawa_pasangsurut' | 'lahan_kering';
  musim: 'hujan' | 'kemarau' | 'pancaroba';
  ph_tanah: number;
  target_pasar?: 'umum' | 'premium' | 'tahan_simpan';
}

export const MASTER_VARIETIES: SeedVariety[] = [
  // ==================== PADI ====================
  {
    id: 'padi-inpari-32',
    nama_varietas: 'Inpari 32 HDB',
    komoditas: 'Padi',
    pemulia_resmi: 'Badan Litbang Pertanian (Kementan / BRIN)',
    potensi_hasil: '8.42 - 10.58 Ton/Ha',
    rata_rata_hasil: '7.8 Ton/Ha',
    umur_panen: '115 - 120 Hari',
    tekstur_atau_kualitas: 'Nasi Pulen, Kadar Amilosa 21.8%, Butir Bening Tanpa Kapur',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['hujan', 'pancaroba', 'kemarau'],
    rentang_ph_optimal: [5.5, 7.2],
    ketahanan_hama_penyakit: [
      'Kebal Hawar Daun Bakteri (Kresek) strain III & IV',
      'Tahan Penyakit Blast ras 033',
      'Agak Tahan Tungro ras Lanrang'
    ],
    keunggulan_utama: 'Paling dicari penggilingan padi nasional karena rendemen beras kepala tinggi dan sangat tahan cuaca lembap musim hujan.',
    alasan_rekomendasi: 'Cocok untuk lahan irigasi dataran rendah-sedang. Tahan serangan kresek saat curah hujan tinggi dan diserap pasar beras umum tanpa diskon harga.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 6.800 - 7.600 / kg GKP',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'padi-inpari-42',
    nama_varietas: 'Inpari 42 Agritan GSR (Green Super Rice)',
    komoditas: 'Padi',
    pemulia_resmi: 'BRIN & IRRI (International Rice Research Institute)',
    potensi_hasil: '7.11 - 10.58 Ton/Ha',
    rata_rata_hasil: '7.5 Ton/Ha',
    umur_panen: '112 Hari (Genjah)',
    tekstur_atau_kualitas: 'Nasi Pulen, Butir Panjang Bersih',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['hujan', 'pancaroba'],
    rentang_ph_optimal: [5.3, 7.0],
    ketahanan_hama_penyakit: [
      'Tahan Rendaman Banjir hingga 14 hari',
      'Hemat Pupuk N & P hingga 20-25%',
      'Tahan Hawar Daun Bakteri strain IV & VIII',
      'Batang Kokoh Anti-Rebah saat Angin Kencang'
    ],
    keunggulan_utama: 'Teknologi Green Super Rice: hemat pupuk, batang kokoh anti rebah saat angin kencang, dan tahan genangan air berlebih.',
    alasan_rekomendasi: 'Sangat ideal untuk wilayah rawan genangan air di musim hujan atau petani yang ingin menekan biaya operasional pupuk kimia.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 6.700 - 7.500 / kg GKP',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'padi-inpari-33',
    nama_varietas: 'Inpari 33 (Spesialis Anti-Wereng)',
    komoditas: 'Padi',
    pemulia_resmi: 'Balai Besar Penelitian Tanaman Padi (BBPadi)',
    potensi_hasil: '7.50 - 9.80 Ton/Ha',
    rata_rata_hasil: '7.2 Ton/Ha',
    umur_panen: '107 Hari (Sangat Genjah)',
    tekstur_atau_kualitas: 'Nasi Pulen Sedang, Gabah Bersih',
    ketinggian_cocok: ['rendah'],
    tipe_lahan_cocok: ['irigasi_teknis'],
    musim_optimal: ['kemarau', 'pancaroba'],
    rentang_ph_optimal: [5.8, 7.2],
    ketahanan_hama_penyakit: [
      'Sangat Tahan Wereng Batang Coklat (WBC) Biotipe 1, 2, dan 3',
      'Tahan Hawar Daun Bakteri strain III'
    ],
    keunggulan_utama: 'Perisai utama di daerah endemik ledakan wereng coklat pada musim gadu (kemarau). Umur panen sangat cepat sehingga perputaran modal kilat.',
    alasan_rekomendasi: 'Rekomendasi nomor 1 untuk musim kemarau di sentra pesisir Jawa yang rawan serangan wereng batang coklat.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 6.600 - 7.400 / kg GKP',
    daya_serap_pasar: 'Tinggi'
  },
  {
    id: 'padi-inpago-8',
    nama_varietas: 'Inpago 8 (Spesialis Lahan Kering / Gogo)',
    komoditas: 'Padi',
    pemulia_resmi: 'Balai Penelitian Tanaman Padi (BBPadi) / BRIN',
    potensi_hasil: '5.60 - 7.40 Ton/Ha',
    rata_rata_hasil: '5.8 Ton/Ha',
    umur_panen: '110 Hari',
    tekstur_atau_kualitas: 'Nasi Pulen Gurih, Rasa Alami Disukai Warga Lokal',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['tadah_hujan', 'lahan_kering'],
    musim_optimal: ['kemarau', 'pancaroba'],
    rentang_ph_optimal: [4.5, 6.2],
    ketahanan_hama_penyakit: [
      'Toleran Kekeringan Ekstrem (Hemat Air)',
      'Toleran Keracunan Aluminium (Al) pada Tanah Masam',
      'Tahan Penyakit Blas Ras 033 dan 073'
    ],
    keunggulan_utama: 'Mampu berproduksi tinggi di lahan bukaan baru, tanah masam berkapur tipis, atau sawah tadah hujan tanpa irigasi teknis.',
    alasan_rekomendasi: 'Pilihan terbaik jika lahan Anda tadah hujan atau tanah masam ber-pH rendah di bawah 5.5.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 6.500 - 7.200 / kg GKP',
    daya_serap_pasar: 'Tinggi'
  },
  {
    id: 'padi-inpara-3',
    nama_varietas: 'Inpara 3 (Spesialis Lahan Rawa & Pasang Surut)',
    komoditas: 'Padi',
    pemulia_resmi: 'Balai Besar Penelitian Tanaman Padi (BBPadi)',
    potensi_hasil: '5.80 - 7.50 Ton/Ha',
    rata_rata_hasil: '5.5 Ton/Ha',
    umur_panen: '115 - 120 Hari',
    tekstur_atau_kualitas: 'Nasi Sedang / Agak Pera (Disukai di Luar Jawa & Olahan Nasi Goreng)',
    ketinggian_cocok: ['rendah'],
    tipe_lahan_cocok: ['rawa_pasangsurut'],
    musim_optimal: ['hujan', 'pancaroba'],
    rentang_ph_optimal: [4.2, 5.8],
    ketahanan_hama_penyakit: [
      'Tahan Rendaman Air Pasang hingga 14 Hari',
      'Toleran Keracunan Besi (Fe) dan Kemasaman Sulfat Masam',
      'Tahan Hawar Daun Bakteri patotipe III'
    ],
    keunggulan_utama: 'Didesain khusus untuk sentra rawa lebak dan pasang surut Sumatera, Kalimantan, dan Papua yang sering terendam air berkarat.',
    alasan_rekomendasi: 'Wajib dipilih untuk lahan gambut, rawa, pasang surut, atau lahan ber-pH masam dengan kadar zat besi tinggi.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 6.400 - 7.000 / kg GKP',
    daya_serap_pasar: 'Tinggi'
  },
  {
    id: 'padi-menthik-wangi',
    nama_varietas: 'Menthik Wangi / Pandan Wangi Murni',
    komoditas: 'Padi',
    pemulia_resmi: 'Kearifan Lokal Tersertifikasi / Balitpa',
    potensi_hasil: '6.00 - 7.80 Ton/Ha',
    rata_rata_hasil: '6.2 Ton/Ha',
    umur_panen: '120 - 125 Hari',
    tekstur_atau_kualitas: 'Aroma Wangi Pandan Alami, Tekstur Sangat Pulen, Beras Putih Mutiara',
    ketinggian_cocok: ['sedang', 'tinggi'],
    tipe_lahan_cocok: ['irigasi_teknis'],
    musim_optimal: ['hujan', 'pancaroba'],
    rentang_ph_optimal: [6.0, 7.0],
    ketahanan_hama_penyakit: [
      'Tahan Cuaca Dingin Pegunungan',
      'Batang Tinggi Kokoh'
    ],
    keunggulan_utama: 'Komoditas Sultan: Harga jual beras mencapai Rp 18.000 - 24.000/kg di tingkat ritel, diserap restoran hotel berbintang.',
    alasan_rekomendasi: 'Sangat menguntungkan di dataran sedang-tinggi bersuhu sejuk dengan pasokan air pegunungan jernih.',
    kategori_pasar: 'Segmen Premium / Restoran',
    estimasi_harga_jual: 'Rp 8.500 - 10.500 / kg GKP (Premium)',
    daya_serap_pasar: 'Khusus/Niche'
  },

  // ==================== CABAI RAWIT MERAH ====================
  {
    id: 'cabai-ori-212',
    nama_varietas: 'Cabai Rawit Unggul ORI 212',
    komoditas: 'Cabai Rawit Merah',
    pemulia_resmi: 'Aura Seed Indonesia',
    potensi_hasil: '18 - 25 Ton/Ha',
    rata_rata_hasil: '20 Ton/Ha',
    umur_panen: '85 - 90 HST (Mulai Petik)',
    tekstur_atau_kualitas: 'Buah Keras Padat, Kulit Mengkilap, Pedas Tajam Ekstrem',
    ketinggian_cocok: ['rendah', 'sedang', 'tinggi'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['hujan', 'pancaroba', 'kemarau'],
    rentang_ph_optimal: [5.8, 7.0],
    ketahanan_hama_penyakit: [
      'Toleran Penyakit Layu Bakteri (Ralstonia)',
      'Toleran Antraknosa (Patek) pada Musim Hujan',
      'Toleran Serangan Tungau dan Kutu Kebul'
    ],
    keunggulan_utama: 'Buah sangat padat dan tidak mudah kempes/busuk saat dikirim antarpulau, menjadi primadona pedagang Pasar Induk.',
    alasan_rekomendasi: 'Tingkat keawetan buah terbaik untuk distribusi jauh. Sangat cocok untuk mengejar harga puncak Ramadhan atau akhir tahun.',
    kategori_pasar: 'Grosir Luar Pulau / Ekspor',
    estimasi_harga_jual: 'Rp 45.000 - 85.000 / kg (Fluktuatif)',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'cabai-kaliber',
    nama_varietas: 'Cabai Rawit Kaliber Super',
    komoditas: 'Cabai Rawit Merah',
    pemulia_resmi: 'Wiji Tani Nusantara',
    potensi_hasil: '20 - 28 Ton/Ha',
    rata_rata_hasil: '22 Ton/Ha',
    umur_panen: '90 - 95 HST',
    tekstur_atau_kualitas: 'Buah Menggantung Lebat, Warna Merah Menyala',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['kemarau', 'pancaroba'],
    rentang_ph_optimal: [6.0, 7.2],
    ketahanan_hama_penyakit: [
      'Tahan Terik Sinar Matahari Kuat',
      'Toleran Virus Bule (Gemini Virus) Sedang-Tinggi',
      'Perakaran Dalam Menyerap Air Tanah Efisien'
    ],
    keunggulan_utama: 'Produktivitas per pohon sangat tinggi (hingga 1.5 - 2 kg per tanaman dengan pemupukan berimbang).',
    alasan_rekomendasi: 'Rekomendasi utama di musim kemarau/gadu pada dataran rendah dengan intensitas cahaya matahari penuh.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 40.000 - 80.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },

  // ==================== BAWANG MERAH ====================
  {
    id: 'bawang-bima-brebes',
    nama_varietas: 'Bima Brebes Asli (Varietas Nasional)',
    komoditas: 'Bawang Merah',
    pemulia_resmi: 'Balitsa Lembang & Petani Brebes Terdaftar',
    potensi_hasil: '10 - 14 Ton/Ha',
    rata_rata_hasil: '11.5 Ton/Ha',
    umur_panen: '55 - 60 Hari',
    tekstur_atau_kualitas: 'Umbi Bulat Merah Cerah, Anakan 7-12 Siung, Aroma Kuat Pedas',
    ketinggian_cocok: ['rendah'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['kemarau', 'pancaroba'],
    rentang_ph_optimal: [6.0, 6.8],
    ketahanan_hama_penyakit: [
      'Daya Simpan Gudang Sangat Baik (3-4 Bulan Tanpa Susut Ekstrem)',
      'Tahan Ulat Grayak (Spodoptera) dengan Pengendalian Ambang Ekonomi'
    ],
    keunggulan_utama: 'Standar patokan harga nasional, paling awet disimpan di para-para bambu saat menunggu harga pasar melonjak tinggi.',
    alasan_rekomendasi: 'Wajib ditanam petani dataran rendah aluvial untuk disimpan dan dijual saat puncak kebutuhan hajatan atau akhir tahun.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 35.000 - 55.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'bawang-bauji',
    nama_varietas: 'Bauji (Spesialis Musim Hujan / Off-Season)',
    komoditas: 'Bawang Merah',
    pemulia_resmi: 'Petani Pemulia Nganjuk & Balitsa',
    potensi_hasil: '11 - 15 Ton/Ha',
    rata_rata_hasil: '12 Ton/Ha',
    umur_panen: '58 - 62 Hari',
    tekstur_atau_kualitas: 'Daun Kaku Tebal, Umbi Agak Lonjong Merah Keunguan',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis'],
    musim_optimal: ['hujan', 'pancaroba'],
    rentang_ph_optimal: [5.8, 6.8],
    ketahanan_hama_penyakit: [
      'Tahan Penyakit Jamur Trotol (Alternaria porri)',
      'Toleran Kelembapan Udara Tinggi (>80%) Musim Hujan'
    ],
    keunggulan_utama: 'Satu-satunya varietas bawang yang bandel ditanam saat musim hujan (off-season) ketika harga pasar melambung ke Rp 60.000/kg.',
    alasan_rekomendasi: 'Gunakan varietas ini jika menanam di musim penghujan untuk meraup untung maksimal di saat pasokan bawang nasional langka.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 40.000 - 65.000 / kg (Musim Langka)',
    daya_serap_pasar: 'Sangat Tinggi'
  },

  // ==================== TOMAT ====================
  {
    id: 'tomat-gustavi-f1',
    nama_varietas: 'Tomat Gustavi F1',
    komoditas: 'Tomat',
    pemulia_resmi: 'Cap Panah Merah (PT East West Seed Indonesia)',
    potensi_hasil: '50 - 70 Ton/Ha',
    rata_rata_hasil: '55 Ton/Ha',
    umur_panen: '65 - 70 HST',
    tekstur_atau_kualitas: 'Buah Sangat Keras, Daging Tebal Tahan Benturan dan Pengiriman 5 Hari',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['hujan', 'pancaroba', 'kemarau'],
    rentang_ph_optimal: [5.8, 7.0],
    ketahanan_hama_penyakit: [
      'Tahan Virus Gemini (Daun Keriting Kuning / Bule)',
      'Tahan Layu Bakteri (Ralstonia solanacearum)',
      'Toleran Iklim Lembap dan Busuk Ujung Buah (BER)'
    ],
    keunggulan_utama: 'Bisa ditanam di dataran rendah dan musim hujan tanpa khawatir virus kuning dan buah busuk.',
    alasan_rekomendasi: 'Hasil tonase panen raksasa dan buah tidak mudah lembek, sangat disukai pedagang pasar grosir perkotaan.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 14.000 - 25.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },

  // ==================== JAGUNG ====================
  {
    id: 'jagung-bonanza-f1',
    nama_varietas: 'Jagung Manis Bonanza F1',
    komoditas: 'Jagung',
    pemulia_resmi: 'Cap Panah Merah',
    potensi_hasil: '14 - 18 Ton/Ha',
    rata_rata_hasil: '15 Ton/Ha',
    umur_panen: '70 - 75 HST (Super Cepat)',
    tekstur_atau_kualitas: 'Rasa Manis Gurih (Brix 13-14%), Biji Rapat Berisi Hingga Ujung Tongkol',
    ketinggian_cocok: ['rendah', 'sedang', 'tinggi'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan', 'lahan_kering'],
    musim_optimal: ['hujan', 'kemarau', 'pancaroba'],
    rentang_ph_optimal: [5.5, 7.2],
    ketahanan_hama_penyakit: [
      'Tahan Penyakit Bulai (Peronosclerospora maydis)',
      'Tahan Hama Ulat Grayak FAW (Spodoptera frugiperda)'
    ],
    keunggulan_utama: 'Masa tanam sangat kilat (2.5 bulan), langsung laku terserap pasar kuliner jagung manis dan hotel/supermarket.',
    alasan_rekomendasi: 'Perputaran modal paling cepat untuk petani yang ingin mengisi lahan jeda sebelum masa tanam padi utama.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 7.500 - 12.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },

  // ==================== JERUK ====================
  {
    id: 'jeruk-keprok-batu55',
    nama_varietas: 'Jeruk Keprok Batu 55',
    komoditas: 'Jeruk',
    pemulia_resmi: 'Balitjestro Kementan RI',
    potensi_hasil: '25 - 35 Ton/Ha',
    rata_rata_hasil: '28 Ton/Ha',
    umur_panen: 'Mulai berbuah 2.5 - 3 Tahun',
    tekstur_atau_kualitas: 'Daging Buah Oranye Segar, Bulir Air Melimpah, Rasa Manis Segar (Brix 11-13%)',
    ketinggian_cocok: ['sedang', 'tinggi'],
    tipe_lahan_cocok: ['irigasi_teknis', 'lahan_kering'],
    musim_optimal: ['kemarau', 'pancaroba'],
    rentang_ph_optimal: [5.5, 6.8],
    ketahanan_hama_penyakit: [
      'Bebas Penyakit CVPD (Citrus Vein Phloem Degeneration)',
      'Toleran Hama Kutu Loncat Diaphorina citri',
      'Toleran Jamur Embun Tepung'
    ],
    keunggulan_utama: 'Varietas jeruk keprok unggulan nasional bersertifikasi bebas virus, kulit mudah dikupas, dan digemari pasar buah meja keluarga.',
    alasan_rekomendasi: 'Pilihan terbaik untuk perkebunan jeruk di dataran sedang hingga tinggi dengan permintaan pasar modern konsisten.',
    kategori_pasar: 'Segmen Premium / Restoran',
    estimasi_harga_jual: 'Rp 18.000 - 26.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'jeruk-siam-madu',
    nama_varietas: 'Jeruk Siam Madu Kintamani / Pontianak',
    komoditas: 'Jeruk',
    pemulia_resmi: 'Balai Penelitian Tanaman Buah Tropika (Balitbu)',
    potensi_hasil: '20 - 30 Ton/Ha',
    rata_rata_hasil: '24 Ton/Ha',
    umur_panen: 'Mulai berbuah 2 - 2.5 Tahun',
    tekstur_atau_kualitas: 'Rasa Manis Dominan Madu, Kulit Tipis Mengkilap, Kadar Air Tinggi',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan'],
    musim_optimal: ['kemarau', 'hujan'],
    rentang_ph_optimal: [5.5, 7.0],
    ketahanan_hama_penyakit: [
      'Adaptif Lahan Dataran Rendah Beriklim Hangat',
      'Tahan Kekeringan Sedang',
      'Toleran Hama Kutu Daun'
    ],
    keunggulan_utama: 'Produksi buah sangat lebat sepanjang tahun dan daya serap pasar grosir tradisional maupun industri jus sangat masif.',
    alasan_rekomendasi: 'Paling menguntungkan untuk kebun komersial skala besar di dataran rendah beririgasi lancar.',
    kategori_pasar: 'Pasar Umum / Massal',
    estimasi_harga_jual: 'Rp 12.000 - 18.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },

  // ==================== COKELAT / KAKAO ====================
  {
    id: 'kakao-mcc-02',
    nama_varietas: 'Kakao Klon MCC 02 (Klon Masamba 45)',
    komoditas: 'Cokelat / Kakao',
    pemulia_resmi: 'Pusat Penelitian Kopi dan Kakao Indonesia (Puslitkoka)',
    potensi_hasil: '2.5 - 3.2 Ton Biji Kering/Ha/Tahun',
    rata_rata_hasil: '2.4 Ton/Ha',
    umur_panen: 'Mulai berbuah 18 - 24 Bulan (Sambung Pucuk)',
    tekstur_atau_kualitas: 'Ukuran Biji Besar (Berat per 100 biji: 125-140 gram), Kadar Lemak 52-54%',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis', 'tadah_hujan', 'lahan_kering'],
    musim_optimal: ['hujan', 'pancaroba'],
    rentang_ph_optimal: [5.5, 6.8],
    ketahanan_hama_penyakit: [
      'Tahan Penyakit VSD (Vascular Streak Dieback)',
      'Tahan Busuk Buah Phytophthora palmivora',
      'Toleran Penggerek Buah Kakao (PBK)'
    ],
    keunggulan_utama: 'Klon kakao paling populer di Nusantara saat ini karena tahan penyakit mati pucuk (VSD) dan bobot biji sangat padat bernilai ekspor.',
    alasan_rekomendasi: 'Sangat ideal untuk revitalisasi kebun cokelat skala kecil maupun perkebunan besar dengan margin penjualan biji kering optimal.',
    kategori_pasar: 'Grosir Luar Pulau / Ekspor',
    estimasi_harga_jual: 'Rp 75.000 - 95.000 / kg (Biji Kering)',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'kakao-sulawesi-01',
    nama_varietas: 'Kakao Klon Sulawesi 01',
    komoditas: 'Cokelat / Kakao',
    pemulia_resmi: 'Dinas Perkebunan & Puslitkoka',
    potensi_hasil: '2.0 - 2.8 Ton Biji Kering/Ha/Tahun',
    rata_rata_hasil: '2.1 Ton/Ha',
    umur_panen: 'Mulai berbuah 2 Tahun',
    tekstur_atau_kualitas: 'Cita Rasa Cokelat Kuat (Rich Aroma), Biji Seragam',
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['tadah_hujan', 'lahan_kering'],
    musim_optimal: ['pancaroba', 'kemarau'],
    rentang_ph_optimal: [5.6, 7.0],
    ketahanan_hama_penyakit: [
      'Kuat Menghadapi Kemarau Panjang',
      'Toleran Hama Kepik Penghisap Buah (Helopeltis sp)',
      'Batang Sambungan Cepat Kokoh'
    ],
    keunggulan_utama: 'Toleran cuaca kering dan cocok ditanam di wilayah bertanah kering atau berbukit.',
    alasan_rekomendasi: 'Varietas alternatif terbaik jika lahan sering mengalami periode kering atau pasokan air terbatas.',
    kategori_pasar: 'Industri Olahan',
    estimasi_harga_jual: 'Rp 70.000 - 85.000 / kg (Biji Kering)',
    daya_serap_pasar: 'Tinggi'
  },

  // ==================== ANGGUR ====================
  {
    id: 'anggur-jupiter',
    nama_varietas: 'Anggur Meja Jupiter (Seedless / Non-Biji)',
    komoditas: 'Anggur',
    pemulia_resmi: 'University of Arkansas (Diadaptasi Riset Pertanian Nasional)',
    potensi_hasil: '15 - 20 Ton/Ha (Greenhouse Paranet/Plastik UV)',
    rata_rata_hasil: '16 Ton/Ha',
    umur_panen: '95 - 105 Hari Pasca Pangkas Pembuahan',
    tekstur_atau_kualitas: 'Buah Manis Beraroma Permen Karet (Muscat), Tanpa Biji, Kulit Tipis Renyah',
    ketinggian_cocok: ['rendah', 'sedang', 'tinggi'],
    tipe_lahan_cocok: ['irigasi_teknis', 'lahan_kering'],
    musim_optimal: ['kemarau', 'pancaroba'],
    rentang_ph_optimal: [6.0, 7.2],
    ketahanan_hama_penyakit: [
      'Tahan Iklim Tropis Panas Dataran Rendah',
      'Cepat Beradaptasi Media Tanam Porus',
      'Toleran Jamur Daun jika Dilindungi Plastik UV'
    ],
    keunggulan_utama: 'Varietas anggur paling genjah dan mudah berbuah di Indonesia, rasa manis disukai anak-anak dan pembeli pasar buah premium.',
    alasan_rekomendasi: 'Sangat direkomendasikan untuk kebun intensif modern, greenhouse agrivoltaik, atau lahan produktif perkotaan bernilai ekonomis tinggi.',
    kategori_pasar: 'Segmen Premium / Restoran',
    estimasi_harga_jual: 'Rp 65.000 - 90.000 / kg',
    daya_serap_pasar: 'Sangat Tinggi'
  },
  {
    id: 'anggur-transfiguration',
    nama_varietas: 'Anggur Transfiguration (Beri Jumbo)',
    komoditas: 'Anggur',
    pemulia_resmi: 'V.N. Krainov (Diuji & Beradaptasi Kebun Riset Tropika)',
    potensi_hasil: '18 - 25 Ton/Ha',
    rata_rata_hasil: '18 Ton/Ha',
    umur_panen: '110 - 120 Hari Pasca Pangkas',
    tekstur_atau_kualitas: "Beri Lonjong Raksasa (12-18 gr/butir), Warna Merah Muda Gradasi Emas, Daging Padat Renyah (Crunchy)",
    ketinggian_cocok: ['rendah', 'sedang'],
    tipe_lahan_cocok: ['irigasi_teknis'],
    musim_optimal: ['kemarau'],
    rentang_ph_optimal: [6.0, 7.0],
    ketahanan_hama_penyakit: [
      'Tandan Buah Raksasa (Mencapai 1 - 2.5 kg per dompol)',
      'Vigor Tanaman Sangat Kuat',
      'Toleran Panas Terik'
    ],
    keunggulan_utama: 'Tampilan tandan buah sangat mewah dan memukau, menjadi primadona agrowisata petik buah langsung dengan harga jual premium.',
    alasan_rekomendasi: 'Varietas komersial dengan nilai estetika dan tonase per pohon tertinggi untuk pengelola kebun modern.',
    kategori_pasar: 'Segmen Premium / Restoran',
    estimasi_harga_jual: 'Rp 60.000 - 85.000 / kg',
    daya_serap_pasar: 'Tinggi'
  }
];

export interface RecommendationResult {
  kondisiLahan: LandConditionInput;
  varietasTerbaik: SeedVariety;
  varietasAlternatif: SeedVariety[];
  diagnosaAgronomis: {
    status_tanah: string;
    status_iklim: string;
    ancaman_utama: string;
    kesimpulan_strategi: string;
  };
}

export function recommendBestSeeds(input: LandConditionInput): RecommendationResult {
  const candidates = MASTER_VARIETIES.filter(v => v.komoditas === input.komoditas);

  const scored = candidates.map(v => {
    let score = 50;
    const matchReasons: string[] = [];

    if (v.ketinggian_cocok.includes(input.ketinggian)) {
      score += 15;
      matchReasons.push(`Cocok di dataran ${input.ketinggian}`);
    } else {
      score -= 20;
    }

    if (v.tipe_lahan_cocok.includes(input.tipe_lahan)) {
      score += 15;
      matchReasons.push(`Sesuai tipe lahan ${input.tipe_lahan.replace('_', ' ')}`);
    } else {
      score -= 15;
    }

    if (v.musim_optimal.includes(input.musim)) {
      score += 12;
      matchReasons.push(`Optimal pada musim ${input.musim}`);
    }

    if (input.ph_tanah >= v.rentang_ph_optimal[0] && input.ph_tanah <= v.rentang_ph_optimal[1]) {
      score += 8;
      matchReasons.push(`Toleransi pH tanah ideal (${input.ph_tanah})`);
    } else {
      const diff = Math.min(
        Math.abs(input.ph_tanah - v.rentang_ph_optimal[0]),
        Math.abs(input.ph_tanah - v.rentang_ph_optimal[1])
      );
      if (diff > 1.0) {
        score -= 10;
      }
    }

    if (input.target_pasar === 'premium' && v.kategori_pasar.includes('Premium')) {
      score += 10;
      matchReasons.push('Nilai jual premium di pasar khusus');
    }

    const finalScore = Math.min(99, Math.max(40, score));

    return {
      ...v,
      skor_kecocokan: finalScore,
      alasan_cocok_wilayah: matchReasons.join(', ')
    };
  });

  scored.sort((a, b) => (b.skor_kecocokan || 0) - (a.skor_kecocokan || 0));

  const varietasTerbaik = scored[0] || candidates[0];
  const varietasAlternatif = scored.slice(1);

  if (varietasTerbaik) {
    varietasTerbaik.label_peringkat = 'PILIHAN UTAMA REKOMENDASI SISTEM';
  }
  if (varietasAlternatif[0]) {
    varietasAlternatif[0].label_peringkat = 'ALTERNATIF UNGGUL #2';
  }

  let statusTanah = `pH ${input.ph_tanah} (${input.ph_tanah < 5.5 ? 'Masam' : input.ph_tanah > 7.2 ? 'Basa/Kapur' : 'Netral & Sehat'}) pada lahan ${input.tipe_lahan.replace('_', ' ')}`;
  let statusIklim = `Dataran ${input.ketinggian}, beroperasi di musim ${input.musim}`;
  let ancamanUtama = input.musim === 'hujan' 
    ? 'Tingginya kelembapan udara berisiko memicu serangan jamur blast, hawar pelepah, dan hawar daun bakteri (kresek).'
    : 'Penurunan debit air permukaan dan potensi ledakan hama wereng batang coklat atau tungau.';
  
  let kesimpulanStrategi = `Sistem menetapkan ${varietasTerbaik.nama_varietas} sebagai varietas paling aman dan menguntungkan karena memiliki ketahanan genetik terhadap ${varietasTerbaik.ketahanan_hama_penyakit[0]} serta daya serap pasar yang ${varietasTerbaik.daya_serap_pasar.toLowerCase()}.`;

  return {
    kondisiLahan: input,
    varietasTerbaik,
    varietasAlternatif,
    diagnosaAgronomis: {
      status_tanah: statusTanah,
      status_iklim: statusIklim,
      ancaman_utama: ancamanUtama,
      kesimpulan_strategi: kesimpulanStrategi
    }
  };
}
