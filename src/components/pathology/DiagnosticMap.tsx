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

export default function DiagnosticMapInner({ diagnostics }: { diagnostics: any[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-[400px] bg-white/5 rounded-xl animate-pulse" />;

  const center: [number, number] = diagnostics.length > 0 
    ? [diagnostics[0].location.lat, diagnostics[0].location.lng] 
    : [7.2906, 80.6337];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/5 relative z-0">
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", background: "#0a0a0a" }}>
        {/* Dark mode CartoDB tile layer for sleek UI */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
        .leaflet-container { font-family: var(--font-outfit), sans-serif; }
        .leaflet-popup-content-wrapper { background: rgba(20,20,20,0.9); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: white; border-radius: 8px; }
        .leaflet-popup-tip { background: rgba(20,20,20,0.9); border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.1); }
        .leaflet-bar a { background-color: rgba(20,20,20,0.8) !important; color: white !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
        .leaflet-bar a:hover { background-color: rgba(40,40,40,0.9) !important; }
      `}</style>
    </div>
  );
}
