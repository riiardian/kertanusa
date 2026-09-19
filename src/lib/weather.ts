import { WeatherData } from './types';
import { getRegionProfile } from './agro_regions';

export function getWeatherData(daerah: string): WeatherData {
  const profile = getRegionProfile(daerah);

  // Variasi realistis harian
  const suhuNow = Math.round((profile.suhu_rata_rata + (Math.random() * 2 - 1)) * 10) / 10;
  const kelembapanTanah = profile.kelembapan_tanah_default;
  const phTanah = profile.ph_rata_rata;

  let statusTanah: 'Kering' | 'Optimal' | 'Jenuh Air' = 'Optimal';
  if (kelembapanTanah < 50) statusTanah = 'Kering';
  else if (kelembapanTanah > 80) statusTanah = 'Jenuh Air';

  let statusPh: 'Sangat Masam' | 'Masam' | 'Ideal/Netral' | 'Basa' = 'Ideal/Netral';
  let rekomendasiPh = 'pH tanah sangat ideal untuk penyerapan unsur hara N-P-K secara optimal.';

  if (phTanah < 5.5) {
    statusPh = 'Masam';
    const dosisDolomit = Math.round((6.5 - phTanah) * 2000); // kg/hektar
    rekomendasiPh = 'Tanah tergolong masam. Direkomendasikan penaburan kapur dolomit sebanyak ' + dosisDolomit.toLocaleString('id-ID') + ' kg/hektar saat pengolahan tanah 2 minggu sebelum tanam.';
  } else if (phTanah > 7.5) {
    statusPh = 'Basa';
    rekomendasiPh = 'Tanah agak basa. Berikan pupuk belerang (ZA) dan pupuk organik matang untuk menurunkan pH ke angka netral.';
  }

  // Radiasi surya (W/m2)
  const radiasiSurya = Math.round(650 + Math.random() * 250);
  let potensiPompaSurya: 'Rendah' | 'Sedang' | 'Optimal' = 'Optimal';
  if (radiasiSurya < 400) potensiPompaSurya = 'Rendah';
  else if (radiasiSurya < 700) potensiPompaSurya = 'Sedang';

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const todayIdx = new Date().getDay();

  const prakiraan7Hari = Array.from({ length: 7 }).map((_, i) => {
    const dayName = days[(todayIdx + i) % 7];
    const isRain = i % 3 === 1;
    return {
      hari: i === 0 ? 'Hari Ini' : dayName,
      suhu: Math.round(suhuNow + (i % 2 === 0 ? 1 : -1)),
      kondisi: isRain ? 'Hujan Ringan' : (i % 2 === 0 ? 'Cerah Berawan' : 'Cerah Terik'),
      curah_hujan: isRain ? 18.5 : 2.0,
      icon: isRain ? 'cloud-rain' : (i % 2 === 0 ? 'cloud-sun' : 'sun')
    };
  });

  return {
    suhu: suhuNow,
    suhu_min: Math.round(suhuNow - 5),
    suhu_max: Math.round(suhuNow + 4),
    kelembapan_udara: 75,
    kelembapan_tanah: kelembapanTanah,
    status_tanah: statusTanah,
    kondisi: 'Cerah Berawan',
    deskripsi: 'Kondisi cuaca stabil, sangat mendukung fotosintesis dan aktivitas operasional pompa surya.',
    radiasi_surya: radiasiSurya,
    potensi_pompa_surya: potensiPompaSurya,
    ph_tanah: phTanah,
    status_ph: statusPh,
    rekomendasi_ph: rekomendasiPh,
    prakiraan_7hari: prakiraan7Hari
  };
}
