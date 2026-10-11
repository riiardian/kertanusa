'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, UserCheck, ShieldCheck, ThumbsUp } from 'lucide-react';
import { KuesionerRecord } from '@/lib/types';

export default function KuesionerSection() {
  const [list, setList] = useState<KuesionerRecord[]>([]);
  const [stats, setStats] = useState({
    total_responden: 4,
    rata_rata_kemudahan: 4.8,
    persentase_kepuasan: 98
  });
  const [loadingList, setLoadingList] = useState(true);

  // Form State
  const [nama, setNama] = useState('');
  const [profesi, setProfesi] = useState<KuesionerRecord['profesi']>('Petani');
  const [skorKemudahan, setSkorKemudahan] = useState(5);
  const [akurasiFitur, setAkurasiFitur] = useState<KuesionerRecord['akurasi_fitur']>('Sangat Akurat');
  const [fiturFavorit, setFiturFavorit] = useState('Scan AI Penyakit');
  const [masukan, setMasukan] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const profesiOptions: KuesionerRecord['profesi'][] = [
    'Petani',
    'Penyuluh Pertanian',
    'Akademisi / Peneliti',
    'Mahasiswa',
    'Masyarakat Umum'
  ];

  const fiturOptions = [
    'Scan AI Penyakit',
    'Radar Cuaca & Jadwal Semprot',
    'Analisis Tren Pasar & Bibit',
    'Peta Geospasial Sawah'
  ];

  const akurasiOptions: KuesionerRecord['akurasi_fitur'][] = [
    'Sangat Akurat',
    'Cukup Akurat',
    'Perlu Peningkatan'
  ];

  useEffect(() => {
    fetchKuesioner();
  }, []);

  const fetchKuesioner = async () => {
    try {
      const res = await fetch('/api/kuesioner', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setList(json.data || []);
        if (json.stats) {
          setStats(json.stats);
        }
      }
    } catch (e) {
      console.warn('Gagal memuat kuesioner:', e);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (masukan.trim().length < 5) {
      setErrorMessage('Mohon berikan masukan atau catatan evaluasi minimal 5 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/kuesioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: nama.trim() || 'Pengguna Terverifikasi',
          profesi,
          skor_kemudahan: skorKemudahan,
          akurasi_fitur: akurasiFitur,
          fitur_favorit: fiturFavorit,
          masukan: masukan.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        fetchKuesioner();
        // Reset text
        setMasukan('');
        setNama('');
      } else {
        setErrorMessage(json.message || 'Gagal mengirim evaluasi.');
      }
    } catch (err) {
      setErrorMessage('Terjadi gangguan jaringan saat mengirim evaluasi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="kuesioner-uat" className="w-full bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800 relative overflow-hidden scroll-mt-24">
      
      {/* Decorative Radial Grid Ambient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Survei Validasi Pengguna Nyata (UAT)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-editorial">
            Evaluasi Lapangan & Umpan Balik Kertanusa
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Partisipasi Anda sebagai petani, penyuluh, maupun akademisi membantu tim riset kami menguji keandalan sistem kecerdasan buatan dan kalibrasi algoritma agrometeorologi Nusantara.
          </p>
        </div>

        {/* Top KPI Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {stats.rata_rata_kemudahan} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </span>
            <span className="text-xs text-slate-300 block font-medium">Skor Kemudahan Antarmuka</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {stats.persentase_kepuasan}%
            </span>
            <span className="text-xs text-slate-300 block font-medium">Akurasi Rekomendasi Teruji</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-teal-400 mb-1">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {stats.total_responden}
            </span>
            <span className="text-xs text-slate-300 block font-medium">Responden Terverifikasi</span>
          </div>
        </div>

        {/* Main Content: Form (Left) & Verified Feedbacks (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form Kuesioner (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
            <div className="border-b border-slate-700/80 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Formulir Penilaian Pengguna</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Isi kuesioner singkat ini dalam waktu kurang dari 1 menit.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Evaluasi Berhasil Dikirim!</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Terima kasih atas partisipasi Anda. Ulasan dan masukan Anda telah tercatat ke dalam basis data validasi lapangan Kertanusa.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Kirim Masukan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Nama & Profesi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Nama / Nama Instansi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Bpk. Mulyono / BPP Brebes"
                      maxLength={80}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Peran / Profesi <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={profesi}
                      onChange={(e) => setProfesi(e.target.value as KuesionerRecord['profesi'])}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {profesiOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Rating Kemudahan Antarmuka (Stars) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Kemudahan Penggunaan Antarmuka (*Usability*) <span className="text-emerald-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSkorKemudahan(star)}
                        className="p-1 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-transform hover:scale-110 ${
                            star <= skorKemudahan
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-300 ml-2">
                      {skorKemudahan === 5 ? 'Sangat Mudah' : skorKemudahan === 4 ? 'Mudah' : skorKemudahan === 3 ? 'Cukup' : 'Perlu Penyesuaian'}
                    </span>
                  </div>
                </div>

                {/* 3. Evaluasi Akurasi Rekomendasi AI & Cuaca */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Kejelasan & Akurasi Rekomendasi (Dosis Pupuk & Jadwal Semprot)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {akurasiOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAkurasiFitur(opt)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          akurasiFitur === opt
                            ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Fitur Paling Bermanfaat */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Fitur yang Paling Bermanfaat bagi Anda
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {fiturOptions.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFiturFavorit(f)}
                        className={`py-2 px-3 rounded-xl border text-xs text-left truncate transition-all cursor-pointer ${
                          fiturFavorit === f
                            ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Catatan / Masukan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Catatan Evaluasi / Saran Pengembangan <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={masukan}
                    onChange={(e) => setMasukan(e.target.value)}
                    placeholder="Tuliskan pengalaman Anda saat mencoba fitur Kertanusa..."
                    maxLength={1000}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Minimal 5 karakter</span>
                    <span>{masukan.length}/1000</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Menyimpan Evaluasi...' : 'Kirim Penilaian Pengguna'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Testimonial & Feed Hasil Evaluasi Nyata (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ulasan Validasi Terverifikasi</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {list.length} Ulasan
              </span>
            </div>

            {loadingList ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Memuat data ulasan validasi...
              </div>
            ) : (
              <div className="space-y-3 max-h-[490px] overflow-y-auto pr-1">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 space-y-2 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{item.nama}</h4>
                        <span className="text-[10px] text-emerald-300 font-medium block mt-0.5">
                          {item.profesi}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                        {[...Array(item.skor_kemudahan)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &ldquo;{item.masukan}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-700/50">
                      <span className="truncate max-w-[170px]">Fitur: {item.fitur_favorit}</span>
                      <span className="shrink-0">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
