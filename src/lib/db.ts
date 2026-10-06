import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { PetaniRecord, VisionAnalysisResult } from './types';
import { getCropInfo } from './crops';
import { getRegionProfile } from './agro_regions';

// Direktori & file database SQLite persisten
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kertanusa.db');
const SEED_JSON_FILE = path.join(DATA_DIR, 'agro_data.json');

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

// Singleton SQLite Database connection
// Menjaga koneksi tetap persisten & aman dari hot reload Next.js
declare global {
  // eslint-disable-next-line no-var
  var __kertanusa_sqlite_db: Database.Database | undefined;
}

function getDatabase(): Database.Database {
  if (global.__kertanusa_sqlite_db) {
    return global.__kertanusa_sqlite_db;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_FILE);

  // Optimasi WAL (Write-Ahead Logging) untuk konkurensi cepat dan bebas crash
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  // Buat tabel petani jika belum ada
  db.exec(`
    CREATE TABLE IF NOT EXISTS petani (
      id TEXT PRIMARY KEY,
      nama_petani TEXT NOT NULL,
      kontak TEXT,
      luas_tanah REAL NOT NULL,
      satuan_luas TEXT NOT NULL,
      daerah TEXT NOT NULL,
      lat REAL,
      lon REAL,
      akurasi_gps REAL,
      jenis_tanaman TEXT NOT NULL,
      waktu_tanam TEXT NOT NULL,
      estimasi_panen TEXT,
      umur_hari INTEGER,
      kelembapan_tanah REAL,
      suhu_lingkungan REAL,
      ph_tanah REAL,
      status_tanaman TEXT,
      catatan TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      nama_tanaman TEXT NOT NULL,
      kategori_diagnosa TEXT,
      nama_masalah TEXT,
      tingkat_keparahan TEXT,
      akurasi REAL,
      status_kematangan TEXT,
      estimasi_hari_panen INTEGER,
      ciri_visual TEXT,
      rekomendasi_pupuk TEXT,
      solusi_perawatan TEXT,
      pestisida_nabati_organik TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Periksa apakah tabel petani masih kosong; jika iya, seed dari agro_data.json atau default
  const countRow = db.prepare('SELECT COUNT(*) as count FROM petani').get() as { count: number };
  if (countRow.count === 0) {
    let seedList = DEFAULT_DATA_PETANI;
    if (fs.existsSync(SEED_JSON_FILE)) {
      try {
        const raw = fs.readFileSync(SEED_JSON_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.petani) && parsed.petani.length > 0) {
          seedList = parsed.petani;
        }
      } catch (err) {
        console.warn('Gagal membaca seed agro_data.json, memakai default data:', err);
      }
    }

    const insertStmt = db.prepare(`
      INSERT INTO petani (
        id, nama_petani, kontak, luas_tanah, satuan_luas, daerah,
        lat, lon, akurasi_gps, jenis_tanaman, waktu_tanam, estimasi_panen,
        umur_hari, kelembapan_tanah, suhu_lingkungan, ph_tanah, status_tanaman,
        catatan, created_at
      ) VALUES (
        @id, @nama_petani, @kontak, @luas_tanah, @satuan_luas, @daerah,
        @lat, @lon, @akurasi_gps, @jenis_tanaman, @waktu_tanam, @estimasi_panen,
        @umur_hari, @kelembapan_tanah, @suhu_lingkungan, @ph_tanah, @status_tanaman,
        @catatan, @created_at
      )
    `);

    const insertMany = db.transaction((rows: PetaniRecord[]) => {
      for (const row of rows) {
        insertStmt.run({
          id: row.id,
          nama_petani: row.nama_petani,
          kontak: row.kontak || null,
          luas_tanah: Number(row.luas_tanah),
          satuan_luas: row.satuan_luas || 'm²',
          daerah: row.daerah,
          lat: row.lat ?? null,
          lon: row.lon ?? null,
          akurasi_gps: row.akurasi_gps ?? null,
          jenis_tanaman: row.jenis_tanaman,
          waktu_tanam: row.waktu_tanam,
          estimasi_panen: row.estimasi_panen || null,
          umur_hari: row.umur_hari ?? null,
          kelembapan_tanah: row.kelembapan_tanah ?? null,
          suhu_lingkungan: row.suhu_lingkungan ?? null,
          ph_tanah: row.ph_tanah ?? null,
          status_tanaman: row.status_tanaman || 'Vegetatif Awal',
          catatan: row.catatan || null,
          created_at: row.created_at || new Date().toISOString()
        });
      }
    });

    insertMany(seedList);
  }

  global.__kertanusa_sqlite_db = db;
  return db;
}

export function getAllPetani(): PetaniRecord[] {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM petani ORDER BY datetime(created_at) DESC').all() as any[];
    return rows.map(r => ({
      ...r,
      luas_tanah: Number(r.luas_tanah),
      lat: r.lat !== null ? Number(r.lat) : undefined,
      lon: r.lon !== null ? Number(r.lon) : undefined,
      akurasi_gps: r.akurasi_gps !== null ? Number(r.akurasi_gps) : undefined,
      umur_hari: r.umur_hari !== null ? Number(r.umur_hari) : undefined,
      kelembapan_tanah: r.kelembapan_tanah !== null ? Number(r.kelembapan_tanah) : undefined,
      suhu_lingkungan: r.suhu_lingkungan !== null ? Number(r.suhu_lingkungan) : undefined,
      ph_tanah: r.ph_tanah !== null ? Number(r.ph_tanah) : undefined
    }));
  } catch (err) {
    console.error('Error getAllPetani SQLite:', err);
    return DEFAULT_DATA_PETANI;
  }
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
  const db = getDatabase();
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

  const stmt = db.prepare(`
    INSERT INTO petani (
      id, nama_petani, kontak, luas_tanah, satuan_luas, daerah,
      lat, lon, akurasi_gps, jenis_tanaman, waktu_tanam, estimasi_panen,
      umur_hari, kelembapan_tanah, suhu_lingkungan, ph_tanah, status_tanaman,
      catatan, created_at
    ) VALUES (
      @id, @nama_petani, @kontak, @luas_tanah, @satuan_luas, @daerah,
      @lat, @lon, @akurasi_gps, @jenis_tanaman, @waktu_tanam, @estimasi_panen,
      @umur_hari, @kelembapan_tanah, @suhu_lingkungan, @ph_tanah, @status_tanaman,
      @catatan, @created_at
    )
  `);

  stmt.run({
    id: newRecord.id,
    nama_petani: newRecord.nama_petani,
    kontak: newRecord.kontak || null,
    luas_tanah: newRecord.luas_tanah,
    satuan_luas: newRecord.satuan_luas,
    daerah: newRecord.daerah,
    lat: newRecord.lat ?? null,
    lon: newRecord.lon ?? null,
    akurasi_gps: newRecord.akurasi_gps ?? null,
    jenis_tanaman: newRecord.jenis_tanaman,
    waktu_tanam: newRecord.waktu_tanam,
    estimasi_panen: newRecord.estimasi_panen || null,
    umur_hari: newRecord.umur_hari ?? null,
    kelembapan_tanah: newRecord.kelembapan_tanah ?? null,
    suhu_lingkungan: newRecord.suhu_lingkungan ?? null,
    ph_tanah: newRecord.ph_tanah ?? null,
    status_tanaman: newRecord.status_tanaman || 'Vegetatif Awal',
    catatan: newRecord.catatan || null,
    created_at: newRecord.created_at
  });

  return newRecord;
}

export function deletePetani(id: string): boolean {
  try {
    const db = getDatabase();
    const info = db.prepare('DELETE FROM petani WHERE id = ?').run(id);
    return info.changes > 0;
  } catch (err) {
    console.error('Error deletePetani SQLite:', err);
    return false;
  }
}

export function getAllScans(): VisionAnalysisResult[] {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM scans ORDER BY datetime(created_at) DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      nama_tanaman: r.nama_tanaman,
      kategori_diagnosa: r.kategori_diagnosa,
      nama_masalah: r.nama_masalah,
      tingkat_keparahan: r.tingkat_keparahan,
      akurasi: Number(r.akurasi),
      status_kematangan: r.status_kematangan,
      estimasi_hari_panen: Number(r.estimasi_hari_panen),
      ciri_visual: r.ciri_visual ? JSON.parse(r.ciri_visual) : [],
      rekomendasi_pupuk: r.rekomendasi_pupuk ? JSON.parse(r.rekomendasi_pupuk) : [],
      solusi_perawatan: r.solusi_perawatan ? JSON.parse(r.solusi_perawatan) : [],
      pestisida_nabati_organik: r.pestisida_nabati_organik ? JSON.parse(r.pestisida_nabati_organik) : []
    }));
  } catch (err) {
    console.error('Error getAllScans SQLite:', err);
    return [];
  }
}

export function addScanRecord(scan: VisionAnalysisResult): void {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO scans (
        id, nama_tanaman, kategori_diagnosa, nama_masalah, tingkat_keparahan,
        akurasi, status_kematangan, estimasi_hari_panen, ciri_visual,
        rekomendasi_pupuk, solusi_perawatan, pestisida_nabati_organik, created_at
      ) VALUES (
        @id, @nama_tanaman, @kategori_diagnosa, @nama_masalah, @tingkat_keparahan,
        @akurasi, @status_kematangan, @estimasi_hari_panen, @ciri_visual,
        @rekomendasi_pupuk, @solusi_perawatan, @pestisida_nabati_organik, @created_at
      )
    `);

    stmt.run({
      id: scan.id,
      nama_tanaman: scan.nama_tanaman,
      kategori_diagnosa: scan.kategori_diagnosa,
      nama_masalah: scan.nama_masalah,
      tingkat_keparahan: scan.tingkat_keparahan,
      akurasi: scan.akurasi,
      status_kematangan: scan.status_kematangan,
      estimasi_hari_panen: scan.estimasi_hari_panen,
      ciri_visual: JSON.stringify(scan.ciri_visual || []),
      rekomendasi_pupuk: JSON.stringify(scan.rekomendasi_pupuk || []),
      solusi_perawatan: JSON.stringify(scan.solusi_perawatan || []),
      pestisida_nabati_organik: JSON.stringify(scan.pestisida_nabati_organik || []),
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error addScanRecord SQLite:', err);
  }
}
