'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sprout, BarChart3, ScanSearch, Users, Menu, X, CloudSun, PlusCircle } from 'lucide-react';

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

  const navItems = [
    { href: '/', label: 'Beranda', icon: Sprout },
    { href: '/input-lahan', label: 'Input Lahan', icon: PlusCircle },
    { href: '/monitoring', label: 'Iklim & pH', icon: CloudSun },
    { href: '/scan-ai', label: 'Scan AI & Panen', icon: ScanSearch },
    { href: '/tren-pasar', label: 'Daya Beli Pasar', icon: BarChart3 },
    { href: '/riset-petani', label: 'Riset Petani', icon: Users },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none">
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
          {navItems.map((item) => {
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
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-[#1E293B] hover:bg-slate-100 rounded-full focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Card Melayang Putih Kompak Pas Sudut) */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs -z-10 pointer-events-auto"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="lg:hidden pointer-events-auto absolute left-3.5 right-3.5 bg-white border border-slate-100 px-5 pt-3 pb-5 shadow-2xl text-slate-700 rounded-2xl max-w-[1280px] mx-auto flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200 top-[62px]"
          >
            <nav className="flex flex-col text-[13.5px]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-2.5 border-b border-slate-100 font-medium transition-colors ${
                      isActive ? 'text-[#0A1628] font-bold' : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
