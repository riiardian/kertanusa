'use client';

import { useState } from 'react';
import { 
  BarChart3, TrendingUp, Sparkles, Calendar, DollarSign, 
  HelpCircle, CheckCircle2, ArrowUpRight, Calculator, PieChart, Info
} from 'lucide-react';
import { COMMODITY_TRENDS, calculateProfitProjection } from '@/lib/market_demand';

export default function TrenPasarPage() {
  const [selectedKomoditas, setSelectedKomoditas] = useState(COMMODITY_TRENDS[0].komoditas);
  const [calcLuas, setCalcLuas] = useState<number>(1500);

  const currentTrend = COMMODITY_TRENDS.find(t => t.komoditas === selectedKomoditas) || COMMODITY_TRENDS[0];
  const projection = calculateProfitProjection(calcLuas, selectedKomoditas);

  // Maximum price in historical data for chart normalization
  const maxPrice = Math.max(...currentTrend.historis_bulanan.map(h => h.harga));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          <span>Market Demand & Price Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Riset Tren Daya Beli & Musim Puncak Komoditas
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-3xl">
          Bantu petani menentukan komoditas yang paling banyak dicari masyarakat pada musim tertentu, sehingga hasil panen laku terjual dengan harga tertinggi dan tidak anjlok saat panen raya.
        </p>
      </div>

      {/* Commodity Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {COMMODITY_TRENDS.map((item) => {
          const isSelected = selectedKomoditas === item.komoditas;
          return (
            <button
              key={item.komoditas}
              onClick={() => setSelectedKomoditas(item.komoditas)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.komoditas}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}>
                Rp {item.harga_saat_ini.toLocaleString('id-ID')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Historical Chart & Seasonal Drivers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Price Chart Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Grafik Tren Harga Bulanan: {currentTrend.komoditas}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{currentTrend.persentase_tren}%
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Rata-rata harga grosir acuan pasar nasional (Rp / kg)</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Harga Acuan Sekarang:</span>
                <p className="text-xl font-extrabold text-emerald-700">
                  Rp {currentTrend.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
                </p>
              </div>
            </div>

            {/* Custom Interactive Bar Chart */}
            <div className="space-y-2">
              <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-2 pt-6">
                {currentTrend.historis_bulanan.map((hist, idx) => {
                  const heightPercent = Math.round((hist.harga / maxPrice) * 100);
                  const isPeak = currentTrend.bulan_harga_tertinggi.some(b => b.toLowerCase().startsWith(hist.bulan.toLowerCase()));
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-100 px-1 py-0.5 rounded">
                        {(hist.harga / 1000).toFixed(0)}k
                      </span>

                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-95 ${
                          isPeak
                            ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-xs'
                            : 'bg-emerald-500/70'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>

                      {/* Label Bulan */}
                      <span className={`text-[11px] font-semibold ${isPeak ? 'text-amber-700 font-extrabold' : 'text-slate-500'}`}>
                        {hist.bulan}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                  <span className="font-medium text-slate-600">Bulan Puncak Permintaan / Harga Tertinggi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500/70 inline-block"></span>
                  <span className="font-medium text-slate-600">Bulan Pasokan Stabil</span>
                </div>
              </div>
            </div>

          </div>

          {/* Seasonal Analysis & Demand Drivers */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Analisis Musim & Penyebab Lonjakan Daya Beli</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-900">Musim Puncak Permintaan:</span>
                <p className="text-sm font-extrabold text-amber-950">{currentTrend.musim_puncak}</p>
                <p className="text-xs text-amber-800/90 leading-relaxed mt-1">
                  {currentTrend.alasan_permintaan}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-900">ðŸ’¡ Rekomendasi Waktu Tanam Cerdas:</span>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed mt-1">
                  {currentTrend.rekomendasi_waktu_tanam}
                </p>
                <div className="pt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mencegah anjlok harga saat panen raya serentak</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Profit & Yield Projection Calculator */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Simulasi Keuntungan Panen</h3>
                <p className="text-[11px] text-slate-500">Estimasi hasil panen & omset bersih</p>
              </div>
            </div>

            {/* Input Luas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Luas Lahan Anda (mÂ²):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={calcLuas}
                  onChange={(e) => setCalcLuas(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm font-semibold outline-none"
                />
                <div className="flex gap-1">
                  {[1000, 2500, 5000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCalcLuas(v)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                    >
                      {v >= 10000 ? `${v/10000}ha` : `${v}mÂ²`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation Output */}
            <div className="space-y-3 pt-2">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Tonase Panen:</span>
                  <strong className="text-slate-900">{projection.totalPanenKg.toLocaleString('id-ID')} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Modal Operasional:</span>
                  <strong className="text-rose-600">Rp {projection.totalBiayaProduksi.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-2">
                  <span className="text-slate-500 font-semibold">Proyeksi Omset Penjualan:</span>
                  <strong className="text-slate-900 font-bold">Rp {projection.totalOmset.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              {/* Net Profit Big Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm space-y-1">
                <span className="text-xs text-emerald-100 font-medium block">Estimasi Keuntungan Bersih:</span>
                <div className="text-2xl font-extrabold tracking-tight">
                  Rp {projection.labaBersih.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-emerald-100/90 pt-1 flex justify-between">
                  <span>Tingkat Pengembalian (ROI):</span>
                  <strong className="text-amber-300 font-extrabold">{projection.roi}%</strong>
                </div>
              </div>

            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              ðŸ“Œ <em>Catatan: Angka di atas dihitung dengan asumsi pemeliharaan sesuai rekomendasi pupuk presisi dan panen pada periode puncak permintaan.</em>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
