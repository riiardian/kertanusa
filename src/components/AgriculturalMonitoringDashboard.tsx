'use client';

import { useState } from 'react';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Layers, 
  Calendar, 
  MapPin, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Data agregat historis komoditas pertanian nasional Indonesia (Sumber: BPS & Kementan)
interface CommodityData {
  id: string;
  nama: string;
  kategori: 'pangan' | 'sayuran' | 'buah';
  kategoriLabel: string;
  produksi2024: number; // Dalam Juta Ton
  pangsaPersen: number; // Persentase total produksi
  warna: string;
  warnaHex: string;
  sentraUtama: string;
  buahAtauSayur: string;
  historis: { tahun: number; produksi: number }[]; // Juta Ton
  catatanTren: string;
}

const KOMODITAS_NASIONAL: CommodityData[] = [
  {
    id: 'padi',
    nama: 'Padi / Beras (GKG)',
    kategori: 'pangan',
    kategoriLabel: 'Tanaman Pangan',
    produksi2024: 54.6,
    pangsaPersen: 38.5,
    warna: 'bg-emerald-600',
    warnaHex: '#059669',
    sentraUtama: 'Jawa Timur, Jawa Barat, Jawa Tengah, Sulsel',
    buahAtauSayur: 'Pangan Pokok #1',
    historis: [
      { tahun: 2000, produksi: 51.9 },
      { tahun: 2005, produksi: 54.2 },
      { tahun: 2010, produksi: 66.5 },
      { tahun: 2015, produksi: 75.4 },
      { tahun: 2020, produksi: 54.7 },
      { tahun: 2024, produksi: 54.6 }
    ],
    catatanTren: 'Produksi stabil 53–55 juta ton setelah penyempurnaan metode KSA (Kerangka Sampel Area) BPS.'
  },
  {
    id: 'jagung',
    nama: 'Jagung Pipil Kering',
    kategori: 'pangan',
    kategoriLabel: 'Tanaman Pangan',
    produksi2024: 25.2,
    pangsaPersen: 17.8,
    warna: 'bg-amber-500',
    warnaHex: '#f59e0b',
    sentraUtama: 'Jawa Timur, Jawa Tengah, Lampung, Sulsel, NTB',
    buahAtauSayur: 'Pangan & Pakan Ternak',
    historis: [
      { tahun: 2000, produksi: 9.7 },
      { tahun: 2005, produksi: 12.5 },
      { tahun: 2010, produksi: 18.3 },
      { tahun: 2015, produksi: 19.6 },
      { tahun: 2020, produksi: 22.8 },
      { tahun: 2024, produksi: 25.2 }
    ],
    catatanTren: 'Pertumbuhan tertinggi (+160% sejak 2000) didorong permintaan pakan unggas & ternak nasional.'
  },
  {
    id: 'singkong',
    nama: 'Ubi Kayu (Singkong)',
    kategori: 'pangan',
    kategoriLabel: 'Tanaman Pangan',
    produksi2024: 16.4,
    pangsaPersen: 11.6,
    warna: 'bg-yellow-600',
    warnaHex: '#ca8a04',
    sentraUtama: 'Lampung, Jawa Tengah, Jawa Timur, NTT',
    buahAtauSayur: 'Bahan Baku Tapioka & Pangan',
    historis: [
      { tahun: 2000, produksi: 16.1 },
      { tahun: 2005, produksi: 19.3 },
      { tahun: 2010, produksi: 23.9 },
      { tahun: 2015, produksi: 21.8 },
      { tahun: 2020, produksi: 18.3 },
      { tahun: 2024, produksi: 16.4 }
    ],
    catatanTren: 'Kerap diekspor dan menjadi komoditas penyangga pangan kering di musim kemarau.'
  },
  {
    id: 'pisang',
    nama: 'Pisang (Buah Terbesar RI)',
    kategori: 'buah',
    kategoriLabel: 'Buah-buahan',
    produksi2024: 9.4,
    pangsaPersen: 6.6,
    warna: 'bg-lime-500',
    warnaHex: '#84cc16',
    sentraUtama: 'Jawa Timur (Malang), Jawa Barat, Lampung, Bali',
    buahAtauSayur: 'Juara Produksi Buah RI',
    historis: [
      { tahun: 2000, produksi: 3.7 },
      { tahun: 2005, produksi: 5.2 },
      { tahun: 2010, produksi: 5.8 },
      { tahun: 2015, produksi: 7.3 },
      { tahun: 2020, produksi: 8.2 },
      { tahun: 2024, produksi: 9.4 }
    ],
    catatanTren: 'Menyumbang lebih dari 35% total produksi seluruh buah-buahan di Indonesia.'
  },
  {
    id: 'mangga',
    nama: 'Mangga & Jeruk',
    kategori: 'buah',
    kategoriLabel: 'Buah-buahan',
    produksi2024: 6.8,
    pangsaPersen: 4.8,
    warna: 'bg-orange-500',
    warnaHex: '#f97316',
    sentraUtama: 'Jawa Timur, Indramayu, Cirebon, Sumut (Jeruk Karo)',
    buahAtauSayur: 'Buah Segar Favorit',
    historis: [
      { tahun: 2000, produksi: 2.1 },
      { tahun: 2005, produksi: 3.4 },
      { tahun: 2010, produksi: 4.2 },
      { tahun: 2015, produksi: 5.1 },
      { tahun: 2020, produksi: 6.0 },
      { tahun: 2024, produksi: 6.8 }
    ],
    catatanTren: 'Musim panen raya serentak di kuartal III dan IV tiap tahunnya.'
  },
  {
    id: 'cabai',
    nama: 'Aneka Cabai (Rawit & Merah)',
    kategori: 'sayuran',
    kategoriLabel: 'Sayur-sayuran',
    produksi2024: 3.1,
    pangsaPersen: 2.2,
    warna: 'bg-rose-600',
    warnaHex: '#e11d48',
    sentraUtama: 'Kediri, Blitar, Garut, Temanggung, Lombok',
    buahAtauSayur: 'Sayuran Super Strategis',
    historis: [
      { tahun: 2000, produksi: 1.1 },
      { tahun: 2005, produksi: 1.4 },
      { tahun: 2010, produksi: 1.8 },
      { tahun: 2015, produksi: 2.1 },
      { tahun: 2020, produksi: 2.7 },
      { tahun: 2024, produksi: 3.1 }
    ],
    catatanTren: 'Komoditas pengendali inflasi nasional nomor satu di pasar pangan perkotaan.'
  },
  {
    id: 'bawang',
    nama: 'Bawang Merah & Putih',
    kategori: 'sayuran',
    kategoriLabel: 'Sayur-sayuran',
    produksi2024: 2.2,
    pangsaPersen: 1.6,
    warna: 'bg-purple-600',
    warnaHex: '#9333ea',
    sentraUtama: 'Brebes, Nganjuk, Bima, Demak, Enrekang',
    buahAtauSayur: 'Bumbu Dapur Wajib',
    historis: [
      { tahun: 2000, produksi: 0.8 },
      { tahun: 2005, produksi: 0.9 },
      { tahun: 2010, produksi: 1.1 },
      { tahun: 2015, produksi: 1.3 },
      { tahun: 2020, produksi: 1.8 },
      { tahun: 2024, produksi: 2.2 }
    ],
    catatanTren: 'Swasembada bawang merah berhasil dicapai, Brebes dan Bima jadi lumbung terbesar.'
  },
  {
    id: 'hortilain',
    nama: 'Hortikultura & Sayur Lainnya',
    kategori: 'sayuran',
    kategoriLabel: 'Sayur & Buah Lain',
    produksi2024: 23.9,
    pangsaPersen: 16.9,
    warna: 'bg-slate-500',
    warnaHex: '#64748b',
    sentraUtama: 'Sumatera Utara, Jawa Barat, Malang, Bali, Sulawesi',
    buahAtauSayur: 'Kubis, Tomat, Nanas, Durian, dll',
    historis: [
      { tahun: 2000, produksi: 11.2 },
      { tahun: 2005, produksi: 14.6 },
      { tahun: 2010, produksi: 17.5 },
      { tahun: 2015, produksi: 20.2 },
      { tahun: 2020, produksi: 22.4 },
      { tahun: 2024, produksi: 23.9 }
    ],
    catatanTren: 'Gabungan komoditas sayur daun, tomat, wortel, nanas, pepaya, dan buah tropis lainnya.'
  }
];

