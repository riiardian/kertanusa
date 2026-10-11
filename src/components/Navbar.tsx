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
  HelpCircle,
  ClipboardCheck 
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

    // Update document title dynamically on client navigation
    const routeTitles: Record<string, string> = {
      '/': 'Beranda | KERTANUSA',
      '/input-lahan': 'Kelola Lahan | KERTANUSA',
      '/monitoring': 'Agroklimat | KERTANUSA',
      '/scan-ai': 'Pindai Tanaman | KERTANUSA',
      '/tren-pasar': 'Harga Pasar | KERTANUSA',
      '/riset-petani': 'Riset Petani | KERTANUSA',
    };
    if (routeTitles[pathname]) {
      document.title = routeTitles[pathname];
    }
  }, [pathname]);

  const desktopNavItems = [
    { href: '/', label: 'Beranda' },
    { href: '/input-lahan', label: 'Kelola Lahan' },
    { href: '/monitoring', label: 'Agroklimat' },
    { href: '/scan-ai', label: 'Pindai Tanaman' },
    { href: '/tren-pasar', label: 'Harga Pasar' },
  ];

  const handleFaqClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      setTimeout(() => {
        const faqElement = document.getElementById('faq');
        if (faqElement) {
          faqElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleKuesionerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      setTimeout(() => {
        const el = document.getElementById('kuesioner-uat');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Main Floating Navbar Header (Bentuk Kapsul Melayang) */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center justify-between bg-white/95 backdrop-blur-md text-slate-800 will-change-[transform,box-shadow] border rounded-full transition-all duration-300 w-[calc(100%-32px)] sm:w-[94%] lg:w-[96%] xl:w-[90%] max-w-[1280px] h-[56px] px-4 sm:px-6 xl:px-8 translate-y-3 ${
            isScrolled
              ? 'border-slate-200/90 shadow-md'
              : 'border-slate-100 shadow-sm'
          }`}
        >
          {/* Left: Brand Logo & Subtitle */}
          <div className="flex-1 flex justify-start items-center shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
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
                <span className="font-[family-name:var(--font-outfit)] font-black text-[15px] sm:text-[16px] md:text-[18px] tracking-[0.05em] uppercase text-[#0A1628] leading-tight">
                  KERTANUSA
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[7.5px] sm:text-[8px] md:text-[8.5px] font-extrabold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#475569] leading-none mt-0.5 whitespace-nowrap">
                  KREASI RISET TANI NUSANTARA
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links (Neutral font with black bottom underline on hover & persistent on active) */}
          <nav className="hidden lg:flex items-center gap-2 lg:gap-2.5 xl:gap-5 2xl:gap-7 justify-center shrink-0">
            {desktopNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group h-[38px] flex items-center justify-center px-1.5 xl:px-2 text-[11.5px] lg:text-[12px] xl:text-[13.5px] whitespace-nowrap cursor-pointer"
                >
                  <span
                    className={`transition-colors ${
                      isActive 
                        ? 'text-slate-950 font-bold' 
                        : 'text-slate-700 group-hover:text-slate-950 font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Garis hitam bawah: muncul saat cursor diarahkan (hover) & netep saat halaman aktif */}
                  <span
                    className={`absolute bottom-0.5 left-1 right-1 h-[2px] bg-slate-950 rounded-full transition-transform duration-200 origin-center ${
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: Desktop Counterbalance Spacer (Balances Left Logo so Center is Truly Centered) */}
          <div className="flex-1 hidden lg:flex justify-end items-center shrink-0 pointer-events-none">
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
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center">
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
                <span className="font-[family-name:var(--font-outfit)] font-black text-[15px] sm:text-[16px] md:text-[18px] tracking-[0.05em] uppercase text-[#0A1628] leading-tight">
                  KERTANUSA
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[7.5px] sm:text-[8px] md:text-[8.5px] font-extrabold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#475569] leading-none mt-0.5 whitespace-nowrap">
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

              {/* 2. Kelola Lahan (DI LUAR KATEGORI MONITORING) */}
              <div className="py-3">
                <Link
                  href="/input-lahan"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/input-lahan' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <PlusCircle className={`w-5 h-5 stroke-[1.8] ${pathname === '/input-lahan' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Kelola Lahan</span>
                </Link>
              </div>

              {/* 3. Group MONITORING (Hanya Agroklimat + Harga Pasar) */}
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
                    <span>Agroklimat</span>
                  </Link>

                  <Link
                    href="/tren-pasar"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-1 transition-colors text-[14px] ${
                      pathname === '/tren-pasar' ? 'text-emerald-700 font-bold' : 'text-slate-700 font-medium hover:text-emerald-600'
                    }`}
                  >
                    <TrendingUp className={`w-4 h-4 stroke-[1.8] ${pathname === '/tren-pasar' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Harga Pasar</span>
                  </Link>
                </div>
              </div>

              {/* 4. Pindai Tanaman (DI LUAR KATEGORI MONITORING) */}
              <div className="py-3">
                <Link
                  href="/scan-ai"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 py-1 transition-colors ${
                    pathname === '/scan-ai' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold hover:text-emerald-600'
                  }`}
                >
                  <ScanSearch className={`w-5 h-5 stroke-[1.8] ${pathname === '/scan-ai' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[15px]">Pindai Tanaman</span>
                </Link>
              </div>

              {/* 5. FAQ */}
              <div className="py-3">
                <Link
                  href="/#faq"
                  onClick={handleFaqClick}
                  className="flex items-center gap-3.5 py-1 text-slate-800 font-semibold hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 stroke-[1.8] text-slate-400" />
                  <span className="text-[15px]">FAQ</span>
                </Link>
              </div>

              {/* 6. Kuesioner Validasi & UAT */}
              <div className="py-3">
                <Link
                  href="/#kuesioner-uat"
                  onClick={handleKuesionerClick}
                  className="flex items-center gap-3.5 py-1 text-slate-800 font-semibold hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <ClipboardCheck className="w-5 h-5 stroke-[1.8] text-slate-400" />
                  <span className="text-[15px]">Kuesioner Validasi (UAT)</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
