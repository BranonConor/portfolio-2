"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_AUDIO_SRC } from "./bootTimeline";

// Every call to useBootChime() (boot intro, the persistent mute button in
// the product layout, the photo carousel's click sound, etc.) creates its
// own independent AudioContext — but the *mute preference* needs to be one
// shared, persisted toggle so muting from any one of them silences all the
// others too, instead of each screen tracking its own separate on/off
// state. This module-level store (plus localStorage) is that single
// source of truth; every hook instance subscribes to it on mount and
// re-applies it to its own gain node whenever it changes anywhere.
const MUTE_STORAGE_KEY = "gba-sound-muted";
const muteListeners = new Set<(muted: boolean) => void>();
let sharedMuted = false;

function readStoredMute(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setSharedMuted(next: boolean) {
  sharedMuted = next;
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Ignore (private browsing / storage disabled) — the in-memory value
    // still keeps every currently-mounted instance in sync for this visit.
  }
  muteListeners.forEach((listener) => listener(next));
}

interface Chain {
  ctx: AudioContext;
}

interface BootPlayback {
  source: AudioBufferSourceNode | null;
  startedAt: number | null;
  pausedAtMs: number | null;
  active: boolean;
}

// A ~0.1s silent WAV, used purely to flip Mobile Safari's audio session
// category from "ambient" to "playback" — see the note in `unlock()` below.
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

/**
 * Owns the shared Web Audio graph. Navigation sounds remain lightweight
 * synthesized cues, while the boot sequence uses the user's committed MP3
 * as its authoritative clock.
 * Playback requires a user gesture (browsers block unrequested audio):
 * `unlock()` resumes the context for UI sounds, while `startBootTrack()`
 * schedules the decoded MP3 from the cartridge activation gesture.
 */
const BOOT_TRACK_GAIN = 0.18;

interface UseBootChimeOptions {
  preloadBootTrack?: boolean;
}

