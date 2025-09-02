// src/pages/index.js
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";        // ✅ pages router import
import { useState, useRef, useEffect } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (showNameModal) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [showNameModal]);

  function handleStart() {
    setShowNameModal(true);
  }

  function handleCancel() {
    setShowNameModal(false);
    setPlayerName("");
  }

  function handleSubmit(e) {
    e?.preventDefault();
    const name = playerName.trim();
    if (!name) return;
    router.push(`/game?name=${encodeURIComponent(name)}`); // ✅ works in pages router
  }
  function handleIwiAccess() {
    const url = "https://korero-maori-0e6d52c9.base44.app";
    window.location.href = url; // ✅ Opens in same window
  }
  return (
    <main className={`start-screen ${geistSans.variable} ${geistMono.variable}`}>
      {/* Normal story start */}
      <section className="start-card">
        <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>Welcome to the Adventure</h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>Click below to begin your journey.</p>
        <button
          className="primary"
          onClick={handleStart}
          aria-haspopup="dialog"
          aria-controls="name-modal"
        >
          Start Story
        </button>
      </section>

      {/* Iwi People Only section */}
      <section className="iwi-card mt-10 text-center">
        <h2 className="text-[22px] mb-3">Iwi People Only</h2>
        <p className="opacity-90 mb-4">
          Access restricted cultural knowledge for iwi members.
        </p>
        <button
          onClick={handleIwiAccess}
          className="primary"
          aria-haspopup="dialog"
          aria-controls="name-modal"
        >
          Enter Iwi Section
        </button>
      </section>

      {/* Modal for player name */}
      {showNameModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" id="name-modal">
          <form className="modal" onSubmit={handleSubmit}>
            <h3>Enter your player name</h3>
            <div className="row">
              <label htmlFor="playerName">Player name</label>
              <input
                id="playerName"
                ref={inputRef}
                className="input"
                placeholder="e.g., Aakaash"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={32}
                autoComplete="name"
              />
            </div>

            <div className="actions">
              <button type="button" className="ghost" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="primary">Continue</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
