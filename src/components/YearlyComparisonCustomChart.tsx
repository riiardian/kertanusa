'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

export interface YearlyComparisonItem {
  tahun: number;
  hargaTanam: number;
  hargaPanen: number;
  selisih: number;
  persentase: number;
  isProfit: boolean;
}

interface YearlyComparisonCustomChartProps {
  data: YearlyComparisonItem[];
  plantMonth: string;
  harvestMonth: string;
}

function getYAxisConfig(data: YearlyComparisonItem[]) {
  const maxPrice = Math.max(
    ...data.map((d) => Math.max(d.hargaTanam, d.hargaPanen, 0)),
    1000
  );

  const steps = [
    500, 1000, 2000, 2500, 5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000,
    75000, 100000, 150000, 200000, 250000, 500000, 1000000,
  ];

  let chosenStep = 10000;
  for (const s of steps) {
    if (s * 4 >= maxPrice) {
      chosenStep = s;
      break;
    }
  }

  if (chosenStep * 4 < maxPrice) {
    chosenStep = Math.ceil(maxPrice / 4 / 10000) * 10000;
  }

  const niceMax = chosenStep * 4;
  const ticks = [niceMax, chosenStep * 3, chosenStep * 2, chosenStep * 1, 0];

  return { niceMax, ticks };
}

function formatYLabel(val: number): string {
  if (val === 0) return '0';
  if (val >= 1000000) {
    return `${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`;
  }
  if (val >= 1000) {
    return `${Math.round(val / 1000)}k`;
  }
  return String(val);
}

