"use client";

import dynamic from "next/dynamic";

const AirCanvas = dynamic(() => import("@/components/AirCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
        color: "#c0c1ff",
        fontFamily: "var(--font-plus-jakarta), sans-serif",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(192,193,255,0.2)",
          borderTopColor: "#c0c1ff",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ margin: 0, fontSize: "14px", opacity: 0.6 }}>
        Loading Game Engine…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function PlayPage() {
  return (
    <main>
      <AirCanvas hasStarted={true} />
    </main>
  );
}
