import { NextResponse } from 'next/server';
import { getAllPetani, addPetani, deletePetani } from '@/lib/db';
import { isRecognizedCrop } from '@/lib/crops';
import { getClientIp, checkRateLimit } from '@/lib/rate_limiter';
import { sanitizeText, sanitizeNumeric, isValidCoordinate } from '@/lib/sanitize';
import { verifyAdminAuthorization } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 'petani_get', 60, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak permintaan data. Tunggu sejenak.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    // Hanya tampilkan nomor kontak penuh jika diakses oleh Administrator sah
    const isAdmin = verifyAdminAuthorization(request);
    const data = getAllPetani(isAdmin);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat data petani' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Maksimal 15 pendaftaran lahan per menit per IP
    const rate = checkRateLimit(ip, 'petani_post', 15, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: `Batas pendaftaran tercapai. Silakan coba lagi dalam ${rate.resetInSeconds} detik.` },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    const body = await request.json();
    const { 
      nama_petani, 
      luas_tanah, 
      satuan_luas, 
      daerah, 
      lat, 
      lon, 
      akurasi_gps, 
      jenis_tanaman, 
      waktu_tanam, 
      kontak, 
      catatan 
    } = body;

    // 1. Sanitasi Input Teks
    const cleanNama = sanitizeText(nama_petani, 100);
    const cleanDaerah = sanitizeText(daerah, 150);
    const cleanTanaman = sanitizeText(jenis_tanaman, 100);
    const cleanWaktuTanam = sanitizeText(waktu_tanam, 30);
    const cleanKontak = sanitizeText(kontak, 30);
    const cleanCatatan = sanitizeText(catatan, 500);

    // 2. Sanitasi & Validasi Numerik
    const cleanLuas = sanitizeNumeric(luas_tanah, 1, 10_000_000);
    const cleanSatuan = (satuan_luas === 'hektar' ? 'hektar' : 'm²') as 'm²' | 'hektar';

    if (!cleanNama || cleanLuas === null || !cleanDaerah || !cleanTanaman || !cleanWaktuTanam) {
      return NextResponse.json({ 
        success: false, 
        message: 'Mohon lengkapi parameter wajib dengan format valid: Nama, Luas Tanah, Daerah, Jenis Tanaman, dan Waktu Tanam.' 
      }, { status: 400 });
    }

    if (!isRecognizedCrop(cleanTanaman)) {
      return NextResponse.json({
        success: false,
        message: `Komoditas "${cleanTanaman}" tidak dikenali sebagai tanaman budidaya pertanian/hortikultura resmi.`
      }, { status: 400 });
    }

    // 3. Validasi Koordinat GPS jika disediakan
    const numLat = lat !== undefined && lat !== null ? Number(lat) : undefined;
    const numLon = lon !== undefined && lon !== null ? Number(lon) : undefined;
    const isCoordsValid = numLat !== undefined && numLon !== undefined ? isValidCoordinate(numLat, numLon) : true;

    if (!isCoordsValid) {
      return NextResponse.json({
        success: false,
        message: 'Titik koordinat GPS tidak valid (-90 s/d 90 untuk latitude, -180 s/d 180 untuk longitude).'
      }, { status: 400 });
    }

    const newPetani = addPetani({
      nama_petani: cleanNama,
      luas_tanah: cleanLuas,
      satuan_luas: cleanSatuan,
      daerah: cleanDaerah,
      lat: numLat,
      lon: numLon,
      akurasi_gps: akurasi_gps ? Math.min(10000, Math.max(0, Number(akurasi_gps))) : undefined,
      jenis_tanaman: cleanTanaman,
      waktu_tanam: cleanWaktuTanam,
      kontak: cleanKontak,
      catatan: cleanCatatan
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Data lahan dan profil petani berhasil disimpan untuk riset!',
      data: newPetani 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server saat menyimpan data.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 'petani_delete', 15, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak permintaan hapus. Tunggu sejenak.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = sanitizeText(searchParams.get('id'), 50);
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID Petani diperlukan' }, { status: 400 });
    }

    // VERIFIKASI KEAMANAN OTORISASI (Anti-Broken Access Control):
    // Memeriksa Kunci Admin (Header / Bearer) atau Delete Token sah pemilik record
    const isAdmin = verifyAdminAuthorization(request);
    const clientDeleteToken = request.headers.get('x-delete-token') || searchParams.get('delete_token');

    const result = deletePetani(id, {
      isAdmin,
      deleteToken: clientDeleteToken ? clientDeleteToken.trim() : undefined
    });

    if (result.status === 'UNAUTHORIZED') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Akses ditolak: Operasi ini membutuhkan otorisasi Kunci Admin atau Delete Token yang sah.' 
        }, 
        { status: 401 }
      );
    }

    if (result.status === 'NOT_FOUND') {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Data petani berhasil dihapus secara aman.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 });
  }
}
