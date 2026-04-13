"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import LandingPage from "@/components/LandingPage";

// Heavy game engine — only loaded when the user actually starts a session.
// This keeps the initial landing page bundle tiny (no MediaPipe, PeerJS, etc.)
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

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  // Shared state threaded between LandingPage and AirCanvas
  const [localName, setLocalName] = useState("");
  const [localAvatar, setLocalAvatar] = useState("Felix");
  const [inputRoomCode, setInputRoomCode] = useState("");

  if (hasStarted) {
    return (
      <main>
        <AirCanvas
          initialName={localName}
          initialAvatar={localAvatar}
          initialRoomCode={inputRoomCode}
        />
      </main>
    );
  }

  return (
    <main>
      <LandingPage
        localName={localName}
        setLocalName={setLocalName}
        localAvatar={localAvatar}
        setLocalAvatar={setLocalAvatar}
        inputRoomCode={inputRoomCode}
        setInputRoomCode={setInputRoomCode}
        handleNativeStart={() => setHasStarted(true)}
      />
    </main>
  );
}
