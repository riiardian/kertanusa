'use client';

import { TrendingUp, TrendingDown, Minus, ArrowRight, BarChart3 } from 'lucide-react';
import { COMMODITY_TRENDS } from '@/lib/market_demand';
import Link from 'next/link';

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// Sinyal aksi cepat berdasarkan tren & bulan
function getSignal(komoditas: string, tren: string, persen: number, bulanTertinggi: string[]) {
  const bulanSekarang = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanIni = bulanSekarang[new Date().getMonth()];
  const bulanPendek = bulanTertinggi.map(b => b.substring(0, 3));
  const isPeakNow = bulanPendek.some(b => b === bulanIni);

  if (isPeakNow && tren === 'Naik') return { label: 'Jual Sekarang', color: 'bg-emerald-600 text-white' };
  if (tren === 'Naik' && persen > 8) return { label: 'Tahan 2–3 Hari', color: 'bg-emerald-100 text-emerald-800' };
  if (tren === 'Turun') return { label: 'Segera Lepas', color: 'bg-rose-100 text-rose-800' };
  return { label: 'Pantau Harga', color: 'bg-slate-100 text-slate-700' };
}

// Sparkline mini 6 bulan (SVG bersih)
function Sparkline({ data }: { data: { bulan: string; harga: number }[] }) {
  const last6 = data.slice(-6);
  const maxH = Math.max(...last6.map(d => d.harga));
  const minH = Math.min(...last6.map(d => d.harga));
  const range = maxH - minH || 1;
  const W = 80, H = 28, pad = 2;

  const pts = last6.map((d, i) => {
    const x = pad + (i / (last6.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.harga - minH) / range) * (H - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const isUp = last6[last6.length - 1].harga >= last6[0].harga;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-7" preserveAspectRatio="none">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={isUp ? '#059669' : '#e11d48'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MarketPriceWidget() {
  // Hanya 4 komoditas pertama
  const items = COMMODITY_TRENDS.slice(0, 4);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">

      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Harga Pasar & Sinyal Jual Komoditas</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau harga komoditas pangan utama dan tentukan waktu jual panen yang paling menguntungkan
          </p>
        </div>
        <Link
          href="/tren-pasar"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors shrink-0"
        >
          Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid 4 Kartu Komoditas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {items.map((item) => {
          const isNaik = item.tren_mingguan === 'Naik';
          const isTurun = item.tren_mingguan === 'Turun';
          const signal = getSignal(item.komoditas, item.tren_mingguan, item.persentase_tren, item.bulan_harga_tertinggi);

          return (
            <div key={item.komoditas} className="p-4 sm:p-5 flex flex-col justify-between gap-3 hover:bg-slate-50/60 transition-colors">

              {/* Nama & Tren Badge */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 leading-tight">{item.komoditas}</span>
                <div className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                  isNaik ? 'bg-emerald-50 text-emerald-700' :
                  isTurun ? 'bg-rose-50 text-rose-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {isNaik && <TrendingUp className="w-3 h-3" />}
                  {isTurun && <TrendingDown className="w-3 h-3" />}
                  {!isNaik && !isTurun && <Minus className="w-3 h-3" />}
                  <span>{isNaik ? '+' : isTurun ? '-' : ''}{item.persentase_tren}%</span>
                </div>
              </div>

              {/* Harga Besar */}
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatRp(item.harga_saat_ini)}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">per kilogram</div>
              </div>

              {/* Sparkline 6 Bulan Terakhir */}
              <div>
                <div className="text-[10px] text-slate-400 mb-1 font-medium">Tren 6 Bulan Terakhir</div>
                <Sparkline data={item.historis_bulanan} />
              </div>

              {/* Sinyal Aksi Cepat */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${signal.color}`}>
                  {signal.label}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px]" title={item.musim_puncak}>
                  Puncak: {item.bulan_harga_tertinggi[0]}–{item.bulan_harga_tertinggi[1] ?? item.bulan_harga_tertinggi[0]}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <p className="text-[11px] text-slate-500">
          Data pasar induk regional · diperbarui mingguan
        </p>
        <Link
          href="/tren-pasar"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
        >
          Analisis Lengkap & Kalkulator Profit <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
