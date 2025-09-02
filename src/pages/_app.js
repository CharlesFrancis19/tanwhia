// src/pages/_app.js
import "@/styles/globals.css";
import { useEffect, useRef } from "react";

export default function MyApp({ Component, pageProps }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;

    const tryPlay = () => {
      audio.play().catch(() => {
        // If autoplay with sound is blocked, start on first user gesture
        const onFirstGesture = () => {
          audio.play().finally(() => {
            window.removeEventListener("pointerdown", onFirstGesture);
            window.removeEventListener("keydown", onFirstGesture);
          });
        };
        window.addEventListener("pointerdown", onFirstGesture, { once: true });
        window.addEventListener("keydown", onFirstGesture, { once: true });
      });
    };

    tryPlay(); // attempt immediately on load
  }, []);

  return (
    <>
      {/* 🎵 Global background music (no UI) */}
      <audio
        ref={audioRef}
        src="/theme.mp3"
        loop
        playsInline
        preload="auto"
        autoPlay
      />
      <Component {...pageProps} />
    </>
  );
}
