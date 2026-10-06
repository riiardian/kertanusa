'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MapPin, Radio, ShieldCheck, Sprout, Smartphone } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ElementType;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara mendaftarkan lahan sawah baru ke dalam peta sebaran KERTANUSA?',
    answer: 'Petani atau kelompok tani dapat mendaftarkan lahan melalui menu "Input Lahan". Anda cukup memasukkan nama petani, luas tanah, jenis komoditas tanaman, perkiraan waktu tanam, serta menyalakan izin lokasi GPS di perangkat Anda. Sistem akan otomatis mengunci titik koordinat sawah dan menghubungkannya ke jaringan sebaran nasional.',
    icon: Sprout
  },
  {
    id: 'faq-2',
    question: 'Apakah titik koordinat lahan tetap 100% akurat tanpa peta satelit foto?',
    answer: 'Ya, akurasi tetap 100% presisi. Sistem KERTANUSA menggunakan standar geospasial global WGS 84 (EPSG:4326) yang dipadukan dengan batas wilayah resmi Badan Informasi Geospasial (BIG). Posisi lahan dipetakan secara matematis berdasarkan garis lintang (latitude) dan bujur (longitude) GPS asli, bukan estimasi visual.',
    icon: MapPin
  },
  {
    id: 'faq-3',
    question: 'Apa fungsi garis lengkung hijau mint yang menghubungkan antarlahan petani?',
    answer: 'Garis tersebut merupakan visualisasi Jaringan Telemetri Sensor Nusantara (Mesh Grid Level 1). Sistem menghubungkan sentra-sentra pertanian untuk menganalisis keselarasan iklim mikro (suhu lingkungan, pH tanah, dan kelembapan) guna memantau stabilitas panen dan mendeteksi potensi anomali cuaca lintas wilayah.',
    icon: Radio
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara melihat detail telemetri tanah dan jadwal panen pada pin sawah?',
    answer: 'Anda cukup mengetuk atau mengklik salah satu pin merah di peta. Di layar desktop, jendela ringkasan otomatis terbuka di samping pin. Di layar smartphone (HP), kartu ringkasan Google Maps-style akan muncul di bagian bawah layar berisi nama petani, komoditas, fase pertumbuhan, estimasi panen, serta 3 sensor tanah (Kelembapan %, pH, dan Suhu °C).',
    icon: ShieldCheck
  },
  {
    id: 'faq-5',
    question: 'Kenapa ada tombol ikon gembok di kanan atas pada layar smartphone?',
    answer: 'Fitur gembok berfungsi untuk mencegah gangguan geser halaman (scroll hijacking). Saat ikon gembok terkunci, Anda dapat menggulir layar web ke atas dan bawah dengan normal. Jika ingin menjelajahi atau menggeser peta di HP, cukup ketuk ikon gembok hingga berwarna hijau (terbuka).',
    icon: Smartphone
  }
];

export default function MapFarmlandFAQ() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['faq-1']));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="w-full space-y-4 pt-4">
      {/* Header FAQ */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-xs shrink-0">
          <HelpCircle className="w-4.5 h-4.5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h3>
          <p className="text-xs text-slate-500">
            Informasi lengkap seputar pemetaan lahan sawah, koordinat GPS, dan telemetri KERTANUSA
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="grid grid-cols-1 gap-2.5">
        {FAQ_LIST.map((item) => {
          const isOpen = openIds.has(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen 
                  ? 'bg-white/90 border-emerald-200/80 shadow-xs' 
                  : 'bg-white/60 hover:bg-white/90 border-slate-200/70'
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 cursor-pointer select-none transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isOpen 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[13px] sm:text-[14px] font-semibold leading-snug ${
                    isOpen ? 'text-emerald-950 font-bold' : 'text-slate-800'
                  }`}>
                    {item.question}
                  </span>
                </div>
                <div className={`p-1 rounded-md text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-emerald-600' : ''
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-0 text-[12px] sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1 animate-in fade-in duration-200">
                  <p className="pl-10 text-slate-600">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
