'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Menu, 
  X, 
  LayoutGrid, 
  Activity, 
  CloudSun, 
  PlusCircle, 
  ScanSearch, 
  TrendingUp, 
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
      <header className="fixed top-0 left-0 right-0 z-40 w-full flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center justify-between bg-white/95 backdrop-blur-md text-slate-800 will-change-[transform,box-shadow] border rounded-2xl transition-all duration-300 w-[calc(100%-28px)] sm:w-[92%] lg:w-[88%] max-w-[1280px] h-[52px] sm:h-[58px] px-3.5 sm:px-8 translate-y-2 sm:translate-y-3 ${
            isScrolled
              ? 'border-slate-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
              : 'border-slate-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.05)]'
          }`}
        >
          {/* Left: Brand Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all shrink-0">
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.3]" />
              </div>
              <div className="flex flex-col justify-center shrink-0">
                <span className="font-[family-name:var(--font-outfit)] font-black text-[15px] sm:text-[16px] md:text-[18px] tracking-[0.05em] uppercase text-[#0A1628] leading-tight">
                  KERTANUSA
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[7.5px] sm:text-[8px] md:text-[9px] font-extrabold tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#475569] leading-none mt-0.5">
                  KREASI RISET TANI NUSANTARA
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-7 justify-center shrink-0">
            {desktopNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13.5px] font-medium transition-colors py-1 ${
                    isActive ? 'text-[#0A1628] font-bold' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Counterbalance Spacer */}
          <div className="flex-1 hidden lg:flex justify-end items-center">
            {/* Spacer penyeimbang tengah */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 text-[#1E293B] hover:bg-slate-100 rounded-full focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay & Drawer (Paysaku Clean Natural Style) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-emerald-100/70 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto overflow-y-auto">
          {/* Top Floating Pill Bar */}
          <div className="mx-4 mt-3 px-4 h-[56px] bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-between shrink-0">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Sprout className="w-4 h-4 text-white stroke-[2.3]" />
              </div>
              <span className="font-[family-name:var(--font-outfit)] font-black text-[15px] tracking-[0.05em] uppercase text-[#0A1628]">
                KERTANUSA
              </span>
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
          <div className="mx-4 mt-3 mb-6 bg-white rounded-[28px] border border-slate-100 shadow-lg px-6 py-5 flex flex-col">
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

              {/* 2. Group MONITORING */}
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
                    <span>Iklim & pH Tanah</span>
                  </Link>

                  <Link
                    href="/input-lahan"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-1 transition-colors text-[14px] ${
                      pathname === '/input-lahan' ? 'text-emerald-700 font-bold' : 'text-slate-700 font-medium hover:text-emerald-600'
                    }`}
                  >
                    <PlusCircle className={`w-4 h-4 stroke-[1.8] ${pathname === '/input-lahan' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Input Lahan</span>
                  </Link>

                  <Link
                    href="/scan-ai"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-1 transition-colors text-[14px] ${
                      pathname === '/scan-ai' ? 'text-emerald-700 font-bold' : 'text-slate-700 font-medium hover:text-emerald-600'
                    }`}
                  >
                    <ScanSearch className={`w-4 h-4 stroke-[1.8] ${pathname === '/scan-ai' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Scan AI Tanaman</span>
                  </Link>
                </div>
              </div>

              {/* 3. Daya Beli Pasar */}
              <div className="py-3">
                <Link
                  href="/tren-pasar"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/tren-pasar' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 stroke-[1.8] ${pathname === '/tren-pasar' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Daya Beli Pasar</span>
                </Link>
              </div>

              {/* 4. Riset Petani */}
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

              {/* 5. Dokumentasi */}
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

              {/* 6. FAQ */}
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
