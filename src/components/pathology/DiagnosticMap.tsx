"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DISEASE_COLORS } from "@/lib/demo-data";
import DiseaseBadge from "./DiseaseBadge";

// Fix for default Leaflet icon missing in Next.js
const defaultIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #A78BFA; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(167,139,250,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

L.Marker.prototype.options.icon = defaultIcon;

const createDiseaseIcon = (disease: string) => {
  const color = DISEASE_COLORS[disease]?.color || "#A78BFA";
  return L.divIcon({
    className: 'custom-disease-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 0 15px ${color};"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function DiagnosticMapInner({ 
  diagnostics,
  defaultCenter = { lat: 7.3275, lng: 79.9880 }
}: { 
  diagnostics: any[];
  defaultCenter?: { lat: number; lng: number };
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-[400px] bg-white/5 rounded-xl animate-pulse" />;

  const center: [number, number] = diagnostics.length > 0 
    ? [diagnostics[0].location.lat, diagnostics[0].location.lng] 
    : [defaultCenter.lat, defaultCenter.lng];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/5 relative z-0">
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", background: "#0a0a0a" }}>
        {/* OpenStreetMap with sleek dark mode filter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        <ChangeView center={center} />
        
        {diagnostics.map((d) => (
          <Marker 
            key={d.id} 
            position={[d.location.lat, d.location.lng]}
            icon={createDiseaseIcon(d.disease_class)}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="text-[10px] text-gray-400 mb-1 font-mono">ID: {d.id}</div>
                <DiseaseBadge disease={d.disease_class} size="sm" />
                <div className="mt-2 text-xs font-mono">Conf: {(d.confidence * 100).toFixed(1)}%</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map styling override to fit glassmorphism */}
      <style jsx global>{`
        .leaflet-container { font-family: var(--font-outfit), sans-serif; background: #0b111e !important; }
        .map-tiles-dark { filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.2) brightness(0.7); }
        .leaflet-popup-content-wrapper { background: rgba(15,23,42,0.95); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(12px); color: white; border-radius: 12px; }
        .leaflet-popup-tip { background: rgba(15,23,42,0.95); border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.1); }
        .leaflet-bar a { background-color: rgba(15,23,42,0.8) !important; color: white !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
        .leaflet-bar a:hover { background-color: rgba(30,41,59,0.9) !important; }
      `}</style>
    </div>
  );
}
