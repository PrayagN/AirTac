"use client";

/**
 * FeedbackIcon
 * Renders the Stitch feedback orb image from /public with no background.
 *
 * Props:
 *  - size      : number  — width & height in px (default 64)
 *  - className : string  — extra CSS class
 *  - style     : object  — extra inline styles
 */
export default function FeedbackIcon({ size = 64, className = "", style = {} }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/feedback-icon.png"
      alt="Feedback"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        background: "none",
        border: "none",
        filter: "drop-shadow(0 0 14px rgba(139,92,246,0.65))",
        display: "block",
        ...style,
      }}
    />
  );
}
