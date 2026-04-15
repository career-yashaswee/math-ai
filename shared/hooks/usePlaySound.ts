"use client";

import useSound from "use-sound";
import { useSoundSettings } from "@/shared/lib/audio/SoundContext";
import { AUDIO_ASSETS, type AudioKey } from "@/shared/constants/audio";

/**
 * Hook to play a sound from the audio library.
 * Automatically respects global volume and mute settings.
 */
export function usePlaySound(audioKey: AudioKey) {
  const { volume, isMuted } = useSoundSettings();

  const [play] = useSound(AUDIO_ASSETS[audioKey], {
    volume: isMuted ? 0 : volume,
    format: ["mp3"],
  });

  return play;
}
