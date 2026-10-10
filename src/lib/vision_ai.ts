import { VisionAnalysisResult } from './types';
import { SAMPLE_CROP_SVGS } from './sample_crops_svg';

export const DISEASE_LIBRARY: Record<string, Omit<VisionAnalysisResult, 'id'>> = {
  'antraknosa': {
    nama_tanaman: 'Cabai Merah / Rawit',
    kategori_diagnosa: 'Penyakit',
    nama_masalah: 'Penyakit Antraknosa (Patek / Colletotrichum capsici)',
    tingkat_keparahan: 'Sedang',
    akurasi: 94.8,
    status_kematangan: 'Mendekati Panen',
    estimasi_hari_panen: 14,
    spad_chlorophyll_index: 38.2,
    health_index: 62,
    sample_image_url: SAMPLE_CROP_SVGS['antraknosa'],
    detected_boxes: [
      {
        id: 'box-1',
        label: 'Lesi Patek Konsentris (94.8%)',
        confidence: 94.8,
        x: 48,
        y: 54,
        width: 18,
        height: 18,
        type: 'disease',
        color: '#e11d48'
      },
      {
        id: 'box-2',
        label: 'Nekrosis Ujung Buah (88.2%)',
        confidence: 88.2,
        x: 46,
        y: 74,
        width: 14,
        height: 14,
        type: 'disease',
        color: '#ea580c'
      }
    ],
    ciri_visual: [
      'Bercak cekung melingkar berwarna cokelat kehitaman pada permukaan buah cabai',
      'Lingkaran konsentris berspora jingga/merah muda saat kondisi lembap malam hari',
      'Ujung buah mengerut dan membusuk sebelum memerah sempurna'
    ],
    rekomendasi_pupuk: [
      { 
        jenis: 'Pupuk Kalsium Boron', 
        formula: 'CaO 26% + B 2%', 
        dosis: '2-3 gram/liter air', 
        cara_aplikasi: 'Semprot kabut ke seluruh tanaman pagi hari untuk mempertebal dinding sel buah.' 
      },
      { 
        jenis: 'Kalium Sulfat (ZK)', 
        formula: 'K2O 50% + S 17%', 
        dosis: '5 gram/tanaman', 
        cara_aplikasi: 'Kocor di pangkal akar, kurangi pupuk urea/nitrogen berlebih saat musim hujan.' 
      }
    ],
    solusi_perawatan: [
      'Petik segera buah yang terkena patek dan musnahkan (kubur/bakar jauh dari lahan) agar spora tidak terbawa angin.',
      'Perlebar jarak tanam dan pangkas daun bagian bawah (*wiwil*) agar sirkulasi udara di bawah tajuk lancar.',
      'Perbaiki drainase parit bedengan; jangan biarkan air menggenang lebih dari 2 jam setelah hujan deras.'
    ],
    pestisida_nabati_organik: [
      'Ekstrak Bawang Putih + Kunyit (mengandung allicin & curcumin sebagai fungisida alami)',
      'Bio-fungisida agens hayati Trichoderma harzianum (kocor pada lubang tanam seminggu sekali)'
    ],
    mitigasi_7hari: [
      'Hari 1: Sanitasi petik buah bergejala dan kubur minimal kedalaman 40 cm.',
      'Hari 2: Aplikasi semprot ekstrak kalsium boron di pagi hari.',
      'Hari 4: Kocor bio-fungisida Trichoderma pada tanah sekitar perakaran.',
      'Hari 7: Evaluasi visual pembentukan buah baru di cabang atas.'
    ]
  },

  'kutu-kebul': {
    nama_tanaman: 'Cabai / Tomat / Terong',
    kategori_diagnosa: 'Hama',
    nama_masalah: 'Serangan Hama Kutu Kebul & Gemini Virus (Bemisia tabaci)',
    tingkat_keparahan: 'Parah',
    akurasi: 96.2,
    status_kematangan: 'Belum Cukup Panen',
    estimasi_hari_panen: 35,
    spad_chlorophyll_index: 29.4,
    health_index: 45,
    sample_image_url: SAMPLE_CROP_SVGS['kutu-kebul'],
    detected_boxes: [
      {
        id: 'box-1',
        label: 'Koloni Vektor Bemisia (96.2%)',
        confidence: 96.2,
        x: 38,
        y: 35,
        width: 25,
        height: 24,
        type: 'pest',
        color: '#e11d48'
      },
      {
        id: 'box-2',
        label: 'Klorosis Kuning Gemini (92.5%)',
        confidence: 92.5,
        x: 48,
        y: 22,
        width: 22,
        height: 22,
        type: 'disease',
        color: '#eab308'
      }
    ],
    ciri_visual: [
      'Koloni serangga putih kecil beterbangan saat daun digoyang pelan',
      'Daun bagian atas mengeriting kerdil, melengkung ke atas seperti mangkok (*cupping*)',
      'Bercak klorosis kuning belang-belang akibat penularan Gemini Virus'
    ],
    rekomendasi_pupuk: [
      { 
        jenis: 'Pupuk Silika Cair (Si)', 
        formula: 'SiO2 20%', 
        dosis: '1.5 ml/liter air', 
        cara_aplikasi: 'Semprot merata di bawah daun untuk membuat jaringan daun kaku dan tidak disukai kutu.' 
      },
      { 
        jenis: 'Asam Amino Organik', 
        formula: 'Amino Acid 50%', 
        dosis: '2 ml/liter air', 
        cara_aplikasi: 'Membantu pemulihan stres fisiologis tanaman setelah serangan kutu.' 
      }
    ],
    solusi_perawatan: [
      'Pasang perangkap lekat kuning (*Yellow Sticky Trap*) setinggi 30 cm di atas tajuk tanaman.',
      'Lakukan penyemprotan rutin pada sore hari (pukul 16.30) menyasar bagian bawah permukaan daun.',
      'Cabut dan musnahkan tanaman yang sudah terserang virus kuning parah agar tidak menular ke tanaman lain.'
    ],
    pestisida_nabati_organik: [
      'Pestisida Daun Mimba (Azadirachtin) + rendaman tembakau',
      'Larutan sabun kalium / deterjen lembut nabati (5 ml/liter) untuk melarutkan lapisan lilin kutu'
    ],
    mitigasi_7hari: [
      'Hari 1: Pasang 20 lembar yellow sticky trap per hektar di antara bedengan.',
      'Hari 2: Semprot biopestisida mimba + sabun kalium di bawah permukaan daun pada sore hari.',
      'Hari 5: Semprot pupuk mikro silika cair untuk mempertebal kutikula daun baru.',
      'Hari 7: Cek populasi kutu di bawah daun pucuk.'
    ]
  },

  'ulat-grayak': {
    nama_tanaman: 'Bawang Merah / Jagung',
    kategori_diagnosa: 'Hama',
    nama_masalah: 'Serangan Ulat Grayak (Spodoptera exigua / frugiperda)',
    tingkat_keparahan: 'Parah',
    akurasi: 95.4,
    status_kematangan: 'Belum Cukup Panen',
    estimasi_hari_panen: 28,
    spad_chlorophyll_index: 34.1,
    health_index: 52,
    sample_image_url: SAMPLE_CROP_SVGS['ulat-grayak'],
    detected_boxes: [
      {
        id: 'box-1',
        label: 'Gerekan Larva Spodoptera (95.4%)',
        confidence: 95.4,
        x: 44,
        y: 32,
        width: 14,
        height: 24,
        type: 'pest',
        color: '#e11d48'
      },
      {
        id: 'box-2',
        label: 'Lubang Transparan Daun (89.0%)',
        confidence: 89.0,
        x: 58,
        y: 30,
        width: 12,
        height: 18,
        type: 'disease',
        color: '#ea580c'
      }
    ],
    ciri_visual: [
      'Lubang gigitan memanjang transparan menyerupai jendela pada daun bawang/jagung',
      'Kotoran ulat berwarna hijau kehitaman di dalam rongga silinder daun terlipat',
      'Ulat bersembunyi di pangkal tanaman saat siang hari dan aktif menggerek di malam hari'
    ],
    rekomendasi_pupuk: [
      { 
        jenis: 'Pupuk Silika Nanomikro', 
        formula: 'SiO2 25% + Boron 1%', 
        dosis: '1.5 ml/liter air', 
        cara_aplikasi: 'Semprot kabut tipis pada sore hari untuk menebalkan kutikula daun.' 
      },
      { 
        jenis: 'Asam Amino & Kalium', 
        formula: 'K2O 30% + Amino 20%', 
        dosis: '2 gram/liter air', 
        cara_aplikasi: 'Kocor di sekitar perakaran untuk memacu pertumbuhan anakan daun baru.' 
      }
    ],
    solusi_perawatan: [
      'Pasang lampu perangkap hama (*Light Trap*) di malam hari dengan nampan air sabun di bawahnya.',
      'Lakukan pengutipan ulat dan kelompok telur berbulu kapas secara manual pada pagi hari (pukul 06.00-08.00).',
      'Rotasi tanaman dengan komoditas non-inang (kacang tanah atau jagung manis tahan ulat).'
    ],
    pestisida_nabati_organik: [
      'Bio-insektisida hayati Beauveria bassiana atau Bacillus thuringiensis (Bt)',
      'Ekstrak biji/daun mimba (Azadirachtin) dicampur rebusan brotowali pahit (semprot sore hari)'
    ],
    mitigasi_7hari: [
      'Hari 1: Nyalakan perangkap lampu light trap di tepi lahan mulai pukul 18.00.',
      'Hari 2: Pengutipan telur kapas dan semprot agens hayati Beauveria bassiana.',
      'Hari 4: Pantau keberadaan bekas gerekan baru pada pucuk daun muda.',
      'Hari 7: Aplikasi kedua bio-insektisida hayati jika ulat masih terpantau.'
    ]
  },

  'hawar-daun': {
    nama_tanaman: 'Padi Sawah / Gogo',
    kategori_diagnosa: 'Penyakit',
    nama_masalah: 'Hawar Daun Bakteri (Kresek / Xanthomonas oryzae pv. oryzae)',
    tingkat_keparahan: 'Sedang',
    akurasi: 93.5,
    status_kematangan: 'Belum Cukup Panen',
    estimasi_hari_panen: 45,
    spad_chlorophyll_index: 31.8,
    health_index: 58,
    sample_image_url: SAMPLE_CROP_SVGS['hawar-daun'],
    detected_boxes: [
      {
        id: 'box-1',
        label: 'Hawar Tepi Helai Xanthomonas (93.5%)',
        confidence: 93.5,
        x: 52,
        y: 20,
        width: 18,
        height: 48,
        type: 'disease',
        color: '#e11d48'
      },
      {
        id: 'box-2',
        label: 'Nekrosis Abu-abu Ujung Daun (87.6%)',
        confidence: 87.6,
        x: 58,
        y: 10,
        width: 14,
        height: 22,
        type: 'disease',
        color: '#ca8a04'
      }
    ],
    ciri_visual: [
      'Garis basah kehijauan di tepi helaian daun yang berubah cepat menjadi kuning pucat keputihan bergelombang',
      'Daun menggulung layu dan mengering menyerupai terbakar terik matahari',
      'Keluarnya eksudat cairan bakteri seperti butiran embun keruh pada pagi hari'
    ],
    rekomendasi_pupuk: [
      { 
        jenis: 'Pupuk MOP / KCl', 
        formula: 'K2O 60%', 
        dosis: '75 kg/hektar', 
        cara_aplikasi: 'Tingkatkan dosis kalium untuk memperkuat imunitas jaringan batang dan helai daun.' 
      },
      { 
        jenis: 'Pupuk Silika Aktif', 
        formula: 'Silikat Larut Air', 
        dosis: '2 kg/hektar', 
        cara_aplikasi: 'Tabur bersamaan dengan jadwal pemupukan susulan kedua.' 
      }
    ],
    solusi_perawatan: [
      'Keringkan sawah secara berkala (*pengairan berselang / AWD*), hindari genangan air terus-menerus.',
      'Kurangi pupuk nitrogen (Urea) hingga 30% saat gejala kresek mulai terlihat di petak sawah.',
      'Gunakan benih bersertifikat varietas tahan kresek (Inpari 32, Inpari 42) pada musim tanam berikutnya.'
    ],
    pestisida_nabati_organik: [
      'Bakterisida hayati Pseudomonas fluorescens atau Bacillus subtilis',
      'Ekstrak lengkuas, rimpang kunyit, dan sirih merah sebagai bakterisida nabati'
    ],
    mitigasi_7hari: [
      'Hari 1: Keringkan genangan air sawah selama 3-4 hari hingga tanah retak rambut.',
      'Hari 2: Semprot agens hayati Pseudomonas fluorescens pada pagi hari.',
      'Hari 4: Tunda aplikasi pupuk urea/nitrogen.',
      'Hari 7: Evaluasi apakah lesi kuning berhenti merambat ke bawah pelepah.'
    ]
  },

  'bulai-jagung': {
    nama_tanaman: 'Jagung (Zea mays)',
    kategori_diagnosa: 'Penyakit',
    nama_masalah: 'Penyakit Bulai Jagung (Peronosclerospora maydis)',
    tingkat_keparahan: 'Parah',
    akurasi: 94.1,
    status_kematangan: 'Belum Cukup Panen',
    estimasi_hari_panen: 60,
    spad_chlorophyll_index: 26.5,
    health_index: 40,
    sample_image_url: SAMPLE_CROP_SVGS['bulai-jagung'],
    detected_boxes: [
      {
        id: 'box-1',
        label: 'Garis Klorotik Bulai (94.1%)',
        confidence: 94.1,
        x: 25,
        y: 20,
        width: 32,
        height: 45,
        type: 'disease',
        color: '#e11d48'
      },
      {
        id: 'box-2',
        label: 'Lapisan Spora Tepung Putih (89.8%)',
        confidence: 89.8,
        x: 35,
        y: 28,
        width: 24,
        height: 28,
        type: 'disease',
        color: '#9333ea'
      }
    ],
    ciri_visual: [
      'Garis klorotik putih sejajar tulang daun dari pangkal hingga ujung helaian',
      'Lapisan serbuk spora putih seperti bedak tepung di bawah permukaan daun saat pagi berkabut',
      'Pertumbuhan tanaman kerdil dan tongkol jagung berpotensi ompong/tidak terisi biji'
    ],
    rekomendasi_pupuk: [
      { 
        jenis: 'Pupuk Kalsium Kocor', 
        formula: 'CaCO3 98%', 
        dosis: '5 kg/drum 200 liter', 
        cara_aplikasi: 'Kocor tanah sekitar perakaran untuk meningkatkan resistensi dinding sel tanaman.' 
      }
    ],
    solusi_perawatan: [
      'Cabut dan musnahkan (bakar/kubur) tanaman yang terinfeksi bulai sebelum spora terbawa angin ke tanaman lain.',
      'Gunakan benih bersertifikat yang telah diperlakukan dengan perlakuan benih (*seed treatment*) fungisida hayati.',
      'Atur waktu tanam serempak dalam satu hamparan untuk memutus siklus hidup jamur bulai.'
    ],
    pestisida_nabati_organik: [
      'Agens hayati Trichoderma asperellum diaplikasikan pada tanah dan lubang tanam',
      'Ekstrak daun sirih hijau dan rimpang jahe sebagai fungisida nabati preventif'
    ],
    mitigasi_7hari: [
      'Hari 1: Roguing (cabut dan bakar tanaman bergejala bulai) pada pagi hari tenang tanpa angin.',
      'Hari 2: Kocor Trichoderma asperellum ke lubang bekas tanaman yang dicabut.',
      'Hari 4: Semprot penguat silika kalsium pada tanaman tetangga yang masih sehat.',
      'Hari 7: Inspeksi menyeluruh daun pucuk jagung di seluruh petakan.'
    ]
  },

  'siap-panen-grade-a': {
    nama_tanaman: 'Cabai Merah Prima (Capsicum annuum)',
    kategori_diagnosa: 'Tanaman Sehat',
    nama_masalah: 'Buah Matang Optimal & Bebas Patogen (Super Grade A)',
    tingkat_keparahan: 'Aman',
    akurasi: 98.7,
    status_kematangan: 'Siap Panen (Super Grade A)',
    estimasi_hari_panen: 0,
    spad_chlorophyll_index: 46.5,
    health_index: 98,
    sample_image_url: SAMPLE_CROP_SVGS['siap-panen-grade-a'],
    detected_boxes: [
      {
        id: 'box-1',
        label: 'Kematangan Pigmen 96% (Grade A)',
        confidence: 98.7,
        x: 44,
        y: 38,
        width: 24,
        height: 48,
        type: 'fruit',
        color: '#059669'
      },
      {
        id: 'box-2',
        label: 'Kutikula Sehat Bebas Bintik (99.2%)',
        confidence: 99.2,
        x: 46,
        y: 45,
        width: 18,
        height: 25,
        type: 'foliage',
        color: '#10b981'
      }
    ],
    ciri_visual: [
      'Warna buah merah merata 95%, berkilau segar dengan kadar padatan terlarut (brix) tinggi',
      'Tingkat kekerasan buah ideal (*firmness* tinggi), tahan simpan 7-10 hari pengiriman pasar induk',
      'Tangkai buah kokoh hijau segar dan mudah dilepas saat dipetik tanpa merusak tangkai cabang'
    ],
    rekomendasi_pupuk: [
      { 
        jenis: 'KNO3 Putih (Post-Harvest Prep)', 
        formula: 'K2O 45% + N 13%', 
        dosis: '2 gram/liter air', 
        cara_aplikasi: 'Semprot ringan 3 hari sebelum petik untuk mempertahankan kilau kulit buah.' 
      }
    ],
    solusi_perawatan: [
      'Lakukan panen pada pagi hari (pukul 06.30 - 09.00) saat suhu masih sejuk dan embun sudah menguap.',
      'Gunakan gunting panen bersih atau petik dengan menyertakan tangkai agar buah tidak mudah susut busuk.',
      'Simpan hasil panen di keranjang berventilasi di tempat teduh, hindari paparan sinar matahari langsung.'
    ],
    pestisida_nabati_organik: [
      'Hentikan seluruh aplikasi pestisida 5 hari sebelum panen untuk menjamin bebas residu kimiawi.'
    ],
    mitigasi_7hari: [
      'Hari 0: Petik cabai merah matang 90-95% di pagi hari.',
      'Hari 1: Sortasi buah berdasarkan ukuran dan pisahkan buah afkir/cacat.',
      'Hari 2: Kemas ke dalam keranjang plastik berongga untuk distribusi cepat ke pasar.',
      'Hari 4: Berikan pupuk susulan NPK seimbang untuk memacu pembungaan gelombang kedua.'
    ]
  }
};

