"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, FlaskConical, Microscope, BarChart3, MessageCircle, Map,
  LayoutDashboard, Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const commands: CommandItem[] = [
    { id: "dashboard", label: "Go to Dashboard", category: "Navigation", icon: <LayoutDashboard className="w-4 h-4" />, action: () => router.push("/") },
    { id: "soil", label: "Soil Intelligence", category: "Navigation", icon: <FlaskConical className="w-4 h-4" />, action: () => router.push("/soil") },
    { id: "pathology", label: "Pathology Diagnostics", category: "Navigation", icon: <Microscope className="w-4 h-4" />, action: () => router.push("/pathology") },
    { id: "yield", label: "Yield Forecast", category: "Navigation", icon: <BarChart3 className="w-4 h-4" />, action: () => router.push("/yield") },
    { id: "advisory", label: "Advisory AI Chat", category: "Navigation", icon: <MessageCircle className="w-4 h-4" />, action: () => router.push("/advisory") },
    { id: "operations", label: "Field Operations", category: "Navigation", icon: <Map className="w-4 h-4" />, action: () => router.push("/operations") },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const executeCommand = (cmd: CommandItem) => {
    cmd.action();
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150]"
            style={{ background: "rgba(3, 7, 5, 0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[160] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(8, 20, 14, 0.95)",
              border: "1px solid rgba(0, 255, 157, 0.12)",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 255, 157, 0.05)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: "rgba(0, 255, 157, 0.08)" }}
            >
              <Search className="w-4 h-4" style={{ color: "rgba(0, 255, 157, 0.5)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/20"
                style={{ color: "#e8efe8" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered.length > 0) {
                    executeCommand(filtered[0]);
                  }
                }}
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  No results found
                </p>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left smooth-transition"
                    style={{ color: "rgba(232,239,232,0.7)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0,255,157,0.06)";
                      e.currentTarget.style.color = "#00FF9D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(232,239,232,0.7)";
                    }}
                  >
                    <span style={{ color: "rgba(0,255,157,0.4)" }}>{cmd.icon}</span>
                    <span className="text-sm flex-1">{cmd.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
                      {cmd.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t flex items-center gap-4"
              style={{ borderColor: "rgba(0,255,157,0.06)" }}
            >
              <div className="flex items-center gap-1.5">
                <Command className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
                  + K to toggle
                </span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.1)" }}>
                ↵ to select
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
