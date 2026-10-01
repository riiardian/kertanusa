export interface PetaniRecord {
  id: string;
  nama_petani: string;
  kontak?: string;
  luas_tanah: number;
  satuan_luas: 'm²' | 'hektar';
  daerah: string;
  lat?: number;
  lon?: number;
  akurasi_gps?: number;
  jenis_tanaman: string;
  waktu_tanam: string;
  estimasi_panen?: string;
  umur_hari?: number;
  kelembapan_tanah?: number;
  suhu_lingkungan?: number;
  ph_tanah?: number;
  status_tanaman?: 'Vegetatif Awal' | 'Vegetatif Aktif' | 'Generatif/Berbunga' | 'Pematangan Buah' | 'Siap Panen';
  catatan?: string;
  created_at: string;
}

export interface RegionProfile {
  id: string;
  nama: string;
  provinsi: string;
  lat: number;
  lon: number;
  jenis_tanah: string;
  ph_rata_rata: number;
  suhu_rata_rata: number;
  kelembapan_tanah_default: number;
  curah_hujan_tahunan: string;
  komoditas_unggulan: string[];
}

export interface WeatherData {
  suhu: number;
  suhu_min: number;
  suhu_max: number;
  kelembapan_udara: number;
  kelembapan_tanah: number;
  status_tanah: 'Kering' | 'Optimal' | 'Jenuh Air';
  kondisi: string;
  is_day?: number;
  deskripsi: string;
  radiasi_surya: number;
  potensi_pompa_surya: 'Rendah' | 'Sedang' | 'Optimal';
  ph_tanah: number;
  status_ph: 'Sangat Masam' | 'Masam' | 'Ideal/Netral' | 'Basa';
  rekomendasi_ph: string;
  kecepatan_angin?: number;
  sumber_data?: string;
  lat?: number;
  lon?: number;
  prakiraan_7hari: Array<{
    hari: string;
    tanggal?: string;
    suhu: number;
    kondisi: string;
    curah_hujan: number;
    icon: string;
  }>;
  prakiraan_14hari?: Array<{
    hari: string;
    tanggal?: string;
    suhu: number;
    kondisi: string;
    curah_hujan: number;
    icon: string;
  }>;
}

export interface VisionAnalysisResult {
  id: string;
  nama_tanaman: string;
  kategori_diagnosa: 'Hama' | 'Penyakit' | 'Fisiologis' | 'Tanaman Sehat';
  nama_masalah: string;
  tingkat_keparahan: 'Ringan' | 'Sedang' | 'Parah' | 'Aman';
  akurasi: number;
  status_kematangan: 'Belum Cukup Panen' | 'Mendekati Panen' | 'Siap Panen (Super Grade A)';
  estimasi_hari_panen: number;
  ciri_visual: string[];
  rekomendasi_pupuk: {
    jenis: string;
    formula: string;
    dosis: string;
    cara_aplikasi: string;
  }[];
  solusi_perawatan: string[];
  pestisida_nabati_organik: string[];
}

export interface MarketCommodityTrend {
  komoditas: string;
  harga_saat_ini: number;
  tren_mingguan: 'Naik' | 'Turun' | 'Stabil';
  persentase_tren: number;
  musim_puncak: string;
  bulan_harga_tertinggi: string[];
  alasan_permintaan: string;
  rekomendasi_waktu_tanam: string;
  historis_bulanan: Array<{
    bulan: string;
    harga: number;
    indeks_daya_beli: number;
  }>;
}