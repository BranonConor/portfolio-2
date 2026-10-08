export const BOOT_AUDIO_SRC = "/boot-intro/game-boy-boot.mp3";

const BPM = 2000;
const BEATS_PER_MEASURE = 4;
const BEAT_MS = 60_000 / BPM;
const MEASURE_MS = BEAT_MS * BEATS_PER_MEASURE;

/**
 * Measured from the committed 44.1 kHz MP3:
 * - decoded duration: 9,456.3 ms
 * - first audible content: ~30 ms
 * - next strong attack: ~150 ms (one literal 2000 BPM measure later)
 * - prominent DING onset / local peak: ~2,435 / 2,455 ms
 * - audible tail below -60 dB: ~5,305 ms
 *
 * The remaining file duration is effectively silence, so navigation can
 * happen after the musical tail without waiting through encoder padding.
 */
const AUDIO_CONTENT_START_MS = 30;
const AUDIO_DING_ONSET_MS = 2435;
const AUDIO_TAIL_END_MS = 5305;

const CARTRIDGE_FLIGHT_MS = 460;
const CONSOLE_ZOOM_MS = 580;
const SCREEN_ON_FLASH_MS = 420;
export const BOOT_TIMELINE = {
  bpm: BPM,
  beatMs: BEAT_MS,
  measureMs: MEASURE_MS,
  cartridgeFlightMs: CARTRIDGE_FLIGHT_MS,
  consoleZoomMs: CONSOLE_ZOOM_MS,
  screenOnFlashMs: SCREEN_ON_FLASH_MS,
  screenOffFlashMs: 360,
  reverseUiRevealDelayMs: 420,
  audioContentStartMs: AUDIO_CONTENT_START_MS,
  letterEntranceDurationMs: BEAT_MS,
  letterSequenceDurationMs: MEASURE_MS,
  dingFromLogoRevealMs: AUDIO_DING_ONSET_MS - AUDIO_CONTENT_START_MS,
  sweepDurationMs: 650,
  navigateFromLogoRevealMs:
    AUDIO_TAIL_END_MS - AUDIO_CONTENT_START_MS + MEASURE_MS,
} as const;

export function getLogoRevealDelayMs(hasCartridgeFlight: boolean) {
  return (
    (hasCartridgeFlight ? BOOT_TIMELINE.cartridgeFlightMs : 0) +
    BOOT_TIMELINE.consoleZoomMs +
    BOOT_TIMELINE.screenOnFlashMs
  );
}

export function getAudioStartDelayMs(hasCartridgeFlight: boolean) {
  return (
    getLogoRevealDelayMs(hasCartridgeFlight) -
    BOOT_TIMELINE.audioContentStartMs
  );
}

export function getLetterStaggerMs(visibleLetterCount: number) {
  if (visibleLetterCount <= 1) return 0;

  return (
    (BOOT_TIMELINE.letterSequenceDurationMs -
      BOOT_TIMELINE.letterEntranceDurationMs) /
    (visibleLetterCount - 1)
  );
}
