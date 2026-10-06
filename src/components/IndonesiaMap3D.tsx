'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  X, MapPin, Droplets, Thermometer, ShieldCheck, Sprout,
  Compass, ZoomIn, ZoomOut, Users, Lock, Unlock
} from 'lucide-react';
import { PetaniRecord } from '@/lib/types';

interface IndonesiaMap3DProps {
  interactive?: boolean;
  highlightFarmerId?: string;
  onSelectFarmer?: (farmer: PetaniRecord) => void;
  userCoords?: { lat: number; lon: number; label?: string } | null;
}

// Telemetry Network Connections across Archipelago (Internet Mesh Grid - Level 1 National Backbone)
function escapeHtml(text?: string | number | null): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const NETWORK_CONNECTIONS: [string, string][] = [
  // Sumatera Backbone
  ['ptn-sumut-01', 'ptn-sumbar-01'],
  ['ptn-sumbar-01', 'ptn-lampung-01'],

  // Trans-Sumatera to Jawa (Active in 'Semua')
  ['ptn-lampung-01', 'ptn-muaoascy'], // Lampung <-> Jakarta

  // Direct Trans-Sumatera to Kalimantan (Active in 'Semua' and 'Luar Jawa')
  ['ptn-lampung-01', 'ptn-kalbar-01'], // Lampung <-> Pontianak Kalbar

  // Jawa Backbone
  ['ptn-muaoascy', 'ptn-jabar-01'],   // Jakarta <-> Cianjur
  ['ptn-jabar-01', 'ptn-jateng-01'],  // Cianjur <-> Brebes
  ['ptn-jateng-01', 'ptn-jatim-01'],  // Brebes <-> Malang

  // Jawa to Bali & NTB (Active in 'Semua')
  ['ptn-jatim-01', 'ptn-bali-01'],    // Malang <-> Tabanan Bali

  // Bali <-> NTB (Active in 'Semua' and 'Luar Jawa')
  ['ptn-bali-01', 'ptn-ntb-01'],      // Tabanan Bali <-> Lombok NTB

  // Trans-Java Sea to Kalimantan (Active in 'Semua')
  ['ptn-muaoascy', 'ptn-kalbar-01'],  // Jakarta <-> Pontianak
  ['ptn-jateng-01', 'ptn-kalsel-01'], // Brebes <-> Barito

  // Kalimantan Backbone
  ['ptn-kalbar-01', 'ptn-kalsel-01'], // Pontianak <-> Barito Kuala
  ['ptn-kalsel-01', 'ptn-kaltim-01'], // Barito <-> Kutai IKN

  // Kalimantan <-> Sulawesi (Active in 'Semua' and 'Luar Jawa')
  ['ptn-kalsel-01', 'ptn-sulsel-01'], // Barito <-> Sidrap Sulsel
  ['ptn-kaltim-01', 'ptn-sulut-01'],  // Kutai <-> Minahasa Sulut

  // Jawa to Sulawesi (Active in 'Semua')
  ['ptn-jatim-01', 'ptn-sulsel-01'],  // Malang <-> Sidrap

  // NTB to Sulawesi (Active in 'Semua' and 'Luar Jawa')
  ['ptn-ntb-01', 'ptn-sulsel-01'],    // Lombok <-> Sidrap across Flores Sea

  // Sulawesi Backbone
  ['ptn-sulsel-01', 'ptn-sulut-01'],  // Sidrap <-> Minahasa

  // Eastern Indonesia Links (Maluku & Papua - Active in 'Semua' and 'Luar Jawa')
  ['ptn-sulsel-01', 'ptn-maluku-01'], // Sidrap <-> Buru Maluku
  ['ptn-sulut-01', 'ptn-maluku-01'],  // Minahasa <-> Buru Maluku
  ['ptn-maluku-01', 'ptn-papua-01'],  // Buru Maluku <-> Merauke Papua
  ['ptn-ntb-01', 'ptn-papua-01'],     // Lombok <-> Merauke Papua
];

