import { VisionAnalysisResult } from './types';

export const DISEASE_LIBRARY: Record<string, Omit<VisionAnalysisResult, 'id'>> = {
  'antraknosa': {
    nama_tanaman: 'Cabai / Tomat',
    kategori_diagnosa: 'Penyakit',
    nama_masalah: 'Penyakit Antraknosa (Patek / Colletotrichum)',
    tingkat_keparahan: 'Sedang',
    akurasi: 94.8,
    status_kematangan: 'Mendekati Panen',
    estimasi_hari_panen: 14,
    ciri_visual: [
      'Bercak cekung melingkar berwarna cokelat kehitaman pada permukaan buah',
      'Lingkaran konsentris berspora jingga/merah muda saat kondisi lembap',
      'Ujung cabai mengerut dan membusuk sebelum memerah sempurna'
    ],
    rekomendasi_pupuk: [
      { jenis: 'Pupuk Kalsium Boron', formula: 'CaO 26% + B 2%', dosis: '2-3 gram/liter air', cara_aplikasi: 'Semprot kabut ke seluruh tanaman pagi hari untuk mempertebal dinding sel buah.' },
      { jenis: 'Kalium Sulfat (ZK)', formula: 'K2O 50% + S 17%', dosis: '5 gram/tanaman', cara_aplikasi: 'Kocor di pangkal akar, hindari pupuk urea/nitrogen berlebih saat musim hujan.' }
    ],
    solusi_perawatan: [
      'Petik segera buah yang terkena patek dan musnahkan (kubur/bakar jauh dari lahan) agar spora tidak menyebar.',
      'Perlebar jarak tanam dan pangkas daun bagian bawah (*wiwil*) agar sirkulasi udara lancar.',
      'Perbaiki drainase parit bedengan; jangan biarkan air menggenang lebih dari 2 jam setelah hujan.'
    ],
    pestisida_nabati_organik: [
      'Ekstrak Bawang Putih + Kunyit (mengandung allicin & curcumin sebagai fungisida alami)',
      'Bio-fungisida agens hayati Trichoderma harzianum (kocor pada lubang tanam seminggu sekali)'
    ]
  },
  'kutu-kebul': {
    nama_tanaman: 'Cabai / Tomat / Terong',
    kategori_diagnosa: 'Hama',
    nama_masalah: 'Serangan Hama Kutu Kebul (Bemisia tabaci)',
    tingkat_keparahan: 'Parah',
    akurasi: 96.2,
    status_kematangan: 'Belum Cukup Panen',
    estimasi_hari_panen: 35,
    ciri_visual: [
      'Koloni serangga putih kecil beterbangan saat daun digoyang',
      'Daun bagian atas mengeriting kerdil, melengkung ke atas seperti mangkok (*cupping*)',
      'Bercak klorosis kuning belang-belang akibat penularan Gemini Virus'
    ],
    rekomendasi_pupuk: [
      { jenis: 'Pupuk Silika Cair (Si)', formula: 'SiO2 20%', dosis: '1.5 ml/liter air', cara_aplikasi: 'Semprot merata di bawah daun untuk membuat jaringan daun kaku dan tidak disukai kutu.' },
      { jenis: 'Asam Amino Organik', formula: 'Amino Acid 50%', dosis: '2 ml/liter air', cara_aplikasi: 'Membantu pemulihan stres tanaman setelah serangan hama.' }
    ],
    solusi_perawatan: [
      'Pasang perangkap lekat kuning (*Yellow Sticky Trap*) setinggi 30 cm di atas tajuk tanaman.',
      'Lakukan penyemprotan rutin pada sore hari (pukul 16.30) menyasar bagian bawah permukaan daun.',
      'Cabut dan musnahkan tanaman yang sudah terserang virus kuning parah agar tidak menular ke tanaman lain.'
    ],
    pestisida_nabati_organik: [
      'Pestisida Daun Mimba (Azadirachtin) + tembakau rendaman',
      'Larutan sabun kalium / deterjen lembut nabati (5 ml/liter) untuk melarutkan lapisan lilin kutu'
    ]
  },
  'hawar-daun': {
    nama_tanaman: 'Padi / Jagung',
    kategori_diagnosa: 'Penyakit',
    nama_masalah: 'Hawar Daun Bakteri (Kresek / Xanthomonas oryzae)',
    tingkat_keparahan: 'Sedang',
    akurasi: 93.5,
    status_kematangan: 'Belum Cukup Panen',
    estimasi_hari_panen: 45,
    ciri_visual: [
      'Garis basah kehijauan di tepi helaian daun yang cepat berubah menjadi kuning pucat keputihan',
      'Daun menggulung layu dan mengering menyerupai terbakar terik matahari',
      'Keluarnya eksudat cairan bakteri seperti tetesan embun keruh di pagi hari'
    ],
    rekomendasi_pupuk: [
      { jenis: 'Pupuk MOP / KCl', formula: 'K2O 60%', dosis: '75 kg/hektar', cara_aplikasi: 'Tingkatkan dosis kalium untuk memperkuat imunitas jaringan batang dan daun.' },
      { jenis: 'Pupuk Mikro Silika', formula: 'Silikat Aktif', dosis: '2 kg/hektar', cara_aplikasi: 'Tabur bersamaan pemupukan susulan kedua.' }
    ],
    solusi_perawatan: [
      'Keringkan sawah secara berkala (*pengairan berselang / intermitten*), jangan biarkan air tergenang terus menerus.',
      'Kurangi pupuk nitrogen (Urea) hingga 30% saat gejala kresek mulai muncul.',
      'Gunakan benih bersertifikat tahan kresek pada musim tanam berikutnya.'
    ],
    pestisida_nabati_organik: [
      'Bakterisida hayati Pseudomonas fluorescens atau Bacillus subtilis',
      'Ekstrak lengkuas dan sirih merah sebagai bakterisida nabati'
    ]
  },
  'siap-panen-grade-a': {
    nama_tanaman: 'Cabai / Tomat / Bawang',
    kategori_diagnosa: 'Tanaman Sehat',
    nama_masalah: 'Tanaman Prima & Buah Matang Optimal',
    tingkat_keparahan: 'Aman',
    akurasi: 98.7,
    status_kematangan: 'Siap Panen (Super Grade A)',
    estimasi_hari_panen: 0,
    ciri_visual: [
      'Warna buah merah merata 95%, berkilau segar dengan kadar padatan terlarut tinggi',
      'Tingkat kekerasan buah ideal (*firmness* tinggi), tahan simpan 7-10 hari pengiriman',
      'Tangkai buah kokoh dan mudah dilepas saat dipetik'
    ],
    rekomendasi_pupuk: [
      { jenis: 'KNO3 Putih (Post-Harvest Prep)', formula: 'K2O 45% + N 13%', dosis: '2 gram/liter air', cara_aplikasi: 'Semprot ringan 3 hari sebelum petik untuk mempertahankan kilau kulit buah.' }
    ],
    solusi_perawatan: [
      'Lakukan panen pada pagi hari (pukul 06.30 - 09.00) saat suhu masih sejuk dan embun sudah menguap.',
      'Gunakan gunting panen bersih atau petik dengan menyertakan tangkai agar buah tidak mudah busuk.',
      'Simpan hasil panen di keranjang berventilasi di tempat teduh, hindari paparan sinar matahari langsung.'
    ],
    pestisida_nabati_organik: [
      'Hentikan seluruh aplikasi pestisida 5 hari sebelum panen untuk menjamin bebas residu kimiawi.'
    ]
  }
};

export function analyzeCropImage(imageKeyOrDesc: string): VisionAnalysisResult {
  const key = imageKeyOrDesc.toLowerCase();
  let selected = DISEASE_LIBRARY['antraknosa'];

  if (key.includes('kutu') || key.includes('putih') || key.includes('keriting') || key.includes('kebul')) {
    selected = DISEASE_LIBRARY['kutu-kebul'];
  } else if (key.includes('hawar') || key.includes('kresek') || key.includes('kuning') || key.includes('padi')) {
    selected = DISEASE_LIBRARY['hawar-daun'];
  } else if (key.includes('sehat') || key.includes('panen') || key.includes('matang') || key.includes('merah')) {
    selected = DISEASE_LIBRARY['siap-panen-grade-a'];
  }

  return {
    id: 'scan-' + Date.now(),
    ...selected
  };
}
