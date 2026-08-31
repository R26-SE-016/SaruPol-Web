"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Edit3,
  X,
  Lock,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth, CRI_FIXED_ESTATES, COMMERCIAL_ESTATES } from "@/lib/auth/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, changePassword, deleteAccount, logout } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Edit Mode state for profile details
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+94 77 123 4567");
  const [estate, setEstate] = useState(
    user?.estate_id || (user?.role === "officer" ? CRI_FIXED_ESTATES[0] : COMMERCIAL_ESTATES[0])
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete Account Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if user updates
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "+94 77 123 4567");
      setEstate(user.estate_id || (user.role === "officer" ? CRI_FIXED_ESTATES[0] : COMMERCIAL_ESTATES[0]));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    await updateProfile({
      name,
      phone,
      estate_id: estate,
    });

    setIsSaving(false);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleCancelEdit = () => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "+94 77 123 4567");
      setEstate(user.estate_id || (user.role === "officer" ? CRI_FIXED_ESTATES[0] : COMMERCIAL_ESTATES[0]));
    }
    setIsEditing(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordError(t.profile.passwordMismatch);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setIsUpdatingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsUpdatingPassword(false);

    if (res.success) {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } else {
      setPasswordError(res.error || "Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      return;
    }

    setIsDeleting(true);
    await deleteAccount();
    setIsDeleting(false);
    setShowDeleteModal(false);
    router.push("/login");
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const getRoleLabel = (r?: string) => {
    if (r === "officer") return t.profile.roleOfficer;
    if (r === "manager") return t.profile.roleManager;
    return t.profile.rolePlanter;
  };

  const isCriOfficer = user?.role === "officer";

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
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                    {t.profile.title}
                  </h1>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold"
                    style={{
                      background: isCriOfficer ? "rgba(0,255,157,0.15)" : "rgba(230,175,46,0.15)",
                      borderColor: isCriOfficer ? "rgba(0,255,157,0.35)" : "rgba(230,175,46,0.3)",
                      color: isCriOfficer ? (theme === "dark" ? "#00FF9D" : "#00875A") : (theme === "dark" ? "#E6AF2E" : "#B45309"),
                    }}
                  >
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {t.profile.subtitle}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-sm cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,255,157,0.15), rgba(212,175,55,0.15))",
                    borderColor: "rgba(0,255,157,0.3)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>{t.profile.editProfile}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold text-muted hover:bg-black/5 dark:hover:bg-white/5 smooth-transition cursor-pointer"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <X className="w-4 h-4" />
                  <span>{t.profile.cancelEdit}</span>
                </button>
              )}

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold text-red-400 hover:bg-red-500/10 smooth-transition cursor-pointer"
                style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}
              >
                <LogOut className="w-4 h-4" />
                <span>{t.auth.signOut}</span>
              </button>
            </div>
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

          {/* Profile Details Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Personal Credentials */}
            <div
              className="p-6 rounded-3xl border backdrop-blur-xl shadow-md space-y-5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>{t.profile.personalInfo}</span>
                </h3>
                {isEditing && (
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-500 animate-pulse">
                    Editing Mode Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">{t.auth.nameLabel}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition focus:border-amber-500"
                      style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    />
                  ) : (
                    <div className="p-3 rounded-xl border text-xs font-mono font-bold" style={{ background: "var(--background)", borderColor: "var(--card-border)" }}>
                      {name || "—"}
                    </div>
                  )}
                </div>

                {/* Email (Always Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted flex items-center justify-between">
                    <span>{t.auth.emailLabel}</span>
                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Primary Login
                    </span>
                  </label>
                  <div className="p-3 rounded-xl border text-xs font-mono opacity-80" style={{ background: "var(--background)", borderColor: "var(--card-border)" }}>
                    {user?.email || "—"}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted">{t.auth.phoneLabel}</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border text-xs font-mono outline-none smooth-transition focus:border-emerald-400"
                      style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    />
                  ) : (
                    <div className="p-3 rounded-xl border text-xs font-mono" style={{ background: "var(--background)", borderColor: "var(--card-border)" }}>
                      {phone || "—"}
                    </div>
                  )}
                </div>

                {/* Immutable Role Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-muted flex items-center justify-between">
                    <span>{t.auth.roleLabel}</span>
                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Fixed Role Tier
                    </span>
                  </label>
                  <div className="p-3 rounded-xl border text-xs font-mono flex items-center justify-between" style={{ background: "var(--background)", borderColor: "var(--card-border)" }}>
                    <span className="font-bold text-amber-500 uppercase">{getRoleLabel(user?.role)}</span>
                    <span className="text-[10px] text-muted font-mono">{user?.role === "officer" ? "Level 3 Scientist" : "Standard Planter"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plantation & Agro-Climatic Context */}
            <div
              className="p-6 rounded-3xl border backdrop-blur-xl shadow-md space-y-5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.profile.plantationInfo}</span>
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  {isCriOfficer ? t.profile.criFixedNotice : t.profile.privateEstateNotice}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-muted">Active Plantation / Zone Assignment</label>
                {isEditing ? (
                  <select
                    value={estate}
                    onChange={(e) => setEstate(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs font-mono outline-none cursor-pointer smooth-transition focus:border-emerald-400"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  >
                    {isCriOfficer ? (
                      <optgroup label="Official CRI Research Experimental Stations (Authorized Only)">
                        {CRI_FIXED_ESTATES.map((est) => (
                          <option key={est} value={est}>
                            {est}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <optgroup label="Commercial Plantations & Private Holdings">
                        {COMMERCIAL_ESTATES.map((est) => (
                          <option key={est} value={est}>
                            {est}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                ) : (
                  <div className="p-3 rounded-xl border text-xs font-mono font-medium flex items-center justify-between" style={{ background: "var(--background)", borderColor: "var(--card-border)" }}>
                    <span>{estate}</span>
                    {isCriOfficer && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        CRI STATION
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save Changes Button (Only in edit mode) */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 rounded-xl border text-xs font-mono font-bold text-muted hover:bg-black/5 dark:hover:bg-white/5 smooth-transition cursor-pointer"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  {t.profile.cancelEdit}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2.5 px-8 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider smooth-transition shadow-lg cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #00FF9D, #D4AF37)",
                    color: "#030705",
                  }}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : t.profile.saveChanges}</span>
                </button>
              </div>
            )}
          </form>

          {/* Security & Password Update Section */}
          <div className="mt-8">
            <div
              className="p-6 rounded-3xl border backdrop-blur-xl shadow-md space-y-5"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <h3 className="text-sm font-mono font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>{t.profile.changePasswordTitle}</span>
              </h3>

              {passwordSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border flex items-center gap-2 text-xs font-mono text-emerald-400"
                  style={{ background: "rgba(0, 255, 157, 0.08)", borderColor: "rgba(0, 255, 157, 0.3)" }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{t.profile.passwordSuccess}</span>
                </motion.div>
              )}

              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border flex items-center gap-2 text-xs font-mono text-red-400"
                  style={{ background: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </motion.div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-muted">{t.profile.currentPassword}</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-xl border text-xs font-mono outline-none"
                      style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-muted">{t.profile.newPassword}</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-xl border text-xs font-mono outline-none"
                      style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-muted flex items-center justify-between">
                      <span>{t.profile.confirmNewPassword}</span>
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
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-xl border text-xs font-mono outline-none"
                      style={{ background: "var(--background)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="px-6 py-2.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider smooth-transition hover:border-amber-500 cursor-pointer disabled:opacity-50"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      borderColor: "rgba(212,175,55,0.3)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {isUpdatingPassword ? "Updating..." : t.profile.updatePasswordBtn}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="mt-8">
            <div
              className="p-6 rounded-3xl border backdrop-blur-xl shadow-md space-y-4"
              style={{
                background: "rgba(239, 68, 68, 0.03)",
                borderColor: "rgba(239, 68, 68, 0.25)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-mono font-bold text-red-400 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>{t.profile.deleteAccountTitle}</span>
                  </h3>
                  <p className="text-xs font-mono text-muted max-w-xl">
                    {t.profile.deleteAccountDesc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 rounded-xl border text-xs font-mono font-bold text-red-400 hover:bg-red-500/20 smooth-transition cursor-pointer self-start sm:self-auto"
                  style={{ borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)" }}
                >
                  {t.profile.deleteAccountBtn}
                </button>
              </div>
            </div>
          </div>

          {/* Double Confirmation Delete Modal */}
          <AnimatePresence>
            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="relative z-50 max-w-md w-full p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-5"
                  style={{
                    background: theme === "dark" ? "rgba(18, 12, 14, 0.98)" : "rgba(255, 255, 255, 0.98)",
                    borderColor: "rgba(239, 68, 68, 0.35)",
                  }}
                >
                  <div className="flex items-center gap-3 text-red-500">
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-mono font-bold text-red-500">
                        {t.profile.confirmDeleteTitle}
                      </h3>
                      <p className="text-[10px] font-mono text-muted uppercase">Irreversible System Action</p>
                    </div>
                  </div>

                  <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {t.profile.confirmDeleteMsg}
                  </p>

                  <div className="space-y-2 p-3 rounded-xl border bg-black/5 dark:bg-black/30" style={{ borderColor: "var(--card-border)" }}>
                    <label className="text-[11px] font-mono font-bold text-muted block">
                      {t.profile.typeDeleteToConfirm}
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="w-full p-2.5 rounded-lg border text-xs font-mono font-bold text-red-500 outline-none uppercase"
                      style={{ background: "var(--background)", borderColor: "rgba(239,68,68,0.4)" }}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="w-full py-3 rounded-xl border text-xs font-mono font-bold text-muted hover:bg-black/5 dark:hover:bg-white/5 smooth-transition cursor-pointer"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      {t.profile.cancelEdit}
                    </button>
                    <button
                      type="button"
                      disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE" || isDeleting}
                      onClick={handleDeleteAccount}
                      className="w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed smooth-transition shadow-lg cursor-pointer"
                    >
                      {isDeleting ? "Deleting..." : t.profile.confirmDeleteBtn}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </AuthGuard>
  );
}
