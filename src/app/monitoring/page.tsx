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

const DEFAULT_BENCHMARK_FARMER: PetaniRecord = {
  id: 'benchmark-brebes',
  nama_petani: 'Lahan Acuan Rekomendasi',
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

  // 1. Penguapan Daun & Kebutuhan Air (VPD)
  const vpdAnalysis = useMemo(() => {
    if (!weather) return { vpd: 0.95, status: 'Sangat Ideal', desc: 'Daun membuka pas. Tanaman segar dan lancar menyerap pupuk.' };
    const tempC = weather.suhu;
    const rh = weather.kelembapan_udara;
    
    const svp = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
    const avp = svp * (rh / 100);
    const vpd = Math.max(0, parseFloat((svp - avp).toFixed(2)));

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
        desc: 'Kondisi daun sangat prima untuk menyerap nutrisi dan pupuk cair.'
      };
    } else if (vpd <= 1.65) {
      return {
        vpd,
        status: 'Penguapan Cepat',
        desc: 'Tanaman menguap agak cepat karena udara hangat. Pastikan pasokan air tanah memadai.'
      };
    } else {
      return {
        vpd,
        status: 'Udara Kering Terik',
        desc: 'Matahari sangat panas terik. Daun rentan layu jika tanah kekurangan air.'
      };
    }
  }, [weather]);

  // 2. Evaluasi Risiko Serangan Jamur & Blas Daun
  const fungalRisk = useMemo(() => {
    if (!weather) return { score: 35, level: 'Rendah (Aman)', advice: 'Udara kering dan sehat. Risiko jamur daun minimal.' };
    
    const rh = weather.kelembapan_udara;
    const temp = weather.suhu;
    const rainToday = weather.prakiraan_7hari?.[0]?.curah_hujan ?? 0;

    let rhFactor = 0;
    if (rh >= 60) rhFactor = Math.min(1, (rh - 60) / 30);

    let tempFactor = 0;
    if (temp >= 18 && temp <= 32) {
      tempFactor = 1 - Math.abs(temp - 25) / 11;
    }
    tempFactor = Math.max(0, tempFactor);

    const rainMultiplier = rainToday > 0 ? 1.3 : 1.0;
    const rawScore = Math.round(rhFactor * tempFactor * rainMultiplier * 100);
    const score = Math.max(15, Math.min(96, rawScore));

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
            {isUserLahan ? `Rincian Lahan ${activePetani.nama_petani}` : 'Rincian Lahan Percontohan (Brebes)'}
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
            <span className="text-slate-900 font-bold">{activePetani.nama_petani}</span>
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
                    Risiko Jamur & Penyakit Daun
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {fungalRisk.level}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pt-1">
                  {fungalRisk.advice}
                </p>
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
                {weather.status_tanah === 'Kering'
                  ? `Tanah ${lahanTerm} mulai mengering. Segera alirkan air irigasi secukupnya ke parit agar tanaman tidak layu.`
                  : weather.status_tanah === 'Jenuh Air'
                  ? `Tanah ${lahanTerm} terlalu becek dan tergenang. Buka saluran parit pembuangan agar akar tanaman tidak terendam dan membusuk.`
                  : isPadi
                  ? 'Kandungan air tanah sangat pas (macak-macak). Akar tanaman leluasa bernapas dan menyerap pupuk.'
                  : 'Kandungan air tanah sangat pas gembur. Akar tanaman leluasa bernapas dan menyerap nutrisi pupuk.'}
              </p>
            </div>

            {/* Grid 2 Kartu Pendukung Tanpa Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Panduan Tebar Pupuk
                  </span>
                  <strong className="text-slate-900 text-xs">
                    {leachingAdvisor.status}
                  </strong>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pt-1">
                  {leachingAdvisor.advice}
                </p>
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
                  <span className="text-[11px] text-slate-500 font-medium block">Tahapan Tanaman Saat Ini</span>
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