export default function YearlyComparisonCustomChart({
  data,
  plantMonth,
  harvestMonth,
}: YearlyComparisonCustomChartProps) {
  // Default active year is the latest year
  const [activeYear, setActiveYear] = useState<number | null>(() => {
    return data.length > 0 ? data[data.length - 1].tahun : null;
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Auto dismiss card when clicking anywhere outside on the web
  useEffect(() => {
    if (activeYear === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      // Jika klik di dalam card rincian itu sendiri, jangan tutup
      if (cardRef.current && cardRef.current.contains(event.target as Node)) {
        return;
      }
      // Jika klik pemicu tahun, biarkan event handler tahun yang mengatur
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-year-trigger]')) {
        return;
      }
      // Klik di bagian mana pun pada web -> tabel penjelasan langsung hilang
      setActiveYear(null);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [activeYear]);

  const { niceMax, ticks } = useMemo(() => getYAxisConfig(data), [data]);

  const activeItem = useMemo(() => {
    if (activeYear === null) return null;
    return data.find((d) => d.tahun === activeYear) || null;
  }, [data, activeYear]);

  if (!data || data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-xs text-slate-400">
        Belum ada data komparasi multi-tahun.
      </div>
    );
  }

  return (
    <div
      className="relative w-full select-none outline-none ring-0"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Container Grafik: Y-Axis + Plot Area */}
      <div className="flex w-full">
        {/* Y-Axis Labels Column */}
        <div className="w-9 sm:w-11 h-[210px] sm:h-[230px] relative shrink-0">
          {ticks.map((tick, idx) => {
            const topPct = (idx / (ticks.length - 1)) * 100;
            const isFirst = idx === 0;
            const isLast = idx === ticks.length - 1;
            const yTranslate = isFirst
              ? 'translate-y-0'
              : isLast
              ? '-translate-y-full'
              : '-translate-y-1/2';

            return (
              <span
                key={tick}
                style={{ top: `${topPct}%` }}
                className={`absolute right-2 ${yTranslate} text-[10px] sm:text-[11px] font-semibold text-slate-400 tabular-nums pointer-events-none select-none`}
              >
                {formatYLabel(tick)}
              </span>
            );
          })}
        </div>

        {/* Plot Area */}
        <div className="flex-1 h-[210px] sm:h-[230px] relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {ticks.map((tick, idx) => {
              const topPct = (idx / (ticks.length - 1)) * 100;
              const isBase = idx === ticks.length - 1;
              return (
                <div
                  key={tick}
                  style={{ top: `${topPct}%` }}
                  className={`absolute left-0 right-0 ${
                    isBase
                      ? 'border-b border-slate-300'
                      : 'border-b border-dashed border-slate-100 sm:border-slate-200/80'
                  }`}
                />
              );
            })}
          </div>

          {/* 5 Kolom Tahun (Batang + Icon Kenaikan/Penurunan) */}
          <div className="absolute inset-0 grid grid-cols-5 gap-1 sm:gap-2.5 z-10 px-0.5 sm:px-1.5">
            {data.map((item) => {
              const isSelected = activeYear === item.tahun;
              const tanamHeightPct = Math.min(
                100,
                Math.max(3, (item.hargaTanam / niceMax) * 100)
              );
              const panenHeightPct = Math.min(
                100,
                Math.max(3, (item.hargaPanen / niceMax) * 100)
              );
              const maxHeight = Math.max(tanamHeightPct, panenHeightPct);

              return (
                <div
                  key={item.tahun}
                  data-year-trigger="true"
                  onClick={() =>
                    setActiveYear((prev) => (prev === item.tahun ? null : item.tahun))
                  }
                  className={`h-full relative flex flex-col justify-end items-center cursor-pointer transition-colors duration-200 rounded-xl group select-none ${
                    isSelected ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Icon Kenaikan / Penurunan + Angka Persentase (Clean & Natural, Tanpa Badge/Pill) */}
                  <div
                    style={{
                      bottom: `calc(${maxHeight}% + 4px)`,
                    }}
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-200 group-hover:scale-110 z-10 flex items-center justify-center gap-0.5 whitespace-nowrap select-none"
                  >
                    {item.isProfit ? (
                      <>
                        <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0 stroke-[2.5]" />
                        <span className="text-[10px] sm:text-[11.5px] font-bold text-emerald-700 tabular-nums">
                          +{item.persentase}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 shrink-0 stroke-[2.5]" />
                        <span className="text-[10px] sm:text-[11.5px] font-bold text-rose-600 tabular-nums">
                          {item.persentase}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Dua Batang Vertikal: Tanam & Panen */}
                  <div className="absolute inset-0 flex items-end justify-center gap-1 sm:gap-2 pointer-events-none pb-0">
                    {/* Batang Tanam (Slate-500) */}
                    <div
                      style={{ height: `${tanamHeightPct}%` }}
                      className={`w-3 sm:w-4.5 bg-slate-500 rounded-t-[3px] sm:rounded-t-[4px] transition-all duration-300 pointer-events-auto ${
                        isSelected
                          ? 'ring-2 ring-slate-400 ring-offset-1 opacity-100'
                          : 'opacity-85 group-hover:opacity-100'
                      }`}
                      title={`Tanam (${plantMonth}): Rp ${item.hargaTanam.toLocaleString('id-ID')}`}
                    />

                    {/* Batang Panen (Emerald-700) */}
                    <div
                      style={{ height: `${panenHeightPct}%` }}
                      className={`w-3 sm:w-4.5 bg-emerald-700 rounded-t-[3px] sm:rounded-t-[4px] transition-all duration-300 pointer-events-auto ${
                        isSelected
                          ? 'ring-2 ring-emerald-600 ring-offset-1 opacity-100'
                          : 'opacity-95 group-hover:opacity-100'
                      }`}
                      title={`Panen (${harvestMonth}): Rp ${item.hargaPanen.toLocaleString('id-ID')}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Detail Card (Dismisses on clicking anywhere outside or on X) */}
          {activeItem && (
            <div
              ref={cardRef}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md border border-slate-200/95 rounded-xl shadow-lg p-3 text-xs w-[220px] sm:w-[245px] transition-all select-none animate-in fade-in zoom-in-95 duration-150"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex justify-between items-center">
                <span className="text-slate-900 font-extrabold text-xs sm:text-sm">
                  Tahun {activeItem.tahun}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {activeItem.isProfit ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                        <span className="text-xs font-bold text-emerald-700 tabular-nums">
                          +{activeItem.persentase}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                        <span className="text-xs font-bold text-rose-600 tabular-nums">
                          {activeItem.persentase}%
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveYear(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors"
                    title="Tutup info"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-slate-600 text-[11px] sm:text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-500 inline-block shrink-0" />
                    Tanam ({plantMonth}):
                  </span>
                  <span className="font-semibold text-slate-900">
                    Rp {activeItem.hargaTanam.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-[11px] sm:text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700 inline-block shrink-0" />
                    Panen ({harvestMonth}):
                  </span>
                  <span className="font-bold text-emerald-700">
                    Rp {activeItem.hargaPanen.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-1.5 text-[10.5px] sm:text-[11px] flex justify-between items-center text-slate-500">
                <span>Selisih Harga:</span>
                <span
                  className={`font-bold ${
                    activeItem.isProfit ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {activeItem.selisih >= 0 ? '+' : ''}Rp{' '}
                  {activeItem.selisih.toLocaleString('id-ID')} / kg
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* X-Axis Labels (Tahun) */}
      <div className="flex pt-2">
        {/* Left spacer matching Y-axis width */}
        <div className="w-9 sm:w-11 shrink-0" />
        {/* 5 Kolom Label Tahun */}
        <div className="flex-1 grid grid-cols-5 gap-1 sm:gap-2.5 px-0.5 sm:px-1.5">
          {data.map((item) => {
            const isSelected = activeYear === item.tahun;
            return (
              <button
                key={item.tahun}
                data-year-trigger="true"
                type="button"
                onClick={() =>
                  setActiveYear((prev) => (prev === item.tahun ? null : item.tahun))
                }
                className={`text-center font-bold text-[11px] sm:text-xs py-1 rounded-md transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'text-emerald-800 font-extrabold bg-emerald-50/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {item.tahun}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
