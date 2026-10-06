import { RegionProfile } from './types';

export const REGIONS: RegionProfile[] = [
  {
    id: 'brebes',
    nama: 'Brebes, Jawa Tengah',
    provinsi: 'Jawa Tengah',
    lat: -6.8703,
    lon: 109.0435,
    jenis_tanah: 'Alluvial & Grumosol (Lempung)',
    ph_rata_rata: 6.5,
    suhu_rata_rata: 30.2,
    kelembapan_tanah_default: 58,
    curah_hujan_tahunan: '1.800 - 2.200 mm/tahun',
    komoditas_unggulan: ['Bawang Merah', 'Cabai Rawit Merah', 'Padi Ciherang']
  },
  {
    id: 'malang',
    nama: 'Malang / Batu, Jawa Timur',
    provinsi: 'Jawa Timur',
    lat: -7.9797,
    lon: 112.6304,
    jenis_tanah: 'Andosol Vulkanis Subur',
    ph_rata_rata: 6.2,
    suhu_rata_rata: 22.4,
    kelembapan_tanah_default: 72,
    curah_hujan_tahunan: '2.400 - 2.900 mm/tahun',
    komoditas_unggulan: ['Apel (Manalagi / Rome Beauty)', 'Tomat', 'Cabai Rawit Merah', 'Sayuran Daun', 'Jagung Manis']
  },
  {
    id: 'cianjur',
    nama: 'Cianjur, Jawa Barat',
    provinsi: 'Jawa Barat',
    lat: -6.8222,
    lon: 107.1394,
    jenis_tanah: 'Latosol & Andosol',
    ph_rata_rata: 5.9,
    suhu_rata_rata: 24.8,
    kelembapan_tanah_default: 68,
    curah_hujan_tahunan: '2.600 - 3.200 mm/tahun',
    komoditas_unggulan: ['Padi Pandanwangi', 'Sayuran Hijau', 'Cabai Merah']
  },
  {
    id: 'lombok-timur',
    nama: 'Lombok Timur, NTB',
    provinsi: 'Nusa Tenggara Barat',
    lat: -8.6500,
    lon: 116.5333,
    jenis_tanah: 'Regosol & Litosol (Batu Berpasir)',
    ph_rata_rata: 6.8,
    suhu_rata_rata: 31.0,
    kelembapan_tanah_default: 42,
    curah_hujan_tahunan: '1.200 - 1.500 mm/tahun (Kering)',
    komoditas_unggulan: ['Cabai Rawit', 'Jagung Hibrida', 'Bawang Merah', 'Tembakau']
  },
  {
    id: 'karo',
    nama: 'Karo / Berastagi, Sumatera Utara',
    provinsi: 'Sumatera Utara',
    lat: 3.1189,
    lon: 98.5133,
    jenis_tanah: 'Vulkanik Dataran Tinggi (Piroklastik)',
    ph_rata_rata: 5.6,
    suhu_rata_rata: 20.1,
    kelembapan_tanah_default: 76,
    curah_hujan_tahunan: '2.500 - 3.000 mm/tahun',
    komoditas_unggulan: ['Tomat', 'Cabai Merah', 'Kentang', 'Jeruk']
  },
  {
    id: 'banyuwangi',
    nama: 'Banyuwangi, Jawa Timur',
    provinsi: 'Jawa Timur',
    lat: -8.2192,
    lon: 114.3692,
    jenis_tanah: 'Mediteran & Alluvial',
    ph_rata_rata: 6.7,
    suhu_rata_rata: 28.5,
    kelembapan_tanah_default: 55,
    curah_hujan_tahunan: '1.600 - 2.100 mm/tahun',
    komoditas_unggulan: ['Cabai Rawit', 'Padi', 'Buah Naga', 'Semangka']
  },
  {
    id: 'tabanan',
    nama: 'Tabanan, Bali',
    provinsi: 'Bali',
    lat: -8.5411,
    lon: 115.1256,
    jenis_tanah: 'Regosol Coklat & Latosol (Sistem Subak)',
    ph_rata_rata: 6.4,
    suhu_rata_rata: 25.3,
    kelembapan_tanah_default: 70,
    curah_hujan_tahunan: '2.200 - 2.700 mm/tahun',
    komoditas_unggulan: ['Padi Beras Merah', 'Kopi', 'Sayuran Hortikultura']
  }
];

export function getRegionProfile(namaDaerah: string): RegionProfile {
  const match = REGIONS.find(r => 
    namaDaerah.toLowerCase().includes(r.id) || 
    namaDaerah.toLowerCase().includes(r.nama.toLowerCase().split(',')[0])
  );
  return match || REGIONS[0];
}

export function getNearestRegionProfile(lat: number, lon: number): RegionProfile {
  let nearest = REGIONS[0];
  let minDistance = Infinity;
  for (const r of REGIONS) {
    const d = Math.hypot(r.lat - lat, r.lon - lon);
    if (d < minDistance) {
      minDistance = d;
      nearest = r;
    }
  }
  return nearest;
}
