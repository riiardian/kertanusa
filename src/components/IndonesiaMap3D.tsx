'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Satellite, Navigation, RefreshCw, X, 
  MapPin, Droplets, Thermometer, ShieldCheck, Sprout,
  ChevronRight, Compass, ZoomIn, ZoomOut
} from 'lucide-react';
import { PetaniRecord } from '@/lib/types';

interface IndonesiaMap3DProps {
  interactive?: boolean;
  highlightFarmerId?: string;
  onSelectFarmer?: (farmer: PetaniRecord) => void;
  userCoords?: { lat: number; lon: number; label?: string } | null;
}

export default function IndonesiaMap3D({ 
  interactive = true, 
  highlightFarmerId,
  onSelectFarmer,
  userCoords
}: IndonesiaMap3DProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [farmers, setFarmers] = useState<PetaniRecord[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<PetaniRecord | null>(null);
  const [myGps, setMyGps] = useState<{ lat: number; lon: number; accuracy?: number } | null>(userCoords || null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filterRegion, setFilterRegion] = useState<'semua' | 'jawa' | 'luar-jawa'>('semua');
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch Petani
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/petani');
        const json = await res.json();
        if (json.success && json.data) {
          setFarmers(json.data);
        }
      } catch (e) {
        console.error('Failed to load farmers for map', e);
      }
    }
    loadData();
  }, []);

  // Initialize Leaflet Map with Natural Esri Satellite Imagery
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Center of Indonesia Archipelago
      const map = L.map(mapContainerRef.current, {
        center: [-2.2, 118.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Natural High-Resolution Satellite Layer (Esri World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      // Markers Layer Group
      const markersGroup = L.layerGroup([]).addTo(map);
      markersGroupRef.current = markersGroup;

      // Clean Equator Khatulistiwa line
      L.polyline([[0, 94], [0, 142]], {
        color: '#0284c7',
        weight: 1.5,
        dashArray: '6, 8',
        opacity: 0.6
      }).addTo(map);

      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      setMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      setMapReady(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Render Glowing Radar Markers for Farmers
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersGroupRef.current || farmers.length === 0) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const markersGroup = markersGroupRef.current;
      if (!markersGroup) return;
      markersGroup.clearLayers();

      const filtered = farmers.filter(f => {
        if (filterRegion === 'semua') return true;
        const isJawa = f.daerah.toLowerCase().includes('jawa') || f.daerah.toLowerCase().includes('brebes') || f.daerah.toLowerCase().includes('malang') || f.daerah.toLowerCase().includes('cianjur');
        if (filterRegion === 'jawa') return isJawa;
        return !isJawa;
      });

      filtered.forEach((f) => {
        if (!f.lat || !f.lon) return;

        const isHighlight = highlightFarmerId === f.id || selectedFarmer?.id === f.id;

        const iconHtml = `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div class="radar-ping-farmer"></div>
            <div style="
              position: relative;
              width: 14px; 
              height: 14px; 
              border-radius: 9999px; 
              background-color: ${isHighlight ? '#0284c7' : '#059669'}; 
              border: 2px solid #ffffff; 
              box-shadow: 0 1px 6px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              transform: ${isHighlight ? 'scale(1.25)' : 'scale(1)'};
              transition: transform 0.2s;
            ">
              <div style="width: 4px; height: 4px; border-radius: 9999px; background-color: #ffffff;"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'farmer-marker-beacon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([f.lat, f.lon], { icon: customIcon });

        marker.on('click', () => {
          setSelectedFarmer(f);
          if (onSelectFarmer) onSelectFarmer(f);
          mapInstanceRef.current.flyTo([f.lat!, f.lon!], 9, { duration: 1.2 });
        });

        markersGroup.addLayer(marker);
      });
    });
  }, [farmers, filterRegion, highlightFarmerId, selectedFarmer, mapReady]);

  // Render User Live GPS Marker
  useEffect(() => {
    const coords = userCoords || myGps;
    if (!mapReady || !coords || !coords.lat || !coords.lon || !mapInstanceRef.current) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const map = mapInstanceRef.current;
      if (!map) return;

      if (userMarkerRef.current) {
        try { map.removeLayer(userMarkerRef.current); } catch (e) {}
      }

      const userIconHtml = `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div class="radar-ping-user"></div>
          <div style="
            width: 16px; 
            height: 16px; 
            border-radius: 9999px; 
            background-color: #0284c7; 
            border: 2.5px solid #ffffff; 
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 5px; height: 5px; border-radius: 9999px; background-color: #ffffff;"></div>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userIconHtml,
        className: 'user-marker-beacon',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const userMarker = L.marker([coords.lat, coords.lon], { 
        icon: userIcon, 
        zIndexOffset: 1000
      }).addTo(map);

      userMarkerRef.current = userMarker;
    });
  }, [myGps, userCoords, mapReady]);

  // Trigger GPS
  function handleTriggerGps() {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung sensor GPS.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setMyGps({
          lat: latitude,
          lon: longitude,
          accuracy: Math.round(accuracy)
        });
        setGpsLoading(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 12, { duration: 1.8 });
        }
      },
      (err) => {
        setGpsLoading(false);
        alert('Gagal membaca GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  // Region Focus
  function handleFocusRegion(region: 'semua' | 'jawa' | 'luar-jawa') {
    setFilterRegion(region);
    if (!mapInstanceRef.current) return;

    if (region === 'jawa') {
      mapInstanceRef.current.flyTo([-7.3, 110.0], 7, { duration: 1.2 });
    } else if (region === 'luar-jawa') {
      mapInstanceRef.current.flyTo([-0.5, 117.0], 5, { duration: 1.2 });
    } else {
      mapInstanceRef.current.flyTo([-2.2, 118.0], 5, { duration: 1.2 });
    }
  }

  return (
    <div className="w-full space-y-2 text-slate-800">
      
      {/* Real Satellite Map Area - Clean & Natural (No Enclosing Table/Card) */}
      <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs" style={{ height: '480px' }}>
        <div ref={mapContainerRef} className="w-full h-full z-0"></div>

        {/* Island Filter Tabs (Floating Top-Left on Map) */}
        <div className="absolute left-3.5 top-3.5 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-sm text-[11px]">
          <button
            onClick={() => handleFocusRegion('semua')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterRegion === 'semua'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => handleFocusRegion('jawa')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterRegion === 'jawa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jawa
          </button>
          <button
            onClick={() => handleFocusRegion('luar-jawa')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterRegion === 'luar-jawa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Luar Jawa
          </button>
        </div>

        {/* Clean Natural Zoom & Reset Controls */}
        <div className="absolute right-3.5 top-3.5 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.flyTo([-2.2, 118.0], 5)}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-emerald-600 border border-slate-200 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            title="Reset Tampilan Nusantara"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Farmer Telemetry Modal - Natural White & Green-Blue Accents */}
        {selectedFarmer && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-84 p-4 rounded-2xl bg-white/95 border border-slate-200 text-slate-900 shadow-xl backdrop-blur-md z-30 space-y-3 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{selectedFarmer.nama_petani}</h4>
                  <p className="text-[10px] text-emerald-700 font-semibold">{selectedFarmer.daerah}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFarmer(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-emerald-700 block text-[9px] font-bold">Komoditas & Luas</span>
                <strong className="text-slate-900 block truncate">{selectedFarmer.jenis_tanaman}</strong>
                <span className="text-[10px] text-slate-600 font-medium">{selectedFarmer.luas_tanah} {selectedFarmer.satuan_luas}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                <span className="text-sky-700 block text-[9px] font-bold">Titik Satelit BMKG</span>
                <span className="font-mono text-[10px] text-slate-900 block truncate font-bold">
                  {selectedFarmer.lat?.toFixed(4)}, {selectedFarmer.lon?.toFixed(4)}
                </span>
                <span className="text-[10px] text-sky-700 font-semibold">
                  Akurasi ±{selectedFarmer.akurasi_gps || 8}m
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px]">
              <span className="flex items-center gap-1 text-slate-700">
                <Droplets className="w-3 h-3 text-sky-600" />
                <span>Tanah: <strong className="text-slate-900">{selectedFarmer.kelembapan_tanah || 58}%</strong></span>
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                <span>pH: <strong className="text-slate-900">{selectedFarmer.ph_tanah || 6.5}</strong></span>
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <Thermometer className="w-3 h-3 text-amber-500" />
                <span><strong className="text-slate-900">{selectedFarmer.suhu_lingkungan || 29.5}°C</strong></span>
              </span>
            </div>

            {/* Waktu Tanam & Estimasi Panen Info */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
              <span>Mulai Tanam: <strong className="text-slate-800 font-mono">{selectedFarmer.waktu_tanam}</strong></span>
              <span>Est. Panen: <strong className="text-emerald-700 font-mono">{selectedFarmer.estimasi_panen || '-'}</strong></span>
            </div>

            <div className="pt-0.5 flex justify-between items-center text-[10px]">
              <span className="text-slate-500">
                Fase: <strong className="text-emerald-700 font-semibold">{selectedFarmer.status_tanaman || 'Vegetatif'}</strong>
              </span>
              <a 
                href="/monitoring"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>Buka Telemetri Lengkap</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Clean Flat Legend (Nyatu dengan Background Halaman) */}
      <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
        <span className="font-medium text-slate-700">titik sebaran sawah petani ({farmers.length} lokasi)</span>
      </div>

    </div>
  );
}
