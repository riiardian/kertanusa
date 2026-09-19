'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Filter, Download, Trash2, Sprout, 
  MapPin, Calendar, PlusCircle, RefreshCw, CheckCircle2,
  FileSpreadsheet, AlertCircle
} from 'lucide-react';
import { PetaniRecord } from '@/lib/types';

export default function RisetPetaniPage() {
  const [petaniList, setPetaniList] = useState<PetaniRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterTanaman, setFilterTanaman] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/petani');
      const data = await res.json();
      if (data.success) {
        setPetaniList(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: string, nama: string) {
    if (!confirm(`Yakin ingin menghapus data riset petani "${nama}"?`)) return;
    try {
      const res = await fetch(`/api/petani?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPetaniList(prev => prev.filter(p => p.id !== id));
        setToast(`Data petani ${nama} berhasil dihapus.`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleExportJSON() {
    const jsonStr = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_riset_petani_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredData = petaniList.filter(p => {
    const matchSearch = p.nama_petani.toLowerCase().includes(search.toLowerCase()) ||
                        p.daerah.toLowerCase().includes(search.toLowerCase());
    const matchCrop = filterTanaman === 'Semua' || p.jenis_tanaman.includes(filterTanaman);
    return matchSearch && matchCrop;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-700 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Basis Data Riset Pertanian</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Database Riset & Demografi Petani
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Rekapitulasi profil lahan, varietas komoditas, dan kalender budidaya petani untuk analisis akademis & riset kebijakan pangan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data Riset (JSON)</span>
          </button>
          <Link
            href="/input-lahan"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Input Petani</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama petani atau daerah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Tanaman */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterTanaman}
            onChange={(e) => setFilterTanaman(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 outline-none bg-white"
          >
            <option value="Semua">Semua Komoditas</option>
            <option value="Cabai">Cabai Rawit</option>
            <option value="Bawang">Bawang Merah</option>
            <option value="Tomat">Tomat</option>
            <option value="Padi">Padi Sawah</option>
            <option value="Jagung">Jagung Manis</option>
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* Data Table Card */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Petani</th>
                <th className="py-3.5 px-4">Daerah / Wilayah</th>
                <th className="py-3.5 px-4">Komoditas & Luas</th>
                <th className="py-3.5 px-4">Waktu Tanam</th>
                <th className="py-3.5 px-4">Status & Umur</th>
                <th className="py-3.5 px-4 text-center">Kondisi Lahan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Memuat basis data riset petani...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data petani yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredData.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Nama Petani */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.nama_petani}</div>
                      {p.kontak && <div className="text-[11px] text-slate-400">{p.kontak}</div>}
                    </td>

                    {/* Daerah & GPS Presisi */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p.daerah}</span>
                      </div>
                      {p.lat && p.lon ? (
                        <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px] text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
                          </span>
                          {p.akurasi_gps && (
                            <span className="text-emerald-700 font-semibold">
                              (±{p.akurasi_gps}m)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Koordinat standar</span>
                      )}
                    </td>

                    {/* Komoditas & Luas */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block">
                        {p.jenis_tanaman}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Luas: <strong>{p.luas_tanah} {p.satuan_luas}</strong>
                      </div>
                    </td>

                    {/* Waktu Tanam & Panen */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>Tanam: <span className="font-mono">{p.waktu_tanam}</span></div>
                      <div className="text-[11px] text-slate-400">Panen: <span className="font-mono text-emerald-700">{p.estimasi_panen}</span></div>
                    </td>

                    {/* Status Tanaman */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status_tanaman?.includes('Siap') 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.status_tanaman || 'Vegetatif'}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {p.umur_hari || 0} hari
                      </div>
                    </td>

                    {/* Kondisi Lahan (Kelembapan & pH) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span>Lembap: <strong>{p.kelembapan_tanah || 60}%</strong></span>
                        <span>•</span>
                        <span>pH: <strong>{p.ph_tanah || 6.5}</strong></span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.nama_petani)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus data riset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Menampilkan <strong>{filteredData.length}</strong> dari <strong>{petaniList.length}</strong> petani terdaftar
          </div>
          <div className="text-[11px] text-slate-400">
            Database tersimpan lokal di <code>data/agro_data.json</code>
          </div>
        </div>

      </div>

    </div>
  );
}
