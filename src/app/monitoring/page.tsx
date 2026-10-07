'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Droplets, Thermometer, MapPin, Sun, CloudRain, ShieldCheck, 
  Wind, CloudSun, Clock, Activity, Sprout, Sparkles, CheckCircle2,
  Calendar, Layers, AlertCircle
} from 'lucide-react';
import { WeatherData, PetaniRecord } from '@/lib/types';
import { REGIONS } from '@/lib/agro_regions';
import { getFallbackWeatherData } from '@/lib/weather';
import { isRecognizedCrop } from '@/lib/crops';

const DEFAULT_BENCHMARK_FARMER: PetaniRecord = {
  id: 'benchmark-brebes',
  nama_petani: 'Lahan Percontohan (Acuan Rekomendasi)',
  daerah: REGIONS[0].nama,
  lat: REGIONS[0].lat,
  lon: REGIONS[0].lon,
  jenis_tanaman: REGIONS[0].komoditas_unggulan[0] || 'Bawang Merah',
  luas_tanah: 10000,
  satuan_luas: 'm²',
  waktu_tanam: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  kontak: '-',
  estimasi_panen: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  umur_hari: 35,
  kelembapan_tanah: REGIONS[0].kelembapan_tanah_default,
  suhu_lingkungan: REGIONS[0].suhu_rata_rata,
  ph_tanah: REGIONS[0].ph_rata_rata,
  status_tanaman: 'Vegetatif Aktif',
  catatan: 'Data benchmark agrometeorologi acuan rekomendasi standar sistem Kertanusa.',
  created_at: new Date().toISOString()
};

interface CropGrowthStage {
  title: string;
  hstRange: string;
  minHst: number;
  maxHst: number;
  warning: string;
}

