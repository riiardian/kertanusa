'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sprout, BarChart3, ScanSearch, Users, Menu, X, CloudSun, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Beranda', icon: Sprout },
    { href: '/input-lahan', label: 'Input Lahan', icon: PlusCircle },
    { href: '/monitoring', label: 'Iklim & pH', icon: CloudSun },
    { href: '/scan-ai', label: 'Scan AI & Panen', icon: ScanSearch },
    { href: '/tren-pasar', label: 'Daya Beli Pasar', icon: BarChart3 },
    { href: '/riset-petani', label: 'Riset Petani', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1A13] border-b border-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Elegan, Natural & Modern */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-500 transition-colors">
              <Sprout className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                Agro<span className="text-emerald-400">Nusantara</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-semibold uppercase tracking-wider text-emerald-300/90 bg-emerald-950/90 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                AI Tani
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Clean, Modern Typography (Bebas Icon Clutter) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/70'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Live Satellite Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-900/60 text-[11px] text-slate-300 font-medium">
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
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-emerald-950 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-emerald-950 bg-[#0B1A13] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-900/90 text-emerald-100 font-bold border border-emerald-700/60'
                    : 'text-slate-300 hover:bg-emerald-950 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-emerald-950/80 mt-2">
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
