"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

const ESTATES_LIST = [
  "Makandura Experimental Estate (Intermediate Zone)",
  "Lunuwila CRI Headquarters (Wet Zone)",
  "Puttalam Seed Garden (Dry Zone)",
  "Kurunegala Commercial Block (Intermediate Zone)",
  "Ratnapura High-Rainfall Estate (Wet Zone)",
  "Batticaloa Coastal Plantation (Dry Zone)",
  "Gampaha / Negombo Smallholding",
  "Other / Private Plantation",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"planter" | "manager" | "officer">("planter");
  const [estate, setEstate] = useState(ESTATES_LIST[0]);
  const [phone, setPhone] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    const res = await register({
      name,
      email,
      password,
      role,
      estate_id: estate,
      phone,
    });

    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Failed to register account.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col justify-between" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Ambience Lighting */}
      <div className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 255, 157, 0.06)" }} />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(212, 175, 55, 0.06)" }} />

      <div className="flex-1 flex items-center justify-center px-4 py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-lg w-full p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-6"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="relative inline-flex items-center justify-center mb-1">
              <Image
                src="/brand/logo-icon.png"
                alt="SaruPol Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                priority
              />
            </div>
            <h1 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
              {t.auth.registerTitle}
            </h1>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {t.auth.registerSubtitle}
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
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.auth.nameLabel}</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.namePlaceholder}
                className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition"
                style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.auth.phoneLabel}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.auth.phonePlaceholder}
                  className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
              </div>
            </div>

            {/* Agricultural Role & Estate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.auth.roleLabel}</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition cursor-pointer"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                >
                  <option value="planter">{t.profile.rolePlanter}</option>
                  <option value="manager">{t.profile.roleManager}</option>
                  <option value="officer">{t.profile.roleOfficer}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.auth.estateLabel}</span>
                </label>
                <select
                  value={estate}
                  onChange={(e) => setEstate(e.target.value)}
                  className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition cursor-pointer"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                >
                  {ESTATES_LIST.map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.auth.passwordLabel}</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                  <span>Confirm Password</span>
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition"
                  style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-lg flex items-center justify-center gap-2 cursor-pointer pt-3"
              style={{
                background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                color: "#030705",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Registering Plantation...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{t.auth.registerBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-xs font-mono text-center text-muted">
            {t.auth.haveAccount}{" "}
            <Link href="/login" className="text-amber-500 font-bold hover:underline">
              {t.auth.signInLink}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
