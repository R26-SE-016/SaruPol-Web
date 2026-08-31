"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { MessageCircle, Send, Mic, MicOff, Volume2, Globe, Bot, User, Sparkles } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  reliability?: string;
  model?: string;
  timestamp: Date;
}

export default function AdvisoryPage() {
  const { t, language, setLanguage } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate RAG response
    await new Promise(r => setTimeout(r, 2000));

    let answer = "Welcome to the SaruPol AI Advisor! I can help with coconut plantation management, disease control, soil nutrients, and yield forecasts.";
    let sources = ["SaruPol General Knowledge Base"];
    const lowerText = text.toLowerCase();

    if (lowerText.includes("bud rot") || lowerText.includes("rot") || lowerText.includes("කුණු") || lowerText.includes("அழுகல்")) {
      answer = "**Bud Rot (Phytophthora palmivora)**\n\n**Treatment Protocol:**\n1. Cut off and destroy all infected crown tissues immediately\n2. Apply Bordeaux paste or copper oxychloride paste to cut surfaces\n3. Spray neighboring palms with Mancozeb (4g/L) prophylactically\n4. Ensure adequate soil drainage around the palm base\n\n*Reference: CRI Disease Advisory Leaflet No. 4*";
      sources = ["CRI Disease Advisory Leaflet No. 4", "Coconut Cultivation Handbook - Section 12"];
    } else if (lowerText.includes("fertilizer") || lowerText.includes("npk") || lowerText.includes("පොහොර") || lowerText.includes("உர")) {
      answer = "**CRI Fertilizer Recommendation for Adult Palms (8+ yrs):**\n\n• Urea: 800g / palm / year\n• Eppawala Rock Phosphate (ERP): 600g / palm / year\n• Muriate of Potash (MOP): 1600g / palm / year\n• Agricultural Dolomite: 1000g / palm / year\n\nApply in split doses during the monsoon rainy season for optimum root absorption.\n\n*Reference: CRI Soils & Nutrition Circular A1*";
      sources = ["CRI Soils & Plant Nutrition Advisory Circular No. A1"];
    } else if (lowerText.includes("bleeding") || lowerText.includes("ලේ") || lowerText.includes("வடியல்")) {
      answer = "**Stem Bleeding (Ceratocystis paradoxa):**\n\n1. Scrape off the bleeding patch with a sterilized chisel down to healthy tissue\n2. Paint the scraped wound with Coal Tar or Copper Fungicide paste\n3. Improve estate drainage to eliminate waterlogging\n\n*Reference: CRI Stem Bleeding Advisory*";
      sources = ["CRI Pathology Technical Bulletin 2026"];
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: answer,
      sources,
      reliability: "High",
      model: "Multi-LLM Consensus",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const toggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput(t.advisory.suggestedQuestions[0]);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-4 relative z-10 flex-1 flex flex-col w-full">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(230,175,46,0.15)" }}>
                <MessageCircle className="w-5 h-5" style={{ color: "#E6AF2E" }} />
              </div>
              <div>
                <h1 className="text-2xl font-normal" style={{ fontFamily: "var(--font-outfit)", color: "var(--text-primary)" }}>{t.advisory.title}</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "#E6AF2E" }}>
                  {t.advisory.subtitle}
                </p>
              </div>
            </div>
            {/* Language Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl border smooth-transition" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className="px-3 py-1 rounded-lg text-xs font-mono smooth-transition"
                  style={{
                    background: language === lang.code ? "rgba(230,175,46,0.25)" : "transparent",
                    color: language === lang.code ? "#E6AF2E" : "var(--text-secondary)",
                    fontWeight: language === lang.code ? "700" : "400",
                  }}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
              <Sparkles className="w-10 h-10 mb-4" style={{ color: "rgba(230,175,46,0.6)" }} />
              <p className="text-sm mb-6 font-medium" style={{ color: "var(--text-secondary)" }}>
                {t.advisory.title}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
                {t.advisory.suggestedQuestions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-4 py-3 rounded-xl text-xs font-mono smooth-transition hover:border-amber-500/50 glass-card"
                    style={{
                      color: "var(--text-secondary)"
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: "rgba(230,175,46,0.15)" }}
                >
                  <Bot className="w-3.5 h-3.5" style={{ color: "#E6AF2E" }} />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                style={{
                  background: msg.role === "user" ? "rgba(0,255,157,0.12)" : "var(--card-bg)",
                  border: `1px solid ${msg.role === "user" ? "rgba(0,255,157,0.25)" : "var(--card-border)"}`,
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-normal" style={{ color: "var(--text-primary)" }}>
                  {msg.content}
                </p>
                {msg.sources && (
                  <div className="mt-3 pt-2 border-t" style={{ borderColor: "var(--card-border)" }}>
                    <p className="text-[9px] uppercase tracking-wider font-mono mb-1" style={{ color: "#E6AF2E" }}>
                      {t.advisory.consensusVerified}
                    </p>
                    {msg.sources.map((s, i) => (
                      <span key={i} className="text-[10px] font-mono mr-2" style={{ color: "var(--text-muted)" }}>
                        [{i + 1}] {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: "rgba(0,255,157,0.15)" }}
                >
                  <User className="w-3.5 h-3.5" style={{ color: "#00FF9D" }} />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(230,175,46,0.15)" }}>
                <Bot className="w-3.5 h-3.5" style={{ color: "#E6AF2E" }} />
              </div>
              <div className="p-4 rounded-2xl border flex items-center gap-2" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-mono ml-2" style={{ color: "var(--text-muted)" }}>Consulting CRI Multi-LLM RAG...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="glass-panel p-3 flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl smooth-transition ${isListening ? "bg-red-500/20 text-red-500" : "hover:bg-black/5"}`}
            style={{ color: isListening ? "#FF4C4C" : "var(--text-secondary)" }}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={isListening ? t.advisory.listening : t.advisory.chatPlaceholder}
            className="flex-1 bg-transparent text-sm outline-none px-2 font-mono"
            style={{ color: "var(--text-primary)" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl smooth-transition"
            style={{
              background: input.trim() ? "linear-gradient(135deg, #E6AF2E, #00FF9D)" : "var(--card-bg)",
              color: input.trim() ? "#030705" : "var(--text-muted)",
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
