import fs from 'fs';
import path from 'path';
import { PetaniRecord, VisionAnalysisResult } from './types';
import { getCropInfo } from './crops';
import { getRegionProfile } from './agro_regions';

const DATA_FILE = path.join(process.cwd(), 'data', 'agro_data.json');

interface DatabaseSchema {
  petani: PetaniRecord[];
  scans: VisionAnalysisResult[];
}

const DEFAULT_DATA: DatabaseSchema = {
  petani: [
    {
      id: 'ptn-001',
      nama_petani: 'H. Subandi',
      kontak: '0812-3456-7890',
      luas_tanah: 1500,
      satuan_luas: 'm²',
      daerah: 'Brebes, Jawa Tengah',
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
  ],
  scans: []
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return DEFAULT_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return DEFAULT_DATA;
  }
}

function writeDb(data: DatabaseSchema): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

export function getAllPetani(): PetaniRecord[] {
  const db = readDb();
  return db.petani.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function addPetani(data: {
  nama_petani: string;
  kontak?: string;
  luas_tanah: number;
  satuan_luas: 'm²' | 'hektar';
  daerah: string;
  jenis_tanaman: string;
  waktu_tanam: string;
  catatan?: string;
}): PetaniRecord {
  const db = readDb();
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
  writeDb(db);
  return newRecord;
}

export function deletePetani(id: string): boolean {
  const db = readDb();
  const initialLen = db.petani.length;
  db.petani = db.petani.filter(p => p.id !== id);
  if (db.petani.length !== initialLen) {
    writeDb(db);
    return true;
  }
  return false;
}

export function getAllScans(): VisionAnalysisResult[] {
  const db = readDb();
  return db.scans || [];
}

export function addScanRecord(scan: VisionAnalysisResult): void {
  const db = readDb();
  if (!db.scans) db.scans = [];
  db.scans.unshift(scan);
  writeDb(db);
}
