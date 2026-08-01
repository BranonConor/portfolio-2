"use client";

import { useCallback, useRef, useState } from "react";

// A major pentatonic scale, spanning a couple of octaves, gives every note a
// consonant/"heavenly" quality no matter which degree a given letter lands
// on — this is what each letter's twinkle picks a pitch from.
const PENTATONIC = [
  523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98,
  1760.0,
];

interface Chain {
  ctx: AudioContext;
  master: GainNode;
}

/**
 * Synthesizes an original GBA-style boot audio set with the Web Audio API —
 * no sampled or copyrighted audio. Two original sounds are produced:
 *  - a soft, airy "heavenly" twinkle for each letter as it lands, built from
 *    detuned sine pairs run through a feedback-delay shimmer for an airy tail
 *  - a bright ascending "sparkle" for the rainbow shine sweep, layering a
 *    quick bell arpeggio with a filtered noise burst
 * Playback requires a user gesture (browsers block un-requested audio):
 * call `unlock()` on/after a gesture to resume the AudioContext. Because the
 * boot animation itself doesn't wait for that gesture, `playLetterTwinkle`
 * and `playSparkle` are simply no-ops until the context is actually running
 * — any sound trigger firing before the first gesture is silently muted
 * rather than scheduled against a frozen (suspended) clock, which would
 * otherwise cause every sound to bunch up and play back garbled the moment
 * the context resumes.
 */
const BASE_MASTER_GAIN = 0.9;

export function useBootChime() {
  const chainRef = useRef<Chain | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  const getChain = useCallback((): Chain | null => {
    if (chainRef.current) return chainRef.current;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.gain.value = mutedRef.current ? 0 : BASE_MASTER_GAIN;

    // A cheap "airy" feedback-delay shimmer shared by all sounds, so notes
    // trail off softly instead of cutting out abruptly.
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.22;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 3200;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delayFilter.connect(ctx.destination);

    const chain = { ctx, master };
    chainRef.current = chain;
    return chain;
  }, []);

  const unlock = useCallback(() => {
    const chain = getChain();
    if (chain?.ctx.state === "suspended") {
      chain.ctx.resume().catch(() => {});
    }
  }, [getChain]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (chainRef.current) {
      chainRef.current.master.gain.value = mutedRef.current
        ? 0
        : BASE_MASTER_GAIN;
    }
  }, []);

  /**
   * A quick, gentle navigation "beep" for moving between cartridges — a
   * single short dry sine tone. Deliberately bypasses the shared shimmer/
   * delay chain (routed straight to `ctx.destination`) since that reverb
   * tail reads as muddy/echoey for a rapid, repeated UI sound like this.
   */
  const playMoveBlip = useCallback(() => {
    const chain = getChain();
    if (!chain || chain.ctx.state !== "running" || mutedRef.current) return;
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

  /** Soft ascending twinkle for the letter at `index` of `total` landing. */
  const playLetterTwinkle = useCallback(
    (index: number, total: number) => {
      const chain = getChain();
      // The AudioContext stays suspended until a real user gesture resumes
      // it, and its currentTime is frozen the whole time it's suspended —
      // scheduling sounds against a frozen clock means they'd all bunch up
      // and play back garbled the instant it's later resumed. Since the
      // animation itself no longer waits for a gesture, simply skip (mute)
      // any sound trigger that fires before the context is actually running;
      // once unlocked, subsequent triggers schedule cleanly against a live
      // clock.
      if (!chain || chain.ctx.state !== "running") return;
      const { ctx, master } = chain;

      const degree = Math.round((index / Math.max(total - 1, 1)) * (PENTATONIC.length - 1));
      const freq = PENTATONIC[Math.min(degree, PENTATONIC.length - 1)];
      const start = ctx.currentTime + 0.005;
      const duration = 0.42;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.16, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      gain.connect(master);

      // Two gently detuned sines, "chorus" style, for a soft/heavenly tone
      // rather than a harsh single-oscillator beep.
      [0, 6].forEach((detune) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        osc.detune.setValueAtTime(detune, start);
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + duration + 0.05);
      });
    },
    [getChain]
  );

  /** Bright shimmering sparkle for the rainbow shine sweep. */
  const playSparkle = useCallback(() => {
    const chain = getChain();
    if (!chain || chain.ctx.state !== "running") return;
    const { ctx, master } = chain;
    const start = ctx.currentTime + 0.005;

    // Quick ascending bell arpeggio.
    const bellNotes = [1046.5, 1318.51, 1567.98, 2093.0];
    bellNotes.forEach((freq, i) => {
      const noteStart = start + i * 0.05;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, noteStart);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.3);
      osc.connect(gain);
      gain.connect(master);
      osc.start(noteStart);
      osc.stop(noteStart + 0.32);
    });

    // Filtered noise burst layered underneath for a bright "sparkle" texture.
    if (!noiseBufferRef.current) {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBufferRef.current;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(6000, start);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, start);
    noiseGain.gain.linearRampToValueAtTime(0.06, start + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(start);
    noise.stop(start + 0.4);
  }, [getChain]);

  return { unlock, playLetterTwinkle, playSparkle, playMoveBlip, muted, toggleMute };
}