function getCropStages(cropName: string): CropGrowthStage[] {
  const c = (cropName || '').toLowerCase();

  // Nanas (Madu Subang / Honi)
  if (c.includes('nanas') || c.includes('nenas') || c.includes('pineapple')) {
    return [
      {
        title: 'Adaptasi Bibit Tunas Batang & Perakaran',
        hstRange: 'HST 1 – 60',
        minHst: 1,
        maxHst: 60,
        warning: 'Bibit tunas batang (suckers/slips) beradaptasi dengan bedengan. Jaga drainase bedengan agar pangkal bibit tidak tergenang dan terhindar dari busuk hati Phytophthora.'
      },
      {
        title: 'Pertumbuhan Vegetatif Daun Sukulen',
        hstRange: 'HST 61 – 180',
        minHst: 61,
        maxHst: 180,
        warning: 'Pembentukan roset daun sukulen berlilin. Lakukan pemupukan NPK berimbang rutin untuk memacu penambahan helai daun minimal 35 helai sebelum masa induksi bunga.'
      },
      {
        title: 'Induksi Pembungaan (Forcing)',
        hstRange: 'HST 181 – 220',
        minHst: 181,
        maxHst: 220,
        warning: 'Tanaman siap diinduksi pembungaan buatan (forcing dengan zat etilen/karbit). Kuncup bunga mahkota merah mulai menyembul dari pusat tajuk daun.'
      },
      {
        title: 'Pembesaran Buah Nanas & Mahkota',
        hstRange: 'HST 221 – 260',
        minHst: 221,
        maxHst: 260,
        warning: 'Mata buah nanas membesar padat dan mahkota daun terbentuk kokoh. Berikan pupuk tinggi Kalium (KNO3 Putih) dan lindungi dari terik matahari berlebih (sunscald).'
      },
      {
        title: 'Pematangan Mata Buah & Panen Petik',
        hstRange: 'HST 261 – 285+',
        minHst: 261,
        maxHst: 999,
        warning: 'Sekitar 25%–50% mata nanas di pangkal buah berubah warna kuning keemasan (~285 HST) dengan aroma harum manis brix tinggi. Petik dengan tangkai 2 cm di pagi hari.'
      }
    ];
  }

  // Durian (Montong / Bawor / Musang King) — SIKLUS POHON PENUH DARI BIBIT
  // KOREKSI AGRONOMI: Durian adalah tanaman TAHUNAN (perennial tree crop)
  // Bibit sambung pucuk → panen perdana = 4-6 TAHUN (bukan 4 bulan!)
  // 110-130 HST hanya berlaku untuk siklus bunga → buah pada pohon DEWASA
  if (c.includes('durian') || c.includes('duren')) {
    return [
      {
        title: 'Adaptasi Bibit & Perakaran Awal',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit sambung pucuk bersertifikat ditanam di lubang 60×60×60 cm dengan jarak 10×10 m. Isi 20 kg pupuk kandang matang/lubang. Jaga kelembapan tanah tanpa tergenang. Pasang ajir dan naungan sementara dari pelepah daun.'
      },
      {
        title: 'Pembentukan Tajuk & Cabang Primer',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Bentuk arsitektur tajuk piramida dengan pemangkasan terencana. Buang cabang silang atau tumbuh ke bawah. Berikan NPK 15-15-15 sebanyak 200 g/pohon tiap 3 bulan. Waspadai penggerek batang (Batocera sp.) yang melubangi batang muda.'
      },
      {
        title: 'Pertumbuhan Vegetatif Aktif & Penguatan Batang',
        hstRange: 'Tahun 3 (HST 731 – 1.095)',
        minHst: 731,
        maxHst: 1095,
        warning: 'Pohon tumbuh membesar pesat. Tingkatkan NPK menjadi 500 g/pohon tiap 3 bulan. Tambahkan pupuk mikro Boron dan Zink untuk menyiapkan kualitas bunga. Kurangi nitrogen bertahap di penghujung tahun ke-3 untuk persiapan generatif.'
      },
      {
        title: 'Inisiasi Generatif & Percobaan Bunga Perdana',
        hstRange: 'Tahun 4–5 (HST 1.096 – 1.825)',
        minHst: 1096,
        maxHst: 1825,
        warning: 'Fase kritis menuju berbuah pertama kali. Lakukan stres air (water stress) 3–4 minggu di musim kemarau untuk merangsang inisiasi bunga. Ganti ke pupuk tinggi Kalium dan Fosfat. Kuncup "mata kepiting" akan mulai muncul di dahan utama — tanda pohon siap berbuah!'
      },
      {
        title: 'Pohon Dewasa Produktif — Siklus Buah Rutin',
        hstRange: 'Tahun 5+ (HST 1.826+)',
        minHst: 1826,
        maxHst: 99999,
        warning: 'Pohon durian dewasa berbuah 1–2 kali per tahun secara rutin. Setiap siklus: bunga mekar → buah masak = 110–130 hari. Lakukan penjarangan buah (sisakan 2–3 terbaik per dahan) dan pasang tali pengikat dahan. Pohon produktif dapat bertahan 20–50 tahun.'
      }
    ];
  }

  // Kacang Tanah
  if (c.includes('kacang tanah')) {
    return [
      {
        title: 'Perkecambahan & Vegetatif Awal',
        hstRange: 'HST 1 – 25',
        minHst: 1,
        maxHst: 25,
        warning: 'Bibit bertunas dengan daun majemuk 4 helai. Lakukan penyiangan gulma di sekitar lubang tanam.'
      },
      {
        title: 'Pembungaan & Penusukan Ginofor',
        hstRange: 'HST 26 – 50',
        minHst: 26,
        maxHst: 50,
        warning: 'Bunga kuning mekar dan jarum ginofor menusuk ke dalam tanah. Lakukan pembumbunan tanah gembur di sekitar tanaman.'
      },
      {
        title: 'Pembentukan Polong di Dalam Tanah',
        hstRange: 'HST 51 – 75',
        minHst: 51,
        maxHst: 75,
        warning: 'Polong membesar di bawah tanah. Berikan kalsium/dolomit untuk mencegah polong hampa (pop-pods).'
      },
      {
        title: 'Pematangan Polong & Panen Cabut',
        hstRange: 'HST 76 – 95+',
        minHst: 76,
        maxHst: 999,
        warning: 'Sebagian besar daun menguning dan rontok (~95 HST). Cek sampel: kulit polong keras berserat cokelat. Cabut dan jemur tiris.'
      }
    ];
  }

  // Cabai / Cabe / Lombok
  if (c.includes('cabai') || c.includes('cabe') || c.includes('chili') || c.includes('lombok')) {
    return [
      {
        title: 'Awal Tanam & Adaptasi Akar',
        hstRange: 'HST 1 – 20',
        minHst: 1,
        maxHst: 20,
        warning: 'Bibit cabai masih adaptasi dengan tanah bedengan. Jaga kelembapan tanah tetap gembur dan siram teratur pagi atau sore agar bibit tidak layu stres.'
      },
      {
        title: 'Pertumbuhan Daun & Percabangan',
        hstRange: 'HST 21 – 45',
        minHst: 21,
        maxHst: 45,
        warning: 'Cabang utama dan tunas samping mulai tumbuh rimbun. Pasang ajir bambu penyangga dan berikan pupuk susulan NPK seimbang untuk memperkokoh batang.'
      },
      {
        title: 'Pembungaan & Bakal Buah Pertama',
        hstRange: 'HST 46 – 65',
        minHst: 46,
        maxHst: 65,
        warning: 'Cabai mulai berbunga lebat dan muncul pentil buah. Cukupi unsur Fosfat & Kalium, hindari genangan air berlebih di parit agar bunga tidak rontok.'
      },
      {
        title: 'Pembesaran Buah Cabai',
        hstRange: 'HST 66 – 80',
        minHst: 66,
        maxHst: 80,
        warning: 'Buah cabai memanjang dan berisi padat. Semprot kalsium untuk mencegah penyakit busuk pantat buah dan pasang perangkap lalat buah jika diperlukan.'
      },
      {
        title: 'Pematangan Buah & Panen Petik',
        hstRange: 'HST 81+',
        minHst: 81,
        maxHst: 999,
        warning: 'Cabai mulai memerah tua merata dan siap dipetik berkala. Lakukan pemetikan pada pagi hari saat embun sudah kering agar buah tahan lama disimpan.'
      }
    ];
  }

  // Bawang Merah
  if (c.includes('bawang')) {
    return [
      {
        title: 'Pertunasan & Akar Umbi',
        hstRange: 'HST 1 – 12',
        minHst: 1,
        maxHst: 12,
        warning: 'Tunas daun menyembul dari umbi bibit. Jaga tanah lembap merata, hindari genangan air di parit bedengan agar umbi bibit tidak busuk.'
      },
      {
        title: 'Pertumbuhan Vegetatif Daun',
        hstRange: 'HST 13 – 30',
        minHst: 13,
        maxHst: 30,
        warning: 'Daun bawang tumbuh tegak dan rumpun bertambah. Waktu tepat pemupukan susulan pertama untuk mempercepat pembentukan anakan daun.'
      },
      {
        title: 'Pembentukan & Pembesaran Umbi',
        hstRange: 'HST 31 – 45',
        minHst: 31,
        maxHst: 45,
        warning: 'Pangkal batang mulai menggembung menjadi umbi merah. Berikan pupuk tinggi Kalium (KNO3 Putih) dan kurangi frekuensi siram berlebih.'
      },
      {
        title: 'Pematangan Umbi & Pengisian',
        hstRange: 'HST 46 – 55',
        minHst: 46,
        maxHst: 55,
        warning: 'Umbi bawang membesar padat dan warna ungu merah semakin pekat. Jaga parit bedengan tetap kering agar kualitas umbi maksimal.'
      },
      {
        title: 'Daun Rebah & Siap Panen',
        hstRange: 'HST 56+',
        minHst: 56,
        maxHst: 999,
        warning: 'Sekitar 60%–70% daun sudah rebah lemas dan leher umbi mengecil. Hentikan penyiraman 3 hari sebelum panen cabut umbi.'
      }
    ];
  }

  // Jagung
  if (c.includes('jagung')) {
    return [
      {
        title: 'Perkecambahan & Pertumbuhan Bibit',
        hstRange: 'HST 1 – 15',
        minHst: 1,
        maxHst: 15,
        warning: 'Bibit jagung bertunas dengan daun awal. Jaga tanah tetap lembap dan bersihkan rumput liar di sekitar lubang tanam.'
      },
      {
        title: 'Pertumbuhan Vegetatif Cepat',
        hstRange: 'HST 16 – 35',
        minHst: 16,
        maxHst: 35,
        warning: 'Batang jagung meninggi pesat. Lakukan pembumbunan tanah di sekitar pangkal batang dan berikan pupuk susulan NPK.'
      },
      {
        title: 'Bunga Jantan & Rambut Tongkol',
        hstRange: 'HST 36 – 55',
        minHst: 36,
        maxHst: 55,
        warning: 'Bunga jantan mekar di pucuk dan rambut tongkol keluar. Ini masa kritis air, pastikan tanah tidak kekeringan saat proses penyerbukan.'
      },
      {
        title: 'Pengisian Biji Tongkol Jagung',
        hstRange: 'HST 56 – 70',
        minHst: 56,
        maxHst: 70,
        warning: 'Biji jagung sedang terisi cairan manis atau pati. Cukupi nutrisi agar butiran jagung terisi rapat dan padat hingga ujung tongkol.'
      },
      {
        title: 'Tongkol Padat & Siap Panen',
        hstRange: 'HST 71+',
        minHst: 71,
        maxHst: 999,
        warning: 'Rambut tongkol sudah berwarna cokelat kering. Petik tongkol pagi hari untuk mempertahankan kesegaran dan rasa manis maksimal.'
      }
    ];
  }

  // Tomat
  if (c.includes('tomat')) {
    return [
      {
        title: 'Adaptasi Bibit & Tumbuh Akar',
        hstRange: 'HST 1 – 18',
        minHst: 1,
        maxHst: 18,
        warning: 'Bibit tomat baru dipindah ke bedengan. Jaga kelembapan tanah, pasang ajir bambu sejak dini agar tidak merusak perakaran nantinya.'
      },
      {
        title: 'Pertumbuhan Vegetatif & Ranting',
        hstRange: 'HST 19 – 35',
        minHst: 19,
        maxHst: 35,
        warning: 'Batang bercabang aktif. Lakukan perempelan tunas air (wiwil) yang tidak produktif dan berikan pupuk susulan NPK seimbang.'
      },
      {
        title: 'Pembungaan & Bakal Pentil Buah',
        hstRange: 'HST 36 – 50',
        minHst: 36,
        maxHst: 50,
        warning: 'Bunga kuning mekar dan terbentuk pentil buah. Semprot kalsium-boron untuk mencegah kerontokan bunga dan busuk ujung pantat buah.'
      },
      {
        title: 'Pembesaran Buah Tomat',
        hstRange: 'HST 51 – 65',
        minHst: 51,
        maxHst: 65,
        warning: 'Buah tomat membesar hijau segar. Jaga penyiraman stabil dan merata agar kulit buah tomat tidak retak atau pecah.'
      },
      {
        title: 'Pematangan Buah & Panen Petik',
        hstRange: 'HST 66+',
        minHst: 66,
        maxHst: 999,
        warning: 'Buah mulai bersemu kemerahan merata. Petik bertahap setiap 2–3 hari sekali pada pagi atau sore hari.'
      }
    ];
  }

  // Standar Padi Sawah
  if (c.includes('padi') || c.includes('gabah')) {
    return [
      {
        title: 'Awal Tanam & Tumbuh Akar',
        hstRange: 'HST 1 – 20',
        minHst: 1,
        maxHst: 20,
        warning: 'Akar bibit baru mulai menancap ke tanah sawah. Jaga air sawah macak-macak tipis agar bibit tidak hanyut dan cepat berdiri tegak.'
      },
      {
        title: 'Pembentukan Daun & Anakan',
        hstRange: 'HST 21 – 50',
        minHst: 21,
        maxHst: 50,
        warning: 'Tanaman giat membentuk anakan rumpun baru. Waktu tepat pemupukan susulan pertama agar anakan produktif bertambah banyak.'
      },
      {
        title: 'Bunting & Keluar Malai Bunga',
        hstRange: 'HST 51 – 75',
        minHst: 51,
        maxHst: 75,
        warning: 'Tanaman sedang bunting atau mulai keluar malai bunga. Jaga pasokan air sawah cukup dan jangan sampai kekeringan agar bulir padi tidak hampa.'
      },
      {
        title: 'Pengisian Bulir Padi',
        hstRange: 'HST 76 – 95',
        minHst: 76,
        maxHst: 95,
        warning: 'Bulir sedang terisi cairan sari pati makanan. Berikan pupuk kalium dan jaga air sawah mengalir dangkal agar bulir padi padat bernas.'
      },
      {
        title: 'Padi Menguning & Siap Panen',
        hstRange: 'HST 96+',
        minHst: 96,
        maxHst: 999,
        warning: 'Bulir padi sudah menguning tua merata (85%+). Keringkan saluran parit sawah 7–10 hari sebelum panen agar tanah padat saat pemotongan.'
      }
    ];
  }

  // Apel (Manalagi / Rome Beauty / Anna) — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('apel') || c.includes('apple')) {
    return [
      {
        title: 'Adaptasi Bibit Okulasi di Tanah Andosol Dingin',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit okulasi ditanam di bedengan tanah andosol dataran tinggi (700-1.200 mdpl). Pasang ajir bambu dan jaga kelembapan tanah remah tanpa becek genangan.'
      },
      {
        title: 'Pembentukan Tajuk Terbuka (Open Center) & Cabang Primer',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Bentuk arsitektur kanopi menyerupai cawan terbuka (open center). Pangkas cabang yang saling silang. Berikan pupuk NPK 16-16-16 dosis 250 g/pohon tiap 3 bulan.'
      },
      {
        title: 'Pematangan Dahan & Inisiasi Percobaan Bunga Pertama',
        hstRange: 'Tahun 3 (HST 731 – 1.095)',
        minHst: 731,
        maxHst: 1095,
        warning: 'Dahan pokok mengeras kokoh. Berikan pupuk Fosfat & Kalium tinggi (MKP) dan kurangi air penyiraman untuk memicu pembentukan kuncup bunga perdana.'
      },
      {
        title: 'Pohon Produktif — Panen Perdana & Siklus Rompes Daun Rutin',
        hstRange: 'Tahun 4+ (HST 1.096+)',
        minHst: 1096,
        maxHst: 99999,
        warning: 'Pohon apel berbuah produktif puluhan tahun. Pada pohon dewasa, pemangkasan & perontokan daun serentak (defoliasi buatan) memicu bunga mekar serempak dengan siklus mekar → petik masak 120–140 hari.'
      }
    ];
  }

  // Jeruk (Siam / Keprok / Lemon) — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('jeruk') || c.includes('citrus') || c.includes('lemon')) {
    return [
      {
        title: 'Adaptasi Bibit Okulasi Bebas CVPD di Lapangan',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Tanam bibit okulasi bebas CVPD bersertifikat di lubang 60×60×60 cm berjarak 5×5 m. Berikan pupuk kandang matang 15 kg/lubang. Lindungi dari kutu loncat Diaphorina citri.'
      },
      {
        title: 'Pembentukan Tajuk 1-3-9 & Pemangkasan Cabang Air',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Bentuk percabangan tajuk 1-3-9 secara teratur. Pangkas tunas air liar di bagian tengah kanopi agar sinar matahari masuk leluasa. Berikan NPK berimbang + unsur mikro Zn dan Fe.'
      },
      {
        title: 'Inisiasi Bunga Putih Harum & Panen Buah Pertama',
        hstRange: 'Tahun 2.5–3 (HST 731 – 900)',
        minHst: 731,
        maxHst: 900,
        warning: 'Bunga putih harum mekar di ujung ranting. Ini masa paling peka stres air. Siram stabil di parit lingkar luar tajuk. Panen buah perdana tiba di umur 2.5–3 tahun (~900 HST).'
      },
      {
        title: 'Pohon Dewasa Produktif — Panen Rutin 1–2 Kali Setahun',
        hstRange: 'Tahun 3+ (HST 901+)',
        minHst: 901,
        maxHst: 99999,
        warning: 'Pohon jeruk dewasa berbuah rutin tahunan. Siklus bunga mekar → petik masak sari manis: 210–240 hari. Berikan Kalium Sulfat ZK untuk meningkatkan kemanisan dan mencegah buah pecah.'
      }
    ];
  }

  // Mangga (Harum Manis / Gedong Gincu) — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('mangga') || c.includes('mango')) {
    return [
      {
        title: 'Adaptasi Bibit Okulasi & Bentuk Tajuk Y',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit okulasi unggul ditanam di lubang 60×60×60 cm berpupuk kandang 20 kg. Jaga kelembapan tanah, pasang ajir penyangga bambu, dan potong pucuk pada ketinggian 80 cm untuk merangsang 3 cabang primer seimbang.'
      },
      {
        title: 'Pembentukan Percabangan 1-3-9',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Pangkas masing-masing cabang primer agar memunculkan 3 cabang sekunder (pola 1-3-9). Berikan NPK 15-15-15 sebanyak 250 g/pohon tiap 3 bulan. Waspadai hama wereng mangga (Idiocerus) dan penggerek pucuk.'
      },
      {
        title: 'Penguatan Dahan & Inisiasi Malai Bunga Pertama',
        hstRange: 'Tahun 3 (HST 731 – 1.095)',
        minHst: 731,
        maxHst: 1095,
        warning: 'Dahan mengeras kokoh. Menjelang musim kemarau, kurangi penyiraman (water stress 1 bulan) dan aplikasikan pupuk tinggi Fosfat & Kalium (MKP) untuk merangsang munculnya malai bunga perdana.'
      },
      {
        title: 'Pohon Produktif — Panen Perdana & Rutin Tahunan',
        hstRange: 'Tahun 4+ (HST 1.096+)',
        minHst: 1096,
        maxHst: 99999,
        warning: 'Pohon mangga berbuah rutin tiap tahun (September-November). Siklus bunga mekar → petik masak: 110–130 hari. Bungkus buah dengan kertas semen/karung saat pentil sebesar telur ayam untuk mencegah sengatan lalat buah.'
      }
    ];
  }

  // Alpukat (Miki / Aligator) — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('alpukat') || c.includes('avocado')) {
    return [
      {
        title: 'Adaptasi Bibit Sambung Pucuk & Perakaran',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit sambung pucuk ditanam pada jarak tanam 6×6 m. Berikan naungan sementara dan pupuk organik matang. Jaga drainase tanah andosol/latosol agar akar tidak terendam air.'
      },
      {
        title: 'Pemangkasan Pucuk (Topping) & Percabangan Mendatar',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Lakukan topping pucuk utama setinggi 1 meter untuk memicu cabang mendatar yang produktif. Berikan NPK 16-16-16 dosis 300 g/pohon tiap 3 bulan. Waspadai ulat kipat dan ulat buah.'
      },
      {
        title: 'Pematangan Cabang Produktif & Bunga Perdana',
        hstRange: 'Tahun 3 (HST 731 – 1.095)',
        minHst: 731,
        maxHst: 1095,
        warning: 'Pohon siap memasuki fase generatif. Berikan pupuk Kalium & Boron tinggi menjelang awal musim kemarau. Bunga kuning kehijauan mulai mekar di ketiak daun.'
      },
      {
        title: 'Pohon Dewasa Produktif — Panen Perdana & Rutin',
        hstRange: 'Tahun 4+ (HST 1.096+)',
        minHst: 1096,
        maxHst: 99999,
        warning: 'Pohon berbuah produktif puluhan tahun. Siklus bunga mekar → petik tua: 180–210 hari (6–7 bulan). Petik buah saat kulit berubah agak kusam dan bila diguncang biji terdengar berdetak lembut.'
      }
    ];
  }

  // Pisang (Cavendish / Raja)
  if (c.includes('pisang')) {
    return [
      {
        title: 'Adaptasi Anakan & Tunas Daun Pertama',
        hstRange: 'HST 1 – 60',
        minHst: 1,
        maxHst: 60,
        warning: 'Anakan bibit ditanam di lubang 50×50×50 cm berjarak 2.5×2.5 m. Pupuk kandang matang 15 kg/lubang. Jaga kelembapan tanah alluvial tanpa becek genangan.'
      },
      {
        title: 'Pertumbuhan Batang Semu & Daun Rimbun',
        hstRange: 'HST 61 – 190',
        minHst: 61,
        maxHst: 190,
        warning: 'Batang semu membesar kokoh. Lakukan penyiangan gulma dan pangkas daun tua yang mengering. Berikan pupuk susulan NPK 15-15-15 dan Urea.'
      },
      {
        title: 'Muncul Jantung Pisang (Ontong) & Mekar Sisir',
        hstRange: 'HST 191 – 230',
        minHst: 191,
        maxHst: 230,
        warning: 'Jantung pisang menyembul dan kelopak membuka menjadi sisir buah. Potong sisa jantung pisang 1–2 jengkal di bawah sisir terakhir agar pengisian buah maksimal.'
      },
      {
        title: 'Pembesaran Buah & Pembungkusan Tandan (Brongsong)',
        hstRange: 'HST 231 – 280',
        minHst: 231,
        maxHst: 280,
        warning: 'Bungkus tandan dengan plastik brongsong biru berpori untuk mencegah luka lalat buah dan gesekan daun. Pasang bambu penopang pohon agar tidak rebah.'
      },
      {
        title: 'Pematangan Jari Pisang & Panen Tandan',
        hstRange: 'HST 281 – 300+',
        minHst: 281,
        maxHst: 999,
        warning: 'Sudut lingkar jari pisang membulat dan daun bendera mulai menguning (~300 HST). Tebang pohon setengah tinggi batang dan tampung tandan hati-hati.'
      }
    ];
  }

  // Pepaya (Calina / California)
  if (c.includes('pepaya') || c.includes('papaya')) {
    return [
      {
        title: 'Adaptasi Bibit Semaian di Guludan Tinggi',
        hstRange: 'HST 1 – 45',
        minHst: 1,
        maxHst: 45,
        warning: 'Bibit semaian dipindah ke guludan tinggi. Perakaran pepaya sangat peka genangan air; pastikan saluran drainase lancar untuk mencegah busuk pangkal batang Phytophthora.'
      },
      {
        title: 'Vegetatif Aktif & Seleksi Bunga Hermaprodit',
        hstRange: 'HST 46 – 100',
        minHst: 46,
        maxHst: 100,
        warning: 'Bunga pertama muncul. Pilih tanaman hermaprodit (bunga sempurna bentuk lonjong) untuk kualitas buah lonjong super Grade A. Berikan pupuk NPK berimbang.'
      },
      {
        title: 'Pembentukan Buah Deret Batang & Penjarangan',
        hstRange: 'HST 101 – 180',
        minHst: 101,
        maxHst: 180,
        warning: 'Buah berderet rapat di batang utama. Buang buah cacat atau saling berhimpitan agar buah lain berkembang sempurna. Berikan pupuk tinggi Kalium (KNO3 Putih).'
      },
      {
        title: 'Pematangan Semburat Kuning & Panen Rutin',
        hstRange: 'HST 181 – 240+',
        minHst: 181,
        maxHst: 999,
        warning: 'Ujung bawah buah mulai bersemu semburat kuning 1–2 garis (~240 HST). Panen diputar dengan tangan di pagi hari. Pohon panen rutin tiap 5–7 hari selama 2–3 tahun.'
      }
    ];
  }

  // Buah Naga Merah
  if (c.includes('naga')) {
    return [
      {
        title: 'Adaptasi Stek & Perambatan Tiang Panjat',
        hstRange: 'HST 1 – 90',
        minHst: 1,
        maxHst: 90,
        warning: 'Ikat sulur stek batang tua ke tiang panjat beton/kayu kuat. Pelihara 1–2 cabang primer tegak ke atas dan bersihkan tunas air samping yang tidak perlu.'
      },
      {
        title: 'Pembentukan Mahkota Tajuk di Ban Penyangga',
        hstRange: 'HST 91 – 220',
        minHst: 91,
        maxHst: 220,
        warning: 'Potong pucuk saat mencapai ban penyangga atas agar membentuk cabang menjuntai ke bawah yang produktif. Berikan pupuk kandang matang dan NPK berimbang.'
      },
      {
        title: 'Inisiasi Kuncup Bunga Malam (Night Bloom)',
        hstRange: 'HST 221 – 290',
        minHst: 221,
        maxHst: 290,
        warning: 'Bunga raksasa putih harum mekar di malam hari. Bantu penyerbukan lebah atau kuas manual pada pagi subuh. Berikan pupuk Fosfat & Kalium tinggi.'
      },
      {
        title: 'Pematangan Kulit Merah & Panen Petik',
        hstRange: 'HST 291 – 330+',
        minHst: 291,
        maxHst: 999,
        warning: 'Kulit buah berubah warna merah marun mengkilap dan sisik buah melunak lentur (~330 HST). Gunting tangkai buah dengan gunting tajam di pagi hari.'
      }
    ];
  }

  // Anggur
  if (c.includes('anggur') || c.includes('grape')) {
    return [
      {
        title: 'Pertumbuhan Batang Primer & Sekunder di Trellis',
        hstRange: 'HST 1 – 150',
        minHst: 1,
        maxHst: 150,
        warning: 'Rambatkan batang utama ke para-para atap UV. Pasang ajir dan pupuk NPK seimbang + asam humat agar perakaran berkembang kuat.'
      },
      {
        title: 'Pembentukan Cabang Tersier & Pematangan Kayu',
        hstRange: 'HST 151 – 270',
        minHst: 151,
        maxHst: 270,
        warning: 'Rawat cabang tersier tempat bakal bunga. Lakukan perompesan daun air dan tunggu cabang tersier berubah warna cokelat tua berkayu (lignifikasi).'
      },
      {
        title: 'Pemangkasan Pembuahan (Pruning) & Bunga Mekar',
        hstRange: 'HST 271 – 305',
        minHst: 271,
        maxHst: 305,
        warning: 'Lakukan potong cabang tersier (pruning) di mata tunas gemuk (bud 4–7). Malai bunga brokoli akan menyembul serempak dalam 10–14 hari setelah pangkas.'
      },
      {
        title: 'Penjarangan Beri & Panen Dompolan Masak',
        hstRange: 'HST 306 – 330+',
        minHst: 306,
        maxHst: 999,
        warning: 'Gunting beri yang terlalu rapat saat seukuran kacang tanah. Petik dompolan saat kadar manis brix mencapai >18 brix dan aroma harum khas (~330 HST).'
      }
    ];
  }

  // Semangka
  if (c.includes('semangka')) {
    return [
      {
        title: 'Vegetatif Awal & Perambatan Sulur',
        hstRange: 'HST 1 – 25',
        minHst: 1,
        maxHst: 25,
        warning: 'Bibit bertunas di atas mulsa/jerami. Atur arah sulur utama agar tidak saling tumpang tindih. Berikan pupuk starter NPK seimbang.'
      },
      {
        title: 'Pembungaan & Polinasi Kawin Silang',
        hstRange: 'HST 26 – 40',
        minHst: 26,
        maxHst: 40,
        warning: 'Bunga jantan dan betina mekar. Lakukan perkawinan buatan pada bunga betina ruas ke-12 s/d 16 pada pukul 06.00–09.00 pagi untuk jaminan jadi buah.'
      },
      {
        title: 'Pembesaran Buah & Pembalikan Posisi',
        hstRange: 'HST 41 – 52',
        minHst: 41,
        maxHst: 52,
        warning: 'Pilih 1–2 buah terbaik per tanaman dan buang calon buah lainnya. Balik posisi buah secara berkala agar warna kulit dan bentuk bulat merata.'
      },
      {
        title: 'Pematangan Buah & Panen Petik',
        hstRange: 'HST 53 – 60+',
        minHst: 53,
        maxHst: 999,
        warning: 'Sungkup tangkai buah mengering dan sulur depan buah mati kaku (~60 HST). Bunyi buah terdengar berat saat ditepuk. Panen siang hari saat kering.'
      }
    ];
  }

  // Melon
  if (c.includes('melon')) {
    return [
      {
        title: 'Vegetatif & Pengikatan Tali Ajir',
        hstRange: 'HST 1 – 25',
        minHst: 1,
        maxHst: 25,
        warning: 'Rambatkan batang utama melon ke tali ajir vertikal. Buang cabang tunas air di ruas 1–8 agar nutrisi terkonsentrasi ke tajuk atas.'
      },
      {
        title: 'Polinasi Bunga Betina (Ruas 9–12)',
        hstRange: 'HST 26 – 38',
        minHst: 26,
        maxHst: 38,
        warning: 'Lakukan penyerbukan bunga betina di ruas 9 s/d 12. Gantung bakal buah melon terpilih menggunakan tali rafia agar tangkai tidak patah memikul beban.'
      },
      {
        title: 'Pembesaran Buah & Pembentukan Jaring (Netting)',
        hstRange: 'HST 39 – 55',
        minHst: 39,
        maxHst: 55,
        warning: 'Jaring (net) kulit buah melon mulai terbentuk rapat. Berikan pupuk Kalium Sulfat tinggi dan kurangi nitrogen agar jaring tebal dan buah manis.'
      },
      {
        title: 'Pematangan Aroma & Panen Gunting',
        hstRange: 'HST 56 – 65+',
        minHst: 56,
        maxHst: 999,
        warning: 'Retakan cincin di tangkai buah sempurna dan tercium aroma wangi harum melon khas (~65 HST). Gunting tangkai buah membentuk huruf T.'
      }
    ];
  }

  // Kopi (Arabika / Robusta) — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('kopi')) {
    return [
      {
        title: 'Adaptasi Bibit di Bawah Naungan Sementara',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit kopi ditanam di bawah naungan pohon lamtoro/moghania pada jarak 2.5×2.5 m. Pupuk kandang matang 10 kg/lubang. Lindungi dari sengatan matahari terik langsung.'
      },
      {
        title: 'Pembentukan Cabang Primer & Pemangkasan Wiwil',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Pangkas pucuk (topping) setinggi 1.6–1.8 m untuk menahan tinggi pohon dan memacu cabang primer mendatar. Buang tunas air (wiwil) liar yang tumbuh tegak lurus.'
      },
      {
        title: 'Inisiasi Bunga Bintang Putih & Panen Perdana',
        hstRange: 'Tahun 3 (HST 731 – 900)',
        minHst: 731,
        maxHst: 900,
        warning: 'Bunga putih harum mekar serempak setelah hujan pertama pasca kemarau. Calon ceri kopi terbentuk. Berikan pupuk Kalium & Fosfat untuk panen buah perdana (~900 HST).'
      },
      {
        title: 'Pohon Dewasa — Panen Raya Petik Merah 100%',
        hstRange: 'Tahun 3+ (HST 901+)',
        minHst: 901,
        maxHst: 99999,
        warning: 'Pohon kopi dewasa panen rutin tiap musim raya (Mei-Agustus). Siklus bunga mekar → ceri merah matang: 210–240 hari. Hanya petik ceri yang 100% merah matang pohon.'
      }
    ];
  }

  // Cokelat / Kakao — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('kakao') || c.includes('cokelat')) {
    return [
      {
        title: 'Adaptasi Bibit Sambung di Bawah Naungan',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit klon unggul (MCC 02/Sulawesi) ditanam di bawah naungan kelapa/lamtoro berjarak 3×3 m. Jaga tanah lembap kaya serasah organik.'
      },
      {
        title: 'Pembentukan Tajuk Jorket & Cabang Kipas',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Atur 3–4 cabang jorket utama yang kokoh. Pangkas cabang cacing dan tunas air berkala agar sinar matahari 60% menembus tajuk. Pupuk NPK berimbang tiap 3 bulan.'
      },
      {
        title: 'Bunga Batang Kauliflori & Panen Perdana',
        hstRange: 'Tahun 2.5–3 (HST 731 – 800)',
        minHst: 731,
        maxHst: 800,
        warning: 'Bunga mekar di bantalan batang utama (kauliflori). Pentil buah cherelle terbentuk. Lakukan sarungisasi plastik (kondomisasi) untuk mencegah hama PBK (~800 HST).'
      },
      {
        title: 'Pohon Dewasa Produktif — Panen Rutin',
        hstRange: 'Tahun 3+ (HST 801+)',
        minHst: 801,
        maxHst: 99999,
        warning: 'Pohon kakao berbuah sepanjang tahun dengan puncak panen raya. Siklus bunga → polong masak: 150–180 hari. Petik polong saat alur kulit berubah warna kuning penuh.'
      }
    ];
  }

  // Kelapa Sawit — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('sawit')) {
    return [
      {
        title: 'TBM 1: Adaptasi Bibit & Pengendalian Gulma',
        hstRange: 'Tahun 1 (HST 1 – 365)',
        minHst: 1,
        maxHst: 365,
        warning: 'Bibit sawit bersertifikat PPKS ditanam sistem mata lima 9×9×9 m di lubang berpupuk fosfat/dolomit. Tanam Mucuna bracteata (kacangan penutup tanah) untuk menahan erosi.'
      },
      {
        title: 'TBM 2: Kastrasi Bunga Pasir & Pembentukan Pelepah',
        hstRange: 'Tahun 2 (HST 366 – 730)',
        minHst: 366,
        maxHst: 730,
        warning: 'Lakukan kastrasi (buang semua bunga pasir jantan & betina) pada umur 14–20 bulan agar nutrisi pohon terkonsentrasi penuh untuk pembesaran batang dan pelepah daun.'
      },
      {
        title: 'TBM 3: Penghentian Kastrasi & Persiapan Buah Perdana',
        hstRange: 'Tahun 3 (HST 731 – 1.095)',
        minHst: 731,
        maxHst: 1095,
        warning: 'Hentikan kastrasi di umur 24–28 bulan. Tandan buah segar (TBS) perdana mulai berkembang. Panen buah pasir perdana di tahun ke-3 (~1.095–1.200 HST).'
      },
      {
        title: 'Tanaman Menghasilkan (TM) Penuh — Panen Rutin',
        hstRange: 'Tahun 4+ (HST 1.096+)',
        minHst: 1096,
        maxHst: 99999,
        warning: 'Pohon sawit dewasa menghasilkan TBS secara rutin tiap 10–14 hari. Panen TBS tepat saat minimal 5 brondolan lepas jatuh ke piringan pohon.'
      }
    ];
  }

  // Karet — SIKLUS POHON PENUH DARI BIBIT
  if (c.includes('karet')) {
    return [
      {
        title: 'TBM 1–2: Adaptasi Okulasi & Pembentukan Batang Lurus',
        hstRange: 'Tahun 1–2 (HST 1 – 730)',
        minHst: 1,
        maxHst: 730,
        warning: 'Bibit okulasi klon PB 260/IRR ditanam berjarak 6×3 m. Tunas okulasi dijaga tumbuh tegak lurus tunggal tanpa cabang hingga ketinggian 2.5–3 meter.'
      },
      {
        title: 'TBM 3–4: Pemeliharaan Tajuk & Pemupukan Berkala',
        hstRange: 'Tahun 3–4 (HST 731 – 1.460)',
        minHst: 731,
        maxHst: 1460,
        warning: 'Cabang tajuk atas mulai rimbun. Pupuk NPK berimbang + kieserit tiap 6 bulan. Waspadai penyakit jamur akar putih (Rigidoporus microporus).'
      },
      {
        title: 'Matang Sadap & Persiapan Buka Sadap Perdana',
        hstRange: 'Tahun 5 (HST 1.461 – 1.825)',
        minHst: 1461,
        maxHst: 1825,
        warning: 'Ukur lingkar lilit batang setinggi 130 cm dari pertautan okulasi. Pohon siap buka sadap perdana saat lilit batang mencapai minimal 45 cm (~1.825 HST).'
      },
      {
        title: 'Pohon Sadap Produktif (TM) — Sadap Pagi Buta',
        hstRange: 'Tahun 5+ (HST 1.826+)',
        minHst: 1826,
        maxHst: 99999,
        warning: 'Sadap lateks dilakukan rutin tiap 2–3 hari sekali pada pukul 05.00–07.00 pagi dengan sudut kemiringan irisan 30 derajat dari kiri atas ke kanan bawah.'
      }
    ];
  }

  // Kentang (Dataran Tinggi)
  if (c.includes('kentang') || c.includes('potato')) {
    return [
      {
        title: 'Pertunasan Umbi Bibit & Tumbuh Akar',
        hstRange: 'HST 1 – 20',
        minHst: 1,
        maxHst: 20,
        warning: 'Tunas bibit mulai menyembul dari tanah guludan. Jaga kelembapan tanah andosol tetap gembur dan pasang mulsa jika di lahan terbuka.'
      },
      {
        title: 'Pertumbuhan Daun & Pembumbunan I',
        hstRange: 'HST 21 – 40',
        minHst: 21,
        maxHst: 40,
        warning: 'Tajuk tanaman rimbun hijau. Lakukan pembumbunan tanah guludan pertama dan berikan pupuk susulan NPK agar stolon terbentuk banyak.'
      },
      {
        title: 'Inisiasi Pembentukan Umbi (Tuberization)',
        hstRange: 'HST 41 – 60',
        minHst: 41,
        maxHst: 60,
        warning: 'Ujung stolon membengkak menjadi calon umbi kentang. Kebutuhan air meningkat stabil. Waspadai embun bulu dan busuk daun Phytophthora infestans saat cuaca lembap kabut.'
      },
      {
        title: 'Pembesaran Umbi & Pengisian Pati',
        hstRange: 'HST 61 – 85',
        minHst: 61,
        maxHst: 85,
        warning: 'Umbi kentang membesar pesat di dalam tanah. Lakukan pembumbunan kedua agar umbi tidak terpapar sinar matahari (mencegah racun solanin/kulit menghijau). Berikan pupuk Kalium tinggi.'
      },
      {
        title: 'Pengerasan Kulit Umbi & Panen Gali',
        hstRange: 'HST 86+',
        minHst: 86,
        maxHst: 999,
        warning: 'Daun dan batang mulai menguning rebah alami. Potong tajuk atas (dehaulming) 7–10 hari sebelum panen gali agar kulit umbi tebal, kuat, dan tidak lecet saat digali.'
      }
    ];
  }

  // Tanaman Umum Lainnya
  return [
    {
      title: 'Awal Tanam & Tumbuh Akar',
      hstRange: 'HST 1 – 20',
      minHst: 1,
      maxHst: 20,
      warning: 'Akar bibit baru menancap ke tanah. Jaga kelembapan tanah tetap stabil agar tanaman lekas tumbuh subur dan kokoh berdiri.'
    },
    {
      title: 'Pertumbuhan Vegetatif & Daun',
      hstRange: 'HST 21 – 45',
      minHst: 21,
      maxHst: 45,
      warning: 'Tanaman sedang giat membentuk percabangan dan daun baru. Waktu tepat pemupukan susulan pertama untuk memacu pertumbuhan.'
    },
    {
      title: 'Pembungaan & Bakal Buah / Umbi',
      hstRange: 'HST 46 – 65',
      minHst: 46,
      maxHst: 65,
      warning: 'Tanaman mulai berbunga atau membentuk bakal buah/umbi. Cukupi pasokan unsur Fosfat dan Kalium serta jaga air tanah stabil.'
    },
    {
      title: 'Pembesaran Buah / Pengisian Hasil',
      hstRange: 'HST 66 – 80',
      minHst: 66,
      maxHst: 80,
      warning: 'Hasil panen sedang dalam fase pembesaran dan pemadatan isi. Lindungi tanaman dari serangan hama perusak buah.'
    },
    {
      title: 'Pematangan Hasil & Siap Panen',
      hstRange: 'HST 81+',
      minHst: 81,
      maxHst: 999,
      warning: 'Tanaman telah memasuki fase masak fisiologis penuh dan siap dipanen untuk mendapatkan kualitas hasil terbaik.'
    }
  ];
}

