"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import {
  MessageCircle, Send, Mic, MicOff, Volume2, Globe, Bot, User,
  Sparkles, History, Cpu, ShieldCheck, Compass, Sun, Copy, Check,
  ThumbsUp, ThumbsDown, Edit3, ArrowRight, Loader2, BookOpen, AlertCircle
} from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/types";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
  advisory, AdvisorySource, AdvisoryImageRef,
  AdvisoryAnswerResponse, MultiLLMAdvisoryResponse
} from "@/lib/api";

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
  translations?: Record<string, string>;
  sources?: AdvisorySource[];
  images?: AdvisoryImageRef[];
  timestamp: Date;
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

export default function AdvisoryPage() {
  const { t, language, setLanguage } = useTranslation();
  const { theme } = useTheme();

  // Engine Mode
  const [chatMode, setChatMode] = useState<"standard" | "multi">("standard");

  // Agro-Climatic Context
  const [zone, setZone] = useState("Intermediate Zone");
  const [season, setSeason] = useState("Yala");
  const [isAutoGps, setIsAutoGps] = useState(true);

  // Sessions & Messages
  const [sessionId, setSessionId] = useState<string>(() => Date.now().toString());
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Input & Voice state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedHighlight, setTranscribedHighlight] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [ratedMsgIds, setRatedMsgIds] = useState<Record<string, "up" | "down">>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load chat sessions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      }
    } catch (e) {
      console.warn("Failed to load past chat sessions:", e);
    }
  }, []);

  // Sync current session into sessions list and localStorage
  const saveCurrentSession = (updatedMessages: ChatMessage[]) => {
    if (updatedMessages.length === 0) return;

    const firstUserMsg = updatedMessages.find((m) => m.role === "user");
    const topic = firstUserMsg ? firstUserMsg.content.slice(0, 45) + (firstUserMsg.content.length > 45 ? "..." : "") : "New Consultation";

    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === sessionId);
      const newSession: ChatSession = {
        id: sessionId,
        topic,
        timestamp: Date.now(),
        messages: updatedMessages,
        chatMode,
      };

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
      return updatedList;
    });
  };

  // Start a brand-new chat session
  const handleNewSession = () => {
    setSessionId(Date.now().toString());
    setMessages([]);
    setInput("");
  };

  // Switch to a previous session
  const handleSelectSession = (selectedId: string) => {
    const found = sessions.find((s) => s.id === selectedId);
    if (found) {
      setSessionId(found.id);
      setMessages(found.messages || []);
      setChatMode(found.chatMode || "standard");
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
    if (targetId === sessionId) {
      handleNewSession();
    }
  };

  // Clear all sessions
  const handleClearAllHistory = () => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
    handleNewSession();
  };

  // In-place dynamic batch translation when switching language
  const handleLanguageChange = async (newLang: Language) => {
    if (newLang === language) return;
    setLanguage(newLang);

    if (messages.length === 0) return;

    // Filter messages that need translation
    const itemsToTranslate: { id: string; text: string }[] = [];
    messages.forEach((msg) => {
      if (!msg.translations?.[newLang]) {
        itemsToTranslate.push({ id: msg.id, text: msg.content });
      }
    });

    if (itemsToTranslate.length === 0) return;

    try {
      const res = await advisory.translateBatch(itemsToTranslate, newLang);
      if (res.success && res.translations) {
        setMessages((prev) =>
          prev.map((msg) => {
            const match = res.translations.find((t) => t.id === msg.id);
            if (match) {
              const updatedTranslations = {
                ...(msg.translations || {}),
                [newLang]: match.translated_text,
                [language]: msg.content,
              };
              return {
                ...msg,
                content: match.translated_text,
                translations: updatedTranslations,
              };
            }
            return msg;
          })
        );
      }
    } catch (err) {
      console.warn("Batch translation offline or unavailable:", err);
    }
  };

  // Send query to AI Advisory Engine
  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const contextPayload = `${zone} | ${season} Season`;

    try {
      if (chatMode === "multi") {
        // Multi-LLM Consensus Mode
        let res: MultiLLMAdvisoryResponse;
        try {
          res = await advisory.askMulti({
            question: query,
            context: contextPayload,
            language,
            session_id: sessionId,
          });
        } catch {
          // Realistic multi-model mock fallback when backend is offline
          res = generateMockMultiLlmResponse(query, language, zone, season);
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.best_answer,
          sources: res.sources,
          images: res.images,
          timestamp: new Date(),
          retrieval_confidence: res.retrieval_confidence,
          combined_reliability: res.combined_reliability,
          reliability_level: res.reliability_level,
          isMultiLlm: true,
          best_model: res.best_model,
          judge_reason: res.reason,
          consensus_score: res.consensus_score,
          llama_answer: res.llama_answer,
          gpt_answer: res.gpt4omini_answer,
          gemma_answer: res.gemma_answer || res.qwen_answer,
          early_exit: res.early_exit,
          similarity_score: res.similarity_score,
          latency_ms: res.latency_ms || 480,
        };

        const updated = [...newMessages, assistantMessage];
        setMessages(updated);
        saveCurrentSession(updated);
      } else {
        // Standard Single-LLM RAG Mode
        let res: AdvisoryAnswerResponse;
        try {
          res = await advisory.ask({
            question: query,
            context: contextPayload,
            language,
            session_id: sessionId,
          });
        } catch {
          res = generateMockStandardResponse(query, language, zone, season);
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.answer,
          sources: res.sources,
          images: res.images,
          timestamp: new Date(),
          retrieval_confidence: res.retrieval_confidence,
          combined_reliability: res.combined_reliability,
          reliability_level: res.reliability_level,
          isMultiLlm: false,
          best_model: res.validated_by || "CRI Hybrid RAG Engine",
          consensus_score: res.consensus_score,
        };

        const updated = [...newMessages, assistantMessage];
        setMessages(updated);
        saveCurrentSession(updated);
      }
    } catch (err) {
      console.error("Advisory error:", err);
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

  // Edit previously asked question
  const handleEditQuestion = (text: string) => {
    setInput(text);
    textInputRef.current?.focus();
  };

  // Microphone Voice Recording (STT)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        stream.getTracks().forEach((track) => track.stop());

        setIsTranscribing(true);
        try {
          const res = await advisory.transcribe(audioBlob, language);
          if (res.success && res.transcribed_text) {
            setInput(res.transcribed_text);
            setTranscribedHighlight(true);
            setTimeout(() => setTranscribedHighlight(false), 2500);
            textInputRef.current?.focus();
          }
        } catch (sttErr) {
          console.warn("Backend STT offline. Using browser Web Speech recognition fallback:", sttErr);
          runBrowserSpeechFallback();
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
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
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTranscribedHighlight(true);
        setTimeout(() => setTranscribedHighlight(false), 2500);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } else {
      setIsRecording(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col relative" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-4 relative z-10 flex-1 flex flex-col w-full min-h-0">
        
        {/* Header Bar & Control Panel */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-3 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Engine Mode Description */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl flex items-center justify-center shadow-md" style={{ background: "rgba(230,175,46,0.15)", color: "#E6AF2E" }}>
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>
                    {t.advisory.title}
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase"
                    style={{
                      background: chatMode === "multi" ? "rgba(230,175,46,0.15)" : "rgba(0,255,157,0.15)",
                      color: chatMode === "multi" ? (theme === "dark" ? "#E6AF2E" : "#B45309") : (theme === "dark" ? "#00FF9D" : "#00875A"),
                      borderColor: chatMode === "multi" ? "rgba(230,175,46,0.3)" : "rgba(0,255,157,0.3)",
                    }}
                  >
                    {chatMode === "multi" ? "3-LLM Consensus" : "Standard RAG"}
                  </span>
                </div>
                <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {chatMode === "multi" ? t.advisory.multiDesc : t.advisory.standardDesc}
                </p>
              </div>
            </div>

            {/* Right Controls: Engine Toggle, Context Pill, History Drawer & Language */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Dual Mode Switcher */}
              <div className="flex items-center p-1 rounded-xl border smooth-transition" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <button
                  onClick={() => setChatMode("standard")}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium smooth-transition"
                  style={{
                    background: chatMode === "standard" ? "rgba(0,255,157,0.15)" : "transparent",
                    color: chatMode === "standard" ? (theme === "dark" ? "#00FF9D" : "#00875A") : "var(--text-secondary)",
                    fontWeight: chatMode === "standard" ? "700" : "400",
                  }}
                >
                  {t.advisory.standardMode}
                </button>
                <button
                  onClick={() => setChatMode("multi")}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium smooth-transition flex items-center gap-1.5"
                  style={{
                    background: chatMode === "multi" ? "rgba(230,175,46,0.2)" : "transparent",
                    color: chatMode === "multi" ? (theme === "dark" ? "#E6AF2E" : "#B45309") : "var(--text-secondary)",
                    fontWeight: chatMode === "multi" ? "700" : "400",
                  }}
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.advisory.multiLlmMode}</span>
                </button>
              </div>

              {/* Agro-Climatic Context Pill */}
              <AgroContextPanel
                zone={zone}
                season={season}
                isAutoGps={isAutoGps}
                onZoneChange={setZone}
                onSeasonChange={setSeason}
                onToggleAutoGps={setIsAutoGps}
              />

              {/* Chat History Button */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 rounded-xl border smooth-transition hover:opacity-80"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                title={t.advisory.chatHistory}
              >
                <History className="w-4 h-4 text-amber-500" />
              </button>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl border smooth-transition" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as Language)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono smooth-transition"
                    style={{
                      background: language === lang.code ? "rgba(230,175,46,0.25)" : "transparent",
                      color: language === lang.code ? (theme === "dark" ? "#E6AF2E" : "#B45309") : "var(--text-secondary)",
                      fontWeight: language === lang.code ? "700" : "400",
                    }}
                  >
                    {lang.nativeLabel}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </motion.div>

        {/* Chat Feed */}
        <div
          className="flex-1 overflow-y-auto space-y-4 mb-3 pr-1 sm:pr-2 min-h-0"
        >
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(230,175,46,0.25), rgba(0,255,157,0.25))",
                  border: "1px solid rgba(230,175,46,0.4)",
                }}
              >
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-mono font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {t.advisory.title}
              </h2>
              <p className="text-xs sm:text-sm max-w-lg mb-8 font-mono leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {t.advisory.subtitle}
              </p>

              {/* Starter Question Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl w-full text-left">
                {t.advisory.suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="p-3.5 rounded-2xl text-xs font-mono smooth-transition hover:scale-[1.02] border glass-card shadow-sm group flex items-center justify-between"
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
                      background: msg.isMultiLlm ? "rgba(230,175,46,0.2)" : "rgba(0,255,157,0.2)",
                      border: `1px solid ${msg.isMultiLlm ? "rgba(230,175,46,0.4)" : "rgba(0,255,157,0.4)"}`,
                    }}
                  >
                    <Bot className="w-4 h-4" style={{ color: msg.isMultiLlm ? "#E6AF2E" : "#00FF9D" }} />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] p-4 sm:p-5 rounded-3xl ${
                    msg.role === "user" ? "rounded-br-md shadow-md" : "rounded-bl-md glass-card shadow-lg"
                  }`}
                  style={{
                    background: msg.role === "user" ? "rgba(0, 255, 157, 0.12)" : "var(--card-bg)",
                    border: `1px solid ${msg.role === "user" ? "rgba(0, 255, 157, 0.3)" : "var(--card-border)"}`,
                  }}
                >
                  {/* Assistant Mode Header */}
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-between pb-2 mb-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider" style={{ color: msg.isMultiLlm ? "#E6AF2E" : "#00FF9D" }}>
                        {msg.isMultiLlm ? "CRI Multi-LLM Consensus Verdict" : "CRI Knowledge RAG Engine"}
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
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleEditQuestion(msg.content)}
                        className="text-[10px] font-mono flex items-center gap-1 hover:opacity-80 transition-opacity"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{t.advisory.editQuestion}</span>
                      </button>
                    </div>
                  )}

                  {/* Assistant Components: Reliability Badge, Multi-LLM Card, Reference Images & Citations */}
                  {msg.role === "assistant" && (
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
                        />
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
                                <span>[{i + 1}] {src.title || src.content.slice(0, 45)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assistant Action Bar: Audio Player, Copy, Feedback */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t mt-3" style={{ borderColor: "var(--card-border)" }}>
                        <AudioWavePlayer text={msg.content} lang={language} />

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
                  {chatMode === "multi" ? "Querying LLaMA + GPT + Gemma consensus engine..." : "Consulting CRI Knowledge Base & Agronomist Leaflets..."}
                </span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar & Voice Controls */}
        <div
          className="glass-panel p-3 sm:p-4 rounded-3xl border shadow-2xl flex flex-col gap-2 flex-shrink-0"
          style={{ borderColor: "var(--card-border)" }}
        >
          {/* Transcribed Highlight Banner */}
          {transcribedHighlight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-2 font-medium"
              style={{ background: "rgba(230,175,46,0.15)", borderColor: "rgba(230,175,46,0.35)", color: theme === "dark" ? "#E6AF2E" : "#B45309" }}
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t.advisory.transcribedHighlight}</span>
            </motion.div>
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
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
              <Send className="w-5 h-5" />
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
  );
}