export function useBootChime({
  preloadBootTrack = false,
}: UseBootChimeOptions = {}) {
  const chainRef = useRef<Chain | null>(null);
  const bootBufferPromiseRef = useRef<Promise<AudioBuffer | null> | null>(null);
  const bootGainRef = useRef<GainNode | null>(null);
  const bootPlaybackRef = useRef<BootPlayback>({
    source: null,
    startedAt: null,
    pausedAtMs: null,
    active: false,
  });
  const mutedRef = useRef(sharedMuted);
  const [muted, setMuted] = useState(sharedMuted);
  const sessionUnlockElRef = useRef<HTMLAudioElement | null>(null);

  // Pick up the persisted preference on mount (sharedMuted is only known
  // once we're on the client), and stay in sync with every other mounted
  // instance's toggles for as long as this one stays mounted.
  useEffect(() => {
    const stored = readStoredMute();
    sharedMuted = stored;
    mutedRef.current = stored;
    setMuted(stored);
    if (bootGainRef.current) {
      bootGainRef.current.gain.value = stored ? 0 : BOOT_TRACK_GAIN;
    }

    const listener = (next: boolean) => {
      mutedRef.current = next;
      setMuted(next);
      if (bootGainRef.current) {
        bootGainRef.current.gain.value = next ? 0 : BOOT_TRACK_GAIN;
      }
    };
    muteListeners.add(listener);
    return () => {
      muteListeners.delete(listener);
    };
  }, []);

  const getChain = useCallback((): Chain | null => {
    if (chainRef.current) return chainRef.current;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();
    const chain = { ctx };
    chainRef.current = chain;
    return chain;
  }, []);

  const loadBootBuffer = useCallback(() => {
    if (bootBufferPromiseRef.current) return bootBufferPromiseRef.current;

    const chain = getChain();
    if (!chain) return Promise.resolve(null);

    bootBufferPromiseRef.current = fetch(BOOT_AUDIO_SRC)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Boot audio failed to load (${response.status})`);
        }
        return response.arrayBuffer();
      })
      .then((data) => chain.ctx.decodeAudioData(data))
      .catch((error) => {
        console.error(error);
        setSharedMuted(true);
        return null;
      });

    return bootBufferPromiseRef.current;
  }, [getChain]);

  useEffect(() => {
    if (preloadBootTrack) void loadBootBuffer();
  }, [loadBootBuffer, preloadBootTrack]);

  const unlock = useCallback(async () => {
    const chain = getChain();
    // Mobile Safari plays Web Audio API oscillators through the "ambient"
    // audio session category, which is silenced by the hardware ringer/
    // silent switch regardless of in-page volume — unlike an HTML
    // <audio>/<video> element's "playback" category, which ignores that
    // switch. Playing (even a silent) audio element here, synchronously
    // within the same user gesture, flips the whole page's session over to
    // "playback" so the page audio is audible with the ringer
    // switched to silent, matching how every other web audio player avoids
    // this same well-known iOS quirk.
    if (!sessionUnlockElRef.current) {
      const el = new Audio(SILENT_WAV_DATA_URI);
      el.setAttribute("playsinline", "true");
      el.volume = 0.01;
      sessionUnlockElRef.current = el;
    }
    sessionUnlockElRef.current.play().catch(() => {});

    if (chain?.ctx.state === "suspended") {
      try {
        await chain.ctx.resume();
      } catch {
        return false;
      }
    }
    return chain?.ctx.state === "running";
  }, [getChain]);

  const stopBootTrack = useCallback(() => {
    const playback = bootPlaybackRef.current;
    playback.active = false;
    playback.startedAt = null;
    playback.pausedAtMs = null;
    if (playback.source) {
      try {
        playback.source.stop();
      } catch {
        // Already stopped.
      }
      playback.source.disconnect();
      playback.source = null;
    }
  }, []);

  const createBootSource = useCallback(
    (buffer: AudioBuffer, startAt: number, offsetMs = 0) => {
      const chain = getChain();
      if (!chain) return false;

      if (!bootGainRef.current) {
        const gain = chain.ctx.createGain();
        gain.gain.value = mutedRef.current ? 0 : BOOT_TRACK_GAIN;
        gain.connect(chain.ctx.destination);
        bootGainRef.current = gain;
      }

      const source = chain.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(bootGainRef.current);
      source.start(startAt, offsetMs / 1000);
      source.onended = () => {
        if (bootPlaybackRef.current.source === source) {
          bootPlaybackRef.current.source = null;
          bootPlaybackRef.current.active = false;
        }
      };
      bootPlaybackRef.current.source = source;
      bootPlaybackRef.current.startedAt = startAt - offsetMs / 1000;
      bootPlaybackRef.current.pausedAtMs = null;
      bootPlaybackRef.current.active = true;
      return true;
    },
    [getChain]
  );

  const startBootTrack = useCallback(
    async (delayMs: number) => {
      stopBootTrack();
      const chain = getChain();
      if (!chain) {
        setSharedMuted(true);
        return false;
      }

      // Anchor the requested start to wall time before any asynchronous
      // resume/decode work. A suspended AudioContext's currentTime is frozen,
      // so calculating only from that clock would add startup latency to the
      // intended delay and let the first letter get ahead of the track.
      const requestedStartAtMs = performance.now() + delayMs;
      const unlocked = await unlock();
      const buffer = await loadBootBuffer();
      if (!unlocked || !buffer) {
        setSharedMuted(true);
        return false;
      }

      const now = chain.ctx.currentTime;
      const remainingMs = requestedStartAtMs - performance.now();
      const lateByMs = Math.max(0, -remainingMs);
      return createBootSource(
        buffer,
        now + Math.max(0.005, remainingMs / 1000),
        lateByMs
      );
    },
    [createBootSource, getChain, loadBootBuffer, stopBootTrack, unlock]
  );

  const getBootElapsedMs = useCallback(() => {
    const chain = chainRef.current;
    const playback = bootPlaybackRef.current;
    if (!chain || !playback.active) return null;
    if (playback.pausedAtMs !== null) return playback.pausedAtMs;
    if (playback.startedAt === null) return null;
    return Math.max(0, (chain.ctx.currentTime - playback.startedAt) * 1000);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      const chain = chainRef.current;
      const playback = bootPlaybackRef.current;
      if (!chain || !playback.active) return;

      if (document.hidden) {
        playback.pausedAtMs = getBootElapsedMs();
        if (playback.source) {
          try {
            playback.source.stop();
          } catch {
            // Already stopped.
          }
          playback.source.disconnect();
          playback.source = null;
        }
        return;
      }

      const pausedAtMs = playback.pausedAtMs;
      if (pausedAtMs === null) return;
      try {
        if (chain.ctx.state === "suspended") await chain.ctx.resume();
      } catch {
        setSharedMuted(true);
        return;
      }
      const buffer = await loadBootBuffer();
      if (!buffer || chain.ctx.state !== "running") {
        setSharedMuted(true);
        return;
      }
      createBootSource(buffer, chain.ctx.currentTime + 0.005, pausedAtMs);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopBootTrack();
    };
  }, [
    createBootSource,
    getBootElapsedMs,
    loadBootBuffer,
    stopBootTrack,
  ]);

  const toggleMute = useCallback(() => {
    // Writes through the shared store (which also updates this instance
    // via its own subscription above) rather than mutating local state
    // directly, so every other mounted useBootChime() instance mutes/
    // unmutes in lockstep with this one.
    setSharedMuted(!mutedRef.current);
  }, []);

  /**
   * A quick, gentle navigation "beep" for moving between cartridges — a
   * single short dry sine tone routed straight to `ctx.destination`.
   */
  const playMoveBlip = useCallback(async () => {
    const chain = getChain();
    if (!chain || mutedRef.current) return;
    if (chain.ctx.state !== "running") {
      try {
        await chain.ctx.resume();
      } catch {
        return;
      }
    }
    if (chain.ctx.state !== "running") return;
    const { ctx } = chain;
    const start = ctx.currentTime + 0.002;
    const duration = 0.05;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, start);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.07, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }, [getChain]);

  return {
    unlock,
    playMoveBlip,
    startBootTrack,
    stopBootTrack,
    getBootElapsedMs,
    muted,
    toggleMute,
  };
}