// Helper to generate gentle curved arch points between two coordinates
function getCurvedPath(p1: [number, number], p2: [number, number], segments = 16): [number, number][] {
  const [lat1, lon1] = p1;
  const [lat2, lon2] = p2;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const dist = Math.hypot(dLat, dLon);

  // Arch curvature factor
  const arcFactor = Math.min(dist * 0.08, 2.2);

  const pts: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = lat1 + dLat * t + Math.sin(t * Math.PI) * arcFactor;
    const lon = lon1 + dLon * t;
    pts.push([lat, lon]);
  }
  return pts;
}

// Haversine accurate geographical distance in kilometers
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Hierarchical Hub-Spoke Mesh Generator (Long-Term Scalable O(N))
function computeDynamicMeshLines(
  farmers: PetaniRecord[],
  filterRegion: 'semua' | 'jawa' | 'luar-jawa',
  isRegionJawa: (daerah: string) => boolean
): { points: [number, number][]; isBackbone: boolean }[] {
  if (farmers.length === 0) return [];

  const farmerMap = new Map<string, PetaniRecord>();
  farmers.forEach(f => farmerMap.set(f.id, f));

  const lines: { points: [number, number][]; isBackbone: boolean }[] = [];
  const connectedPairs = new Set<string>();

  const getPairKey = (id1: string, id2: string) => {
    return id1 < id2 ? `${id1}:${id2}` : `${id2}:${id1}`;
  };

  const isVisibleInRegion = (f: PetaniRecord) => {
    if (filterRegion === 'semua') return true;
    const isJawa = isRegionJawa(f.daerah);
    return filterRegion === 'jawa' ? isJawa : !isJawa;
  };

  // 1. Level 1: Core Backbone Lines (Trans-Nusantara)
  NETWORK_CONNECTIONS.forEach(([idA, idB]) => {
    const farmerA = farmerMap.get(idA);
    const farmerB = farmerMap.get(idB);

    if (!farmerA?.lat || !farmerA?.lon || !farmerB?.lat || !farmerB?.lon) return;
    if (!isVisibleInRegion(farmerA) || !isVisibleInRegion(farmerB)) return;

    const pairKey = getPairKey(idA, idB);
    connectedPairs.add(pairKey);

    const curvedPoints = getCurvedPath([farmerA.lat, farmerA.lon], [farmerB.lat, farmerB.lon]);
    lines.push({ points: curvedPoints, isBackbone: true });
  });

  // Track nodes that already have at least 1 connection
  const nodesWithConnections = new Set<string>();
  connectedPairs.forEach(pair => {
    const [a, b] = pair.split(':');
    nodesWithConnections.add(a);
    nodesWithConnections.add(b);
  });

  // 2. Level 2: Dynamic Auto-Connect for New / Local Farmers
  // Ensures any newly registered farmer connects to the nearest existing node in the mesh
  farmers.forEach(f => {
    if (!f.lat || !f.lon || !isVisibleInRegion(f)) return;

    // If farmer is already fully connected via backbone, skip
    if (nodesWithConnections.has(f.id)) return;

    let nearestNode: PetaniRecord | null = null;
    let minDistance = Infinity;

    farmers.forEach(other => {
      if (other.id === f.id || !other.lat || !other.lon || !isVisibleInRegion(other)) return;

      const dist = getHaversineDistanceKm(f.lat!, f.lon!, other.lat!, other.lon!);
      // Threshold: Ignore < 0.2 km (adjacent parcels), find nearest node
      if (dist >= 0.2 && dist < minDistance) {
        minDistance = dist;
        nearestNode = other;
      }
    });

    if (nearestNode) {
      const otherNode: PetaniRecord = nearestNode;
      const pairKey = getPairKey(f.id, otherNode.id);
      if (!connectedPairs.has(pairKey)) {
        connectedPairs.add(pairKey);
        nodesWithConnections.add(f.id);
        nodesWithConnections.add(otherNode.id);

        const curvedPoints = getCurvedPath([f.lat!, f.lon!], [otherNode.lat!, otherNode.lon!], 14);
        lines.push({ points: curvedPoints, isBackbone: false });
      }
    }
  });

  return lines;
}

