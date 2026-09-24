'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sprout, BarChart3, ScanSearch, Users, Menu, X, CloudSun, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === '/';

  const navItems = [
    { href: '/', label: 'Beranda', icon: Sprout },
    { href: '/input-lahan', label: 'Input Lahan', icon: PlusCircle },
    { href: '/monitoring', label: 'Iklim & pH', icon: CloudSun },
    { href: '/scan-ai', label: 'Scan AI & Panen', icon: ScanSearch },
    { href: '/tren-pasar', label: 'Daya Beli Pasar', icon: BarChart3 },
    { href: '/riset-petani', label: 'Riset Petani', icon: Users },
  ];

  return (
    <header
      className={`${
        isHome
          ? 'absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent text-white'
          : 'sticky top-0 z-50 bg-[#0B1A13] border-b border-emerald-950 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo (Tulisan AI Tani dihapus) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-500 transition-colors">
              <Sprout className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-100 transition-colors leading-tight">
                Kerta<span className="text-emerald-400">nusa</span>
              </span>
              <span className="text-[9.5px] text-emerald-300/85 font-medium tracking-tight leading-none hidden sm:block">
                Kreasi Riset Tani Nusantara
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Garis Bawah Putih untuk Item Aktif & Hover (Tanpa Background Card) */}
          <nav className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-1.5 px-1 text-xs font-semibold transition-all border-b-2 ${
                    isActive
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-slate-200 hover:text-white hover:border-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Live Satellite Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/15 text-[11px] text-slate-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Satelit Terhubung</span>
            </div>

            <Link
              href="/input-lahan"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors border border-emerald-500/40 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-100" />
              <span>Daftar Lahan Baru</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950/95 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-white font-bold border-b border-white'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 mt-2">
            <Link
              href="/input-lahan"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-100" />
              <span>Daftar Lahan Baru</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
