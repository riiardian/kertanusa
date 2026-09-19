import { NextResponse } from 'next/server';
import { getAllPetani, addPetani, deletePetani } from '@/lib/db';

export async function GET() {
  try {
    const data = getAllPetani();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat data petani' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_petani, luas_tanah, satuan_luas, daerah, lat, lon, akurasi_gps, jenis_tanaman, waktu_tanam, kontak, catatan } = body;

    if (!nama_petani || !luas_tanah || !daerah || !jenis_tanaman || !waktu_tanam) {
      return NextResponse.json({ 
        success: false, 
        message: 'Mohon lengkapi 5 parameter wajib: Nama, Luas Tanah, Daerah, Jenis Tanaman, dan Waktu Tanam.' 
      }, { status: 400 });
    }

        const newPetani = addPetani({
      nama_petani,
      luas_tanah: Number(luas_tanah),
      satuan_luas: satuan_luas || 'm²',
      daerah,
      lat: lat ? Number(lat) : undefined,
      lon: lon ? Number(lon) : undefined,
      akurasi_gps: akurasi_gps ? Number(akurasi_gps) : undefined,
      jenis_tanaman,
      waktu_tanam,
      kontak,
      catatan
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID Petani diperlukan' }, { status: 400 });
    }
    const success = deletePetani(id);
    if (success) {
      return NextResponse.json({ success: true, message: 'Data petani berhasil dihapus.' });
    }
    return NextResponse.json({ success: false, message: 'Data tidak ditemukan.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 });
  }
}
