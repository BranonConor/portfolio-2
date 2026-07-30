"use client";

import { useCallback, useRef } from "react";

/**
 * Synthesizes an original ascending arpeggio "boot chime" with the Web Audio
 * API — evokes the classic handheld power-on ding without using any sampled
 * or copyrighted audio. Playback is gated behind a user gesture (browsers
 * block un-requested audio otherwise); call `playChime()` from inside a
 * gesture handler (click/keydown/touchstart).
 */
export function useBootChime() {
  const ctxRef = useRef<AudioContext | null>(null);
  const playedRef = useRef(false);

  const playChime = useCallback(() => {
    if (playedRef.current) return;
    playedRef.current = true;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = ctxRef.current ?? new AudioContextClass();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Rising arpeggio, roughly a major chord climbing an octave — bright and
    // "ready to go" like the reference, but an entirely original melody.
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5 E5 G5 C6 E6
    const noteDuration = 0.11;
    const start = ctx.currentTime + 0.02;

    notes.forEach((freq, i) => {
      const noteStart = start + i * noteDuration * 0.85;

      const osc = ctx.createOscillator();
      osc.type = i === notes.length - 1 ? "triangle" : "square";
      osc.frequency.setValueAtTime(freq, noteStart);

      const gain = ctx.createGain();
      const peak = i === notes.length - 1 ? 0.22 : 0.14;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(peak, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        noteStart + noteDuration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + noteDuration + 0.02);
    });

    // Final sustained shimmer to land the "ready" feeling.
    const shimmerStart = start + notes.length * noteDuration * 0.85;
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1318.51, shimmerStart);
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0, shimmerStart);
    shimmerGain.gain.linearRampToValueAtTime(0.18, shimmerStart + 0.02);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, shimmerStart + 0.4);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(shimmerStart);
    shimmer.stop(shimmerStart + 0.42);
  }, []);

  return { playChime };
}
