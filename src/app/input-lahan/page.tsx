'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, MapPin, Check, ChevronDown, Trash2 } from 'lucide-react';
import { REGIONS } from '@/lib/agro_regions';
import LottieAnimation from '@/components/LottieAnimation';
import loadingAnimation from '../../../public/loading.json';

export default function InputLahanPage() {
  const [formData, setFormData] = useState({
    nama_petani: '',
    kontak: '',
    luas_tanah: '',
    satuan_luas: 'm²' as 'm²' | 'hektar',
    daerah: '',
    lat: undefined as number | undefined,
    lon: undefined as number | undefined,
    akurasi_gps: undefined as number | undefined,
    jenis_tanaman: '',
    waktu_tanam: new Date().toISOString().split('T')[0],
    catatan: ''
  });

  const [savedData, setSavedData] = useState<(typeof formData & { id?: string }) | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cek apakah user sudah pernah mendaftarkan lahan sebelumnya dan validasi dengan database
  useEffect(() => {
    async function checkActiveFarmer() {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      const storedId = localStorage.getItem('kertanusa_active_farmer_id');
      if (!stored && !storedId) {
        setSavedData(null);
        return;
      }

      try {
        let parsed: any = null;
        if (stored) {
          try {
            parsed = JSON.parse(stored);
          } catch {
            parsed = null;
          }
        }

        // Validasi ke backend apakah petani ini masih ada di database
        const res = await fetch('/api/petani');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const match = json.data.find((p: any) => 
            (storedId && p.id === storedId) || 
            (parsed?.id && p.id === parsed.id) ||
            (parsed?.nama_petani && p.nama_petani.trim().toLowerCase() === parsed.nama_petani.trim().toLowerCase())
          );

          if (match) {
            setSavedData(match);
            localStorage.setItem('kertanusa_active_farmer_id', match.id);
            localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(match));
          } else {
            // Data sudah dihapus dari riset/database! Bersihkan localStorage
            localStorage.removeItem('kertanusa_active_farmer_id');
            localStorage.removeItem('kertanusa_active_farmer_data');
            setSavedData(null);
          }
        }
      } catch (e) {
        console.error('Error validating active farmer:', e);
      }
    }

    checkActiveFarmer();
  }, []);

    async function executeDeleteSaved() {
    if (!savedData) return;
    setIsDeleting(true);

    try {
      if (savedData.id) {
        await fetch(`/api/petani?id=${savedData.id}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.error('Gagal menghapus data di server:', e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kertanusa_active_farmer_id');
        localStorage.removeItem('kertanusa_active_farmer_data');
      }
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSavedData(null);
      setIsEditing(false);
      setFormData({
        nama_petani: '',
        kontak: '',
        luas_tanah: '',
        satuan_luas: 'm²',
        daerah: '',
        lat: undefined,
        lon: undefined,
        akurasi_gps: undefined,
        jenis_tanaman: '',
        waktu_tanam: new Date().toISOString().split('T')[0],
        catatan: ''
      });
    }
  }

  // Animasi Toast dinamis gaya AeroFlazz (muncul halus slide-down, stay 3.5 detik, exit slide-up mulus)
  useEffect(() => {
    if (success) {
      const enterTimer = setTimeout(() => {
        setShowToast(true);
      }, 150);

      const exitTimer = setTimeout(() => {
        setShowToast(false);
      }, 3600);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [success]);

  // Deteksi GPS Akurat dari Satelit Perangkat Keras HP
  function handleActivateGps() {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Peramban tidak mendukung sensor lokasi GPS.');
      return;
    }

    setGpsStatus('loading');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const roundedAcc = Math.round(accuracy);

        try {
          const res = await fetch(`/api/cuaca?lat=${latitude}&lon=${longitude}`);
          const resData = await res.json();

          let detectedDaerah = formData.daerah;
          if (resData.success && resData.daerah) {
            detectedDaerah = resData.daerah;
          }

          setFormData(prev => ({
            ...prev,
            lat: latitude,
            lon: longitude,
            akurasi_gps: roundedAcc,
            daerah: detectedDaerah
          }));

          setGpsStatus('success');
          setGpsErrorMsg('');
        } catch {
          setFormData(prev => ({
            ...prev,
            lat: latitude,
            lon: longitude,
            akurasi_gps: roundedAcc
          }));
          setGpsStatus('success');
          setGpsErrorMsg('');
        }
      },
      (err) => {
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsErrorMsg('Akses GPS ditolak peramban. Silakan izinkan akses lokasi (GPS) pada pengaturan browser HP Anda.');
        } else if (err.code === 2) {
          setGpsErrorMsg('Sinyal satelit GPS tidak terdeteksi. Pastikan fitur lokasi HP Anda aktif.');
        } else {
          setGpsErrorMsg('Waktu pembacaan GPS habis. Silakan coba kembali.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const resPromise = fetch('/api/petani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const [res] = await Promise.all([resPromise, minLoadingTime]);
      const data = await res.json();

      if (data.success) {
        const finalData = data.data || formData;
        setSavedData(finalData);
        if (typeof window !== 'undefined') {
          if (finalData.id) {
            localStorage.setItem('kertanusa_active_farmer_id', finalData.id);
          }
          localStorage.setItem('kertanusa_active_farmer_data', JSON.stringify(finalData));
        }
        setIsEditing(false);
        setSuccess(true);
      } else {
        setError(data.message || 'Gagal menyimpan data lahan.');
      }
    } catch {
      setError('Terjadi kendala jaringan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-6">
      
      {/* Toast Notification Gaya AeroFlazz (Floating Pill Terpusat, Ringkas, Tidak Menggeser Posisi Konten) */}
      <div 
        className={`fixed top-18 sm:top-22 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-400 ease-out w-auto max-w-[92vw] ${
          showToast 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-5 scale-95'
        }`}
      >
        <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#064e3b] text-white text-xs sm:text-[13px] font-semibold shadow-lg border border-emerald-600/40">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
          </div>
          <span className="whitespace-nowrap">Data lahan berhasil disimpan ke sistem</span>
        </div>
      </div>

      {/* Loading Overlay Murni Tanpa Blur & Tanpa Latar Bulat (Latar Belakang Tetap Tampilan Inputan Bersih & Terang) */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent select-none cursor-wait animate-in fade-in duration-150">
          <LottieAnimation
            animationData={loadingAnimation}
            className="w-24 h-24 sm:w-28 sm:h-28"
            loop={true}
            autoplay={true}
          />
        </div>
      )}

      {/* Header Halaman: Berikan perbedaan jelas antara yang SUDAH input dan BELUM input */}
      {savedData && !isEditing ? (
        <div className="space-y-1">
          
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Profil Lahan Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Data lahan ini telah tersimpan dan terhubung langsung dengan pemantauan iklim serta rekomendasi agronomi.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Ubah Data Lahan' : 'Input Data Lahan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isEditing
              ? 'Perbarui informasi lahan Anda untuk menyesuaikan hasil pemantauan iklim dan rekomendasi agronomi.'
              : 'Formulir pendaftaran profil lahan dan tanaman untuk pencatatan serta pemantauan.'}
          </p>
        </div>
      )}

      {savedData && !isEditing ? (
        /* State 1: User SUDAH Input Data -> Tampilkan Rincian Lahan Terdaftar + Tombol Monitoring & Ubah Data */
        <div className="space-y-4 animate-in fade-in duration-200">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Animasi Lottie Farmers */}
            <div className="flex flex-col items-center justify-center text-center">
              <LottieAnimation
                src="/Farmers.json"
                className="w-56 h-56 sm:w-72 sm:h-72"
                loop={true}
                autoplay={true}
              />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
                Rincian Lahan Terdaftar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lahan atas nama {savedData.nama_petani} aktif di sistem Kertanusa
              </p>
            </div>

            {/* Key-Value List Rapi */}
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Nama Pemilik / Petani</span>
                <span className="text-slate-900 font-bold">{savedData.nama_petani}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Wilayah / Lokasi</span>
                <span className="text-slate-900 font-semibold">{savedData.daerah || '-'}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Koordinat GPS Titik Lahan</span>
                <span className="text-slate-900 font-mono font-semibold">
                  {savedData.lat ? `${Number(savedData.lat).toFixed(5)}, ${Number(savedData.lon).toFixed(5)}` : 'Sesuai Wilayah'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Jenis Tanaman</span>
                <span className="text-slate-900 font-bold">
                  {savedData.jenis_tanaman}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Luas Lahan</span>
                <span className="text-slate-900 font-semibold">{savedData.luas_tanah} {savedData.satuan_luas || 'm²'}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Tanggal Mulai Tanam</span>
                <span className="text-slate-900 font-semibold">{savedData.waktu_tanam}</span>
              </div>
            </div>

            {/* Aksi Navigasi: Lihat Peta & Hapus Data */}
            <div className="space-y-2 pt-2">
              <Link
                href="/#peta-sebaran-lahan"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-xs transition-all duration-200 text-center block cursor-pointer"
              >
                Lihat Peta
              </Link>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2.5 px-4 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 active:scale-[0.98] border border-rose-200 font-semibold text-xs transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Hapus Data</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Formulir Clean, Flat, & Ringkas (Single Card) */
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Nama Petani */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Nama Petani / Pemilik <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Pak Budi Hartono"
              value={formData.nama_petani}
              onChange={(e) => setFormData({ ...formData, nama_petani: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 text-sm outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Wilayah / Lokasi & Tombol GPS (Hanya via GPS, Input Manual Diblok) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Wilayah / Lokasi Lahan <span className="text-rose-500">*</span>
              </label>
              {formData.lat && formData.lon && (
                <span className="text-[11px] font-mono text-slate-500 font-normal">
                  GPS: {Number(formData.lat).toFixed(4)}, {Number(formData.lon).toFixed(4)} ({formData.akurasi_gps ? `±${formData.akurasi_gps}m` : 'Terkunci'})
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                required
                readOnly
                value={formData.daerah}
                placeholder="Klik tombol Ambil GPS untuk mengunci lokasi lahan"
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 text-sm outline-none cursor-not-allowed select-none font-medium placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm"
              />
              <button
                type="button"
                onClick={handleActivateGps}
                disabled={gpsStatus === 'loading'}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shrink-0 disabled:opacity-60 shadow-xs"
              >
                {gpsStatus === 'loading' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-white" />
                )}
                <span>{gpsStatus === 'loading' ? 'Mendeteksi...' : 'Ambil GPS'}</span>
              </button>
            </div>

            {gpsStatus === 'error' && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                {gpsErrorMsg}
              </p>
            )}
          </div>

          {/* Jenis Tanaman (Input Bebas Manual 100% Tanpa Dropdown) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Jenis Tanaman / Komoditas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ketik jenis tanaman (contoh: Padi Inpari, Cabai Rawit, Bawang Merah...)"
              value={formData.jenis_tanaman}
              onChange={(e) => setFormData({ ...formData, jenis_tanaman: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 text-sm outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Luas Lahan & Satuan Luas (Icon Chevron Terpusat Rapi) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Luas Lahan <span className="text-rose-500">*</span>
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
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 text-sm outline-none transition-all duration-200 font-medium text-slate-900 placeholder:text-slate-400"
              />
              <div className="relative w-28 shrink-0">
                <select
                  value={formData.satuan_luas}
                  onChange={(e) => setFormData({ ...formData, satuan_luas: e.target.value as 'm²' | 'hektar' })}
                  className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 focus:border-emerald-600 text-slate-800 text-xs font-bold outline-none transition-all duration-150 cursor-pointer"
                >
                  <option value="m²">m²</option>
                  <option value="hektar">Hektar</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Tanggal Mulai Tanam */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Tanggal Mulai Tanam <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.waktu_tanam}
              onChange={(e) => setFormData({ ...formData, waktu_tanam: e.target.value })}
              className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 text-sm outline-none transition-all duration-200 font-medium text-slate-900"
            />
          </div>

          {/* Tombol Simpan & Opsi Batal Ubah */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEditing ? 'Perbarui Data Lahan' : 'Simpan Data Lahan'}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors text-center block"
              >
                Batal Ubah
              </button>
            )}
          </div>

        </form>
      )}
      {/* Modal Konfirmasi Hapus Data Lahan (Custom, Modern & Clean) */}
      {showDeleteModal && savedData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) setShowDeleteModal(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">Hapus Profil Lahan?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data lahan atas nama <span className="font-semibold text-slate-800">&ldquo;{savedData.nama_petani}&rdquo;</span> akan dihapus dari sistem. Anda dapat mendaftarkan profil lahan baru setelahnya.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteSaved}
                disabled={isDeleting}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}