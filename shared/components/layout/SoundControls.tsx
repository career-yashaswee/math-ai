"use client";

import { useSoundSettings } from "@/shared/lib/audio/SoundContext";
import { Button } from "@/components/core";
import { Volume2, VolumeX } from "lucide-react";

export function SoundControls() {
  const { volume, isMuted, setVolume, toggleMute } = useSoundSettings();

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-secondary/30 border border-border/50">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={toggleMute}
        disableSound // Don't play click sound when muting
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        aria-label="Volume"
      />
    </div>
  );
}