interface CropCareGuide {
  komoditasClean: string;
  category: 'Buah' | 'Sayuran & Bumbu' | 'Tanaman Pangan' | 'Umum';
  siramDesc: string;
  pupukDesc: string;
  pupukNamaKhusus: string;
  userLuasLabel: string;
  npkKg: number;
  komposKg: number;
  khususKg: number;
  pestWarning: string;
  tipsFase: string;
}

function getCropCareGuide(cropName: string, luasTanah: number, satuanLuas: string, weather: WeatherData | null, hst: number): CropCareGuide {
  const c = (cropName || '').toLowerCase();
  const luasM2 = satuanLuas === 'hektar' ? Number(luasTanah) * 10000 : Number(luasTanah) || 1000;
  const areaHa = luasM2 / 10000;
  const userLuasLabel = `${luasTanah || 1000} ${satuanLuas || 'm²'}`;

  const isDry = (weather?.kelembapan_tanah ?? 55) < 50;
  const isWet = (weather?.kelembapan_tanah ?? 55) > 80;

  // 0A. NANAS
  if (c.includes('nanas') || c.includes('nenas') || c.includes('pineapple')) {
    const isVegetatif = hst <= 180;
    const isInduksi = hst > 180 && hst <= 220;

    const siramDesc = isWet
      ? 'Tanah bedengan nanas tergenang air! Segera perdalam parit drainase keliling. Nanas sangat rentan penyakit busuk hati (heart rot Phytophthora nicotianae) jika perakaran tergenang lebih dari 24 jam.'
      : isDry
      ? 'Tanah bedengan nanas agak kering. Berikan penyiraman secukupnya di parit bedengan seluas ' + userLuasLabel + '. Nanas memiliki daun sukulen berlilin hemat air, namun butuh air saat pembesaran buah.'
      : 'Kelembapan tanah bedengan nanas sangat prima (gembur berpasir). Tanaman menyerap hara dengan baik tanpa risiko busuk akar.';

    const pupukDesc = isVegetatif
      ? 'Fase Vegetatif Roset: Berikan pupuk NPK 15-15-15 dan kompos matang untuk memacu pembentukan minimal 35 helai daun aktif sebelum fase induksi pembungaan.'
      : isInduksi
      ? 'Fase Induksi Bunga: Lakukan forcing etilen/kalsium karbit pada titik tumbuh di sore hari dan berikan pupuk Kalsium-Boron untuk memperkokoh tangkai kuncup bunga nanas.'
      : 'Fase Pembesaran & Pematangan: Tingkatkan Kalium tinggi (KNO3 Putih / Kalium Sulfat ZK) untuk menaikkan kadar brix rasa manis madu, aroma harum, dan bobot buah nanas.';

    const npkKg = Math.max(1, Math.round(280 * areaHa));
    const komposKg = Math.max(5, Math.round(1500 * areaHa));
    const khususKg = Math.max(1, Math.round(45 * areaHa));

    return {
      komoditasClean: 'Tanaman Nanas (Madu Subang / Honi)',
      category: 'Buah',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: isInduksi ? 'Zat Induksi Bunga & Kalsium' : 'KNO3 Putih (Kalium Tinggi)',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai kutu putih nanas (Dysmicoccus brevipes) yang memicu penyakit layu mealybug wilt, serta busuk hati/pangkal Phytophthora saat drainase kurang lancar.',
      tipsFase: 'Tutup bagian atas buah nanas dengan daun pembungkus saat sinar matahari sangat terik untuk mencegah luka gosong terbakar matahari (sunscald).'
    };
  }

  // 0B. DURIAN — Tanaman Tahunan (Perennial Tree Crop)
  // Bibit sambung pucuk → panen perdana = 4-6 tahun
  // Siklus bunga → buah (untuk pohon dewasa) = 110-130 HST
  if (c.includes('durian') || c.includes('duren')) {
    const isTahunPertama = hst <= 365;
    const isTahunKedua = hst > 365 && hst <= 730;
    const isTahunKetiga = hst > 730 && hst <= 1095;
    const isPreGeneratif = hst > 1095 && hst <= 1825;
    const isPohonDewasa = hst > 1825;

    const siramDesc = isWet
      ? 'Lahan kebun durian becek tergenang! Buat saluran parit pembuangan air di luar piringan tajuk. Genangan air memicu jamur mematikan kanker batang Phytophthora palmivora.'
      : isDry
      ? 'Tanah piringan pohon durian kering. Alirkan irigasi piringan di bawah kanopi luar tajuk seluas ' + userLuasLabel + '. Pohon durian butuh air cukup untuk pertumbuhan vegetatif dan pengisian buah.'
      : 'Kondisi air tanah kebun durian sangat pas gembur berdrainase prima. Perakaran menyerap nutrisi hara secara optimal.';

    const pupukDesc = isTahunPertama
      ? 'Tahun 1 — Adaptasi Bibit: Berikan pupuk organik (pupuk kandang + kompos) di piringan lubang tanam. Mulai pupuk NPK ringan 50-100 g/pohon/bulan untuk memacu pertumbuhan akar & tunas daun.'
      : isTahunKedua
      ? 'Tahun 2 — Pembentukan Tajuk: Berikan NPK 15-15-15 sebanyak 200 g/pohon tiap 3 bulan. Tambahkan Kalsium-Boron untuk arsitektur dahan yang kuat. Pangkas cabang tumbuh ke dalam/bawah.'
      : isTahunKetiga
      ? 'Tahun 3 — Vegetatif Aktif: Naikkan dosis NPK menjadi 500 g/pohon/3 bulan. Mulai kurangi nitrogen (N) secara bertahap. Tambah pupuk Kalium dan Fosfat untuk persiapan fase generatif berbunga.'
      : isPreGeneratif
      ? 'Tahun 4–5 — Induksi Generatif: STOP pemupukan N tinggi. Lakukan stres air 3–4 minggu kemarau untuk memaksa inisiasi bunga. Berikan Kalium Sulfat ZK + MKP (Mono Kalium Fosfat) untuk kuncup bunga berkualitas.'
      : 'Pohon Dewasa Produktif: Fase pembesaran & pengisian daging buah — berikan Kalium tinggi (Kalium Sulfat ZK / KNO3 Putih) di lingkar tajuk agar daging buah durian pulen, manis, dan bertekstur mentega.';

    const npkKg = Math.max(1, Math.round((isPohonDewasa ? 300 : isTahunPertama ? 80 : 200) * areaHa));
    const komposKg = Math.max(5, Math.round(2000 * areaHa));
    const khususKg = Math.max(1, Math.round((isPohonDewasa ? 50 : 30) * areaHa));

    return {
      komoditasClean: 'Pohon Durian (Montong / Bawor / Musang King)',
      category: 'Buah',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: isPohonDewasa || isPreGeneratif ? 'Kalium Sulfat (ZK) / MKP' : isTahunPertama ? 'Pupuk Kandang + Kompos' : 'NPK 15-15-15 + Kalsium',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai ulat penggerek buah (Conogethes punctiferalis), penggerek batang (Batocera sp.), dan jamur kanker batang Phytophthora palmivora. Durian adalah investasi jangka panjang (4-6 tahun hingga panen perdana).',
      tipsFase: isTahunPertama
        ? 'Pastikan bibit yang ditanam adalah bibit SAMBUNG PUCUK (okulasi) bersertifikat dari varietas unggul (Montong / Bawor / Musang King). Bibit dari biji bisa membutuhkan 8-15 tahun untuk berbuah!'
        : isPohonDewasa
        ? 'Pasang tali pengikat dahan dan buah ke cabang utama untuk mencegah dahan patah atau buah durian jatuh prematur membentur tanah.'
        : 'Durian adalah tanaman investasi jangka panjang. Perawatan konsisten di tahun-tahun vegetatif menentukan produktivitas puluhan tahun ke depan.'
    };
  }

  // 1. APEL
  if (c.includes('apel') || c.includes('apple')) {
    const isVegetatif = hst <= 40;
    const isBungaPentil = hst > 40 && hst <= 70;

    const siramDesc = isWet
      ? 'Tanah kebun apel terlalu basah dan tergenang. Buka saluran parit drainase agar lingkar tajuk tidak becek, untuk mencegah pembusukan leher akar dan jamur upas.'
      : isDry
      ? 'Tanah kebun apel kering. Siram pada area piringan lingkar tajuk luar perakaran apel seluas ' + userLuasLabel + '. Hindari menyemprot batang utama langsung.'
      : 'Kelembapan tanah kebun apel sangat ideal (gembur berpori). Perakaran aktif menyerap nutrisi hara tanpa risiko stres genangan air.';

    const pupukDesc = isVegetatif
      ? 'Fase Tunas & Bunga: Berikan NPK 16-16-16 + pupuk kandang matang di piringan tajuk terluar, ditambah Kalsium-Boron agar tangkai bunga kokoh.'
      : isBungaPentil
      ? 'Fase Pentil Buah: Lakukan penjarangan pentil (sisakan 1–2 buah per dompolan) dan aplikasikan pupuk Kalsium Nitrat + MKP untuk mempertebal dinding sel buah.'
      : 'Fase Pembesaran & Pematangan: Tingkatkan Kalium (KNO3 Putih / Kalium Sulfat ZK) untuk menaikkan kadar gula manis (Brix), aroma harum, dan warna semburat merah/kuning.';

    const npkKg = Math.max(1, Math.round(250 * areaHa));
    const komposKg = Math.max(5, Math.round(1500 * areaHa));
    const khususKg = Math.max(1, Math.round(50 * areaHa));

    return {
      komoditasClean: 'Pohon Apel (Manalagi / Rome Beauty)',
      category: 'Buah',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: isVegetatif ? 'Kalsium-Boron' : 'KNO3 Putih / MKP',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai serangan lalat buah (Bactrocera) yang menyengat pentil buah, serta embun tepung (Podosphaera) dan bercak daun Marssonina saat cuaca lembap kabut.',
      tipsFase: 'Lakukan pembungkusan buah apel (fruit bagging) dengan kertas/plastik khusus saat buah sebesar bola pingpong untuk mencegah cacat kulit.'
    };
  }

  // 2. JERUK
  if (c.includes('jeruk') || c.includes('citrus') || c.includes('lemon')) {
    const siramDesc = isWet
      ? 'Tanah kebun jeruk tergenang. Segera buat parit keliling di luar lingkar tajuk agar akar tidak terendam air, yang memicu jamur blendok (Diplodia).'
      : isDry
      ? 'Tanah kebun jeruk mulai kering. Alirkan air irigasi piringan di bawah kanopi luar tajuk agar daun tidak menggulung layu.'
      : 'Kondisi air tanah kebun jeruk pas dan gembur. Akar leluasa bernapas di dalam tanah remah berpasir.';

    const pupukDesc = hst < 60
      ? 'Fase Flush & Bunga: Berikan pupuk NPK berimbang ditambah unsur mikro Seng (Zn) dan Besi (Fe) untuk mencegah daun menguning (klorosis).'
      : 'Fase Pembesaran Buah: Fokus pupuk Kalium Sulfat (ZK / KNO3 Putih) dan Kalsium untuk mencegah buah pecah (fruit cracking) dan meningkatkan rasa manis sari jeruk.';

    const npkKg = Math.max(1, Math.round(240 * areaHa));
    const komposKg = Math.max(5, Math.round(1200 * areaHa));
    const khususKg = Math.max(1, Math.round(40 * areaHa));

    return {
      komoditasClean: 'Pohon Jeruk',
      category: 'Buah',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'Kalsium & KNO3',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai kutu loncat Diaphorina citri (vektor penyakit CVPD) serta lalat buah pengorok sari jeruk.',
      tipsFase: 'Pangkas cabang air liar (wiwil) di bagian tengah kanopi pohon agar sinar matahari leluasa masuk menembus tajuk.'
    };
  }

  // 3. CABAI
  if (c.includes('cabai') || c.includes('cabe') || c.includes('chili') || c.includes('lombok')) {
    const siramDesc = isWet
      ? 'Tanah bedengan cabai terlalu basah becek! Buka parit pembuangan air sekarang juga. Akar cabai sangat rentan layu bakteri Ralstonia dan layu fusarium jika terendam.'
      : isDry
      ? 'Tanah bedengan cabai mulai kering. Alirkan air ke parit bedengan (sistem leb) lalu buang air berlebih saat tanah mulsa sudah cukup lembap.'
      : 'Kandungan air tanah bedengan cabai sangat pas gembur. Tanaman cabai tumbuh kokoh tanpa stres perakaran.';

    const pupukDesc = hst < 40
      ? 'Fase Vegetatif Cabang: Kocor larutan NPK 16-16-16 di lubang mulsa tanaman tiap 7 hari sekali untuk memacu cabang produktif Y.'
      : 'Fase Bunga & Buah: Semprot Kalsium Nitrat rutin tiap minggu untuk mencegah penyakit patek / antraknosa dan busuk pantat buah, ditambah Kalium tinggi.';

    const npkKg = Math.max(1, Math.round(200 * areaHa));
    const komposKg = Math.max(5, Math.round(1000 * areaHa));
    const khususKg = Math.max(1, Math.round(30 * areaHa));

    return {
      komoditasClean: 'Tanaman Cabai',
      category: 'Sayuran & Bumbu',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'Kalsium Nitrat (CNG)',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai penyakit antraknosa (patek Colletotrichum), keriting daun akibat kutu kebul/thrips, dan busuk basah buah saat hujan sering turun.',
      tipsFase: 'Pasang ajir bambu dan ikat batang utama cabai sebelum cabang Y berbuah lebat agar tanaman tidak patah saat angin kencang.'
    };
  }

  // 4. BAWANG MERAH
  if (c.includes('bawang')) {
    const siramDesc = isWet
      ? 'Tanah bedengan bawang terlalu becek! Parit bedengan harus dikeringkan segera agar umbi bawang tidak busuk basah dan terhindar dari layu moler.'
      : isDry
      ? 'Tanah bedengan bawang agak kering. Siram lembut pada pagi hari sebelum jam 08.00 dengan gembor halus untuk membilas embun daun.'
      : 'Kondisi air tanah pas lembap remah. Parit bedengan mengalir lancar dan umbi bawang tumbuh leluasa bernapas.';

    const pupukDesc = hst < 25
      ? 'Fase Anakan Daun: Berikan pupuk susulan NPK Phonska + ZA di sela tanaman untuk memacu pertumbuhan rumpun anakan bawang.'
      : 'Fase Pembesaran Umbi: Aplikasi KNO3 Putih (Kalium tinggi) tanpa tambahan pupuk Urea agar umbi bawang padat berbobot, berkulit merah mengkilap, dan tahan disimpan.';

    const npkKg = Math.max(1, Math.round(250 * areaHa));
    const komposKg = Math.max(5, Math.round(1200 * areaHa));
    const khususKg = Math.max(1, Math.round(45 * areaHa));

    return {
      komoditasClean: 'Bawang Merah',
      category: 'Sayuran & Bumbu',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'KNO3 Putih (Kalium)',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai bercak ungu trotol (Alternaria porri), ulat grayak bawang (Spodoptera exigua), dan penyakit layu moler Fusarium.',
      tipsFase: 'Hentikan penyiraman 3 hari sebelum panen cabut umbi agar umbi kesat, tanah mudah dibersihkan, dan umbi tidak mudah busuk saat digantung.'
    };
  }

  // 5. TOMAT
  if (c.includes('tomat')) {
    const siramDesc = isWet
      ? 'Tanah bedengan tomat terlalu basah. Kurangi pasokan air agar akar tidak kekurangan oksigen dan buah tidak pecah mendadak.'
      : isDry
      ? 'Tanah bedengan tomat kering. Siram teratur di pangkal tanaman. Fluktuasi basah-kering mendadak akan menyebabkan kulit buah merekah retak.'
      : 'Kelembapan tanah tomat stabil prima. Buah tomat membesar halus dan mulus tanpa retak kulit.';

    const pupukDesc = hst < 35
      ? 'Fase Percabangan: Berikan NPK berimbang dan lakukan perempelan tunas air wiwil agar nutrisi terfokus pada cabang utama.'
      : 'Fase Buah: Tambahkan Kalsium-Boron dan Kalium tinggi untuk mencegah busuk pantat buah tomat (blossom end rot) dan menambah bobot buah.';

    const npkKg = Math.max(1, Math.round(220 * areaHa));
    const komposKg = Math.max(5, Math.round(1000 * areaHa));
    const khususKg = Math.max(1, Math.round(35 * areaHa));

    return {
      komoditasClean: 'Tanaman Tomat',
      category: 'Sayuran & Bumbu',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'Kalsium-Boron',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai busuk daun (Phytophthora infestans), busuk ujung pantat buah akibat defisiensi kalsium, dan virus kuning gemini.',
      tipsFase: 'Ikat batang tomat pada ajir bambu setinggi 1.5 meter dan pangkas daun tua yang menyentuh tanah agar tidak tertular jamur tanah.'
    };
  }

  // 6. PADI SAWAH
  if (c.includes('padi') || c.includes('gabah')) {
    const siramDesc = isWet
      ? 'Air sawah sedang menggenang tinggi. Buka saluran pembuangan parit agar tinggi genangan air sawah turun ke batas ideal 2–3 cm (macak-macak).'
      : isDry
      ? 'Petakan sawah mulai merekah kering. Alirkan air irigasi secukupnya ke petakan sawah agar perakaran bibit padi tidak stres kekurangan air.'
      : 'Tata kelola air sawah sangat pas (macak-macak berselang / AWD). Akar leluasa bernapas dan rumpun anakan aktif membelah.';

    const pupukDesc = hst < 30
      ? 'Fase Anakan Aktif: Tebar pupuk NPK Phonska dan Urea saat air sawah macak-macak dangkal agar anakan produktif bertambah banyak.'
      : 'Fase Bunting & Pengisian: Semprot pupuk daun Kalium dan silika cair saat fase bunting untuk memperkuat batang dari rebah dan bulir padi terisi bernas.';

    const npkKg = Math.max(1, Math.round(300 * areaHa));
    const komposKg = Math.max(5, Math.round(1000 * areaHa));
    const khususKg = Math.max(1, Math.round(50 * areaHa));

    return {
      komoditasClean: 'Padi Sawah',
      category: 'Tanaman Pangan',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'Pupuk Silika & Kalium',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai penyakit blas daun (Pyricularia oryzae), hawar daun bakteri kresek, sundep/beluk penggerek batang, dan wereng batang cokelat.',
      tipsFase: 'Keringkan petakan sawah 7–10 hari sebelum panen raya agar pemotongan malai mudah dan tanah tidak becek saat perontokan.'
    };
  }

  // 7. JAGUNG
  if (c.includes('jagung')) {
    const siramDesc = isWet
      ? 'Saluran parit guludan jagung tergenang. Buang air genangan agar pangkal batang tidak membusuk.'
      : isDry
      ? 'Tanah guludan jagung kering. Alirkan air irigasi di sela parit alur, terutama jika tanaman sedang memasuki fase berbunga dan keluar rambut tongkol.'
      : 'Kelembapan tanah guludan jagung sangat pas gembur. Akar napas menancap kokoh.';

    const pupukDesc = hst < 35
      ? 'Fase Pertumbuhan Batang: Lakukan pembumbunan tanah guludan dan taburkan pupuk susulan NPK + Urea di samping pangkal batang.'
      : 'Fase Pengisian Biji Tongkol: Tambahkan Kalium KCL agar butiran jagung terisi padat bernas hingga ujung tongkol.';

    const npkKg = Math.max(1, Math.round(250 * areaHa));
    const komposKg = Math.max(5, Math.round(800 * areaHa));
    const khususKg = Math.max(1, Math.round(40 * areaHa));

    return {
      komoditasClean: 'Tanaman Jagung',
      category: 'Tanaman Pangan',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'Urea & KCL',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai ulat grayak jagung (Spodoptera frugiperda / FAW) yang memakan titik tumbuh pucuk, serta penyakit bulai.',
      tipsFase: 'Lakukan pembumbunan tanah setinggi 10 cm di sekitar batang untuk memperkokoh akar tunjang dari terpaan angin kencang.'
    };
  }

  // 8. KENTANG
  if (c.includes('kentang') || c.includes('potato')) {
    const siramDesc = isWet
      ? 'Tanah guludan kentang terlalu basah. Buka parit guludan agar air tidak menggenangi zona umbi di dalam tanah.'
      : isDry
      ? 'Tanah guludan kentang kering. Siram merata di parit alur agar tanah andosol kembali lembap remah.'
      : 'Kondisi tanah guludan andosol sangat pas gembur. Calon umbi leluasa membesar.';

    const pupukDesc = hst < 40
      ? 'Fase Vegetatif: Berikan pupuk NPK seimbang + pupuk kandang matang saat melakukan pembumbunan guludan pertama.'
      : 'Fase Pembesaran Umbi: Berikan pupuk tinggi Kalium (Kalium Sulfat ZK) dan Fosfat agar umbi kentang berukuran besar dan berkulit mulus.';

    const npkKg = Math.max(1, Math.round(300 * areaHa));
    const komposKg = Math.max(5, Math.round(2000 * areaHa));
    const khususKg = Math.max(1, Math.round(60 * areaHa));

    return {
      komoditasClean: 'Tanaman Kentang',
      category: 'Sayuran & Bumbu',
      siramDesc,
      pupukDesc,
      pupukNamaKhusus: 'Kalium Sulfat (ZK)',
      userLuasLabel,
      npkKg,
      komposKg,
      khususKg,
      pestWarning: 'Waspadai busuk daun Phytophthora infestans (lodoh) saat cuaca berkabut dingin dan layu bakteri.',
      tipsFase: 'Lakukan pembumbunan tanah 2–3 kali agar umbi kentang tidak tersengat sinar matahari yang menyebabkan racun solanin/kulit menghijau.'
    };
  }

  // FALLBACK UMUM LAINNYA
  const siramDesc = isWet
    ? 'Tanah lahan sedang becek tergenang. Buka saluran pembuangan parit agar perakaran tanaman tidak terendam air berlebih.'
    : isDry
    ? 'Tanah lahan mulai mengering. Segera siram merata seluas ' + userLuasLabel + ' pada pagi atau sore hari.'
    : 'Kandungan air tanah sangat pas gembur. Akar tanaman leluasa bernapas dan menyerap nutrisi hara.';

  const pupukDesc = hst < 40
    ? 'Fase Vegetatif Awal: Berikan pupuk NPK seimbang dan pupuk organik kompos untuk memacu pembentukan akar dan tunas daun baru.'
    : 'Fase Generatif: Tingkatkan unsur Fosfat dan Kalium serta kurangi Nitrogen berlebih agar tanaman fokus pada pembuahan/pengisian hasil.';

  const npkKg = Math.max(1, Math.round(200 * areaHa));
  const komposKg = Math.max(5, Math.round(1000 * areaHa));
  const khususKg = Math.max(1, Math.round(30 * areaHa));

  return {
    komoditasClean: cropName || 'Tanaman Budidaya',
    category: 'Umum',
    siramDesc,
    pupukDesc,
    pupukNamaKhusus: 'Pupuk Kalium',
    userLuasLabel,
    npkKg,
    komposKg,
    khususKg,
    pestWarning: 'Waspadai jamur daun saat kelembapan udara tinggi dan serangga hama penghisap cairan daun saat cuaca panas terik.',
    tipsFase: 'Bersihkan rumput liar di sekitar pangkal tanaman agar tidak berebut nutrisi pupuk dan air dengan tanaman utama.'
  };
}

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<'semprot' | 'irigasi' | 'siklus'>('semprot');

  const [activePetani, setActivePetani] = useState<PetaniRecord>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return DEFAULT_BENCHMARK_FARMER;
  });

  const isPadi = useMemo(() => {
    const c = (activePetani?.jenis_tanaman || '').toLowerCase();
    return c.includes('padi') || c.includes('gabah');
  }, [activePetani?.jenis_tanaman]);

  const lahanTerm = useMemo(() => {
    return isPadi ? 'sawah' : 'lahan';
  }, [isPadi]);

  const cropStages = useMemo(() => {
    return getCropStages(activePetani?.jenis_tanaman || '');
  }, [activePetani?.jenis_tanaman]);

  const [isUserLahan, setIsUserLahan] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      return !!stored;
    }
    return false;
  });

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number; label: string }>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.lat && parsed.lon) {
            return { lat: parsed.lat, lon: parsed.lon, label: parsed.daerah || 'Lahan Pengguna' };
          }
        } catch {}
      }
    }
    return {
      lat: DEFAULT_BENCHMARK_FARMER.lat,
      lon: DEFAULT_BENCHMARK_FARMER.lon,
      label: DEFAULT_BENCHMARK_FARMER.daerah
    };
  });

  const [weather, setWeather] = useState<WeatherData>(() => {
    let initialDaerah = DEFAULT_BENCHMARK_FARMER.daerah;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.daerah) initialDaerah = parsed.daerah;
        } catch {}
      }
    }
    return getFallbackWeatherData(initialDaerah);
  });

  // Muat data cuaca live satelit berdasarkan parameter
  async function loadWeather(options: { lat?: number; lon?: number; daerah?: string; label?: string }) {
    try {
      let url = '/api/cuaca?';
      if (options.lat !== undefined && options.lon !== undefined) {
        url += `lat=${options.lat}&lon=${options.lon}`;
      } else if (options.daerah) {
        url += `daerah=${encodeURIComponent(options.daerah)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setWeather(data.data);
        setCurrentCoords({
          lat: data.lat ?? (options.lat || DEFAULT_BENCHMARK_FARMER.lat),
          lon: data.lon ?? (options.lon || DEFAULT_BENCHMARK_FARMER.lon),
          label: options.label || data.daerah || 'Wilayah Lahan'
        });
      }
    } catch (e) {
      console.error('Error fetching weather:', e);
    }
  }

  // Sinkronisasi otomatis data lahan petani yang sudah diinput
  useEffect(() => {
    async function initActiveFarmer() {
      try {
        let targetFarmer: PetaniRecord | null = null;

        const storedData = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_data') : null;
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('kertanusa_active_farmer_id') : null;

        let parsed: any = null;
        if (storedData) {
          try {
            parsed = JSON.parse(storedData);
          } catch {
            parsed = null;
          }
        }

        // Validasi ke backend apakah petani ini masih aktif di database
        if (storedId || parsed) {
          const res = await fetch('/api/petani');
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            targetFarmer = json.data.find((p: PetaniRecord) => 
              (storedId && p.id === storedId) ||
              (parsed?.id && p.id === parsed.id) ||
              (parsed?.nama_petani && p.nama_petani.trim().toLowerCase() === parsed.nama_petani.trim().toLowerCase())
            ) || null;
          }
        }

        // JIKA PETANI TERBUKTI MASIH ADA DI DATABASE (USER SUDAH INPUT):
        if (targetFarmer) {
          setIsUserLahan(true);
          setActivePetani(targetFarmer);
          if (typeof window !== 'undefined') {
            localStorage.setItem('kertanusa_active_farmer_id', targetFarmer.id);
            localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(targetFarmer));
          }

          if (targetFarmer.lat && targetFarmer.lon) {
            await loadWeather({
              lat: targetFarmer.lat,
              lon: targetFarmer.lon,
              label: `${targetFarmer.daerah}`
            });
          } else {
            await loadWeather({
              daerah: targetFarmer.daerah,
              label: `${targetFarmer.daerah}`
            });
          }
        } else {
          // JIKA USER BELUM INPUT: Tampilkan data acuan rekomendasi default (sama seperti hero section)
          setIsUserLahan(false);
          setActivePetani(DEFAULT_BENCHMARK_FARMER);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('kertanusa_active_farmer_id');
            localStorage.removeItem('kertanusa_active_farmer_data');
          }

          await loadWeather({
            lat: DEFAULT_BENCHMARK_FARMER.lat,
            lon: DEFAULT_BENCHMARK_FARMER.lon,
            label: `${DEFAULT_BENCHMARK_FARMER.daerah}`
          });
        }
      } catch (e) {
        console.error('Gagal sinkron data petani, menggunakan acuan default:', e);
        setIsUserLahan(false);
        setActivePetani(DEFAULT_BENCHMARK_FARMER);
        await loadWeather({
          lat: DEFAULT_BENCHMARK_FARMER.lat,
          lon: DEFAULT_BENCHMARK_FARMER.lon,
          label: `${DEFAULT_BENCHMARK_FARMER.daerah}`
        });
      }
    }

    initActiveFarmer();
  }, []);

  // 1. Penguapan Daun & Kebutuhan Air (VPD) dengan Interlock Silang Sensor Tanah
  const vpdAnalysis = useMemo(() => {
    if (!weather) return { vpd: 0.95, status: 'Sangat Ideal', desc: 'Daun membuka pas. Tanaman segar dan lancar menyerap pupuk.' };
    const tempC = weather.suhu;
    const rh = weather.kelembapan_udara;
    const sm = weather.kelembapan_tanah;
    
    const svp = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
    const avp = svp * (rh / 100);
    const vpd = Math.max(0, parseFloat((svp - avp).toFixed(2)));

    // Interlock Tata Kelola Air Padi (AWD / Macak-Macak)
    if (isPadi) {
      if (sm < 50) {
        return { vpd, status: 'Airi Sawah Macak-macak', desc: 'Tanah sawah mulai merekah. Alirkan air irigasi setinggi 2–3 cm lalu biarkan surut alami (metode AWD).' };
      }
      return { vpd, status: 'Air Sawah Cukup', desc: 'Kondisi air sawah dalam batas macak-macak optimal untuk anakan padi produktif.' };
    }

    // Interlock Silang Hortikultura: Cek kejenuhan tanah
    if (sm >= 82) {
      return {
        vpd,
        status: 'Tanah Jenuh Air (Stop Siram)',
        desc: 'Tanah sudah sangat basah becek. Dilarang menambah air agar akar tidak mengalami hipoksia dan busuk akar.'
      };
    }

    if (vpd < 0.45) {
      return {
        vpd,
        status: 'Udara Terlalu Lembap',
        desc: 'Daun sulit menguapkan air. Waspada embun berlebih pemicu jamur daun.'
      };
    } else if (vpd <= 1.25) {
      return {
        vpd,
        status: 'Sangat Ideal',
        desc: 'Kondisi stomata daun sangat prima untuk menyerap nutrisi dan pupuk cair.'
      };
    } else if (vpd <= 1.65) {
      if (sm < 65) {
        return {
          vpd,
          status: 'Penguapan Cepat (Waktunya Siram)',
          desc: 'Udara hangat dan tanah mulai mengering. Tambahkan air penyiraman pada pagi atau sore hari.'
        };
      }
      return {
        vpd,
        status: 'Penguapan Normal',
        desc: 'Tanaman menguap agak cepat namun kelembapan tanah di perakaran masih mencukupi.'
      };
    } else {
      if (sm < 65) {
        return {
          vpd,
          status: 'Udara Kering Terik (Irigasi Diperlukan)',
          desc: 'Matahari sangat terik dan tanah butuh air. Siram segera agar tanaman tidak layu permanen.'
        };
      }
      return {
        vpd,
        status: 'Udara Terik (Tanah Masih Lembap)',
        desc: 'Udara panas menyengat namun tanah masih basah. Cukup jaga kelembapan tanah tanpa siram berlebih.'
      };
    }
  }, [weather, isPadi]);

  // 2. Evaluasi Risiko Serangan Jamur & Blas Daun (Terproteksi Clamp)
  const fungalRisk = useMemo(() => {
    if (!weather) return { score: 35, level: 'Rendah (Aman)', advice: 'Udara kering dan sehat. Risiko jamur daun minimal.' };
    
    const rh = weather.kelembapan_udara;
    const temp = weather.suhu;
    const rainToday = weather.prakiraan_7hari?.[0]?.curah_hujan ?? 0;

    // Proteksi Matematis: Cegah nilai minus memicu alarm palsu
    const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));
    const rhFactor = clamp((rh - 60) / 30);
    const tempFactor = clamp(1 - Math.abs(temp - 25) / 11);

    // Matriks Kuantitatif Pengali Hujan (mm/hari)
    let rainMultiplier = 0.9;
    if (rainToday > 20) rainMultiplier = 1.4;
    else if (rainToday > 5) rainMultiplier = 1.25;
    else if (rainToday > 0) rainMultiplier = 1.1;

    const rawScore = Math.round(rhFactor * tempFactor * rainMultiplier * 100);
    const score = Math.max(10, Math.min(96, rawScore));

    if (score >= 70) {
      return {
        score,
        level: 'Tinggi (Waspada Jamur Daun)',
        advice: 'Cuaca sangat lembap dan berair. Jamur daun (blas, kresek, atau bercak) rawan menular. Kurangi pupuk Urea dan semprot obat jamur pencegah jika diperlukan.'
      };
    } else if (score >= 45) {
      return {
        score,
        level: 'Sedang (Cukup Lembap)',
        advice: 'Kondisi udara agak lembap. Bersihkan rumput liar dan pangkas daun tua bagian bawah agar udara di sela rumpun tanaman mengalir lancar.'
      };
    } else {
      return {
        score,
        level: 'Rendah (Aman)',
        advice: 'Udara cukup kering dan bersih. Daun tanaman sehat dan risiko serangan jamur daun sangat kecil.'
      };
    }
  }, [weather]);

  // 3. Waktu Semprot Obat & Pupuk Daun
  const sprayAdvisor = useMemo(() => {
    if (!weather) return { canSpray: true, status: 'Waktu Sangat Bagus', timeWindow: 'Pagi (06.30 – 08.30) atau Sore (15.30 – 17.30 WIB)', reason: 'Kondisi angin tenang dan tidak ada potensi hujan.' };
    const wind = weather.kecepatan_angin || 8;
    const temp = weather.suhu;
    const rainToday = weather.prakiraan_7hari?.[0]?.curah_hujan ?? 0;

    if (rainToday > 2.0) {
      return {
        canSpray: false,
        status: 'Tunda Semprot (Akan Turun Hujan)',
        timeWindow: 'Tunda Hari Ini',
        reason: 'Diprakirakan akan turun hujan. Jangan semprot dulu karena obat semprot akan luntur tercuci air hujan sebelum sempat meresap.'
      };
    }
    if (wind > 14) {
      return {
        canSpray: false,
        status: 'Tunda Semprot (Angin Kencang)',
        timeWindow: 'Tunggu Angin Reda',
        reason: `Angin di ${lahanTerm} bertiup kencang (${wind} km/jam). Obat semprot akan kabur terbawa angin ke luar area ${lahanTerm} dan terbuang sia-sia.`
      };
    }
    if (temp > 32) {
      return {
        canSpray: false,
        status: 'Tunda Semprot (Matahari Terik)',
        timeWindow: 'Tunggu Sore (15.30 WIB)',
        reason: 'Matahari sedang sangat panas terik. Obat semprot akan cepat menguap dan daun tanaman bisa hangus terbakar.'
      };
    }
    return {
      canSpray: true,
      status: 'Aman untuk Semprot',
      timeWindow: 'Pagi (06.30 – 08.30) atau Sore (15.30 – 17.30 WIB)',
      reason: 'Angin tenang dan daun masih berembun segar. Butiran obat semprot atau pupuk daun akan menempel lekat dan meresap maksimal.'
    };
  }, [weather, lahanTerm]);

  // 4. Panduan Tebar Pupuk (Anti-Hanyut)
  const leachingAdvisor = useMemo(() => {
    if (!weather) return { status: 'Waktu Tepat Tebar Pupuk', advice: 'Kelembapan tanah pas untuk melarutkan butiran pupuk.' };
    const soilMoisture = weather.kelembapan_tanah;
    const rain = weather.prakiraan_7hari?.[0]?.curah_hujan ?? 0;

    if (soilMoisture > 80 || rain > 12) {
      return {
        status: 'Tunda Nabur Pupuk',
        advice: `${isPadi ? 'Sawah' : 'Lahan'} sedang tergenang atau hujan lebat. Tunda menebar pupuk agar butiran pupuk tidak hanyut terbawa aliran air parit.`
      };
    } else if (soilMoisture < 45) {
      return {
        status: isPadi ? 'Airkan Sawah Sedikit Dahulu' : 'Siram Lahan Sedikit Dahulu',
        advice: `Tanah ${lahanTerm} agak kering dan merekah. Alirkan sedikit air sebelum pupuk ditabur agar butiran pupuk mudah larut.`
      };
    } else {
      return {
        status: 'Aman untuk Tabur Pupuk',
        advice: isPadi
          ? 'Kebasahan tanah pas lembap macak-macak. Butiran pupuk tabur (NPK / Urea) cepat larut merata dan langsung dimakan akar tanaman.'
          : 'Kebasahan tanah pas gembur lembap. Butiran pupuk tabur (NPK / Urea) cepat larut merata dan langsung diserap perakaran tanaman.'
      };
    }
  }, [weather, isPadi, lahanTerm]);

  // 5. Tahapan Usia & Perkembangan Tanaman (HST = Hari Setelah Tanam)
  const gddTracker = useMemo(() => {
    let plantDateStr = activePetani?.waktu_tanam;
    let daysPassed = 1;

    if (plantDateStr) {
      const pDate = new Date(plantDateStr);
      const now = new Date();
      const diff = Math.max(1, Math.floor((now.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24)));
      daysPassed = diff;
    }

    const stages = cropStages;
    let stageIndex = 0;
    for (let i = 0; i < stages.length; i++) {
      if (daysPassed >= stages[i].minHst && daysPassed <= stages[i].maxHst) {
        stageIndex = i;
        break;
      }
      if (i === stages.length - 1 && daysPassed >= stages[i].minHst) {
        stageIndex = i;
      }
    }

    return {
      stageIndex,
      days: daysPassed,
      phase: stages[stageIndex].title,
      warning: stages[stageIndex].warning
    };
  }, [activePetani?.waktu_tanam, cropStages]);

  // 6. Kebutuhan Kapur Pertanian (Dolomit) jika Tanah Asam
  const dolomitCalc = useMemo(() => {
    if (!weather) return { needed: false, kgTotal: 0, sacks: 0, luasM2: 0 };
    const ph = weather.ph_tanah;
    if (ph >= 6.0) return { needed: false, kgTotal: 0, sacks: 0, luasM2: 0 };

    let luasM2 = 1000;
    if (activePetani) {
      luasM2 = activePetani.satuan_luas === 'hektar' ? activePetani.luas_tanah * 10000 : activePetani.luas_tanah;
    }

    const deficitPh = 6.5 - ph;
    const kgPerHa = deficitPh * 2000;
    const kgTotal = Math.round((kgPerHa * luasM2) / 10000);
    const sacks = Math.ceil(kgTotal / 50);

    return { needed: true, kgTotal, sacks, luasM2 };
  }, [weather, activePetani]);

  // 7. Panduan Perawatan Spesifik Komoditas & Dosis Pupuk Riil Berdasarkan Luas Lahan
  const cropCareGuide = useMemo(() => {
    return getCropCareGuide(
      activePetani?.jenis_tanaman || '',
      Number(activePetani?.luas_tanah) || 1000,
      activePetani?.satuan_luas || 'm²',
      weather,
      gddTracker.days
    );
  }, [activePetani?.jenis_tanaman, activePetani?.luas_tanah, activePetani?.satuan_luas, weather, gddTracker.days]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-6 text-slate-800">
      
      {/* 1. HEADER HALAMAN (CLEAN & NATURAL) */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pantauan Cuaca & Kondisi {isUserLahan && !isPadi ? 'Lahan' : 'Sawah'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Informasi cuaca harian, kondisi tanah {isUserLahan && !isPadi ? 'lahan' : 'sawah'}, dan panduan praktis perawatan tanaman.
        </p>
      </div>

      {/* 2. KARTU RINCIAN LAHAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isUserLahan ? `Rincian Lahan ${activePetani.nama_petani}` : 'Rincian Lahan Percontohan (Acuan Rekomendasi)'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isUserLahan 
              ? 'Data lahan terhubung langsung dengan profil pendaftaran sawah Anda.'
              : 'Data acuan standar untuk contoh panduan cuaca dan perawatan sawah.'}
          </p>
        </div>

        {/* Tabel Ringkas Key-Value Rapi */}
        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Nama Pemilik / Petani</span>
            <span className="text-slate-900 font-bold">{isUserLahan ? activePetani.nama_petani : 'Lahan Percontohan (Acuan Rekomendasi)'}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Wilayah / Lokasi</span>
            <span className="text-slate-900 font-semibold">{activePetani.daerah || currentCoords?.label || '-'}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Titik Lokasi {isPadi ? 'Sawah' : 'Lahan'} (GPS)</span>
            <span className="text-slate-900 font-mono font-semibold">
              {currentCoords ? `${currentCoords.lat.toFixed(5)}, ${currentCoords.lon.toFixed(5)}` : '-'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Jenis Tanaman</span>
            <span className="text-slate-900 font-bold">{activePetani.jenis_tanaman}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Luas Lahan</span>
            <span className="text-slate-900 font-semibold">
              {activePetani.luas_tanah} {activePetani.satuan_luas}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Tanggal Mulai Tanam</span>
            <span className="text-slate-900 font-semibold">
              {activePetani.waktu_tanam} <span className="text-slate-500 font-normal">({gddTracker.days} HST)</span>
            </span>
          </div>
        </div>

        {isUserLahan && !isRecognizedCrop(activePetani.jenis_tanaman) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950">Komoditas &ldquo;{activePetani.jenis_tanaman}&rdquo; tidak terdaftar resmi</strong>
              <span>
                Nama ini tidak dikenali sebagai tanaman budidaya pertanian/hortikultura. Rekomendasi di bawah menggunakan parameter acuan tanaman umum. Silakan perbarui data di menu Pendaftaran Lahan agar jadwal dan dosis pupuk sesuai kebutuhan spesifik tanaman Anda.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. GRID 4 PARAMETER UTAMA (KELEMBAPAN TANAH, SUHU, PENGUAPAN DAUN, pH TANAH) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Kelembapan Tanah */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kebasahan Tanah</span>
            <Droplets className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 block">{weather.kelembapan_tanah}%</span>
            <span className="text-xs font-semibold text-slate-700 block mt-1">
              {weather.kelembapan_tanah < 45 ? 'Tanah Kering (Butuh Air)' : weather.kelembapan_tanah > 80 ? 'Terlalu Becek (Tergenang)' : 'Lembap Pas (Macak-macak)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            Kondisi pas: 55% – 70% (tanah macak-macak)
          </p>
        </div>

        {/* Suhu Udara */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Suhu Udara</span>
            <Thermometer className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 block">{weather.suhu}°C</span>
            <span className="text-xs font-semibold text-slate-700 block mt-1">
              {weather.kondisi}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            Kelembapan Udara: {weather.kelembapan_udara}%
          </p>
        </div>

        {/* Penguapan Daun (VPD) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kondisi Daun (Penguapan)</span>
            <Activity className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 block">
              {vpdAnalysis.vpd} <span className="text-xs font-medium text-slate-400">kPa</span>
            </span>
            <span className="text-xs font-semibold text-slate-700 block mt-1">
              {vpdAnalysis.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            Kondisi pas: daun segar menyerap pupuk semprot
          </p>
        </div>

        {/* Kadar Asam Tanah (pH) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kadar Asam Tanah (pH)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 block">pH {weather.ph_tanah}</span>
            <span className="text-xs font-semibold text-slate-700 block mt-1">
              {weather.ph_tanah < 6.0 ? 'Tanah Masam (Perlu Kapur)' : weather.ph_tanah <= 7.0 ? 'Tanah Subur (Netral)' : 'Tanah Basa'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            Skala tanah subur: 6.0 – 7.0 (netral)
          </p>
        </div>

      </div>

      {/* 4. TABEL PRAKIRAAN CUACA 14 HARI */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Prakiraan Cuaca Satelit 14 Hari</h3>
            <p className="text-xs text-slate-500">Perkiraan suhu, kondisi hujan, dan panas 14 hari ke depan untuk rencana olah tanah, semprot, dan jemur hasil panen.</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span className="text-slate-600">Ada Hujan</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 inline-block" />
              <span className="text-slate-600">Cerah / Kering</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
          {(weather.prakiraan_14hari || weather.prakiraan_7hari).map((item, idx) => {
            const isRain = item.curah_hujan > 0 || item.kondisi.toLowerCase().includes('hujan') || item.icon === 'cloud-rain';

            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-center space-y-1.5 transition-all shadow-xs ${
                  isRain 
                    ? 'bg-blue-600 border-blue-700 text-white' 
                    : 'bg-amber-400 border-amber-500 text-slate-950'
                }`}
              >
                <div>
                  <span className={`text-xs font-bold block truncate ${isRain ? 'text-white' : 'text-slate-950'}`}>
                    {item.hari}
                  </span>
                  {item.tanggal && (
                    <span className={`text-[10px] block font-mono ${isRain ? 'text-blue-100' : 'text-amber-950/80'}`}>
                      {item.tanggal}
                    </span>
                  )}
                </div>

                <div className={`w-8 h-8 rounded-full bg-white mx-auto flex items-center justify-center my-1 shadow-xs ${
                  isRain ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {item.icon === 'cloud-rain' ? (
                    <CloudRain className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                  ) : item.icon === 'cloud-sun' ? (
                    <CloudSun className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                  )}
                </div>

                <div>
                  <span className={`text-sm font-bold block ${isRain ? 'text-white' : 'text-slate-950'}`}>
                    {item.suhu}°C
                  </span>
                  <span className={`text-[10px] block leading-tight truncate font-medium ${isRain ? 'text-blue-100' : 'text-amber-950'}`}>
                    {item.kondisi}
                  </span>
                </div>

                <div className={`text-[10px] font-mono pt-1 border-t ${
                  isRain 
                    ? 'border-blue-400/40 text-blue-100 font-semibold' 
                    : 'border-amber-600/30 text-amber-950 font-semibold'
                }`}>
                  {item.curah_hujan} mm
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. PANEL PANDUAN PERAWATAN SAWAH & TANAMAN (SEGMENTED TABS) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
        
        {/* Header & Segmented Controller */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Panduan Perawatan {isPadi ? 'Sawah' : 'Lahan'} & Tanaman</h3>
            <p className="text-xs text-slate-500 mt-0.5">Petunjuk praktis lapangan berdasarkan kondisi cuaca dan tanah hari ini.</p>
          </div>

          {/* Segmented Controller Tab Buttons (Full width & spacious on mobile) */}
          <div className="w-full sm:w-auto grid grid-cols-3 p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1">
            <button
              onClick={() => setActiveTab('semprot')}
              className={`px-1.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                activeTab === 'semprot'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">Jadwal Semprot</span>
            </button>

            <button
              onClick={() => setActiveTab('irigasi')}
              className={`px-1.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                activeTab === 'irigasi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Air & Pupuk</span>
            </button>

            <button
              onClick={() => setActiveTab('siklus')}
              className={`px-1.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                activeTab === 'siklus'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Usia & Tumbuh</span>
            </button>
          </div>
        </div>

        {/* TAB 1: JADWAL SEMPROT OBAT */}
        {activeTab === 'semprot' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Operational Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pb-2.5 border-b border-slate-200/70">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">Status Semprot</span>
                  <strong className="text-xs sm:text-sm text-slate-900 block font-bold">{sprayAdvisor.status}</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">Waktu Semprot Terbaik</span>
                  <strong className="text-xs sm:text-sm text-slate-900 block font-bold">{sprayAdvisor.timeWindow}</strong>
                </div>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {sprayAdvisor.reason}
              </p>
            </div>

            {/* Grid 2 Kartu Pendukung */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Kondisi Angin & Cuaca
                  </span>
                  <span className="text-[11px] text-slate-400">BMKG Live</span>
                </div>
                <div className="space-y-2 pt-1 text-slate-600">
                  <div className="flex justify-between items-center py-0.5">
                    <span>Kecepatan Angin:</span>
                    <strong className="text-slate-900 font-semibold">{weather.kecepatan_angin || 8} km/jam</strong>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span>Suhu Udara:</span>
                    <strong className="text-slate-900 font-semibold">{weather.suhu}°C</strong>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span>Kelembapan Udara:</span>
                    <strong className="text-slate-900 font-semibold">{weather.kelembapan_udara}%</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                  Angin tenang di bawah 12 km/jam aman untuk semprot tanpa takut obat melayang ke luar area {lahanTerm}.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Risiko Jamur & Penyakit ({cropCareGuide.komoditasClean})
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {fungalRisk.level}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pt-1">
                  {fungalRisk.advice}
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Peringatan Khusus {activePetani.jenis_tanaman}:</strong> {cropCareGuide.pestWarning}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AIR SAWAH & PUPUK */}
        {activeTab === 'irigasi' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Operational Banner Tanpa Badge */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Kondisi Air {isPadi ? 'Sawah' : 'Tanah'}:</span>
                  <strong className="text-xs sm:text-sm text-slate-900">
                    {weather.status_tanah} ({weather.kelembapan_tanah}%)
                  </strong>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Kadar Asam-Basa:</span>
                  <strong className="text-slate-900">
                    pH {weather.ph_tanah} ({weather.status_ph})
                  </strong>
                </div>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {cropCareGuide.siramDesc}
              </p>
            </div>

            {/* Grid 2 Kartu Pendukung Tanpa Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Panduan Pupuk {cropCareGuide.komoditasClean}
                  </span>
                  <strong className="text-slate-900 text-xs">
                    {leachingAdvisor.status}
                  </strong>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pt-1">
                  {cropCareGuide.pupukDesc}
                </p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1.5 text-[11px]">
                  <span className="font-semibold text-slate-700 block">
                    Kalkulasi Kebutuhan Pupuk Lahan ({cropCareGuide.userLuasLabel}):
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block font-medium">Pupuk NPK</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block font-bold mt-0.5">{cropCareGuide.npkKg} kg</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block font-medium">Kompos / Kandang</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block font-bold mt-0.5">{cropCareGuide.komposKg} kg</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block font-medium truncate">{cropCareGuide.pupukNamaKhusus}</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block font-bold mt-0.5">{cropCareGuide.khususKg} kg</strong>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Hindari tabur pupuk saat air {lahanTerm} mengalir deras agar pupuk tidak terbuang sia-sia.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Kesehatan Tanah & Kapur (Dolomit)
                  </span>
                  <span className="text-[11px] text-slate-500">Skala Netral: 6.0 – 7.0</span>
                </div>
                {dolomitCalc.needed ? (
                  <div className="space-y-1 text-slate-700 pt-1">
                    <p className="font-semibold text-slate-900">
                      Kebutuhan Kapur Pertanian:{' '}
                      <strong className="text-slate-900">
                        {dolomitCalc.kgTotal.toLocaleString('id-ID')} kg ({dolomitCalc.sacks} karung isi 50 kg)
                      </strong>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Untuk {lahanTerm} seluas {dolomitCalc.luasM2.toLocaleString('id-ID')} m², taburkan kapur dolomit agar tanah tidak masam. Tanah masam membuat pupuk mahal mengendap dan tidak bisa dimakan tanaman.
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-600 text-xs leading-relaxed pt-1">
                    Tanah {lahanTerm} subur dan tidak masam (pH netral). Pupuk kimia maupun organik dapat langsung diserap lancar oleh perakaran tanaman tanpa butuh kapur.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USIA & PERTUMBUHAN */}
        {activeTab === 'siklus' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Operational Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pb-2.5 border-b border-slate-200/70">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">Tahapan {cropCareGuide.komoditasClean} Saat Ini</span>
                  <strong className="text-xs sm:text-sm text-slate-900 block font-bold">{gddTracker.phase}</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">Umur Tanaman</span>
                  <strong className="text-xs sm:text-sm text-slate-900 block font-bold">
                    {gddTracker.days} HST (Hari Setelah Tanam)
                  </strong>
                </div>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {gddTracker.warning}
              </p>
              {cropCareGuide.tipsFase && (
                <div className="pt-2 border-t border-slate-200/60 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Tips Agronomis Fase Ini: {cropCareGuide.tipsFase}</span>
                </div>
              )}
            </div>

            {/* Tahapan Siklus Tanam Ringkas & Rapi */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="border-b border-slate-100 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Tahapan Perkembangan Tanaman</span>
                <span className="text-slate-500 font-normal text-xs">Komoditas: <strong className="text-slate-800">{activePetani.jenis_tanaman}</strong></span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {cropStages.map((stg, idx) => (
                  <div key={idx} className={`py-2.5 sm:py-3 px-2 sm:px-2.5 rounded-lg flex items-center justify-between gap-2 transition-all ${
                    gddTracker.stageIndex === idx 
                      ? 'font-bold text-slate-900 bg-slate-100/90 -mx-1 sm:-mx-2' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0 pr-1">
                      <span className="text-xs sm:text-sm leading-snug">{idx + 1}. {stg.title}</span>
                      {gddTracker.stageIndex === idx && (
                        <span className="text-[10px] sm:text-[11px] text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded shrink-0">
                          Tahap Sekarang
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] sm:text-xs text-slate-500 font-semibold shrink-0 bg-white/90 sm:bg-transparent px-1.5 py-0.5 sm:p-0 rounded border sm:border-0 border-slate-200/60">
                      {stg.hstRange}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-500">
                <span>Mulai Tanam: <strong className="text-slate-800 font-semibold">{activePetani.waktu_tanam}</strong></span>
                <span>Perkiraan Panen: <strong className="text-slate-800 font-semibold">{activePetani.estimasi_panen}</strong></span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
