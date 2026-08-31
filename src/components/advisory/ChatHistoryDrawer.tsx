"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Plus, Trash2, X, MessageSquare, Cpu, Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export interface ChatSession {
  id: string;
  topic: string;
  timestamp: number;
  messages: any[];
  chatMode: "standard" | "multi";
}

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

export default function ChatHistoryDrawer({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAll,
}: ChatHistoryDrawerProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-full max-w-sm h-full glass-card border-l p-6 flex flex-col z-10 shadow-2xl"
            style={{
              borderColor: "var(--card-border)",
              background: theme === "dark" ? "rgba(8, 14, 10, 0.95)" : "rgba(255, 255, 255, 0.98)",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "var(--card-border)" }}>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  {t.advisory.chatHistory}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="py-4">
              <button
                onClick={() => {
                  onNewSession();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                style={{
                  background: "linear-gradient(135deg, rgba(230,175,46,0.2), rgba(0,255,157,0.2))",
                  borderColor: "rgba(230,175,46,0.4)",
                  color: "var(--text-primary)",
                }}
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>{t.advisory.newChat}</span>
              </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {sessions.length === 0 ? (
                <div className="text-center py-12 px-4" style={{ color: "var(--text-muted)" }}>
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-mono">{t.advisory.noHistory}</p>
                </div>
              ) : (
                sessions.map((sess) => {
                  const isActive = sess.id === currentSessionId;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => {
                        onSelectSession(sess.id);
                        onClose();
                      }}
                      className="group p-3 rounded-xl border cursor-pointer smooth-transition relative flex items-start justify-between gap-2"
                      style={{
                        background: isActive ? "rgba(0, 255, 157, 0.12)" : "var(--card-bg)",
                        borderColor: isActive ? "rgba(0, 255, 157, 0.4)" : "var(--card-border)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase"
                            style={{
                              background: sess.chatMode === "multi" ? "rgba(212,175,55,0.15)" : "rgba(0,255,157,0.15)",
                              color: sess.chatMode === "multi" ? (theme === "dark" ? "#E6AF2E" : "#B45309") : (theme === "dark" ? "#00FF9D" : "#00875A"),
                            }}
                          >
                            {sess.chatMode === "multi" ? "MULTI-LLM" : "STANDARD"}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                            {new Date(sess.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <h4 className="text-xs font-mono font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {sess.topic || "Agricultural Consultation"}
                        </h4>
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {sess.messages.length} messages
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(sess.id);
                        }}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear All Footer */}
            {sessions.length > 0 && (
              <div className="pt-3 border-t mt-2" style={{ borderColor: "var(--card-border)" }}>
                <button
                  onClick={onClearAll}
                  className="w-full py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.advisory.clearHistory}</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
