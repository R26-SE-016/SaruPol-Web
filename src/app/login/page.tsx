"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || t.auth.invalidCredentials);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: "agronomist" | "planter") => {
    setError(null);
    setIsLoading(true);
    const demo = DEMO_ACCOUNTS[type];
    setEmail(demo.email);
    setPassword(demo.password);

    const res = await login(demo.email, demo.password);
    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || t.auth.invalidCredentials);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col justify-between" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Ambience Grids & Lighting */}
      <div className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(212, 175, 55, 0.06)" }} />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 255, 157, 0.05)" }} />

      <div className="flex-1 flex items-center justify-center px-4 py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-6"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          {/* Header & Emblem */}
          <div className="text-center space-y-2">
            <div className="relative inline-flex items-center justify-center mb-1">
              <Image
                src="/brand/logo-icon.png"
                alt="SaruPol Logo"
                width={52}
                height={52}
                className="w-13 h-13 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                priority
              />
            </div>
            <h1 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
              {t.auth.loginTitle}
            </h1>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {t.auth.loginSubtitle}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl border flex items-center gap-2 text-xs font-mono"
              style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#EF4444" }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.auth.emailLabel}</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.auth.passwordLabel}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-muted hover:text-amber-500 transition-colors flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                color: "#030705",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t.auth.loginBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login One-Click Section */}
          <div className="pt-2 border-t space-y-2.5" style={{ borderColor: "var(--card-border)" }}>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted text-center">
              {t.auth.demoLoginHeader}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("agronomist")}
                className="p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 smooth-transition hover:border-amber-500 cursor-pointer"
                style={{ background: "rgba(230,175,46,0.06)", borderColor: "var(--card-border)" }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate">{t.auth.demoAgronomist}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("planter")}
                className="p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 smooth-transition hover:border-emerald-400 cursor-pointer"
                style={{ background: "rgba(0,255,157,0.06)", borderColor: "var(--card-border)" }}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">{t.auth.demoPlanter}</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="text-xs font-mono text-center text-muted">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="text-amber-500 font-bold hover:underline">
              {t.auth.signUpLink}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
