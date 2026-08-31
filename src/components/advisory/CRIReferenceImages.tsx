"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, ZoomIn, X, ExternalLink, Camera } from "lucide-react";
import { AdvisoryImageRef } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface CRIReferenceImagesProps {
  images?: AdvisoryImageRef[];
}

export default function CRIReferenceImages({ images }: CRIReferenceImagesProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<AdvisoryImageRef | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  // Normalize image URL to local public/cri-reference directory or fallback
  const getNormalizedUrl = (url: string) => {
    if (!url) return "/brand/logo-icon.png";
    if (url.startsWith("/static/images/")) {
      const filename = url.replace("/static/images/", "");
      return `/cri-reference/${filename}`;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `/cri-reference/${url}`;
  };

  return (
    <div className="mt-4 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-mono font-medium" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }}>
        <Camera className="w-3.5 h-3.5" />
        <span>{t.advisory.refImagesTitle} ({images.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {images.map((img, idx) => {
          const imageUrl = getNormalizedUrl(img.url);
          return (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className="group cursor-pointer rounded-2xl border overflow-hidden smooth-transition hover:scale-[1.02] shadow-sm flex flex-col"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="relative w-full h-36 bg-black/20 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={img.caption || "CRI Reference"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image load fails
                    (e.target as HTMLImageElement).src = "/brand/logo-icon.png";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-mono">
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                  <span>{t.advisory.viewImage}</span>
                </div>
                {img.source && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-mono bg-black/75 text-emerald-300 border border-emerald-500/30">
                    {img.source}
                  </span>
                )}
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <p className="text-xs font-mono line-clamp-2 leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>
                  {img.caption || "CRI Diagnostic Specimen"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Lightbox Zoom */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full glass-card p-4 rounded-3xl border shadow-2xl flex flex-col max-h-[90vh]"
              style={{
                borderColor: "var(--card-border)",
                background: theme === "dark" ? "rgba(10, 20, 14, 0.95)" : "rgba(255, 255, 255, 0.98)",
              }}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-black/10 mb-4 flex items-center justify-center">
                <img
                  src={getNormalizedUrl(selectedImage.url)}
                  alt={selectedImage.caption}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold"
                    style={{
                      background: "rgba(0, 255, 157, 0.15)",
                      color: theme === "dark" ? "#00FF9D" : "#00875A",
                      borderColor: "rgba(0, 255, 157, 0.3)"
                    }}
                  >
                    {selectedImage.source || "Coconut Research Institute (CRI)"}
                  </span>
                </div>
                <h3 className="text-sm font-mono font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {selectedImage.caption}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
