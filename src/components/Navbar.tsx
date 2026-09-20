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
    <header className="sticky top-0 z-50 bg-emerald-800 border-b border-emerald-700/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Bersih, Elegan, Natural & Tanpa AI Slop */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 border border-emerald-600/60 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-600 transition-colors">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-emerald-100 transition-colors">
              AgroNusantara
            </span>
          </Link>

          {/* Desktop Nav - Bersih & Rapi */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-950/60 text-white shadow-xs'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-700/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-90" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Action */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/input-lahan"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Daftar Lahan Baru</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-700/70 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-emerald-700 bg-emerald-800 px-4 pt-2 pb-4 space-y-1 shadow-lg">
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
                    ? 'bg-emerald-950 text-white font-bold'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/input-lahan"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-white text-emerald-900 text-sm font-bold shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Daftar Lahan Baru</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}