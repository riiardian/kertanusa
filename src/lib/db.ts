import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PetaniRecord, VisionAnalysisResult } from './types';
import { getCropInfo } from './crops';
import { getRegionProfile } from './agro_regions';
import { maskPhoneNumber } from './sanitize';

// Direktori penyimpanan data permanen (diabaikan oleh Git agar tidak terhapus saat deploy/restart)
const STORAGE_DIR = path.join(process.cwd(), 'storage');
const DB_FILE = path.join(STORAGE_DIR, 'kertanusa_db.json');
const BACKUP_DIR = path.join(STORAGE_DIR, 'backups');
const SEED_FILE = path.join(process.cwd(), 'data', 'agro_data.json');

interface DatabaseSchema {
  petani: PetaniRecord[];
  scans: VisionAnalysisResult[];
  _version: number;
  _updated_at: string;
}

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

export function getAllPetani(includeSensitive: boolean = false): PetaniRecord[] {
  const db = readPersistentDb();
  const list = (db.petani || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return list.map(item => {
    const safeRecord = { ...item };
    delete safeRecord.delete_token; // Jangan pernah membocorkan delete_token ke publik
    if (!includeSensitive && safeRecord.kontak) {
      safeRecord.kontak = maskPhoneNumber(safeRecord.kontak);
    }
    return safeRecord;
  });
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

  // Bangkitkan delete_token rahasia berkemampuan khusus (Capability-Based Security)
  const deleteToken = 'dtk-' + crypto.randomBytes(12).toString('hex');

  const newRecord: PetaniRecord = {
    id: 'ptn-' + Date.now().toString(36),
    nama_petani: data.nama_petani,
    kontak: data.kontak || '',
    delete_token: deleteToken,
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

  // Batasi total kapasitas database petani (mencegah DoS Storage & Resource Exhaustion)
  if (db.petani.length >= 200) {
    const defaultIds = new Set(DEFAULT_DATA_PETANI.map(d => d.id));
    const oldestIndex = db.petani.findLastIndex(p => !defaultIds.has(p.id));
    if (oldestIndex !== -1) {
      db.petani.splice(oldestIndex, 1);
    }
  }

  db.petani.unshift(newRecord);
  saveAtomicDb(db);
  return newRecord;
}

export interface DeletePetaniResult {
  success: boolean;
  status: 'SUCCESS' | 'UNAUTHORIZED' | 'NOT_FOUND';
}

export function deletePetani(
  id: string,
  auth?: { isAdmin?: boolean; deleteToken?: string }
): DeletePetaniResult {
  const db = readPersistentDb();
  const target = db.petani.find(p => p.id === id);
  if (!target) {
    return { success: false, status: 'NOT_FOUND' };
  }

  // Cek otorisasi: Wajib merupakan Admin ATAU pemegang delete_token sah dari record ini
  const isAuthorized = Boolean(
    auth?.isAdmin ||
    (auth?.deleteToken && target.delete_token && auth.deleteToken === target.delete_token)
  );

  if (!isAuthorized) {
    return { success: false, status: 'UNAUTHORIZED' };
  }

  db.petani = db.petani.filter(p => p.id !== id);
  saveAtomicDb(db);
  return { success: true, status: 'SUCCESS' };
}

export function getAllScans(): VisionAnalysisResult[] {
  const db = readPersistentDb();
  return db.scans || [];
}

export function addScanRecord(scan: VisionAnalysisResult): void {
  const db = readPersistentDb();
  if (!db.scans) db.scans = [];
  db.scans.unshift(scan);
  // Pangkas ke maksimal 30 scan terakhir untuk mencegah memory leak & storage bloat
  if (db.scans.length > 30) {
    db.scans = db.scans.slice(0, 30);
  }
  saveAtomicDb(db);
}