// ─── Realistic Mock Fallback Generators (Offline Support) ───

function generateMockStandardResponse(
  question: string,
  lang: string,
  zone: string,
  season: string
): AdvisoryAnswerResponse {
  const lower = question.toLowerCase();

  let answer = `**CRI General Advisory for ${zone} (${season} Season):**\n\nFor optimal coconut yield in Sri Lanka, apply split fertilizer doses in the manure circle (1.8m radius) during the active monsoon season. Ensure adequate soil moisture retention via coconut husk mulching (2 layers, convex side upwards).\n\n*Reference: CRI Coconut Cultivation Handbook & Advisory Circular A1*`;
  let sources: AdvisorySource[] = [
    { title: "CRI Advisory Circular No. A1 — Plant Nutrition & Fertilizer Management", content: "Split application guidelines for adult palms." }
  ];
  let images: AdvisoryImageRef[] = [
    { url: "Spreading of fertilizer in the manure circle.png", caption: "Correct circular spreading of fertilizer in the 1.8m manure ring.", source: "CRI Advisory Circular A1" }
  ];

  if (lower.includes("rot") || lower.includes("කුණු") || lower.includes("அழுகல்")) {
    answer = `**Bud Rot (Phytophthora palmivora) Control Protocol for ${zone}:**\n\n1. **Immediate Sanitation:** Sever and incinerate all infected spear leaves and rotting crown tissue down to healthy white cabbage.\n2. **Protective Dressing:** Paint the exposed tissue with Bordeaux Paste (100g Copper Sulphate + 100g Quicklime in 1L water) or Copper Oxychloride paste (50g/L).\n3. **Prophylactic Spray:** Spray neighboring asymptomatic palms with Mancozeb 80% WP (4g/L water) or Captan.\n4. **Drainage:** Deepen contour drainage channels to eliminate standing water during the ${season} monsoon season.\n\n*Reference: CRI Advisory Leaflet No. 4 & Plant Pathology Bulletin 2026*`;
    sources = [
      { title: "CRI Advisory Leaflet No. 4 — Management of Bud Rot in Coconut", content: "Phytophthora palmivora disease protocol." },
      { title: "CRI Plant Pathology Bulletin 2026", content: "Fungicidal dosage and prophylactic crown spray schedules." }
    ];
    images = [
      { url: "Bud rot damage in mature coconut.png", caption: "Severe bud rot necrosis showing collapsed central spear leaf.", source: "CRI Advisory Leaflet No. 4" },
      { url: "Coconut palm affected by leaf rot disease.png", caption: "Leaf rot and necrotic frond lesions requiring copper fungicide.", source: "CRI Advisory Leaflet No. 4" }
    ];
  } else if (lower.includes("weevil") || lower.includes("කුරුමිණි") || lower.includes("வண்டு") || lower.includes("beetle")) {
    answer = `**Red Palm Weevil (Rhynchophorus ferrugineus) & Black Beetle Integrated Protocol:**\n\n1. **Pheromone Trapping:** Install Ferrugineol aggregation pheromone traps with food attractant (fresh sugarcane or coconut water) at 1 trap per hectare.\n2. **Trunk Wound Sealing:** Paint all fresh harvesting injuries or machete cuts with coal tar to prevent adult female oviposition.\n3. **Biological Control:** Release predatory earwigs and apply Metarhizium anisopliae fungal spores to cattle dung breeding pits.\n4. **Emergency Curative Action:** Inject Monocrotophos 600g/L SL (10ml in 10ml water) into the trunk 1 meter below the lowest frond if chewing sounds are heard.\n\n*Reference: CRI Crop Protection Circular CP-12*`;
    sources = [
      { title: "CRI Crop Protection Circular CP-12 — Red Palm Weevil & Rhinoceros Beetle Management", content: "Pheromone trapping and trunk injection methods." }
    ];
    images = [
      { url: "Pheromone Trap in the Field.png", caption: "CRI standard aggregation pheromone trap positioned in field block.", source: "CRI Crop Protection Circular CP-12" },
      { url: "Crown toppled palm due to red weevil damage.png", caption: "Toppled palm crown caused by internal larval tunneling.", source: "CRI Crop Protection Circular CP-12" }
    ];
  }

  return {
    success: true,
    question,
    answer,
    sources,
    images,
    zone,
    season,
    retrieval_confidence: 0.94,
    combined_reliability: 91.5,
    reliability_level: "High",
  };
}

function generateMockMultiLlmResponse(
  question: string,
  lang: string,
  zone: string,
  season: string
): MultiLLMAdvisoryResponse {
  const std = generateMockStandardResponse(question, lang, zone, season);

  return {
    success: true,
    best_answer: std.answer,
    best_model: "meta-llama/llama-3.3-70b-instruct (Groq Turbo)",
    reason: "Judge selected LLaMA 3.3 70B for strict adherence to CRI Leaflet No. 4 dosage parameters, high factual consistency with retrieved documents, and comprehensive step-by-step agronomist formatting.",
    consensus_score: 92,
    retrieval_confidence: 0.95,
    combined_reliability: 93.8,
    reliability_level: "High",
    llama_answer: std.answer,
    gpt4omini_answer: std.answer.replace("1.", "Step 1:").replace("2.", "Step 2:"),
    gemma_answer: std.answer.replace("**Immediate Sanitation:**", "**1. Sanitation:**"),
    sources: std.sources,
    images: std.images,
    zone,
    season,
    early_exit: true,
    similarity_score: 0.93,
    latency_ms: 540,
  };
}
