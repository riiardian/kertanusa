'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Activity, 
  CloudSun, 
  TrendingUp,
  PlusCircle, 
  ScanSearch, 
  Users, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollY > 20);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  useEffect(() => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setIsScrolled(scrollY > 20);
  }, [pathname]);

  const desktopNavItems = [
    { href: '/', label: 'Beranda' },
    { href: '/input-lahan', label: 'Input Lahan' },
    { href: '/monitoring', label: 'Iklim & pH' },
    { href: '/scan-ai', label: 'Scan AI & Panen' },
    { href: '/tren-pasar', label: 'Daya Beli Pasar' },
    { href: '/riset-petani', label: 'Riset Petani' },
  ];

  return (
    <>
      {/* Main Floating Navbar Header (Bentuk Kapsul Melayang) */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center justify-between bg-white/95 backdrop-blur-md text-slate-800 will-change-[transform,box-shadow] border rounded-full transition-all duration-300 w-[calc(100%-32px)] sm:w-[94%] lg:w-[92%] xl:w-[88%] max-w-[1280px] h-[56px] px-4 sm:px-6 xl:px-8 translate-y-3 ${
            isScrolled
              ? 'border-slate-200/90 shadow-md'
              : 'border-slate-100 shadow-sm'
          }`}
        >
          {/* Left: Brand Logo & Subtitle */}
          <div className="flex-1 flex justify-start items-center shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                <Image
                  src="/logokertanusa.png"
                  alt="Logo Kertanusa"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain drop-shadow-xs"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center shrink-0">
                <span className="font-[family-name:var(--font-outfit)] font-black text-[15px] sm:text-[16px] md:text-[18px] tracking-[0.05em] uppercase text-[#0A1628] leading-tight">
                  KERTANUSA
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[7px] sm:text-[7.5px] lg:text-[7.5px] xl:text-[8px] font-extrabold tracking-[0.1em] sm:tracking-[0.14em] uppercase text-[#475569] leading-none mt-0.5 whitespace-nowrap">
                  KREASI RISET TANI NUSANTARA
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links (Centered, Clean Typography without card/capsule badge) */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-8 justify-center shrink-0">
            {desktopNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[12.5px] xl:text-[13.5px] font-semibold transition-colors py-1 px-1 whitespace-nowrap ${
                    isActive 
                      ? 'text-emerald-600 font-bold' 
                      : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Desktop Counterbalance Spacer (Balances Left Logo so Center is Truly Centered) */}
          <div className="flex-1 hidden lg:flex justify-end items-center shrink-0">
            {/* Counterbalance spacer */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay & Drawer (Gelap Blur Backdrop + Teks Lengkap) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto overflow-y-auto">
          {/* Top Floating Pill Bar */}
          <div className="mx-4 mt-3 px-4 sm:px-6 h-[56px] bg-white rounded-full border border-slate-100 shadow-md flex items-center justify-between shrink-0">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
                <Image
                  src="/logokertanusa.png"
                  alt="Logo Kertanusa"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain drop-shadow-xs"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center shrink-0">
                <span className="font-[family-name:var(--font-outfit)] font-black text-[15px] sm:text-[16px] tracking-[0.05em] uppercase text-[#0A1628] leading-tight">
                  KERTANUSA
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[7.5px] sm:text-[8px] font-extrabold tracking-[0.2em] uppercase text-[#475569] leading-none mt-0.5">
                  KREASI RISET TANI NUSANTARA
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Main White Card Drawer */}
          <div className="mx-4 mt-3 mb-6 bg-white rounded-[28px] border border-slate-100 shadow-xl px-6 py-5 flex flex-col">
            <nav className="flex flex-col divide-y divide-slate-100 text-slate-800">
              {/* 1. Beranda */}
              <div className="pb-3">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <LayoutGrid className={`w-5 h-5 stroke-[1.8] ${pathname === '/' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Beranda</span>
                </Link>
              </div>

              {/* 2. Input Lahan (DI LUAR KATEGORI MONITORING) */}
              <div className="py-3">
                <Link
                  href="/input-lahan"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/input-lahan' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <PlusCircle className={`w-5 h-5 stroke-[1.8] ${pathname === '/input-lahan' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Input Lahan</span>
                </Link>
              </div>

              {/* 3. Group MONITORING (Hanya Iklim & Cuaca + Daya Beli Pasar) */}
              <div className="py-3 space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-0.5 pb-1">
                  <Activity className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                  <span>MONITORING</span>
                </div>
                
                {/* Sub-items (Indented) */}
                <div className="pl-6 space-y-2.5 pt-0.5">
                  <Link
                    href="/monitoring"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-1 transition-colors text-[14px] ${
                      pathname === '/monitoring' ? 'text-emerald-700 font-bold' : 'text-slate-700 font-medium hover:text-emerald-600'
                    }`}
                  >
                    <CloudSun className={`w-4 h-4 stroke-[1.8] ${pathname === '/monitoring' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Iklim & Cuaca</span>
                  </Link>

                  <Link
                    href="/tren-pasar"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-1 transition-colors text-[14px] ${
                      pathname === '/tren-pasar' ? 'text-emerald-700 font-bold' : 'text-slate-700 font-medium hover:text-emerald-600'
                    }`}
                  >
                    <TrendingUp className={`w-4 h-4 stroke-[1.8] ${pathname === '/tren-pasar' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Daya Beli Pasar</span>
                  </Link>
                </div>
              </div>

              {/* 4. Scan AI Tanaman (DI LUAR KATEGORI MONITORING) */}
              <div className="py-3">
                <Link
                  href="/scan-ai"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/scan-ai' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <ScanSearch className={`w-5 h-5 stroke-[1.8] ${pathname === '/scan-ai' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Scan AI Tanaman</span>
                </Link>
              </div>

              {/* 5. Riset Petani */}
              <div className="py-3">
                <Link
                  href="/riset-petani"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/riset-petani' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <Users className={`w-5 h-5 stroke-[1.8] ${pathname === '/riset-petani' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Riset Petani</span>
                </Link>
              </div>

              {/* 6. Dokumentasi */}
              <div className="py-3">
                <Link
                  href="/#riset"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3.5 py-1 text-slate-800 font-semibold hover:text-emerald-600 transition-colors"
                >
                  <BookOpen className="w-5 h-5 stroke-[1.8] text-slate-400" />
                  <span className="text-[15px]">Dokumentasi</span>
                </Link>
              </div>

              {/* 7. FAQ */}
              <div className="py-3">
                <Link
                  href="/#faq"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3.5 py-1 text-slate-800 font-semibold hover:text-emerald-600 transition-colors"
                >
                  <HelpCircle className="w-5 h-5 stroke-[1.8] text-slate-400" />
                  <span className="text-[15px]">FAQ</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
