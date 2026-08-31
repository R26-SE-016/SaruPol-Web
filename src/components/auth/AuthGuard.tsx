"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, LogIn, UserPlus, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-muted animate-pulse">Authenticating SaruPol Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full p-8 rounded-3xl border backdrop-blur-xl shadow-2xl text-center space-y-6 relative overflow-hidden"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(230, 175, 46, 0.15)" }}
          />

          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border shadow-xl relative z-10"
            style={{
              background: "linear-gradient(135deg, rgba(230,175,46,0.2), rgba(0,255,157,0.1))",
              borderColor: "rgba(230,175,46,0.35)",
            }}
          >
            <Lock className="w-8 h-8 text-amber-500" />
          </div>

          <div className="space-y-2 relative z-10">
            <h2 className="text-xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
              {t.auth.guestRestrictedTitle}
            </h2>
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t.auth.guestRestrictedMsg}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 relative z-10">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-lg"
              style={{
                background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                color: "#030705",
              }}
            >
              <LogIn className="w-4 h-4" />
              <span>{t.auth.loginBtn}</span>
            </Link>

            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border smooth-transition hover:opacity-80"
              style={{
                background: "var(--background)",
                borderColor: "var(--card-border)",
                color: "var(--text-primary)",
              }}
            >
              <UserPlus className="w-4 h-4 text-amber-500" />
              <span>{t.auth.signUpLink}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
