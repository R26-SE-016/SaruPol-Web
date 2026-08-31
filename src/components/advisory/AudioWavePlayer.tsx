"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react";
import { advisory } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface AudioWavePlayerProps {
  text: string;
  lang?: string;
}

export default function AudioWavePlayer({ text, lang }: AudioWavePlayerProps) {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const activeLang = lang || language;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const ttsUrl = advisory.getTtsUrl(text, activeLang);
      const audio = new Audio(ttsUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.onerror = () => {
        console.warn("Backend TTS stream unreachable. Falling back to Web Speech API...");
        // Web Speech API fallback
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const cleanText = text.replace(/[*#_`]/g, "").trim();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = activeLang === "si" ? "si-LK" : activeLang === "ta" ? "ta-LK" : "en-US";
          utterance.rate = 0.95;

          utterance.onstart = () => {
            setIsLoading(false);
            setIsPlaying(true);
          };
          utterance.onend = () => {
            setIsPlaying(false);
            setProgress(0);
          };
          utterance.onerror = () => {
            setIsLoading(false);
            setIsPlaying(false);
          };

          window.speechSynthesis.speak(utterance);
        } else {
          setIsLoading(false);
          setIsPlaying(false);
        }
      };

      await audio.play();
    } catch (err) {
      console.warn("Audio playback error, using Web Speech API fallback:", err);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#_`]/g, "").trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = activeLang === "si" ? "si-LK" : activeLang === "ta" ? "ta-LK" : "en-US";
        utterance.onstart = () => {
          setIsLoading(false);
          setIsPlaying(true);
        };
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(0);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border smooth-transition"
      style={{
        background: isPlaying ? "rgba(212, 175, 55, 0.15)" : "var(--card-bg)",
        borderColor: isPlaying ? "rgba(212, 175, 55, 0.4)" : "var(--card-border)",
      }}
    >
      <button
        onClick={handleTogglePlay}
        disabled={isLoading}
        className="flex items-center gap-1.5 text-xs font-mono font-medium smooth-transition hover:opacity-80"
        style={{ color: isPlaying ? "#E6AF2E" : "var(--text-primary)" }}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
        ) : isPlaying ? (
          <Pause className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" style={{ color: theme === "dark" ? "#E6AF2E" : "#B45309" }} />
        )}
        <span>{isPlaying ? t.advisory.pauseAudio : t.advisory.playAudio}</span>
      </button>

      {/* Animated sound wave bars when active */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 ml-1">
          <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse [animation-delay:0.1s]" />
          <span className="w-0.5 h-4 bg-amber-400 rounded-full animate-pulse [animation-delay:0.3s]" />
          <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]" />
          <span className="w-0.5 h-4 bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]" />
          <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-pulse [animation-delay:0.15s]" />
        </div>
      )}
    </div>
  );
}
