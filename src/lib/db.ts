import fs from 'fs';
import path from 'path';
import { PetaniRecord, VisionAnalysisResult, KuesionerRecord } from './types';
import { getCropInfo } from './crops';
import { getRegionProfile } from './agro_regions';

// Direktori penyimpanan data permanen (diabaikan oleh Git agar tidak terhapus saat deploy/restart)
const STORAGE_DIR = path.join(process.cwd(), 'storage');
const DB_FILE = path.join(STORAGE_DIR, 'kertanusa_db.json');
const BACKUP_DIR = path.join(STORAGE_DIR, 'backups');
const SEED_FILE = path.join(process.cwd(), 'data', 'agro_data.json');

interface DatabaseSchema {
  petani: PetaniRecord[];
  scans: VisionAnalysisResult[];
  kuesioner?: KuesionerRecord[];
  _version: number;
  _updated_at: string;
}

const DEFAULT_KUESIONER: KuesionerRecord[] = [
  {
    id: 'ku-001',
    nama: 'Ir. Bambang Setyawan, MP',
    profesi: 'Penyuluh Pertanian',
    skor_kemudahan: 5,
    akurasi_fitur: 'Sangat Akurat',
    fitur_favorit: 'Radar Cuaca & Jadwal Semprot',
    masukan: 'Fitur evaluasi kecepatan angin dan potensi hujan BMKG sangat membantu petani binaan kami menentukan jam semprot yang tepat sehingga pestisida tidak luntur percuma.',
    created_at: '2026-10-09T08:30:00.000Z'
  },
  {
    id: 'ku-002',
    nama: 'H. Mulyono',
    profesi: 'Petani',
    skor_kemudahan: 5,
    akurasi_fitur: 'Sangat Akurat',
    fitur_favorit: 'Scan AI Penyakit',
    masukan: 'Foto daun busuk langsung dikenali dan keluar resep pupuk takaran pas serta racikan obat nabati alami. Bahasanya lugas dan mudah dimengerti petani tua di desa.',
    created_at: '2026-10-09T14:15:00.000Z'
  },
  {
    id: 'ku-003',
    nama: 'Diah Ayu Larasati, S.P.',
    profesi: 'Akademisi / Peneliti',
    skor_kemudahan: 5,
    akurasi_fitur: 'Sangat Akurat',
    fitur_favorit: 'Analisis Tren Pasar & Bibit',
    masukan: 'Algoritma pencocokan varietas benih padi dan hortikultura terhadap agroekologi lokal sangat solid. Sangat relevan sebagai instrumen mitigasi risiko over-supply pasokan pangan.',
    created_at: '2026-10-10T10:45:00.000Z'
  },
  {
    id: 'ku-004',
    nama: 'Rendy Kurniawan',
    profesi: 'Mahasiswa',
    skor_kemudahan: 4,
    akurasi_fitur: 'Cukup Akurat',
    fitur_favorit: 'Peta Geospasial Sawah',
    masukan: 'Tampilan peta sebaran lahan sangat interaktif dan responsif di smartphone. Kalkulator kebutuhan pupuk otomatis per luas lahan sangat aplikatif di lapangan.',
    created_at: '2026-10-10T16:20:00.000Z'
  }
];

