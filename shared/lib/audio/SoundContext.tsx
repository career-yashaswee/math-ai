"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SoundContextType {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY_VOLUME = "math-ai-volume";
const STORAGE_KEY_MUTED = "math-ai-muted";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMutedState] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
    const savedMuted = localStorage.getItem(STORAGE_KEY_MUTED);

    if (savedVolume !== null) setVolumeState(parseFloat(savedVolume));
    if (savedMuted !== null) setIsMutedState(savedMuted === "true");
  }, []);

  const setVolume = (v: number) => {
    const newVolume = Math.min(Math.max(v, 0), 1);
    setVolumeState(newVolume);
    localStorage.setItem(STORAGE_KEY_VOLUME, newVolume.toString());
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMutedState(newMuted);
    localStorage.setItem(STORAGE_KEY_MUTED, newMuted.toString());
  };

  return (
    <SoundContext.Provider value={{ volume, isMuted, setVolume, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundSettings must be used within a SoundProvider");
  }
  return context;
}
