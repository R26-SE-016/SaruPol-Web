"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LanguageOption, TranslationSchema } from "./types";
import { en } from "./dictionaries/en";
import { si } from "./dictionaries/si";
import { ta } from "./dictionaries/ta";

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල", flag: "🇱🇰" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇱🇰" },
];

const dictionaries: Record<Language, TranslationSchema> = {
  en,
  si,
  ta,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
  languages: SUPPORTED_LANGUAGES,
});

const STORAGE_KEY = "sarupol_preferred_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && (saved === "en" || saved === "si" || saved === "ta")) {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage errors (e.g. in private mode)
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore
    }
  };

  const t = dictionaries[language] || en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage, languages } = useLanguage();
  return { t, language, setLanguage, languages };
}
