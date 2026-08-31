"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ShieldCheck,
  Calendar,
  Save,
  LogOut,
  Microscope,
  TrendingUp,
  MessageCircle,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
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

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+94 77 123 4567");
  const [estate, setEstate] = useState(user?.estate_id || ESTATES_LIST[0]);
  const [role, setRole] = useState(user?.role || "planter");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "+94 77 123 4567");
      setEstate(user.estate_id || ESTATES_LIST[0]);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    await updateProfile({
      name,
      phone,
      estate_id: estate,
      role: role as any,
    });

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const getRoleLabel = (r: string) => {
    if (r === "officer") return t.profile.roleOfficer;
    if (r === "manager") return t.profile.roleManager;
    return t.profile.rolePlanter;
  };

  return (
    <AuthGuard>
      <main className="min-h-screen relative flex flex-col justify-between" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
        <Navbar />

        {/* Ambient Lighting */}
        <div className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(212, 175, 55, 0.05)" }} />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 255, 157, 0.04)" }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-10 w-full">
          
          {/* Header Title Area */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--card-border)" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-md flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(0,255,157,0.1))",
                  borderColor: "rgba(212,175,55,0.35)",
                }}
              >
                <User className="w-7 h-7" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                    {t.profile.title}
                  </h1>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold"
                    style={{
                      background: "rgba(230,175,46,0.15)",
                      borderColor: "rgba(230,175,46,0.3)",
                      color: theme === "dark" ? "#E6AF2E" : "#B45309",
                    }}
                  >
                    {getRoleLabel(role)}
                  </span>
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {t.profile.subtitle}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold text-red-400 hover:bg-red-500/10 smooth-transition cursor-pointer self-start sm:self-auto"
              style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}
            >
              <LogOut className="w-4 h-4" />
              <span>{t.auth.signOut}</span>
            </button>
          </div>

          {/* Activity Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex items-center gap-4"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div className="p-3 rounded-xl" style={{ background: "rgba(0, 255, 157, 0.12)", color: "#00FF9D" }}>
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  14
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted">
                  {t.profile.diagnosticsCount}
                </p>
              </div>
            </div>

            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex items-center gap-4"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div className="p-3 rounded-xl" style={{ background: "rgba(0, 229, 255, 0.12)", color: "#00E5FF" }}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  8
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted">
                  {t.profile.harvestLogsCount}
                </p>
              </div>
            </div>

            <div
              className="p-5 rounded-2xl border backdrop-blur-xl shadow-md flex items-center gap-4"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div className="p-3 rounded-xl" style={{ background: "rgba(230, 175, 46, 0.12)", color: "#E6AF2E" }}>
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  23
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted">
                  {t.profile.advisoryQueriesCount}
                </p>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 rounded-2xl border flex items-center gap-3 text-xs font-mono font-bold"
              style={{ background: "rgba(0, 255, 157, 0.1)", borderColor: "rgba(0, 255, 157, 0.3)", color: "#00FF9D" }}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{t.profile.savedSuccess}</span>
            </motion.div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div
              className="p-6 rounded-3xl border backdrop-blur-xl shadow-md space-y-5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>{t.profile.personalInfo}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs font-mono outline-none"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">Email Address (Registered)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full p-3 rounded-xl border text-xs font-mono opacity-60 cursor-not-allowed"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs font-mono outline-none"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  />
                </div>

                {/* User ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">{t.profile.userId}</label>
                  <input
                    type="text"
                    disabled
                    value={user?.id ? String(user.id) : "USR-2026-001"}
                    className="w-full p-3 rounded-xl border text-xs font-mono opacity-60 font-bold text-amber-500 cursor-not-allowed"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Plantation & Agro-Climatic Context */}
            <div
              className="p-6 rounded-3xl border backdrop-blur-xl shadow-md space-y-5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{t.profile.plantationInfo}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">Primary Research / Commercial Estate</label>
                  <select
                    value={estate}
                    onChange={(e) => setEstate(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs font-mono outline-none cursor-pointer"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  >
                    {ESTATES_LIST.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">Role Privilege Tier</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-3 rounded-xl border text-xs font-mono outline-none cursor-pointer"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  >
                    <option value="planter">{t.profile.rolePlanter}</option>
                    <option value="manager">{t.profile.roleManager}</option>
                    <option value="officer">{t.profile.roleOfficer}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-lg cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                  color: "#030705",
                }}
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : t.profile.saveChanges}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </AuthGuard>
  );
}
