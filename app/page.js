"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  // Shared state threaded between LandingPage and redirect
  const [localName, setLocalName] = useState("");
  const [localAvatar, setLocalAvatar] = useState("Felix");
  const [inputRoomCode, setInputRoomCode] = useState("");

  const handleNativeStart = () => {
    const params = new URLSearchParams();
    if (localName) params.set("name", localName);
    if (localAvatar) params.set("avatar", localAvatar);
    if (inputRoomCode) params.set("room", inputRoomCode);
    
    // We do a hard redirect (window.location.href) to completely unload the AdSense script page session
    window.location.href = `/play?${params.toString()}`;
  };

  return (
    <main>
      <LandingPage
        localName={localName}
        setLocalName={setLocalName}
        localAvatar={localAvatar}
        setLocalAvatar={setLocalAvatar}
        inputRoomCode={inputRoomCode}
        setInputRoomCode={setInputRoomCode}
        handleNativeStart={handleNativeStart}
      />
    </main>
  );
}
