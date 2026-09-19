'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, MapPin, Calendar, Ruler, User, 
  CheckCircle2, ArrowRight, Sparkles, ShieldAlert,
  HelpCircle, Info
} from 'lucide-react';
import { REGIONS } from '@/lib/agro_regions';
import { CROPS_CATALOG } from '@/lib/crops';

export default function InputLahanPage() {
  const [formData, setFormData] = useState({
    nama_petani: '',
    kontak: '',
    luas_tanah: '',
    satuan_luas: 'm²',
    daerah: REGIONS[0].nama,
    jenis_tanaman: 'Cabai Rawit Merah',
    waktu_tanam: new Date().toISOString().split('T')[0],
    catatan: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedCrop = CROPS_CATALOG[formData.jenis_tanaman] || CROPS_CATALOG['Cabai Rawit Merah'];
  const selectedRegion = REGIONS.find(r => r.nama === formData.daerah) || REGIONS[0];

  // Hitung estimasi tanggal panen
  const tanamDate = new Date(formData.waktu_tanam);
  const panenDate = new Date(tanamDate);
  panenDate.setDate(panenDate.getDate() + selectedCrop.umur_panen_hari);
  const panenFormatted = panenDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Estimasi tonase panen
  const luasVal = Number(formData.luas_tanah) || 0;
  const luasM2 = formData.satuan_luas === 'hektar' ? luasVal * 10000 : luasVal;
  const estYieldKg = Math.round(luasM2 * (formData.jenis_tanaman === 'Tomat' ? 2.5 : formData.jenis_tanaman === 'Bawang Merah' ? 1.2 : 0.9));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/petani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Form Registrasi Lahan & Petani</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Profil Lahan & Tanaman
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Lengkapi 5 data input utama untuk mengaktifkan pemantauan mikroklimat tanah, rekomendasi irigasi surya, dan pencatatan basis data riset pertanian.
        </p>
      </div>

      {success ? (
        <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Lahan Berhasil Didaftarkan!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Data petani <strong>{formData.nama_petani}</strong> di wilayah <strong>{formData.daerah}</strong> telah masuk ke basis data riset dan terhubung dengan sensor iklim digital.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  nama_petani: '',
                  kontak: '',
                  luas_tanah: '',
                  satuan_luas: 'm²',
                  daerah: REGIONS[0].nama,
                  jenis_tanaman: 'Cabai Rawit Merah',
                  waktu_tanam: new Date().toISOString().split('T')[0],
                  catatan: ''
                });
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              + Input Lahan Lain
            </button>
            <a
              href="/monitoring"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Buka Monitoring Iklim & pH</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/riset-petani"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Lihat Database Riset</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              
              {/* 1. Nama Petani */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Nama Lengkap Petani <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Joko Suyono / Kelompok Tani Makmur"
                  value={formData.nama_petani}
                  onChange={(e) => setFormData({ ...formData, nama_petani: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400">Dimasukkan ke database untuk profil demografi & riset pertanian.</p>
              </div>

              {/* Kontak (Opsional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Nomor HP / WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="0812-xxxx-xxxx"
                  value={formData.kontak}
                  onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>

              {/* 2. Daerah */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Wilayah / Daerah Sawah <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={formData.daerah}
                  onChange={(e) => setFormData({ ...formData, daerah: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none bg-white transition-all"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.nama}>
                      {r.nama} (Tanah: {r.jenis_tanah})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">Menentukan kalibrasi sensor cuaca satelit dan karakteristik tanah bawaan.</p>
              </div>

              {/* 3. Luas Tanah */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Luas Tanah / Lahan <span className="text-rose-500">*</span></span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="Contoh: 1500"
                    value={formData.luas_tanah}
                    onChange={(e) => setFormData({ ...formData, luas_tanah: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                  />
                  <select
                    value={formData.satuan_luas}
                    onChange={(e) => setFormData({ ...formData, satuan_luas: e.target.value as 'm²' | 'hektar' })}
                    className="w-28 px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-sm font-semibold outline-none"
                  >
                    <option value="m²">Meter² (m²)</option>
                    <option value="hektar">Hektar (ha)</option>
                  </select>
                </div>
              </div>

              {/* 4. Jenis Tanaman */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4. Jenis Tanaman yang Ditanam <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={formData.jenis_tanaman}
                  onChange={(e) => setFormData({ ...formData, jenis_tanaman: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none bg-white transition-all font-semibold text-slate-800"
                >
                  {Object.keys(CROPS_CATALOG).map((crop) => (
                    <option key={crop} value={crop}>
                      {crop} (Siklus {CROPS_CATALOG[crop].umur_panen_hari} hari)
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Waktu Tanam */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5. Waktu / Tanggal Mulai Tanam <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.waktu_tanam}
                  onChange={(e) => setFormData({ ...formData, waktu_tanam: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all font-medium"
                />
              </div>

              {/* Catatan / Keterangan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Catatan Lahan / Varietas Benih (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Varietas hibrida, menggunakan pompa tenaga surya, tanah berpasir..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Menyimpan ke Database...' : 'Simpan Data Lahan & Mulai Monitoring'}
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Right Column: Live Calculation Preview */}
          <div className="space-y-4">
            
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Preview Analisis Budidaya</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Komoditas:</span>
                  <p className="text-sm font-bold text-emerald-400">{selectedCrop.nama}</p>
                  <p className="text-[11px] text-slate-400">Kategori: {selectedCrop.kategori}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Umur Siklus:</span>
                    <p className="font-bold text-slate-200">{selectedCrop.umur_panen_hari} Hari</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Panen:</span>
                    <p className="font-bold text-amber-300">{panenFormatted}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Karakteristik Lahan:</span>
                  <p className="text-slate-300 font-medium mt-0.5">{selectedRegion.nama}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Jenis Tanah: <span className="text-slate-200">{selectedRegion.jenis_tanah}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    pH Alami: <span className="text-emerald-300 font-semibold">{selectedRegion.ph_rata_rata}</span> | Suhu Rata-rata: <span className="text-amber-300">{selectedRegion.suhu_rata_rata}°C</span>
                  </p>
                </div>

                {luasVal > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-slate-400">Proyeksi Hasil Panen:</span>
                    <p className="text-base font-extrabold text-emerald-300">
                      ± {estYieldKg.toLocaleString('id-ID')} kg
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Dihitung dari luas lahan {luasVal} {formData.satuan_luas}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Riset Pertanian Berkelanjutan</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                Data yang Anda masukkan tersimpan secara aman dalam database riset untuk memetakan sebaran pola tanam, kalender ketersediaan air, dan pencegahan gagal panen petani di daerah pelosok.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