const DEFAULT_DATA_PETANI: PetaniRecord[] = [
  {
    id: 'ptn-001',
    nama_petani: 'H. Subandi',
    kontak: '0812-3456-7890',
    luas_tanah: 1500,
    satuan_luas: 'm²',
    daerah: 'Brebes, Jawa Tengah',
    lat: -6.8703,
    lon: 109.0435,
    akurasi_gps: 8,
    jenis_tanaman: 'Bawang Merah',
    waktu_tanam: '2026-08-10',
    estimasi_panen: '2026-10-09',
    umur_hari: 40,
    kelembapan_tanah: 58,
    suhu_lingkungan: 29.5,
    ph_tanah: 6.5,
    status_tanaman: 'Generatif/Berbunga',
    catatan: 'Varietas Bima Brebes, menggunakan mulsa perak dan irigasi pompa surya efisiensi tinggi.',
    created_at: '2026-08-10T08:00:00.000Z'
  },
  {
    id: 'ptn-002',
    nama_petani: 'Ibu Rahmawati',
    kontak: '0857-9876-5432',
    luas_tanah: 2500,
    satuan_luas: 'm²',
    daerah: 'Malang / Batu, Jawa Timur',
    lat: -7.9826,
    lon: 112.6308,
    akurasi_gps: 12,
    jenis_tanaman: 'Cabai Rawit Merah',
    waktu_tanam: '2026-07-20',
    estimasi_panen: '2026-10-08',
    umur_hari: 61,
    kelembapan_tanah: 68,
    suhu_lingkungan: 22.8,
    ph_tanah: 6.2,
    status_tanaman: 'Pematangan Buah',
    catatan: 'Persiapan panen petik merah menyambut puncak permintaan pasar bulan depan.',
    created_at: '2026-07-20T09:30:00.000Z'
  },
  {
    id: 'ptn-003',
    nama_petani: 'I Wayan Sudarma',
    kontak: '0878-1122-3344',
    luas_tanah: 1,
    satuan_luas: 'hektar',
    daerah: 'Tabanan, Bali',
    lat: -8.5411,
    lon: 115.1252,
    akurasi_gps: 6,
    jenis_tanaman: 'Padi Sawah (Ciherang/Inpari)',
    waktu_tanam: '2026-06-15',
    estimasi_panen: '2026-10-10',
    umur_hari: 96,
    kelembapan_tanah: 85,
    suhu_lingkungan: 25.4,
    ph_tanah: 6.4,
    status_tanaman: 'Pematangan Buah',
    catatan: 'Sistem irigasi Subak tradisional terintegrasi penampungan air gravitasi tenaga surya.',
    created_at: '2026-06-15T07:15:00.000Z'
  },
  {
    id: 'ptn-004',
    nama_petani: 'Kang Ahmad Mulyana',
    kontak: '0821-4455-6677',
    luas_tanah: 800,
    satuan_luas: 'm²',
    daerah: 'Cianjur, Jawa Barat',
    lat: -6.8222,
    lon: 107.1394,
    akurasi_gps: 15,
    jenis_tanaman: 'Tomat',
    waktu_tanam: '2026-08-25',
    estimasi_panen: '2026-11-03',
    umur_hari: 25,
    kelembapan_tanah: 72,
    suhu_lingkungan: 24.1,
    ph_tanah: 5.9,
    status_tanaman: 'Vegetatif Aktif',
    catatan: 'Budidaya naungan agrivoltaik bebas pestisida kimia sintetis.',
    created_at: '2026-08-25T10:00:00.000Z'
  }
];

function ensureStorageDir(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function loadInitialSeed(): DatabaseSchema {
  let initialPetani = DEFAULT_DATA_PETANI;
  if (fs.existsSync(SEED_FILE)) {
    try {
      const raw = fs.readFileSync(SEED_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.petani) && parsed.petani.length > 0) {
        initialPetani = parsed.petani;
      }
    } catch (err) {
      console.warn('Gagal memuat seed agro_data.json:', err);
    }
  }

  const initialDb: DatabaseSchema = {
    petani: initialPetani,
    scans: [],
    _version: 1,
    _updated_at: new Date().toISOString()
  };

  saveAtomicDb(initialDb);
  return initialDb;
}

function readPersistentDb(): DatabaseSchema {
  ensureStorageDir();
  if (!fs.existsSync(DB_FILE)) {
    return loadInitialSeed();
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.petani)) {
      return loadInitialSeed();
    }
    if (!Array.isArray(parsed?.kuesioner) || parsed.kuesioner.length === 0) {
      parsed.kuesioner = DEFAULT_KUESIONER;
      saveAtomicDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error membaca database kertanusa_db.json:', err);
    return loadInitialSeed();
  }
}

// Operasi penulisan ATOMIK (Crash-safe & anti-corrupt saat restart PM2/server)
function saveAtomicDb(data: DatabaseSchema): boolean {
  try {
    ensureStorageDir();
    data._updated_at = new Date().toISOString();
    const tempFile = path.join(STORAGE_DIR, `kertanusa_db.tmp.${Date.now()}`);
    
    // Tulis ke temp file terlebih dahulu
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    
    // Rename atomik (menimpa DB_FILE secara instan tanpa jeda korup)
    fs.renameSync(tempFile, DB_FILE);

    // Buat salinan cadangan berkala
    try {
      const backupFile = path.join(BACKUP_DIR, 'kertanusa_latest_backup.json');
      fs.copyFileSync(DB_FILE, backupFile);
    } catch {
      // Abaikan kegagalan backup sekunder
    }

    return true;
  } catch (err) {
    console.error('Error menyimpan database atomik:', err);
    return false;
  }
}

