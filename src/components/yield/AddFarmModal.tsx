"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sprout, MapPin, TreePine, Cpu, Sparkles, Ruler } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farm: {
    name: string;
    locationName: string;
    totalTrees: number;
    perches?: number;
    deviceId?: string;
  }) => Promise<void>;
}

export default function AddFarmModal({ isOpen, onClose, onSave }: AddFarmModalProps) {
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [totalTrees, setTotalTrees] = useState<number>(40);
  const [perches, setPerches] = useState<number>(80);
  const [deviceId, setDeviceId] = useState("DEV_LUN_01");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for the coconut plantation.");
      return;
    }
    if (!locationName.trim()) {
      setError("Please specify the district / location name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        name: name.trim(),
        locationName: locationName.trim(),
        totalTrees: Number(totalTrees) || 40,
        perches: Number(perches) || 80,
        deviceId: deviceId.trim() || undefined,
      });
      // Reset form
      setName("");
      setLocationName("");
      setTotalTrees(40);
      setPerches(80);
      setDeviceId("DEV_LUN_01");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to register farm. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-6 relative overflow-hidden"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
            color: "var(--text-primary)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 229, 255, 0.1))",
                  borderColor: "rgba(0, 255, 157, 0.3)",
                }}
              >
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  Register Plantation Farm
                </h3>
                <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  Connect your estate to the Firebase IoT Telemetry & ML Engine
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-lg border text-muted hover:text-white transition-colors cursor-pointer"
              style={{ borderColor: "var(--card-border)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl border text-xs font-mono text-red-400"
              style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.25)" }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farm Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>Farm / Estate Name</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lunuwila Central Holding"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Location & District */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Location / District</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kurunegala, Lunuwila, Puttalam, Gampaha"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Trees & Extent Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Palms Count</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  required
                  value={totalTrees}
                  onChange={(e) => setTotalTrees(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Extent (Perches)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={perches}
                  onChange={(e) => setPerches(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* ESP32 Device ID */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ESP32 IoT Node ID</span>
                </span>
                <span className="text-[10px] text-cyan-400">Firebase Telemetry Link</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DEV_LUN_01 or D7074"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-mono outline-none"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
              <p className="text-[10px] font-mono text-muted pt-0.5">
                Default ESP32 Node: <b className="text-emerald-400">DEV_LUN_01</b> (transmits live soil moisture & temp to Firebase).
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border text-xs font-mono font-medium hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--text-secondary)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] shadow-md"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 255, 157, 0.3), rgba(0, 229, 255, 0.2))",
                  borderColor: "rgba(0, 255, 157, 0.5)",
                  color: theme === "dark" ? "#00FF9D" : "#00875A",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save to Backend</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
