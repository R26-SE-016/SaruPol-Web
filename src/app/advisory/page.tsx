"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { MessageCircle, Send, Mic, MicOff, Volume2, Globe, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  reliability?: string;
  model?: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "What fertilizer schedule for adult palms during rainy season?",
  "How to treat Bud Rot in coconut trees?",
  "Best practices for coconut seedling care",
  "Recommended NPK ratio for dry zone palms",
];

export default function AdvisoryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
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
    await new Promise(r => setTimeout(r, 2500));

    let answer = "Welcome to the SaruPol AI Advisor! I can help with coconut plantation management, disease control, soil nutrients, and yield forecasts.";
    let sources = ["SaruPol General Knowledge Base"];
    const lowerText = text.toLowerCase();

    if (lowerText.includes("bud rot") || lowerText.includes("rot")) {
      answer = "**Bud Rot** is a critical fungal disease caused by *Phytophthora palmivora*. It leads to rotting of the spindle leaf and heart bud.\n\n**Treatment Plan:**\n1. Cut off and destroy all infected crown tissues immediately\n2. Apply Bordeaux paste or copper oxychloride paste to cut surfaces\n3. Spray neighboring palms with Mancozeb (4g/L) prophylactically\n4. Ensure good drainage around the palm base\n\n*Source: CRI Disease Advisory Leaflet No. 4*";
      sources = ["CRI Disease Advisory Leaflet No. 4", "Coconut Cultivation Handbook - Section 12"];
    } else if (lowerText.includes("fertilizer") || lowerText.includes("npk")) {
      answer = "For **adult palms** (8+ years), the CRI recommends per palm per year:\n\n| Fertilizer | Amount |\n|---|---|\n| Urea | 800g |\n| Eppawala Rock Phosphate | 600g |\n| Muriate of Potash | 1600g |\n| Dolomite | 1000g |\n\nApply in split doses during the rainy season (May-June and Oct-Nov) for optimal absorption.\n\n*Source: CRI Advisory Circular A1*";
      sources = ["CRI Soils & Plant Nutrition Advisory Circular No. A1"];
    } else if (lowerText.includes("seedling") || lowerText.includes("young")) {
      answer = "For **young palms** (1-4 years), focus on:\n\n1. **Watering**: 40-50 liters per seedling every 3 days during dry periods\n2. **Mulching**: Apply 10cm thick organic mulch around the base (1.5m radius)\n3. **Fertilizer**: Urea 250g + TSP 350g per palm per year, applied in 2 splits\n4. **Weed Control**: Keep a 2m circle weed-free around each seedling\n5. **Protection**: Install wire mesh if cattle grazing is present\n\n*Source: CRI Young Palm Care Guidelines*";
      sources = ["CRI Young Palm Care Guidelines", "Coconut Cultivation Handbook"];
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
      // Web Speech API placeholder
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput("What is the recommended fertilizer for coconut palms?");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const langLabels: Record<string, string> = { en: "English", si: "සිංහල", ta: "தமிழ்" };

  return (
    <main className="min-h-screen relative flex flex-col">
      <Navbar />
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-4 relative z-10 flex-1 flex flex-col w-full">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(230,175,46,0.1)" }}>
                <MessageCircle className="w-5 h-5" style={{ color: "#E6AF2E" }} />
              </div>
              <div>
                <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>Advisory AI</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(230,175,46,0.5)" }}>
                  Multi-LLM Consensus RAG Engine
                </p>
              </div>
            </div>
            {/* Language Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {(["en", "si", "ta"] as const).map(lang => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className="px-3 py-1 rounded-full text-[10px] font-mono smooth-transition"
                  style={{
                    background: language === lang ? "rgba(230,175,46,0.15)" : "transparent",
                    color: language === lang ? "#E6AF2E" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
              <Sparkles className="w-10 h-10 mb-4" style={{ color: "rgba(230,175,46,0.2)" }} />
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
                Ask any question about coconut plantation management
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                {QUICK_PROMPTS.map(prompt => (
                  <button key={prompt} onClick={() => sendMessage(prompt)}
                    className="text-left px-3 py-2 rounded-xl text-xs smooth-transition"
                    style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(232,239,232,0.5)"
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
                  style={{ background: "rgba(230,175,46,0.1)" }}
                >
                  <Bot className="w-3.5 h-3.5" style={{ color: "#E6AF2E" }} />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                style={{
                  background: msg.role === "user" ? "rgba(0,255,157,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${msg.role === "user" ? "rgba(0,255,157,0.12)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(232,239,232,0.8)" }}>
                  {msg.content}
                </p>
                {msg.sources && (
                  <div className="mt-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] uppercase tracking-wider font-mono mb-1" style={{ color: "rgba(230,175,46,0.4)" }}>Sources</p>
                    {msg.sources.map((s, i) => (
                      <span key={i} className="text-[10px] font-mono mr-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                        [{i + 1}] {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: "rgba(0,255,157,0.08)" }}
                >
                  <User className="w-3.5 h-3.5" style={{ color: "#00FF9D" }} />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(230,175,46,0.1)" }}>
                <Bot className="w-3.5 h-3.5" style={{ color: "#E6AF2E" }} />
              </div>
              <div className="p-4 rounded-2xl rounded-bl-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full loading-dot" style={{ background: "rgba(230,175,46,0.5)" }} />
                  <div className="w-2 h-2 rounded-full loading-dot" style={{ background: "rgba(230,175,46,0.5)" }} />
                  <div className="w-2 h-2 rounded-full loading-dot" style={{ background: "rgba(230,175,46,0.5)" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="sticky bottom-4 flex items-center gap-2 p-2 rounded-2xl"
          style={{
            background: "rgba(8, 20, 14, 0.9)",
            border: "1px solid rgba(0,255,157,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <button onClick={toggleVoice}
            className="p-2.5 rounded-xl smooth-transition"
            style={{
              background: isListening ? "rgba(255,76,76,0.15)" : "rgba(255,255,255,0.04)",
              color: isListening ? "#FF4C4C" : "rgba(255,255,255,0.3)",
            }}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={`Ask in ${langLabels[language]}...`}
            className="flex-1 bg-transparent text-sm outline-none px-2"
            style={{ color: "#e8efe8" }}
          />

          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl smooth-transition"
            style={{
              background: input.trim() ? "rgba(0,255,157,0.12)" : "rgba(255,255,255,0.03)",
              color: input.trim() ? "#00FF9D" : "rgba(255,255,255,0.15)",
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </main>
  );
}