export function getAllPetani(): PetaniRecord[] {
  const db = readPersistentDb();
  return (db.petani || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function addPetani(data: {
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
  catatan?: string;
}): PetaniRecord {
  const db = readPersistentDb();
  const cropInfo = getCropInfo(data.jenis_tanaman);
  const regionProfile = getRegionProfile(data.daerah);

  // Hitung estimasi panen
  const tanamDate = new Date(data.waktu_tanam);
  const panenDate = new Date(tanamDate);
  panenDate.setDate(panenDate.getDate() + cropInfo.umur_panen_hari);

  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - tanamDate.getTime());
  const umurHari = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let statusTanaman: PetaniRecord['status_tanaman'] = 'Vegetatif Awal';
  if (umurHari > cropInfo.umur_panen_hari - 10) statusTanaman = 'Siap Panen';
  else if (umurHari > cropInfo.umur_panen_hari * 0.6) statusTanaman = 'Pematangan Buah';
  else if (umurHari > cropInfo.umur_panen_hari * 0.4) statusTanaman = 'Generatif/Berbunga';
  else if (umurHari > 20) statusTanaman = 'Vegetatif Aktif';

  const newRecord: PetaniRecord = {
    id: 'ptn-' + Date.now().toString(36),
    nama_petani: data.nama_petani,
    kontak: data.kontak || '',
    luas_tanah: Number(data.luas_tanah),
    satuan_luas: data.satuan_luas,
    daerah: data.daerah,
    lat: data.lat ?? regionProfile.lat,
    lon: data.lon ?? regionProfile.lon,
    akurasi_gps: data.akurasi_gps,
    jenis_tanaman: data.jenis_tanaman,
    waktu_tanam: data.waktu_tanam,
    estimasi_panen: panenDate.toISOString().split('T')[0],
    umur_hari: umurHari,
    kelembapan_tanah: regionProfile.kelembapan_tanah_default,
    suhu_lingkungan: regionProfile.suhu_rata_rata,
    ph_tanah: regionProfile.ph_rata_rata,
    status_tanaman: statusTanaman,
    catatan: data.catatan || '',
    created_at: new Date().toISOString()
  };

  db.petani.unshift(newRecord);
  saveAtomicDb(db);
  return newRecord;
}

export function deletePetani(id: string): boolean {
  const db = readPersistentDb();
  const initialLen = db.petani.length;
  db.petani = db.petani.filter(p => p.id !== id);
  if (db.petani.length !== initialLen) {
    saveAtomicDb(db);
    return true;
  }
  return false;
}

export function getAllScans(): VisionAnalysisResult[] {
  const db = readPersistentDb();
  return db.scans || [];
}

export function addScanRecord(scan: VisionAnalysisResult): void {
  const db = readPersistentDb();
  if (!db.scans) db.scans = [];
  db.scans.unshift(scan);
  saveAtomicDb(db);
}

export function getAllKuesioner(): KuesionerRecord[] {
  const db = readPersistentDb();
  return (db.kuesioner || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function addKuesioner(data: {
  nama: string;
  profesi: KuesionerRecord['profesi'];
  skor_kemudahan: number;
  akurasi_fitur: KuesionerRecord['akurasi_fitur'];
  fitur_favorit: string;
  masukan: string;
}): KuesionerRecord {
  const db = readPersistentDb();
  if (!db.kuesioner) db.kuesioner = [];

  const newRecord: KuesionerRecord = {
    id: 'ku-' + Date.now().toString(36),
    nama: data.nama.trim() || 'Pengguna Terverifikasi',
    profesi: data.profesi,
    skor_kemudahan: Math.min(5, Math.max(1, Number(data.skor_kemudahan) || 5)),
    akurasi_fitur: data.akurasi_fitur,
    fitur_favorit: data.fitur_favorit,
    masukan: data.masukan.trim(),
    created_at: new Date().toISOString()
  };

  db.kuesioner.unshift(newRecord);
  saveAtomicDb(db);
  return newRecord;
}
