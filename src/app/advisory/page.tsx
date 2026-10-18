"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  MessageCircle, Send, Mic, MicOff, Bot, User,
  Sparkles, History, Cpu, Copy, Check, MapPin,
  ThumbsUp, ThumbsDown, Edit3, ArrowRight, Loader2, BookOpen, X, Plus, Languages
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/types";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { advisory, AdvisorySource, AdvisoryImageRef } from "@/lib/api";

import ReliabilityBadge from "@/components/advisory/ReliabilityBadge";
import MultiLlmConsensusCard from "@/components/advisory/MultiLlmConsensusCard";
import CRIReferenceImages from "@/components/advisory/CRIReferenceImages";
import AudioWavePlayer from "@/components/advisory/AudioWavePlayer";
import AgroContextPanel from "@/components/advisory/AgroContextPanel";
import ChatHistoryDrawer, { ChatSession } from "@/components/advisory/ChatHistoryDrawer";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  translations?: Record<string, string | undefined>;
  sources?: AdvisorySource[];
  images?: AdvisoryImageRef[];
  context_used?: string;
  timestamp: Date;
  isError?: boolean;
  // Reliability metrics
  retrieval_confidence?: number;
  combined_reliability?: number;
  reliability_level?: "High" | "Moderate" | "Low";
  // Multi-LLM fields
  isMultiLlm?: boolean;
  best_model?: string;
  judge_reason?: string;
  consensus_score?: number;
  llama_answer?: string;
  gpt_answer?: string;
  gemma_answer?: string;
  early_exit?: boolean;
  similarity_score?: number;
  latency_ms?: number;
}

const STORAGE_KEY = "sarupol_chat_sessions";

// ─── Helpers ported from SaruPol-Apk (utils/contextHelper.ts) ───
const determineSeason = (date: Date): "Yala" | "Maha" => {
  const month = date.getMonth() + 1;
  return month >= 5 && month <= 9 ? "Yala" : "Maha";
};

const getMonthName = (date: Date) => date.toLocaleString("en-US", { month: "long" });

const determineZone = (lat: number, lon: number): string => {
  if (lat >= 5.9 && lat <= 7.5 && lon >= 79.8 && lon <= 80.6) return "Wet Zone";
  if (lat >= 5.9 && lat <= 8.0 && lon >= 79.8 && lon <= 81.2) return "Intermediate Zone";
  if (lat >= 5.5 && lat <= 10.0 && lon >= 79.5 && lon <= 82.0) return "Dry Zone";
  return "Unknown Zone";
};

// Representative coordinates used by the mobile app for manual zone overrides
const ZONE_COORDS: Record<string, { lat: number; lon: number }> = {
  "Wet Zone": { lat: 6.9271, lon: 79.8612 },
  "Intermediate Zone": { lat: 7.2906, lon: 80.6337 },
  "Dry Zone": { lat: 8.3114, lon: 80.4037 },
};

const generateUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const L = (lang: string, en: string, si: string, ta: string) => (lang === "si" ? si : lang === "ta" ? ta : en);

// Same suggested questions as the mobile app (matched to the CRI knowledge-base PDFs)
const getSuggestions = (lang: string) => [
  L(lang, "How should I fertilize young coconut palms?", "පොල් පැළ සඳහා පොහොර යෙදිය යුත්තේ කෙසේද?", "இளம் தேங்காய் மரங்களுக்கு உரமிட வேண்டியது எப்படி?"),
  L(lang, "How do I select a good mother palm?", "හොඳ මව් ශාකයක් තෝරා ගන්නේ කෙසේද?", "நல்ல தாய் பனையை தேர்ந்தெடுப்பது எப்படி?"),
  L(lang, "How do I control termites in coconut nursery?", "පොල් තවාන් වල වේයන් පාලනය කරන්නේ කෙසේද?", "தேங்காய் நாற்றங்காலில் கறையானைகளை கட்டுப்படுத்துவது எப்படி?"),
  L(lang, "What fertilizer mixture is recommended for coconut seedlings?", "පොල් පැළ සඳහා නිර්දේශිත පොහොර මිශ්‍රණය කුමක්ද?", "தேங்காய் நாற்றுகளுக்கு பரிந்துரைக்கப்படும் உரக் கலவை என்ன?"),
];