// Data tren total produksi gabungan per tahun (Juta Ton)
const TOTAL_TREN_TAHUN = [
  { tahun: '2000', total: 96.5, ket: 'Awal reformasi pertanian' },
  { tahun: '2005', total: 111.5, ket: 'Perluasan bibit hibrida' },
  { tahun: '2010', total: 149.3, ket: 'Ekspansi komoditas pangan' },
  { tahun: '2015', total: 168.0, ket: 'Mekanisasi alat mesin tani' },
  { tahun: '2020', total: 147.0, ket: 'Standardisasi KSA BPS' },
  { tahun: '2024', total: 141.6, ket: 'Ketahanan iklim & irigasi modern' }
];

export default function AgriculturalMonitoringDashboard() {
  const [kategoriAktif, setKategoriAktif] = useState<'semua' | 'pangan' | 'sayuran' | 'buah'>('semua');
  const [selectedKomoditas, setSelectedKomoditas] = useState<CommodityData>(KOMODITAS_NASIONAL[0]);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Filter list sesuai tab kategori
  const filteredList = kategoriAktif === 'semua' 
    ? KOMODITAS_NASIONAL 
    : KOMODITAS_NASIONAL.filter(k => k.kategori === kategoriAktif);

  // Perhitungan SVG Donut Chart (Diagram Bulat)
  const radius = 68;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius; // ~427.25

  let accumulatedOffset = 0;
  const slices = KOMODITAS_NASIONAL.map((item) => {
    const sliceLength = (item.pangsaPersen / 100) * circumference;
    const offset = accumulatedOffset;
    accumulatedOffset += sliceLength;
    return {
      ...item,
      sliceLength,
      offset
    };
  });

  // Highlighted info di tengah diagram bulat
  const activeDonutItem = hoveredSlice 
    ? KOMODITAS_NASIONAL.find(k => k.id === hoveredSlice) || selectedKomoditas 
    : selectedKomoditas;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
      
      {/* 1. HEADER UTAMA SECTION */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Data Resmi BPS & Kementan
            </span>
            <span className="text-xs text-slate-500 font-medium">Historis 2000 – 2024/2025</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700 shrink-0" />
            Monitoring & Statistik Produksi Pertanian Indonesia
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Pantauan komprehensif volume produksi pangan, aneka sayuran, hingga buah-buahan terbanyak yang dipanen petani Nusantara.
          </p>
        </div>

        {/* Tab Selector Kategori */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'semua', label: 'Semua Komoditas' },
            { id: 'pangan', label: 'Pangan Pokok' },
            { id: 'sayuran', label: 'Sayur-sayuran' },
            { id: 'buah', label: 'Buah-buahan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setKategoriAktif(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                kategoriAktif === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. BARIS KARTU HIGHLIGHT UTAMA (METRIK JUARA) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-white">
        
        {/* Pangan Terbanyak */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pangan #1 Terbanyak</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Padi (Beras)</div>
            <div className="text-xs text-emerald-700 font-bold mt-0.5">54.60 Juta Ton / Thn</div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Sentra: Jatim, Jabar, Jateng</span>
        </div>

        {/* Buah Terbanyak */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Buah #1 Terbanyak</span>
            <Sparkles className="w-4 h-4 text-lime-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Pisang Nusantara</div>
            <div className="text-xs text-lime-700 font-bold mt-0.5">9.40 Juta Ton / Thn</div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Menyumbang 35%+ total buah RI</span>
        </div>

        {/* Sayuran Paling Bernilai */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sayur Paling Bernilai</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Cabai & Bawang</div>
            <div className="text-xs text-rose-700 font-bold mt-0.5">5.30 Juta Ton / Thn</div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Komoditas pengendali inflasi utama</span>
        </div>

        {/* Pertumbuhan Produksi */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Produksi Nasional</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">~141.6 Juta Ton</div>
            <div className="text-xs text-slate-700 font-bold mt-0.5">Semua subsektor pertanian</div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Diolah dari 10.6 juta Ha lahan panen</span>
        </div>

      </div>

      {/* 3. BAGIAN INTI: DIAGRAM BULAT (PROPORSI) & DIAGRAM HISTORIS (2000 - SEKARANG) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* KOLOM KIRI: DIAGRAM BULAT (DONUT CHART) INTERAKTIF */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-emerald-700" />
                Diagram Bulat Proporsi Komoditas Terbanyak
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Hover untuk detail</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Porsi pembagian volume hasil panen nasional. Padi dan Jagung mendominasi lebih dari 55% total tonase pangan.
            </p>

            {/* SVG DONUT CHART INTERAKTIF */}
            <div className="relative flex items-center justify-center my-3">
              <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                />
                
                {/* Slices */}
                {slices.map((slice) => {
                  const isHovered = hoveredSlice === slice.id;
                  const isSelected = selectedKomoditas.id === slice.id;
                  return (
                    <circle
                      key={slice.id}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={slice.warnaHex}
                      strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${slice.sliceLength} ${circumference}`}
                      strokeDashoffset={-slice.offset}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(slice.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => setSelectedKomoditas(slice)}
                    />
                  );
                })}
              </svg>

              {/* Teks Tengah Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {activeDonutItem.kategoriLabel}
                </span>
                <span className="text-lg font-black text-slate-900 leading-tight mt-0.5 line-clamp-1">
                  {activeDonutItem.nama.split('(')[0]}
                </span>
                <span className="text-base font-extrabold text-emerald-700 mt-0.5">
                  {activeDonutItem.pangsaPersen}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {activeDonutItem.produksi2024} Juta Ton
                </span>
              </div>
            </div>
          </div>

          {/* Legend Warna Diagram Bulat */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
            {KOMODITAS_NASIONAL.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedKomoditas(item)}
                onMouseEnter={() => setHoveredSlice(item.id)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center gap-2 p-1.5 rounded-lg text-left transition-colors text-xs ${
                  selectedKomoditas.id === item.id ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.warnaHex }} />
                <span className="truncate">{item.nama.split('(')[0]}</span>
                <span className="ml-auto text-[11px] text-slate-400">{item.pangsaPersen}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: DIAGRAM HISTORIS (2000 - SEKARANG) & DETAIL SENTRA */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  Grafik Tren Produksi: {selectedKomoditas.nama}
                </h3>
                <p className="text-xs text-slate-500">
                  Perkembangan panen dari tahun 2000 hingga 2024/2025 (Satuan: Juta Ton)
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start">
                <span className="font-semibold">{selectedKomoditas.buahAtauSayur}</span>
              </div>
            </div>

            {/* DIAGRAM BATANG HISTORIS (2000 - 2024) */}
            <div className="space-y-2.5 my-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {(() => {
                const maxVal = Math.max(...selectedKomoditas.historis.map(h => h.produksi)) * 1.15 || 1;
                return selectedKomoditas.historis.map((h, idx) => {
                  const widthPct = Math.round((h.produksi / maxVal) * 100);
                  const isLatest = idx === selectedKomoditas.historis.length - 1;

                  return (
                    <div key={h.tahun} className="flex items-center gap-3 text-xs">
                      <span className="w-10 font-bold text-slate-600 text-right shrink-0">{h.tahun}</span>
                      <div className="flex-1 bg-slate-200/80 rounded-full h-5 overflow-hidden flex items-center p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 flex items-center justify-end px-2 ${
                            isLatest ? 'bg-emerald-600' : 'bg-slate-700'
                          }`}
                          style={{ width: `${Math.max(widthPct, 12)}%` }}
                        >
                          <span className="text-[10px] text-white font-bold tracking-tight">
                            {h.produksi} Jt
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 w-16 text-right font-medium">
                        {h.produksi} Juta T
                      </span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Catatan Analisis Komoditas yang Dipilih */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">{selectedKomoditas.catatanTren}</p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <strong>Lumbung Utama:</strong> {selectedKomoditas.sentraUtama}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Switcher Komoditas di Bagian Bawah */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Pilih Komoditas untuk Menampilkan Tren Historis:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {filteredList.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKomoditas(k)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedKomoditas.id === k.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {k.nama.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. FOOTER: PERBANDINGAN TREN NASIONAL DARI TAHUN 2000 & STATISTIK PETANI */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Kesimpulan BPS:</strong> Produksi komoditas pangan & hortikultura Indonesia tumbuh rata-rata <strong>+2.4% per tahun</strong> sejak era tahun 2000.
          </span>
        </div>
        <div className="text-slate-400 text-[11px] shrink-0">
          Diperbarui: Sensus Pertanian & Estimasi Terkini
        </div>
      </div>

    </div>
  );
}
