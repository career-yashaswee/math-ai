/**
 * Registry of all audio assets used in the application.
 * Values point to MP3 files located in the /public/assets/sfx directory.
 */
export const AUDIO_ASSETS = {
  /** Main button click sound */
  CLICK: "/assets/sfx/click.mp3",
  /** Success feedback sound */
  SUCCESS: "/assets/sfx/success.mp3",
  /** Error/Warning feedback sound */
  ERROR: "/assets/sfx/error.mp3",
} as const;

export type AudioKey = keyof typeof AUDIO_ASSETS;