function AdvisoryContent() {
  const searchParams = useSearchParams();
  const initialPromptProcessed = useRef(false);
  const { t, language, setLanguage } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Engine Mode
  const [chatMode, setChatMode] = useState<"standard" | "multi">("standard");

  // Agro-Climatic Context (Auto GPS + date, with manual override — same as mobile)
  const [isAutoGps, setIsAutoGps] = useState(true);
  const [gpsZone, setGpsZone] = useState<string>("Unknown Zone");
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [manualZone, setManualZone] = useState<string>("Intermediate Zone");
  const [manualSeason, setManualSeason] = useState<string | null>(null);
  const autoSeason = determineSeason(new Date());
  const zone = isAutoGps ? gpsZone : manualZone;
  const season = manualSeason || autoSeason;
  const isOverridden = !isAutoGps || manualSeason !== null;

  // Sessions & Messages
  const [sessionId, setSessionId] = useState<string>(() => generateUUID());
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  // Input & Voice state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedHighlight, setTranscribedHighlight] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [ratedMsgIds, setRatedMsgIds] = useState<Record<string, "up" | "down">>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const prevLangRef = useRef<Language>(language);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  // Auto-scroll to bottom of chat safely without shoving header behind fixed navbar
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isLoading]);

  // Ensure window resets to top on initial mount or when a new session begins
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [sessionId]);

  // Get browser GPS location once (mobile: expo-location)
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        setGpsZone(determineZone(latitude, longitude));
      },
      (err) => console.log("Geolocation unavailable:", err.message),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  // Load chat sessions from localStorage + Cloud
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSessions(JSON.parse(stored));
    } catch (e) {
      console.warn("Failed to load past chat sessions:", e);
    }

    // Hydrate sessions from Cloud Gateway for multi-device synchronization
    if (user?.id && typeof navigator !== "undefined" && navigator.onLine) {
      advisory.getSessions(String(user.id))
        .then((res) => {
          if (res?.sessions && Array.isArray(res.sessions) && res.sessions.length > 0) {
            setSessions((prev) => {
              const mergedMap = new Map<string, ChatSession>();
              // Populate cloud sessions first
              res.sessions.forEach((s: any) => {
                if (s && s.id) mergedMap.set(s.id, s);
              });
              // Merge local sessions, favoring local if newer or active
              prev.forEach((s) => {
                const cloudS = mergedMap.get(s.id);
                if (!cloudS || (s.timestamp && cloudS.timestamp && s.timestamp >= cloudS.timestamp)) {
                  mergedMap.set(s.id, s);
                }
              });
              const merged = Array.from(mergedMap.values()).sort(
                (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
              );
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (_) {}
              return merged;
            });
          }
        })
        .catch((err) => console.warn("Failed to fetch cloud advisory sessions:", err));
    }
  }, [user?.id]);

  // Check for auto-populated query/context from cross-module handoffs (e.g., Soil foliar scan, Pathology critical alert)
  useEffect(() => {
    if (initialPromptProcessed.current) return;
    const promptParam = searchParams?.get("q") || searchParams?.get("prompt");
    const zoneParam = searchParams?.get("zone");
    const modeParam = searchParams?.get("mode");

    if (zoneParam) {
      setIsAutoGps(false);
      if (zoneParam.toLowerCase().includes("wet")) setManualZone("Wet Zone");
      else if (zoneParam.toLowerCase().includes("dry")) setManualZone("Dry Zone");
      else setManualZone("Intermediate Zone");
    }

    if (modeParam === "multi") {
      setChatMode("multi");
    }

    if (promptParam) {
      initialPromptProcessed.current = true;
      setInput(promptParam);
      // Small tick so states settle before auto-firing query
      const timer = setTimeout(() => {
        void sendMessage(promptParam);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Persist current session whenever messages change (local + cloud)
  useEffect(() => {
    if (messages.length === 0) return;
    const firstUserMsg = messages.find((m) => m.role === "user");
    const topic = firstUserMsg
      ? firstUserMsg.content.slice(0, 45) + (firstUserMsg.content.length > 45 ? "..." : "")
      : "New Consultation";

    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === sessionId);
      const newSession: ChatSession = { id: sessionId, topic, timestamp: Date.now(), messages, chatMode };
      let updatedList: ChatSession[];
      if (existingIdx >= 0) {
        updatedList = [...prev];
        updatedList[existingIdx] = newSession;
      } else {
        updatedList = [newSession, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.warn("Failed to save session to localStorage:", e);
      }

      // Cloud synchronization across devices
      if (user?.id && typeof navigator !== "undefined" && navigator.onLine) {
        advisory.saveSessions(String(user.id), updatedList).catch((err) => {
          console.warn("Failed to sync advisory sessions to cloud:", err);
        });
      }

      return updatedList;
    });
  }, [messages, sessionId, chatMode, user?.id]);

  // Start a brand-new chat session
  const handleNewSession = () => {
    setSessionId(generateUUID());
    setMessages([]);
    setInput("");
    setEditingMsgId(null);
    setIsLoading(false);
  };

  // Switch to a previous session
  const handleSelectSession = (selectedId: string) => {
    const found = sessions.find((s) => s.id === selectedId);
    if (found) {
      setSessionId(found.id);
      setMessages(found.messages || []);
      setChatMode(found.chatMode || "standard");
      setEditingMsgId(null);
    }
  };

  // Delete a session
  const handleDeleteSession = (targetId: string) => {
    const updated = sessions.filter((s) => s.id !== targetId);
    setSessions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to update localStorage:", e);
    }
    if (user?.id && typeof navigator !== "undefined" && navigator.onLine) {
      advisory.saveSessions(String(user.id), updated).catch(() => {});
    }
    if (targetId === sessionId) handleNewSession();
  };

  // Clear all sessions
  const handleClearAllHistory = () => {
    setSessions([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    if (user?.id && typeof navigator !== "undefined" && navigator.onLine) {
      advisory.saveSessions(String(user.id), []).catch(() => {});
    }
    handleNewSession();
  };

  // ─── Language switch: batch-translate whole conversation (answers, captions, model answers, judge reason) ───
  const applyCachedLanguage = (msg: ChatMessage, nextLang: string): ChatMessage => {
    const tr = msg.translations || {};
    const updated: ChatMessage = { ...msg, content: tr[nextLang] || msg.content };
    if (msg.images && msg.images.length > 0) {
      updated.images = msg.images.map((img, idx) => ({ ...img, caption: tr[`img_${idx}_${nextLang}`] || img.caption }));
    }
    if (msg.isMultiLlm) {
      updated.llama_answer = tr[`llama_${nextLang}`] || msg.llama_answer;
      updated.gpt_answer = tr[`gpt4omini_${nextLang}`] || msg.gpt_answer;
      updated.gemma_answer = tr[`gemma_${nextLang}`] || msg.gemma_answer;
      updated.judge_reason = tr[`reason_${nextLang}`] || msg.judge_reason;
    }
    return updated;
  };

  const translateConversation = async (currentLang: string, nextLang: "en" | "si" | "ta") => {
    const current = messagesRef.current;
    if (current.length === 0) return;

    const items: { id: string; text: string }[] = [];
    current.forEach((msg) => {
      if (msg.isError) return;
      const tr = msg.translations || {};
      if (!tr[nextLang]) {
        items.push({ id: `${msg.id}_text`, text: tr["en"] || tr["si"] || msg.content });
      }
      msg.images?.forEach((img, idx) => {
        if (!tr[`img_${idx}_${nextLang}`] && img.caption) items.push({ id: `${msg.id}_img_${idx}`, text: img.caption });
      });
      if (msg.isMultiLlm) {
        if (!tr[`llama_${nextLang}`] && msg.llama_answer) items.push({ id: `${msg.id}_llama`, text: msg.llama_answer });
        if (!tr[`gpt4omini_${nextLang}`] && msg.gpt_answer) items.push({ id: `${msg.id}_gpt4omini`, text: msg.gpt_answer });
        if (!tr[`gemma_${nextLang}`] && msg.gemma_answer) items.push({ id: `${msg.id}_gemma`, text: msg.gemma_answer });
        if (!tr[`reason_${nextLang}`] && msg.judge_reason) items.push({ id: `${msg.id}_reason`, text: msg.judge_reason });
      }
    });

    if (items.length === 0) {
      setMessages((prev) => prev.map((m) => (m.isError ? m : applyCachedLanguage(m, nextLang))));
      return;
    }

    setTranslating(true);
    try {
      const res = await advisory.translateBatch(items, nextLang);
      if (!res.success || !res.translations) throw new Error("Translation failed");
      const find = (id: string) => res.translations.find((x) => x.id === id)?.translated_text;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.isError) return msg;
          const tr: Record<string, string | undefined> = { ...(msg.translations || {}) };
          // Cache current-language versions before switching
          if (!tr[currentLang]) tr[currentLang] = msg.content;
          msg.images?.forEach((img, idx) => {
            if (!tr[`img_${idx}_${currentLang}`] && img.caption) tr[`img_${idx}_${currentLang}`] = img.caption;
          });
          if (msg.isMultiLlm) {
            if (!tr[`llama_${currentLang}`]) tr[`llama_${currentLang}`] = msg.llama_answer;
            if (!tr[`gpt4omini_${currentLang}`]) tr[`gpt4omini_${currentLang}`] = msg.gpt_answer;
            if (!tr[`gemma_${currentLang}`]) tr[`gemma_${currentLang}`] = msg.gemma_answer;
            if (!tr[`reason_${currentLang}`]) tr[`reason_${currentLang}`] = msg.judge_reason;
          }
          // Store new translations
          const txt = find(`${msg.id}_text`);
          if (txt) tr[nextLang] = txt;
          msg.images?.forEach((_, idx) => {
            const c = find(`${msg.id}_img_${idx}`);
            if (c) tr[`img_${idx}_${nextLang}`] = c;
          });
          if (msg.isMultiLlm) {
            const a = find(`${msg.id}_llama`); if (a) tr[`llama_${nextLang}`] = a;
            const b = find(`${msg.id}_gpt4omini`); if (b) tr[`gpt4omini_${nextLang}`] = b;
            const c = find(`${msg.id}_gemma`); if (c) tr[`gemma_${nextLang}`] = c;
            const r = find(`${msg.id}_reason`); if (r) tr[`reason_${nextLang}`] = r;
          }
          return applyCachedLanguage({ ...msg, translations: tr }, nextLang);
        })
      );
    } catch (err) {
      console.warn("Failed to translate previous messages:", err);
      setMessages((prev) => prev.map((m) => (m.isError ? m : applyCachedLanguage(m, nextLang))));
    } finally {
      setTranslating(false);
    }
  };

  // React to language changes from the page toggle OR the global Navbar switcher
  useEffect(() => {
    const prev = prevLangRef.current;
    if (prev === language) return;
    prevLangRef.current = language;
    void translateConversation(prev, language as "en" | "si" | "ta");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ─── Send query to AI Advisory Engine (mirrors mobile handleSend) ───
  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;
    setTranscribedHighlight(false);

    // Location: GPS coords in auto mode, representative zone coords in manual mode
    let sendLat: number | null = userCoords?.lat ?? null;
    let sendLon: number | null = userCoords?.lon ?? null;
    if (!isAutoGps && ZONE_COORDS[manualZone]) {
      sendLat = ZONE_COORDS[manualZone].lat;
      sendLon = ZONE_COORDS[manualZone].lon;
    }
    const month = manualSeason ? (manualSeason === "Yala" ? "July" : "December") : getMonthName(new Date());
    const contextPayload = `${zone} | ${season} Season (${month})`;

    // Edit & resend: drop the edited question and everything after it
    let baseMessages = messagesRef.current;
    if (editingMsgId) {
      const idx = baseMessages.findIndex((m) => m.id === editingMsgId);
      if (idx !== -1) baseMessages = baseMessages.slice(0, idx);
      setEditingMsgId(null);
    }

    const detectedLang = /[\u0D80-\u0DFF]/.test(query) ? "si" : /[\u0B80-\u0BFF]/.test(query) ? "ta" : "en";
    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: "user",
      content: query,
      translations: { [detectedLang]: query },
      timestamp: new Date(),
    };

    setMessages([...baseMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    const payload = {
      question: query,
      context: contextPayload,
      language,
      session_id: sessionId,
      latitude: sendLat,
      longitude: sendLon,
    };

    try {
      if (chatMode === "multi") {
        const res = await advisory.askMulti(payload);
        if (res.session_id) setSessionId(res.session_id);
        if (!res.success) throw new Error("Multi-LLM query failed");

        const gemmaAns = res.gemma_answer || res.qwen_answer;
        const assistantMessage: ChatMessage = {
          id: generateUUID(),
          role: "assistant",
          content: res.best_answer,
          translations: {
            [language]: res.best_answer,
            [`llama_${language}`]: res.llama_answer,
            [`gpt4omini_${language}`]: res.gpt4omini_answer,
            [`gemma_${language}`]: gemmaAns,
            [`reason_${language}`]: res.reason,
          },
          sources: res.sources || [],
          images: res.images || [],
          context_used: res.zone ? `${res.zone} | ${res.season}` : undefined,
          timestamp: new Date(),
          retrieval_confidence: res.retrieval_confidence ?? 0.85,
          combined_reliability: res.combined_reliability ?? 80,
          reliability_level: res.reliability_level ?? "Moderate",
          isMultiLlm: true,
          best_model: res.best_model,
          judge_reason: res.reason,
          consensus_score: res.consensus_score,
          llama_answer: res.llama_answer,
          gpt_answer: res.gpt4omini_answer,
          gemma_answer: gemmaAns,
          early_exit: res.early_exit ?? false,
          similarity_score: res.similarity_score ?? undefined,
          latency_ms: res.latency_ms ?? undefined,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const res = await advisory.ask(payload);
        if (res.session_id) setSessionId(res.session_id);

        // Backend may return the question translated into the selected language
        if (res.question && language !== "en" && detectedLang === "en") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === userMessage.id
                ? { ...m, content: res.question, translations: { ...m.translations, [language]: res.question } }
                : m
            )
          );
        }

        const assistantMessage: ChatMessage = {
          id: generateUUID(),
          role: "assistant",
          content: res.answer,
          translations: { [language]: res.answer },
          sources: res.sources || [],
          images: res.images || [],
          context_used: res.context_used,
          timestamp: new Date(),
          retrieval_confidence: res.retrieval_confidence ?? 0.85,
          combined_reliability: res.combined_reliability ?? 80,
          reliability_level: res.reliability_level ?? "Moderate",
          isMultiLlm: false,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error("Advisory error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateUUID(),
          role: "assistant",
          isError: true,
          timestamp: new Date(),
          content: L(
            language,
            "Sorry, I am facing connectivity issues to my knowledge base. Please check your internet connection.",
            "සමාවන්න, උපදේශන සේවාව සමඟ සම්බන්ධ වීමට අපොහොසත් විය. කරුණාකර අන්තර්ජාලය පරීක්ෂා කරන්න.",
            "மன்னிக்கவும், தகவல் தளத்துடன் இணைப்பதில் சிக்கல் ஏற்பட்டுள்ளது. உங்கள் இணைய இணைப்பை சரிபார்க்கவும்."
          ),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy assistant response
  const handleCopyAnswer = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Rate feedback
  const handleRateFeedback = (msgId: string, type: "up" | "down") => {
    setRatedMsgIds((prev) => ({ ...prev, [msgId]: type }));
  };

  // Edit previously asked question (resend replaces it and following answers)
  const handleEditQuestion = (msg: ChatMessage) => {
    setEditingMsgId(msg.id);
    setInput(msg.content);
    setTimeout(() => textInputRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditingMsgId(null);
    setInput("");
  };

  // ─── Microphone Voice Recording (STT) ───
  const startRecording = async () => {
    setSttError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferred = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
      const mimeType = typeof MediaRecorder !== "undefined"
        ? preferred.find((m) => MediaRecorder.isTypeSupported(m))
        : undefined;
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        if (audioBlob.size < 1000) {
          setSttError(L(language, "Recording too short. Please speak clearly and try again.", "පටිගත කිරීම කෙටි වැඩියි. කරුණාකර නැවත උත්සාහ කරන්න.", "பதிவு மிகவும் குறுகியது. மீண்டும் முயற்சிக்கவும்."));
          return;
        }

        setIsTranscribing(true);
        try {
          const res = await advisory.transcribe(audioBlob, language);
          if (res.success && res.transcribed_text?.trim()) {
            setInput(res.transcribed_text);
            setTranscribedHighlight(true);
            setTimeout(() => textInputRef.current?.focus(), 50);
          } else {
            throw new Error(res.error || "Empty transcription");
          }
        } catch (sttErr) {
          console.warn("Backend STT failed. Using browser speech recognition fallback:", sttErr);
          runBrowserSpeechFallback();
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordIntervalRef.current = setInterval(() => setRecordingSeconds((prev) => prev + 1), 1000);
    } catch (err) {
      console.warn("Microphone access failed, using browser Web Speech API:", err);
      runBrowserSpeechFallback();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = null;
      }
    }
  };

  const runBrowserSpeechFallback = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "si" ? "si-LK" : language === "ta" ? "ta-LK" : "en-US";
      recognition.interimResults = false;
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
        setTranscribedHighlight(true);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } else {
      setIsRecording(false);
      setSttError(L(language, "Voice input failed. Please type your question.", "හඬ ආදානය අසාර්ථක විය. කරුණාකර ප්‍රශ්නය ටයිප් කරන්න.", "குரல் உள்ளீடு தோல்வியடைந்தது. கேள்வியை தட்டச்சு செய்யவும்."));
    }
  };

  const suggestions = getSuggestions(language);
  const editingMsg = editingMsgId ? messages.find((m) => m.id === editingMsgId) : null;
  const month = manualSeason ? (manualSeason === "Yala" ? "July" : "December") : getMonthName(new Date());

  return (
    <AuthGuard>
      <main className="min-h-screen relative flex flex-col" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
        <Navbar />

      {/* Unified SaruPol Background Ambience matching Pathology */}
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-20" />
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(230, 175, 46, 0.05)" }} />
      <div className="absolute top-80 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0, 255, 157, 0.04)" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-6 relative z-10 flex-1 flex flex-col w-full">

        {/* Header Title Area — matching Pathology */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 flex-shrink-0" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 shadow-md"
              style={{
                background: "linear-gradient(135deg, rgba(230,175,46,0.18), rgba(230,175,46,0.06))",
                borderColor: "rgba(230,175,46,0.3)",
              }}
            >
              <MessageCircle className="w-5 h-5" style={{ color: "#E6AF2E" }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-normal tracking-tight whitespace-nowrap" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                  {t.advisory.title}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold whitespace-nowrap"
                  style={{
                    background: "rgba(230,175,46,0.12)",
                    border: "1px solid rgba(230,175,46,0.3)",
                    color: theme === "dark" ? "#E6AF2E" : "#B45309",
                  }}
                >
                  Coconut Consensus AI
                </span>
              </div>
              <p className="text-xs font-mono tracking-wide mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {t.advisory.subtitle}
              </p>
            </div>
          </div>

          {/* Right Header Action Pills: Agro-Climatic Context, New Chat & History */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <AgroContextPanel
              zone={zone}
              season={season}
              isAutoGps={isAutoGps && manualSeason === null}
              onZoneChange={(z) => setManualZone(z)}
              onSeasonChange={(s) => setManualSeason(s)}
              onToggleAutoGps={(auto) => {
                setIsAutoGps(auto);
                if (auto) setManualSeason(null);
              }}
            />

            <button
              onClick={handleNewSession}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono smooth-transition hover:opacity-80 shadow-sm whitespace-nowrap"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
              title={t.advisory.newChat}
            >
              <Plus className="w-3.5 h-3.5" style={{ color: theme === "dark" ? "#00FF9D" : "#00875A" }} />
              <span className="font-medium hidden md:inline">{t.advisory.newChat}</span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono smooth-transition hover:opacity-80 shadow-sm whitespace-nowrap"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-primary)",
              }}
              title={t.advisory.chatHistory}
            >
              <History className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium">{t.advisory.chatHistory}</span>
              {sessions.length > 0 && (
                <span
                  className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ml-0.5"
                  style={{ background: "rgba(230,175,46,0.2)", color: "#E6AF2E" }}
                >
                  {sessions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Full-Width Segmented Mode Navigation Bar — matching Pathology Tab Bar */}
        <div
          className="mb-2 p-1 rounded-2xl border backdrop-blur-xl grid grid-cols-2 gap-1.5 shadow-md smooth-transition flex-shrink-0"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <button
            onClick={() => setChatMode("standard")}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono transition-all text-center"
            style={{
              background: chatMode === "standard" ? (theme === "dark" ? "rgba(0, 255, 157, 0.12)" : "rgba(0, 168, 107, 0.12)") : "transparent",
              color: chatMode === "standard" ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)",
              border: chatMode === "standard" ? "1px solid var(--card-hover-border)" : "1px solid transparent",
              boxShadow: chatMode === "standard" ? "var(--card-shadow)" : "none",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: chatMode === "standard" ? "#00FF9D" : "inherit" }} />
            <span className="font-bold">{t.advisory.standardMode}</span>
            <span className="text-[10px] opacity-60 hidden md:inline">• {L(language, "For Farmers", "ගොවීන් සඳහා", "விவசாயிகளுக்கு")}</span>
          </button>

          <button
            onClick={() => setChatMode("multi")}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono transition-all text-center"
            style={{
              background: chatMode === "multi" ? (theme === "dark" ? "rgba(230, 175, 46, 0.15)" : "rgba(230, 175, 46, 0.18)") : "transparent",
              color: chatMode === "multi" ? (theme === "dark" ? "#E6AF2E" : "#B45309") : "var(--text-secondary)",
              border: chatMode === "multi" ? "1px solid var(--card-hover-border)" : "1px solid transparent",
              boxShadow: chatMode === "multi" ? "var(--card-shadow)" : "none",
            }}
          >
            <Cpu className="w-3.5 h-3.5 flex-shrink-0" style={{ color: chatMode === "multi" ? "#E6AF2E" : "inherit" }} />
            <span className="font-bold">{t.advisory.multiLlmMode}</span>
            <span className="text-[10px] opacity-60 hidden md:inline">• 3-Model Consensus Ensemble</span>
          </button>
        </div>

        {/* Active context banner (same info mobile shows above the chat) */}
        <div
          className="mb-3 px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-2 flex-shrink-0 self-start"
          style={{
            background: isOverridden ? "rgba(245,158,11,0.12)" : "rgba(0,255,157,0.08)",
            borderColor: isOverridden ? "rgba(245,158,11,0.4)" : "rgba(0,255,157,0.25)",
            color: isOverridden ? (theme === "dark" ? "#F59E0B" : "#B45309") : (theme === "dark" ? "#00FF9D" : "#00875A"),
          }}
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {zone} | {season} Season ({month})
            {isOverridden ? ` · ${L(language, "Manual", "අතින්", "கைமுறை")}` : userCoords ? " · GPS" : ""}
          </span>
          {translating && (
            <span className="flex items-center gap-1 ml-2 opacity-80">
              <Languages className="w-3 h-3 animate-pulse" />
              {L(language, "Translating...", "පරිවර්තනය කරමින්...", "மொழிபெயர்க்கிறது...")}
            </span>
          )}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 space-y-4 mb-4">
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-4 sm:py-8 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(230,175,46,0.25), rgba(0,255,157,0.25))",
                  border: "1px solid rgba(230,175,46,0.4)",
                }}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-xs max-w-md mb-4 font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {L(
                  language,
                  "Hello! I am your SaruPol AI Farming Advisor. I can answer any questions about coconut cultivation, pest controls, diseases, or fertilizer schedules. Ask me anything!",
                  "ආයුබෝවන්! මම සරුපොල් AI වගා උපදේශකයා වෙමි. පොල් වගාව, පළිබෝධ පාලනය, රෝග හෝ පොහොර යෙදීම් පිළිබඳ ඕනෑම ගැටලුවක් මගෙන් විමසන්න.",
                  "வணக்கம்! நான் SaruPol AI விவசாய ஆலோசகர். தேங்காய் பயிர்ச்செய்கை, பூச்சி கட்டுப்பாடு, நோய்கள் அல்லது உர திட்டங்கள் பற்றி எந்தக் கேள்வியையும் கேளுங்கள்!"
                )}
              </p>

              {/* Starter Question Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl w-full text-left">
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="p-3 rounded-2xl text-xs font-mono smooth-transition hover:scale-[1.01] border glass-card shadow-sm group flex items-center justify-between"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span className="line-clamp-2 leading-relaxed">{q}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md"
                    style={{
                      background: msg.isError ? "rgba(239,83,80,0.2)" : msg.isMultiLlm ? "rgba(230,175,46,0.2)" : "rgba(0,255,157,0.2)",
                      border: `1px solid ${msg.isError ? "rgba(239,83,80,0.4)" : msg.isMultiLlm ? "rgba(230,175,46,0.4)" : "rgba(0,255,157,0.4)"}`,
                    }}
                  >
                    <Bot className="w-4 h-4" style={{ color: msg.isError ? "#EF5350" : msg.isMultiLlm ? "#E6AF2E" : "#00FF9D" }} />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] p-4 sm:p-5 rounded-3xl ${
                    msg.role === "user" ? "rounded-br-md shadow-md" : "rounded-bl-md glass-card shadow-lg"
                  }`}
                  style={{
                    background: msg.role === "user" ? "rgba(0, 255, 157, 0.12)" : msg.isError ? "rgba(239,83,80,0.08)" : "var(--card-bg)",
                    border: `1px solid ${msg.role === "user" ? "rgba(0, 255, 157, 0.3)" : msg.isError ? "rgba(239,83,80,0.35)" : "var(--card-border)"}`,
                    outline: editingMsgId === msg.id ? "2px dashed rgba(230,175,46,0.6)" : undefined,
                  }}
                >
                  {/* Assistant Mode Header */}
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-between pb-2 mb-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider" style={{ color: msg.isError ? "#EF5350" : msg.isMultiLlm ? "#E6AF2E" : "#00FF9D" }}>
                        {msg.isError
                          ? L(language, "SaruPol AI", "සරුපොල් AI", "சருபோல் AI")
                          : msg.isMultiLlm ? "CRI Multi-LLM Consensus Verdict" : "CRI Knowledge RAG Engine"}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}

                  {/* Main Message Text */}
                  <p className="text-sm font-mono whitespace-pre-wrap leading-relaxed font-normal" style={{ color: "var(--text-primary)" }}>
                    {msg.content}
                  </p>

                  {/* User Edit Trigger */}
                  {msg.role === "user" && (
                    <div className="mt-2 flex justify-between items-center gap-3">
                      <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button
                        onClick={() => handleEditQuestion(msg)}
                        disabled={isLoading}
                        className="text-[10px] font-mono flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-40"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{t.advisory.editQuestion}</span>
                      </button>
                    </div>
                  )}

                  {/* Assistant Components: Reliability Badge, Multi-LLM Card, Reference Images & Citations */}
                  {msg.role === "assistant" && !msg.isError && (
                    <div className="space-y-3 pt-2">

                      {/* Reliability Score Badge */}
                      <ReliabilityBadge
                        combinedReliability={msg.combined_reliability}
                        reliabilityLevel={msg.reliability_level}
                        retrievalConfidence={msg.retrieval_confidence}
                      />

                      {/* Multi-LLM Consensus Card */}
                      {msg.isMultiLlm && (
                        <MultiLlmConsensusCard
                          bestModel={msg.best_model}
                          consensusScore={msg.consensus_score}
                          judgeReason={msg.judge_reason}
                          llamaAnswer={msg.llama_answer}
                          gptAnswer={msg.gpt_answer}
                          gemmaAnswer={msg.gemma_answer}
                          earlyExit={msg.early_exit}
                          similarityScore={msg.similarity_score}
                          latencyMs={msg.latency_ms}
                          retrievalConfidence={msg.retrieval_confidence}
                          combinedReliability={msg.combined_reliability}
                        />
                      )}

                      {/* Context used by the backend */}
                      {msg.context_used && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                          <MapPin className="w-3 h-3" />
                          <span>{L(language, "Context Used:", "භාවිතා කළ සන්දර්භය:", "பயன்படுத்தப்பட்ட சூழல்:")} {msg.context_used}</span>
                        </div>
                      )}

                      {/* CRI Reference Images */}
                      {msg.images && msg.images.length > 0 && (
                        <CRIReferenceImages images={msg.images} />
                      )}

                      {/* CRI Source Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t space-y-1.5" style={{ borderColor: "var(--card-border)" }}>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase" style={{ color: "var(--text-muted)" }}>
                            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                            <span>{t.advisory.sourcesTitle}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, i) => (
                              <div
                                key={i}
                                className="px-2.5 py-1 rounded-lg border text-[10px] font-mono font-medium"
                                style={{
                                  background: "var(--card-bg)",
                                  borderColor: "var(--card-border)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                <span>[{i + 1}] {src.title || (src.content || "").slice(0, 45)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assistant Action Bar: Audio Player, Copy, Feedback */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t mt-3" style={{ borderColor: "var(--card-border)" }}>
                        <AudioWavePlayer key={`${msg.id}_${language}`} text={msg.content} lang={language} />

                        <div className="flex items-center gap-1.5">
                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopyAnswer(msg.id, msg.content)}
                            className="p-1.5 rounded-lg border text-xs font-mono smooth-transition hover:opacity-80 flex items-center gap-1"
                            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] text-emerald-500 font-bold">{t.advisory.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px]">{t.advisory.copyAnswer}</span>
                              </>
                            )}
                          </button>

                          {/* Thumbs Up / Down Feedback */}
                          <div className="flex items-center rounded-lg border p-0.5" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                            <button
                              onClick={() => handleRateFeedback(msg.id, "up")}
                              className={`p-1 rounded-md transition-colors ${
                                ratedMsgIds[msg.id] === "up" ? "bg-emerald-500/20 text-emerald-500 font-bold" : "text-muted hover:text-primary"
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRateFeedback(msg.id, "down")}
                              className={`p-1 rounded-md transition-colors ${
                                ratedMsgIds[msg.id] === "down" ? "bg-red-500/20 text-red-500 font-bold" : "text-muted hover:text-primary"
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md"
                    style={{ background: "rgba(0, 255, 157, 0.15)", border: "1px solid rgba(0, 255, 157, 0.35)", color: "#00FF9D" }}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))
          )}

          {/* Loading Animation */}
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: chatMode === "multi" ? "rgba(230,175,46,0.2)" : "rgba(0,255,157,0.2)",
                  border: `1px solid ${chatMode === "multi" ? "rgba(230,175,46,0.4)" : "rgba(0,255,157,0.4)"}`,
                }}
              >
                <Bot className="w-4 h-4" style={{ color: chatMode === "multi" ? "#E6AF2E" : "#00FF9D" }} />
              </div>
              <div
                className="p-4 rounded-3xl border flex items-center gap-3 glass-card shadow-md"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-xs font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                  {chatMode === "multi"
                    ? L(language, "Querying LLaMA + GPT-4o Mini + Gemini consensus engine...", "ආකෘති 3ක සම්මුතිය විශ්ලේෂණය කරමින්...", "3 மாதிரி ஒருமித்த பகுப்பாய்வு...")
                    : L(language, "Searching knowledge base...", "විශ්ලේෂණය කරමින් පවතී...", "தகவல் தளத்தை தேடுகிறது...")}
                </span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar & Voice Controls (Sticky floating at the bottom) */}
        <div
          className="sticky bottom-4 z-30 glass-panel p-3 sm:p-4 rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col gap-2 mt-auto"
          style={{
            borderColor: transcribedHighlight ? "rgba(102,187,106,0.6)" : "var(--card-border)",
            background: theme === "dark" ? "rgba(10, 20, 14, 0.88)" : "rgba(255, 255, 255, 0.92)",
          }}
        >
          {/* Editing banner */}
          {editingMsg && (
            <div
              className="px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center justify-between gap-2"
              style={{ background: "rgba(230,175,46,0.1)", borderColor: "rgba(230,175,46,0.35)", color: theme === "dark" ? "#E6AF2E" : "#B45309" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Edit3 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-bold whitespace-nowrap">{L(language, "Editing Question", "ප්‍රශ්නය සංස්කරණය කිරීම", "கேள்வியைத் திருத்துகிறது")}</span>
                <span className="truncate opacity-75">&quot;{editingMsg.content}&quot;</span>
              </div>
              <button onClick={cancelEdit} className="p-0.5 hover:opacity-70">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Transcribed Highlight Banner */}
          {transcribedHighlight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-2 font-medium"
              style={{ background: "rgba(102,187,106,0.12)", borderColor: "rgba(102,187,106,0.35)", color: theme === "dark" ? "#66BB6A" : "#2E7D32" }}
            >
              <Mic className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{L(language, "Transcribed from voice — tap send or edit", "හඬින් පරිවර්තනය විය — යැවීමට තට්ටු කරන්න හෝ සංස්කරණය කරන්න", "குரலிலிருந்து பெறப்பட்டது — அனுப்ப தட்டவும் அல்லது திருத்தவும்")}</span>
            </motion.div>
          )}

          {/* STT error */}
          {sttError && (
            <div className="px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center justify-between gap-2" style={{ background: "rgba(239,83,80,0.1)", borderColor: "rgba(239,83,80,0.35)", color: "#EF5350" }}>
              <span>{sttError}</span>
              <button onClick={() => setSttError(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Microphone STT Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || isLoading}
              className={`p-3 rounded-2xl smooth-transition flex items-center justify-center shadow-md relative ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : isTranscribing
                  ? "bg-amber-500/20 text-amber-500"
                  : "hover:scale-105"
              }`}
              style={{
                background: !isRecording && !isTranscribing ? "rgba(230,175,46,0.15)" : undefined,
                color: !isRecording && !isTranscribing ? "#E6AF2E" : undefined,
                border: !isRecording && !isTranscribing ? "1px solid rgba(230,175,46,0.3)" : undefined,
              }}
              title={isRecording ? "Stop Recording" : "Speak to AI Advisor"}
            >
              {isTranscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRecording ? (
                <div className="flex items-center gap-1.5 font-mono text-xs px-1 font-bold">
                  <MicOff className="w-4 h-4" />
                  <span>{recordingSeconds}s</span>
                </div>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Query Input Box */}
            <input
              ref={textInputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (transcribedHighlight) setTranscribedHighlight(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage();
                if (e.key === "Escape" && editingMsgId) cancelEdit();
              }}
              placeholder={
                isRecording
                  ? t.advisory.listening
                  : isTranscribing
                  ? t.advisory.transcribing
                  : t.advisory.chatPlaceholder
              }
              disabled={isRecording || isTranscribing}
              className="flex-1 bg-transparent text-xs sm:text-sm outline-none px-3 py-2 font-mono"
              style={{ color: "var(--text-primary)" }}
            />

            {/* Send Button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || isRecording}
              className="p-3 rounded-2xl smooth-transition disabled:opacity-40 shadow-lg flex items-center justify-center font-bold"
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg, #E6AF2E, #00FF9D)"
                  : "var(--card-bg)",
                color: input.trim() ? "#030705" : "var(--text-muted)",
              }}
            >
              {editingMsgId ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Chat History Slide-Over Drawer */}
      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        currentSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllHistory}
      />
    </main>
    </AuthGuard>
  );
}

export default function AdvisoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030705]" />}>
      <AdvisoryContent />
    </Suspense>
  );
}
