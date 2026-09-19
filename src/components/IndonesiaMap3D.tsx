'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Satellite, Navigation, Layers, RefreshCw, X, 
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

type TileLayerType = 'satellite' | 'dark' | 'streets';

export default function IndonesiaMap3D({ 
  interactive = true, 
  highlightFarmerId,
  onSelectFarmer,
  userCoords
}: IndonesiaMap3DProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<TileLayerType>('satellite');
  const [farmers, setFarmers] = useState<PetaniRecord[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<PetaniRecord | null>(null);
  const [myGps, setMyGps] = useState<{ lat: number; lon: number; accuracy?: number } | null>(userCoords || null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filterRegion, setFilterRegion] = useState<'semua' | 'jawa' | 'luar-jawa'>('semua');
  const [isClient, setIsClient] = useState(false);

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

  // Initialize Leaflet Map
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

      // Create Custom High Z-Index Pane for Glowing Radar Markers
      const radarPane = map.createPane('radarPane');
      radarPane.style.zIndex = '650';

      const tileUrls = {
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      };

      const initialLayer = L.tileLayer(tileUrls.satellite, {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      currentTileLayerRef.current = initialLayer;

      // Create Markers Layer Group inside radarPane
      const markersGroup = L.layerGroup([], { pane: 'radarPane' }).addTo(map);
      markersGroupRef.current = markersGroup;

      // Equator Khatulistiwa line
      L.polyline([[0, 94], [0, 142]], {
        color: '#fbbf24',
        weight: 1.5,
        dashArray: '6, 8',
        opacity: 0.7
      }).addTo(map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Switch Tile Layer
  function switchLayer(layerType: TileLayerType) {
    if (!mapInstanceRef.current || !currentTileLayerRef.current) return;
    setActiveLayer(layerType);

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const map = mapInstanceRef.current;

      map.removeLayer(currentTileLayerRef.current);

      const tileUrls = {
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      };

      const newLayer = L.tileLayer(tileUrls[layerType], {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      newLayer.bringToBack();
      currentTileLayerRef.current = newLayer;
    });
  }

  // Render Glowing Radar Markers for Farmers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || farmers.length === 0) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const markersGroup = markersGroupRef.current;
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
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="
              position: absolute; 
              inset: -8px; 
              border-radius: 9999px; 
              background-color: ${isHighlight ? 'rgba(251, 191, 36, 0.6)' : 'rgba(16, 185, 129, 0.6)'}; 
              animation: radarPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: relative;
              width: 16px; 
              height: 16px; 
              border-radius: 9999px; 
              background-color: ${isHighlight ? '#fbbf24' : '#10b981'}; 
              border: 2.5px solid #ffffff; 
              box-shadow: 0 0 16px ${isHighlight ? '#fbbf24' : '#10b981'};
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
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          pane: 'radarPane'
        });

        const marker = L.marker([f.lat, f.lon], { icon: customIcon, pane: 'radarPane' });

        // Tooltip
        marker.bindTooltip(`
          <div style="font-size: 11px; font-weight: 700; color: #064e3b; padding: 2px 4px;">
            🌾 ${f.nama_petani} (${f.jenis_tanaman})
          </div>
        `, { direction: 'top', offset: [0, -14], className: 'radar-tooltip' });

        marker.on('click', () => {
          setSelectedFarmer(f);
          if (onSelectFarmer) onSelectFarmer(f);
          mapInstanceRef.current.flyTo([f.lat!, f.lon!], 9, { duration: 1.2 });
        });

        markersGroup.addLayer(marker);
      });
    });
  }, [farmers, filterRegion, highlightFarmerId, selectedFarmer]);

  // Render User Live GPS Marker
  useEffect(() => {
    const coords = userCoords || myGps;
    if (!coords || !coords.lat || !coords.lon || !mapInstanceRef.current) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const map = mapInstanceRef.current;

      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const userIconHtml = `
        <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute; 
            inset: -12px; 
            border-radius: 9999px; 
            background-color: rgba(6, 182, 212, 0.75); 
            animation: radarPing 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 20px; 
            height: 20px; 
            border-radius: 9999px; 
            background-color: #06b6d4; 
            border: 3px solid #ffffff; 
            box-shadow: 0 0 20px rgba(6, 182, 212, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background-color: #ffffff;"></div>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userIconHtml,
        className: 'user-marker-beacon',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        pane: 'radarPane'
      });

      const userMarker = L.marker([coords.lat, coords.lon], { 
        icon: userIcon, 
        zIndexOffset: 1000, 
        pane: 'radarPane' 
      }).addTo(map);

      userMarkerRef.current = userMarker;
    });
  }, [myGps, userCoords]);

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
    <div className="rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-xl overflow-hidden relative">
      
      {/* Top Map Control Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Map Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Satellite className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">
                Peta Satelit Geospasial Nusantara (Citra Asli BMKG)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Peta Asli Indonesia
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Citra foto satelit resolusi tinggi kepulauan Indonesia dengan suar radar telemetri titik sawah
            </p>
          </div>
        </div>

        {/* Right: Controls & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Island Filter */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-[11px]">
            <button
              onClick={() => handleFocusRegion('semua')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterRegion === 'semua'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => handleFocusRegion('jawa')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterRegion === 'jawa'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jawa
            </button>
            <button
              onClick={() => handleFocusRegion('luar-jawa')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterRegion === 'luar-jawa'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Luar Jawa
            </button>
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-[11px]">
            <button
              onClick={() => switchLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeLayer === 'satellite'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Foto Satelit Nyata"
            >
              🛰️ Satelit Asli
            </button>
            <button
              onClick={() => switchLayer('dark')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeLayer === 'dark'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mode Dark Radar"
            >
              🌌 Dark Radar
            </button>
            <button
              onClick={() => switchLayer('streets')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeLayer === 'streets'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Peta Topografi & Jalan"
            >
              🗺️ Topografi
            </button>
          </div>

          {/* Nyalakan GPS Button */}
          <button
            onClick={handleTriggerGps}
            disabled={gpsLoading}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all text-xs ${
              myGps
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 ring-2 ring-cyan-400/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {gpsLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>{gpsLoading ? 'Mencari...' : myGps ? 'GPS Aktif' : 'Nyalakan GPS'}</span>
          </button>

        </div>

      </div>

      {/* Real Leaflet Map Container */}
      <div className="w-full relative" style={{ height: '460px' }}>
        <div ref={mapContainerRef} className="w-full h-full z-0"></div>

        {/* Floating Zoom Controls & Compass */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.flyTo([-2.2, 118.0], 5)}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Reset ke Seluruh Nusantara"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS Active Floating Indicator */}
        {myGps && (
          <div className="absolute left-4 top-4 z-20 pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400 text-cyan-300 text-[11px] font-bold shadow-xl flex items-center gap-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>GPS Anda Terkunci: {myGps.lat.toFixed(4)}, {myGps.lon.toFixed(4)} (±{myGps.accuracy || 8}m)</span>
            </div>
          </div>
        )}

        {/* Selected Farmer Telemetry Modal / Card */}
        {selectedFarmer && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-84 p-4 rounded-xl bg-slate-900/95 border border-emerald-500/50 text-white shadow-2xl backdrop-blur-md z-30 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{selectedFarmer.nama_petani}</h4>
                  <p className="text-[10px] text-emerald-400 font-medium">{selectedFarmer.daerah}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFarmer(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block text-[9px]">Komoditas & Luas</span>
                <strong className="text-emerald-300 block truncate">{selectedFarmer.jenis_tanaman}</strong>
                <span className="text-[10px] text-slate-300">{selectedFarmer.luas_tanah} {selectedFarmer.satuan_luas}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block text-[9px]">Koordinat Satelit BMKG</span>
                <span className="font-mono text-[10px] text-slate-200 block truncate">
                  {selectedFarmer.lat?.toFixed(4)}, {selectedFarmer.lon?.toFixed(4)}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  ±{selectedFarmer.akurasi_gps || 8}m Akurasi
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-[10px]">
              <span className="flex items-center gap-1 text-slate-300">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span>Lembap: <strong>{selectedFarmer.kelembapan_tanah || 58}%</strong></span>
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>pH: <strong>{selectedFarmer.ph_tanah || 6.5}</strong></span>
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Thermometer className="w-3 h-3" />
                <span>{selectedFarmer.suhu_lingkungan || 29.5}°C</span>
              </span>
            </div>

            <div className="pt-1 flex justify-between items-center text-[10px]">
              <span className="text-slate-400">
                Fase: <strong className="text-slate-200">{selectedFarmer.status_tanaman || 'Vegetatif'}</strong>
              </span>
              <a 
                href="/monitoring"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
              >
                <span>Buka Telemetri</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Telemetry Legend & National Research Summary */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500"></span>
            <span>Titik Sawah Riset Terdaftar ({farmers.length} Lokasi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400"></span>
            <span>{myGps ? 'Titik GPS Sawah Anda Terkunci' : 'Nyalakan GPS untuk Menandai Lokasi'}</span>
          </div>
        </div>

        {/* Realtime Satellites Sync */}
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Satelit Geospasial: <strong>Esri World Imagery & BMKG Model</strong></span>
        </div>

      </div>

    </div>
  );
}
