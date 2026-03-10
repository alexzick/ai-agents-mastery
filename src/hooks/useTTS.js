import { useState, useRef, useEffect } from "react";

/**
 * Custom hook for ElevenLabs Text-to-Speech.
 * Reads API key from localStorage. Calls /api/tts server proxy.
 * Returns { speak, stop, isSpeaking, isAvailable }.
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const getApiKey = () => localStorage.getItem("elevenlabs-api-key");
  const isAvailable = Boolean(getApiKey());

  const speak = async (text) => {
    const apiKey = getApiKey();
    if (!apiKey || !text) return;
    stop();
    setIsSpeaking(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, apiKey }),
      });

      if (!res.ok) {
        console.error("TTS error:", res.status);
        setIsSpeaking(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      audio.play();
    } catch (err) {
      console.error("TTS fetch error:", err);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => () => stop(), []);

  return { speak, stop, isSpeaking, isAvailable };
}
