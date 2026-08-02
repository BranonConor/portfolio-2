"use client";

interface SoundMuteIconProps {
  muted: boolean;
  size?: number;
}

/**
 * The exact speaker glyph used by the boot cartridge-picker's mute button —
 * pulled out into its own component so the persistent mute button in the
 * product layout (top-left corner, next to ESC) renders a pixel-identical
 * icon rather than a similar-but-different one.
 */
export const SoundMuteIcon: React.FC<SoundMuteIconProps> = ({ muted, size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="3,9 8,9 13,4 13,20 8,15 3,15" fill="currentColor" stroke="none" />
    {muted ? (
      <path d="M16 9l6 6M22 9l-6 6" />
    ) : (
      <>
        <path d="M16.5 8a5 5 0 0 1 0 8" />
        <path d="M19.5 5a9 9 0 0 1 0 14" />
      </>
    )}
  </svg>
);