// Spatial Dispersal for farmers in close proximity (anti-overlap optimizer)
function computeDispersedFarmers(list: PetaniRecord[]): { farmer: PetaniRecord; renderLat: number; renderLon: number }[] {
  const result: { farmer: PetaniRecord; renderLat: number; renderLon: number }[] = [];
  const groups: PetaniRecord[][] = [];

  list.forEach(f => {
    if (!f.lat || !f.lon) return;
    let placed = false;
    for (const group of groups) {
      const g0 = group[0];
      const dLat = Math.abs(g0.lat! - f.lat);
      const dLon = Math.abs(g0.lon! - f.lon);
      // Within ~150 meters threshold
      if (dLat < 0.0014 && dLon < 0.0014) {
        group.push(f);
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push([f]);
    }
  });

  groups.forEach(group => {
    if (group.length === 1) {
      result.push({ farmer: group[0], renderLat: group[0].lat!, renderLon: group[0].lon! });
    } else {
      // Disperse multiple nearby farmers in an optimal micro-orbital radius (~120-140m visual offset)
      const radius = 0.0012;
      group.forEach((farmer, idx) => {
        const angle = (2 * Math.PI * idx) / group.length + (Math.PI / 4);
        const renderLat = farmer.lat! + Math.sin(angle) * radius;
        const renderLon = farmer.lon! + Math.cos(angle) * radius;
        result.push({ farmer, renderLat, renderLon });
      });
    }
  });

  return result;
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
  const networkLinesGroupRef = useRef<any>(null);

  const [farmers, setFarmers] = useState<PetaniRecord[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<PetaniRecord | null>(null);
  const [filterRegion, setFilterRegion] = useState<'semua' | 'jawa' | 'luar-jawa'>('semua');
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isTouchPanEnabled, setIsTouchPanEnabled] = useState(false);

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

  // Initialize Leaflet Map with Islands-Only Vector Layers (Pure White Canvas, No Ocean Water)
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Center of Indonesia Archipelago with Auto Fit Bounds (Sabang to Merauke 100% visible on Mobile & Desktop)
      const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

      // Geographic Bounding Box encompassing entire Indonesian Archipelago
      const indonesiaBounds = L.latLngBounds([
        [-11.2, 94.8], // Southernmost / Westernmost (Rote/Timor & Sabang)
        [6.2, 141.2]   // Northernmost / Easternmost (Miangas/Aceh & Merauke)
      ]);

      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: isMobileDevice ? 3.4 : 4.8,
        minZoom: 2.8,
        maxZoom: 11,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: !isMobileDevice, // Mobile: single finger scrolls page smoothly by default!
        touchZoom: true
      });

      mapInstanceRef.current = map;

      // Fit entire archipelago bounds cleanly without cutting off Sabang or Merauke
      map.fitBounds(indonesiaBounds, {
        padding: isMobileDevice ? [8, 8] : [24, 24],
        animate: false
      });

      // Keep pan bounds comfortably padded
      map.setMaxBounds(indonesiaBounds.pad(0.25));

      // Load and render Islands of Indonesia in Rich Dark Green (Hitam-Hijau) over transparent canvas
      try {
        const geoRes = await fetch('/indonesia-islands.json');
        if (geoRes.ok && isMounted) {
          const geoData = await geoRes.json();
          const geoLayer = L.geoJSON(geoData, {
            style: () => ({
              fillColor: '#064e3b', // Deep rich forest green ("hitam-hijau" kontras & tegas)
              fillOpacity: 0.92,
              color: '#047857',     // Crisp defined border outline
              weight: 1,
              opacity: 0.85
            }),
            onEachFeature: (feature: any, layer: any) => {
              const provName = feature.properties?.Propinsi || 'Indonesia';
              layer.bindTooltip(
                `<div style="font-weight: 700; font-size: 11px; color: #064e3b; text-transform: capitalize;">${provName.toLowerCase()}</div>`,
                {
                  sticky: true,
                  direction: 'top',
                  className: 'island-province-tooltip'
                }
              );

              layer.on({
                click: (e: any) => {
                  if (e?.originalEvent?.target?.blur) {
                    e.originalEvent.target.blur();
                  }
                },
                mouseover: (e: any) => {
                  const l = e.target;
                  l.setStyle({
                    fillColor: '#047857', // Brighter emerald highlight on hover
                    color: '#34d399',
                    weight: 1.5,
                    fillOpacity: 1
                  });
                },
                mouseout: (e: any) => {
                  geoLayer.resetStyle(e.target);
                }
              });
            }
          }).addTo(map);

          // Keep GeoJSON at bottom layer under telemetry lines and markers
          geoLayer.bringToBack();
        }
      } catch (err) {
        console.warn('Failed to load indonesia-islands.json', err);
      }

      // Network Lines Layer Group (Rendered under markers)
      const networkLinesGroup = L.layerGroup([]).addTo(map);
      networkLinesGroupRef.current = networkLinesGroup;

      // Markers Layer Group (Rendered above lines)
      const markersGroup = L.layerGroup([]).addTo(map);
      markersGroupRef.current = markersGroup;

      // Dismiss selected farmer when clicking empty map background
      map.on('click', () => {
        setSelectedFarmer(null);
        map.closePopup();
      });

      // Clean Equator Khatulistiwa line (0° Latitude)
      L.polyline([[0, 94], [0, 142]], {
        color: '#38bdf8',
        weight: 1.2,
        dashArray: '5, 7',
        opacity: 0.6
      }).addTo(map);

      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(indonesiaBounds, {
            padding: isMobileDevice ? [8, 8] : [24, 24],
            animate: false
          });
        }
      }, 150);

      // Handle window resize dynamically so mobile viewport always fits all islands
      const handleResize = () => {
        if (!mapInstanceRef.current) return;
        const isMob = window.innerWidth < 768;
        mapInstanceRef.current.fitBounds(indonesiaBounds, {
          padding: isMob ? [8, 8] : [24, 24],
          animate: false
        });
      };
      window.addEventListener('resize', handleResize);

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

  // Toggle Mobile Touch Dragging to prevent scroll hijacking
  const toggleMobileDrag = () => {
    if (!mapInstanceRef.current) return;
    const nextState = !isTouchPanEnabled;
    setIsTouchPanEnabled(nextState);
    if (nextState) {
      mapInstanceRef.current.dragging.enable();
    } else {
      mapInstanceRef.current.dragging.disable();
    }
  };

  // Helper check Jawa
  const isRegionJawa = (daerah: string) => {
    const d = daerah.toLowerCase();
    return d.includes('jawa') || d.includes('brebes') || d.includes('malang') || d.includes('cianjur') || d.includes('jakarta') || d.includes('guntur');
  };

  // Render Dynamic Inter-Island & Regional Network Telemetry Lines in White
  useEffect(() => {
    if (!mapReady || !networkLinesGroupRef.current) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const linesGroup = networkLinesGroupRef.current;
      if (!linesGroup) return;
      linesGroup.clearLayers();

      if (farmers.length === 0) return;

      const dynamicLines = computeDynamicMeshLines(farmers, filterRegion, isRegionJawa);

      dynamicLines.forEach(({ points, isBackbone }) => {
        // Clean Crisp Mint Telemetry Line across Dark Green Islands (High Visibility, 60fps GPU)
        L.polyline(points, {
          className: 'telemetry-network-line',
          color: isBackbone ? '#34d399' : '#6ee7b7',
          weight: isBackbone ? 1.5 : 1.1,
          opacity: isBackbone ? 0.85 : 0.65,
          dashArray: isBackbone ? '5, 5' : '3, 5',
          smoothFactor: 1.5
        }).addTo(linesGroup);
      });
    });
  }, [farmers, filterRegion, mapReady]);

  // Render Animated Red Location Pins for Farmers with Anti-Overlap Dispersal
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersGroupRef.current || farmers.length === 0) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const markersGroup = markersGroupRef.current;
      if (!markersGroup) return;
      markersGroup.clearLayers();

      const filtered = farmers.filter(f => {
        if (filterRegion === 'semua') return true;
        const isJawa = isRegionJawa(f.daerah);
        if (filterRegion === 'jawa') return isJawa;
        return !isJawa;
      });

      // Compute optimized coordinates to prevent overlap if farmers are in close proximity
      const dispersedList = computeDispersedFarmers(filtered);
      const isMob = typeof window !== 'undefined' && window.innerWidth < 768;

      // Responsive Pin Dimensions: Compact on Mobile so islands remain clearly visible!
      const containerW = isMob ? 18 : 26;
      const containerH = isMob ? 24 : 36;
      const shadowW = isMob ? 8 : 12;
      const shadowH = isMob ? 2.5 : 4;
      const shadowMarginL = isMob ? -4 : -6;
      const pinW = isMob ? 14 : 22;
      const pinH = isMob ? 18 : 28;
      const pinMarginL = isMob ? -7 : -11;
      const anchorX = isMob ? 9 : 13;
      const anchorY = isMob ? 22 : 33;

      dispersedList.forEach((item, idx) => {
        const f = item.farmer;
        const isHighlight = highlightFarmerId === f.id || selectedFarmer?.id === f.id;
        const delay = ((idx * 0.22) % 1.5).toFixed(2);

        // Animated Google-Style Red Pin (Scaled Down for Mobile)
        const iconHtml = `
          <div style="position: relative; width: ${containerW}px; height: ${containerH}px; display: flex; align-items: flex-end; justify-content: center; cursor: pointer;">
            <!-- Ground Shadow (Clean & Fast) -->
            <div style="
              position: absolute;
              bottom: 2px;
              left: 50%;
              width: ${shadowW}px;
              height: ${shadowH}px;
              margin-left: ${shadowMarginL}px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.4);
              animation: pinShadowPulse 2s ease-in-out infinite;
              animation-delay: ${delay}s;
              pointer-events: none;
            "></div>
            
            <!-- Compact Animated Bouncing Pin (Hardware-Accelerated) -->
            <div style="
              position: absolute;
              bottom: 3px;
              left: 50%;
              width: ${pinW}px;
              height: ${pinH}px;
              margin-left: ${pinMarginL}px;
              animation: pinBob 2s ease-in-out infinite;
              animation-delay: ${delay}s;
              transform-origin: bottom center;
              will-change: transform;
            ">
              <svg width="${pinW}" height="${pinH}" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="
                transform: ${isHighlight ? 'scale(1.25)' : 'scale(1)'};
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
              ">
                <!-- Red Pin Body (Google Red #EA4335) -->
                <path d="M12 0C5.37258 0 0 5.37258 0 12C0 19.8 10.6 30.6 11.28 31.42C11.66 31.83 12.34 31.83 12.72 31.42C13.4 30.6 24 19.8 24 12C24 5.37258 18.6274 0 12 0Z" fill="${isHighlight ? '#C5221F' : '#EA4335'}"/>
                <!-- Crisp White Center Hole -->
                <circle cx="12" cy="11.5" r="4.5" fill="#FFFFFF"/>
              </svg>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'farmer-marker-beacon',
          iconSize: [containerW, containerH],
          iconAnchor: [anchorX, anchorY],
          popupAnchor: [0, -anchorY]
        });

        const marker = L.marker([item.renderLat, item.renderLon], { icon: customIcon });


        // Farmer Farmland Telemetry Detail Popup (Natural, Clean, Anchored right on Pin)
        const popupHtml = `
          <div style="font-family: inherit; color: #1e293b; text-align: left; padding: 2px;">
            <!-- Header: Nama Petani & Lokasi -->
            <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 10px; padding-right: 22px;">
              <h4 style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 0; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${escapeHtml(f.nama_petani)}
              </h4>
              <p style="font-size: 11px; color: #64748b; font-weight: 500; margin: 3px 0 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${escapeHtml(f.daerah)}
              </p>
            </div>

            <!-- Komoditas, Luas, Fase & Est Panen -->
            <div style="padding: 10px; border-radius: 8px; background: #f8fafc; border: 1px solid #f1f5f9; font-size: 11px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${escapeHtml(f.jenis_tanaman)}
                </span>
                <span style="font-size: 10.5px; color: #64748b; font-weight: 500; flex-shrink: 0;">
                  Panen: <strong style="color: #334155; font-weight: 600;">${escapeHtml(f.estimasi_panen || '-')}</strong>
                </span>
              </div>
              <div style="font-size: 10.5px; color: #64748b; display: flex; flex-direction: column; gap: 3px;">
                <div>
                  Luas: <strong style="color: #334155; font-weight: 600;">${escapeHtml(String(f.luas_tanah))} ${escapeHtml(f.satuan_luas || 'm²')}</strong>
                </div>
                <div>
                  Fase: <strong style="color: #334155; font-weight: 600;">${escapeHtml(f.status_tanaman || 'Vegetatif')}</strong>
                </div>
              </div>
            </div>

            <!-- 3 Telemetri Metrics in Clean Unified 3-Column Strip -->
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; text-align: center; margin-bottom: 8px;">
              <div style="padding: 8px 4px; border-radius: 8px; background: #f8fafc; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; color: #64748b; font-weight: 500; display: block;">Kelembapan</span>
                <strong style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px; display: block; line-height: 1.2;">
                  ${escapeHtml(String(f.kelembapan_tanah || 58))}%
                </strong>
              </div>
              <div style="padding: 8px 4px; border-radius: 8px; background: #f8fafc; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; color: #64748b; font-weight: 500; display: block;">pH</span>
                <strong style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px; display: block; line-height: 1.2;">
                  ${escapeHtml(String(f.ph_tanah || 6.5))}
                </strong>
              </div>
              <div style="padding: 8px 4px; border-radius: 8px; background: #f8fafc; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; color: #64748b; font-weight: 500; display: block;">Suhu</span>
                <strong style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px; display: block; line-height: 1.2;">
                  ${escapeHtml(String(f.suhu_lingkungan || 29.5))}&deg;C
                </strong>
              </div>
            </div>

            <!-- Footer: GPS -->
            <div style="font-family: monospace; font-size: 9.5px; color: #94a3b8; padding-top: 2px;">
              Koordinat GPS: ${f.lat ? f.lat.toFixed(4) : '-'}, ${f.lon ? f.lon.toFixed(4) : '-'}
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, {
          className: 'farmer-detail-popup',
          offset: [205, 160],
          autoPan: true,
          autoPanPadding: [20, 20],
          closeButton: true,
          maxWidth: 320,
          minWidth: 280
        });

        marker.on('click', (e: any) => {
          if (e) {
            L.DomEvent.stopPropagation(e);
            if (e.originalEvent) {
              L.DomEvent.stopPropagation(e.originalEvent);
            }
          }
          setSelectedFarmer(f);
          if (onSelectFarmer) onSelectFarmer(f);

          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          if (isMobile) {
            // Mobile: Close popup, fly camera slightly south so pin is nicely visible in top-half of map above bottom card
            mapInstanceRef.current?.closePopup();
            mapInstanceRef.current?.flyTo([item.renderLat - 0.2, item.renderLon], 5.8, { duration: 1.2 });
          } else {
            // Desktop: Open side popup and fly camera centered with right offset
            marker.openPopup();
            mapInstanceRef.current?.flyTo([item.renderLat, item.renderLon + 0.35], 6.8, { duration: 1.2 });
          }
        });

        markersGroup.addLayer(marker);
      });
    });
  }, [farmers, filterRegion, highlightFarmerId, mapReady]);


  return (
    <div className="w-full space-y-2 text-slate-800">
      
      {/* Seamless Vector Map Area (Transparent Canvas, Blends Directly with Bone-White Background) */}
      <div className="w-full relative rounded-2xl overflow-hidden h-[330px] sm:h-[440px] md:h-[540px] bg-transparent" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-transparent" style={{ background: 'transparent' }}></div>

        {/* Clean Seamless Zoom & Reset Controls (Zero White Box, Blends with Canvas) */}
        {/* Clean Seamless Zoom, Reset & Mobile Lock Controls (Aligned Top-Right, Zero White Box) */}
        <div className="absolute right-2.5 top-2.5 z-20 flex flex-col gap-1">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-xl bg-transparent hover:bg-slate-200/60 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-xl bg-transparent hover:bg-slate-200/60 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => {
              setSelectedFarmer(null);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.closePopup();
                const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
                const indonesiaBounds = [
                  [-11.2, 94.8],
                  [6.2, 141.2]
                ];
                mapInstanceRef.current.fitBounds(indonesiaBounds, {
                  padding: isMob ? [8, 8] : [24, 24],
                  duration: 1.2
                });
              }
            }}
            className="w-8 h-8 rounded-xl bg-transparent hover:bg-slate-200/60 text-emerald-700 hover:text-emerald-800 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Reset Tampilan Peta Nusantara"
          >
            <Compass className="w-4.5 h-4.5" />
          </button>

          {/* Gembok Kunci/Buka Geser Peta (Ikon Saja di Mobile, Sejajar dengan Zoom) */}
          <button
            onClick={toggleMobileDrag}
            className="w-8 h-8 rounded-xl bg-transparent hover:bg-slate-200/60 flex items-center justify-center transition-all cursor-pointer active:scale-95 md:hidden"
            title={isTouchPanEnabled ? "Kunci Geser Peta (Scroll Halaman Aktif)" : "Buka Geser Peta (Navigasi Peta Aktif)"}
            aria-label={isTouchPanEnabled ? "Kunci Geser Peta" : "Buka Geser Peta"}
          >
            {isTouchPanEnabled ? (
              <Unlock className="w-4.5 h-4.5 text-emerald-600" />
            ) : (
              <Lock className="w-4.5 h-4.5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Floating Bottom Sheet - Google Maps Style (Only on Mobile < 768px) */}
        {selectedFarmer && (
          <div className="md:hidden absolute bottom-2.5 left-2.5 right-2.5 p-3 rounded-xl bg-white border border-slate-200/90 text-slate-800 shadow-xl z-30 space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Header: Nama Petani & Lokasi & Tombol Tutup */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
              <div className="min-w-0 pr-1">
                <h4 className="font-bold text-[13px] text-slate-900 leading-tight truncate">
                  {selectedFarmer.nama_petani}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {selectedFarmer.daerah}
                </p>
              </div>
              <button 
                onClick={() => {
                  setSelectedFarmer(null);
                  mapInstanceRef.current?.closePopup();
                }}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer shrink-0"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Komoditas, Luas, Fase & Est Panen */}
            <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100 text-[11px] space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-bold text-slate-900 truncate">
                  {selectedFarmer.jenis_tanaman}
                </span>
                <span className="text-[10.5px] text-slate-500 font-medium shrink-0">
                  Panen: <strong className="text-slate-700 font-semibold">{selectedFarmer.estimasi_panen || '-'}</strong>
                </span>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center justify-between gap-2">
                <span>Luas: <strong className="text-slate-700 font-semibold">{selectedFarmer.luas_tanah} {selectedFarmer.satuan_luas || 'm²'}</strong></span>
                <span>Fase: <strong className="text-slate-700 font-semibold">{selectedFarmer.status_tanaman || 'Vegetatif'}</strong></span>
              </div>
            </div>

            {/* 3 Telemetri Metrics in Clean 3-Column Strip */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <span className="text-[9.5px] text-slate-500 font-medium block">Kelembapan</span>
                <strong className="text-xs font-bold text-slate-900 mt-0.5 block leading-tight">{selectedFarmer.kelembapan_tanah || 58}%</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <span className="text-[9.5px] text-slate-500 font-medium block">pH</span>
                <strong className="text-xs font-bold text-slate-900 mt-0.5 block leading-tight">{selectedFarmer.ph_tanah || 6.5}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <span className="text-[9.5px] text-slate-500 font-medium block">Suhu</span>
                <strong className="text-xs font-bold text-slate-900 mt-0.5 block leading-tight">{selectedFarmer.suhu_lingkungan || 29.5}&deg;C</strong>
              </div>
            </div>

            {/* Footer: GPS */}
            <div className="flex items-center text-[9.5px] text-slate-400 font-mono pt-0.5">
              <span>Koordinat GPS: {selectedFarmer.lat?.toFixed(4)}, {selectedFarmer.lon?.toFixed(4)}</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
