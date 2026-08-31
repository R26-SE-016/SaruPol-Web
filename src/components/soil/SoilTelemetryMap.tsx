"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SoilTestRecord } from "@/lib/soil-storage";

// Fix for default Leaflet marker in Next.js
const defaultSoilIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #00FF9D; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,255,157,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

L.Marker.prototype.options.icon = defaultSoilIcon;

const getHealthStatusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("optimal") || s.includes("balanced")) return "#00FF9D";
  if (s.includes("moderate") || s.includes("mild") || s.includes("sub-optimal")) return "#E6AF2E";
  if (s.includes("critical") || s.includes("acute") || s.includes("severe") || s.includes("deficit")) return "#FF4C4C";
  return "#00E5FF";
};

const createSoilHealthIcon = (status: string) => {
  const color = getHealthStatusColor(status);
  return L.divIcon({
    className: 'custom-soil-marker-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 0 14px ${color};"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function SoilTelemetryMap({ 
  soilTests,
  defaultCenter = { lat: 7.3275, lng: 79.9880 }
}: { 
  soilTests: SoilTestRecord[];
  defaultCenter?: { lat: number; lng: number };
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-[420px] bg-white/5 rounded-2xl animate-pulse" />;

  const center: [number, number] = soilTests.length > 0 
    ? [soilTests[0].location.lat, soilTests[0].location.lng] 
    : [defaultCenter.lat, defaultCenter.lng];

  return (
    <div className="w-full h-[420px] rounded-2xl overflow-hidden border relative z-0" style={{ borderColor: "var(--card-border)" }}>
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", background: "#0a0a0a" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        <ChangeView center={center} />
        
        {soilTests.map((t) => {
          const color = getHealthStatusColor(t.health_status);
          return (
            <Marker 
              key={t.id} 
              position={[t.location.lat, t.location.lng]}
              icon={createSoilHealthIcon(t.health_status)}
            >
              <Popup className="custom-popup">
                <div className="p-2 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between gap-3 border-b pb-1.5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <span className="font-bold text-white">Tree #{t.tree_no}</span>
                    <span className="text-[10px] text-gray-400">{t.zone_id}</span>
                  </div>

                  <div className="text-[11px] font-bold" style={{ color }}>
                    {t.health_status}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded bg-black/40 text-[10px]">
                    <div>
                      <span className="text-gray-400 block text-[9px]">Leaf N</span>
                      <span className="font-bold text-cyan-300">{t.predicted_14th_leaf_npk.N.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">Leaf P</span>
                      <span className="font-bold text-green-300">{t.predicted_14th_leaf_npk.P.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">Leaf K</span>
                      <span className="font-bold text-amber-300">{t.predicted_14th_leaf_npk.K.toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="text-[10px] space-y-0.5 text-gray-300">
                    <div>Urea: <span className="text-white font-bold">{t.fertilizer_recommendation.Urea}g</span></div>
                    <div>ERP: <span className="text-white font-bold">{t.fertilizer_recommendation.Eppawala_Rock_Phosphate_ERP}g</span></div>
                    <div>MOP: <span className="text-white font-bold">{t.fertilizer_recommendation.Muriate_of_Potash_MOP}g</span></div>
                    <div>Dolomite: <span className="text-white font-bold">{t.fertilizer_recommendation.Dolomite}g</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-container { font-family: var(--font-outfit), sans-serif; background: #0b111e !important; }
        .map-tiles-dark { filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.2) brightness(0.7); }
        .leaflet-popup-content-wrapper { background: rgba(15,23,42,0.95); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(12px); color: white; border-radius: 12px; }
        .leaflet-popup-tip { background: rgba(15,23,42,0.95); border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
