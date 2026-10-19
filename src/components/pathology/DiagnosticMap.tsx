"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DISEASE_COLORS } from "@/lib/demo-data";
import DiseaseBadge from "./DiseaseBadge";
import { Plane, Microscope, AlertTriangle, ShieldAlert, Sparkles, Filter } from "lucide-react";

// Fix default Leaflet icon in Next.js SSR
const defaultIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #A78BFA; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(167,139,250,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

L.Marker.prototype.options.icon = defaultIcon;

// System B Mobile Disease Markers
const createDiseaseIcon = (disease: string) => {
  const color = DISEASE_COLORS[disease?.toLowerCase()]?.color || "#00FF9D";
  return L.divIcon({
    className: "custom-disease-icon",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 14px ${color}, 0 2px 6px rgba(0,0,0,0.8);"></div>
        <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; border: 1px dashed ${color}; opacity: 0.6;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// System A Aerial Hotspot Stressed Tree Markers (Pulsing Beacon)
const createAerialHotspotIcon = (severity: "critical" | "high" | "moderate" = "high") => {
  const color = severity === "critical" ? "#FF4C4C" : severity === "high" ? "#E6AF2E" : "#00E5FF";
  const pulseColor = severity === "critical" ? "rgba(255, 76, 76, 0.4)" : severity === "high" ? "rgba(230, 175, 46, 0.4)" : "rgba(0, 229, 255, 0.4)";
  
  return L.divIcon({
    className: "custom-aerial-hotspot-icon",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${pulseColor};
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          background: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 18px ${color}, 0 2px 8px rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-weight: 900;
          font-size: 9px;
          font-family: monospace;
        ">!</div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

interface DiagnosticMapInnerProps {
  diagnostics?: any[];
  hotspots?: any[];
  defaultCenter?: { lat: number; lng: number };
}

export default function DiagnosticMapInner({
  diagnostics = [],
  hotspots = [],
  defaultCenter = { lat: 7.4863, lng: 80.3623 },
}: DiagnosticMapInnerProps) {
  const [mounted, setMounted] = useState(false);
  const [filterMode, setFilterMode] = useState<"aerial">("aerial");

  useEffect(() => setMounted(true), []);

  // Compute valid System A Aerial Hotspot locations
  const validHotspots = useMemo(() => {
    return hotspots.filter(h => h.location && typeof h.location.lat === "number" && typeof h.location.lng === "number");
  }, [hotspots]);

  // Determine map center based on System A Drone Hotspots
  const center: [number, number] = useMemo(() => {
    if (validHotspots.length > 0) {
      return [validHotspots[0].location.lat, validHotspots[0].location.lng];
    }
    return [defaultCenter.lat, defaultCenter.lng];
  }, [validHotspots, defaultCenter]);

  if (!mounted) return <div className="w-full h-[450px] bg-white/5 rounded-2xl animate-pulse" />;

  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden border border-white/10 relative z-0 flex flex-col font-mono">
      
      {/* Top Map Layer Control Bar - System A Aerial Orthomosaic Focus */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-xl shadow-xl"
        style={{ background: "rgba(11, 17, 30, 0.92)", borderColor: "rgba(255, 255, 255, 0.15)" }}
      >
        <div className="px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5"
          style={{
            background: "rgba(0, 255, 157, 0.15)",
            color: "#00FF9D",
            border: "1px solid rgba(0, 255, 157, 0.35)",
          }}
        >
          <Plane className="w-3.5 h-3.5 text-red-400" />
          <span>System A Aerial Stressed Trees ({validHotspots.length})</span>
        </div>
      </div>

      {/* Main Interactive Leaflet Map */}
      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", background: "#0a0a0a" }}>
        {/* OpenStreetMap with Dark Mode Styling */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        <ChangeView center={center} />

        {/* System A Aerial Stressed Trees (Hotspots) */}
        {validHotspots.map((hs) => {
          const color = hs.severity === "critical" ? "#FF4C4C" : hs.severity === "high" ? "#E6AF2E" : "#00E5FF";
          return (
            <div key={`hotspot-${hs.id}`}>
              <Marker
                position={[hs.location.lat, hs.location.lng]}
                icon={createAerialHotspotIcon(hs.severity)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 space-y-2 font-mono min-w-[220px]">
                    <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1"
                        style={{
                          background: hs.severity === "critical" ? "rgba(255, 76, 76, 0.2)" : hs.severity === "high" ? "rgba(230, 175, 46, 0.2)" : "rgba(0, 229, 255, 0.2)",
                          color,
                          border: `1px solid ${color}60`
                        }}
                      >
                        <Plane className="w-3 h-3" /> {hs.severity} Stressed Tree
                      </span>
                      <span className="text-[9px] text-gray-400">ID: {hs.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-gray-400 block">GPS Coordinates:</span>
                        <strong className="text-white">{hs.location.lat.toFixed(5)}, {hs.location.lng.toFixed(5)}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Spectral Index:</span>
                        <strong style={{ color }}>{typeof hs.mean_index_value === "number" ? hs.mean_index_value.toFixed(3) : "—"}</strong>
                      </div>
                    </div>

                    {hs.z_score && (
                      <div className="text-[10px]">
                        <span className="text-gray-400 block">Z-Score Outlier:</span>
                        <strong style={{ color }}>{hs.z_score}σ Drop</strong>
                      </div>
                    )}

                    {hs.recommended_action && (
                      <div className="p-2 rounded bg-black/40 border border-white/10 text-[10px] text-gray-300 leading-relaxed">
                        <span className="text-yellow-400 font-bold block mb-0.5">Field Protocol:</span>
                        {hs.recommended_action}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Stress Radiance Circle on Map */}
              <Circle
                center={[hs.location.lat, hs.location.lng]}
                radius={hs.radius_meters || 12}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: hs.severity === "critical" ? 0.25 : 0.15,
                  weight: 1.5,
                  dashArray: "3, 6",
                }}
              />
            </div>
          );
        })}
      </MapContainer>
      
      {/* Bottom Map Legend - Dedicated System A Aerial UAV Key */}
      <div className="p-2.5 border-t flex flex-wrap items-center justify-between text-[10px]"
        style={{ background: "rgba(11, 17, 30, 0.95)", borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="flex items-center gap-4">
          <span className="text-gray-400 flex items-center gap-1 font-bold">
            <span>🗺️ GIS Map Legend:</span>
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#FF4C4C]" /> Critical Hotspot (Bud Rot / Collapse)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#E6AF2E]" /> High Severity Stress (Defoliation)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]" /> Moderate Stress (Mild Chlorosis)
          </span>
        </div>

        <span className="text-gray-500 font-mono text-[9px]">
          Geo-Spatial Projection: EPSG:4326 (WGS 84)
        </span>
      </div>

      {/* Global CSS Overrides */}
      <style jsx global>{`
        .leaflet-container { font-family: var(--font-outfit), sans-serif; background: #0b111e !important; }
        .map-tiles-dark { filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.2) brightness(0.7); }
        .leaflet-popup-content-wrapper { background: rgba(11, 17, 30, 0.96); border: 1px solid rgba(255, 255, 255, 0.18); backdrop-filter: blur(16px); color: white; border-radius: 14px; box-shadow: 0 15px 35px rgba(0,0,0,0.8); }
        .leaflet-popup-tip { background: rgba(11, 17, 30, 0.96); border-top: 1px solid rgba(255, 255, 255, 0.18); border-left: 1px solid rgba(255, 255, 255, 0.18); }
        .leaflet-bar a { background-color: rgba(15, 23, 42, 0.85) !important; color: white !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; }
        .leaflet-bar a:hover { background-color: rgba(30, 41, 59, 0.95) !important; }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