export function analyzeCropImage(imageKeyOrDesc: string, registeredCrop?: string): VisionAnalysisResult {
  const key = (imageKeyOrDesc || '').toLowerCase();
  let selectedKey = 'siap-panen-grade-a';

  if (key.includes('ulat') || key.includes('grayak') || key.includes('spodoptera')) {
    selectedKey = 'ulat-grayak';
  } else if (key.includes('bulai') || key.includes('putih-jagung')) {
    selectedKey = 'bulai-jagung';
  } else if (key.includes('kutu') || key.includes('kebul') || key.includes('gemini') || key.includes('keriting')) {
    selectedKey = 'kutu-kebul';
  } else if (key.includes('hawar') || key.includes('kresek') || key.includes('xanthomonas')) {
    selectedKey = 'hawar-daun';
  } else if (key.includes('antraknosa') || key.includes('patek') || key.includes('colletotrichum') || key.includes('busuk')) {
    selectedKey = 'antraknosa';
  } else if (key.includes('sehat') || key.includes('panen') || key.includes('matang') || key.includes('grade-a')) {
    selectedKey = 'siap-panen-grade-a';
  } else if (registeredCrop) {
    const rc = registeredCrop.toLowerCase();
    if (rc.includes('bawang')) selectedKey = 'ulat-grayak';
    else if (rc.includes('jagung')) selectedKey = 'bulai-jagung';
    else if (rc.includes('padi')) selectedKey = 'hawar-daun';
    else if (rc.includes('cabai') || rc.includes('cabe')) selectedKey = 'antraknosa';
    else selectedKey = 'siap-panen-grade-a';
  }

  const selected = DISEASE_LIBRARY[selectedKey] || DISEASE_LIBRARY['antraknosa'];

  return {
    id: 'scan-' + Date.now(),
    ...selected
  };
}
