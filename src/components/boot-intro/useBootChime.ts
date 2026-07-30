"use client";

import { useCallback, useRef } from "react";

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
 * Playback is gated behind a user gesture (browsers block un-requested
 * audio); call `unlock()` from inside a gesture handler before using the
 * other players.
 */
export function useBootChime() {
  const chainRef = useRef<Chain | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const getChain = useCallback((): Chain | null => {
    if (chainRef.current) return chainRef.current;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.gain.value = 0.9;

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

  /** Soft ascending twinkle for the letter at `index` of `total` landing. */
  const playLetterTwinkle = useCallback(
    (index: number, total: number) => {
      const chain = getChain();
      if (!chain) return;
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
    if (!chain) return;
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

  return { unlock, playLetterTwinkle, playSparkle };
}
