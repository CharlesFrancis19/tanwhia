import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import MapToggle from "../components/MapToggle";
import CharacterSprite from "../components/CharacterSprite";
import DialogueBox from "../components/DialogueBox";

/**
 * Label atlas: % coordinates in 0..100 space of the map modal.
 * Nudge x/y by ±0.5 if a pin needs fine alignment on your /public/map.png.
 */
const LABELS = {
  // far left entry (river/road junction region)
  LEFT_GATE: { x: 23.5, y: 79.4, label: "Entry" },

  // south band / river road
  KAKAKA: { x: 50.6, y: 86.8, label: "KAKAKA" },
  AWA: { x: 66.9, y: 78.9, label: "Awa" },
  ARA: { x: 86.4, y: 70.6, label: "Ara" },

  // mid plateau
  OTUALEA: { x: 73.2, y: 61.8, label: "OTUALEA" },
  START_SPOT: { x: 71.8, y: 55.8, label: "Start" },
  ASK_SPOT: { x: 69.2, y: 50.8, label: "Ask" },

  // centre-left band
  LUTOVYA: { x: 56.3, y: 63.5, label: "LUTOVYA" },
  ROLJOAKA: { x: 60.9, y: 50.8, label: "ROLJOAKA" },
  PUEPORA: { x: 46.1, y: 58.5, label: "PUEΡOЯA" },

  // upper mid / waiata hill
  MOTUOLANI: { x: 52.0, y: 39.6, label: "MOTUOLANI" },
  WAIATA: { x: 61.6, y: 33.6, label: "Waiata" },

  // right lake & labels
  SPILIALA: { x: 83.9, y: 42.9, label: "SPIΛIALA" },
  KAI_KAIA: { x: 89.2, y: 55.8, label: "KAI KAIA" },

  // top-left hill
  KAI_TKA: { x: 42.9, y: 50.8, label: "KAI TKA" },
};

/** Handy helper to map label keys -> actual point objects */
const pts = (...keys) => keys.map((k) => LABELS[k]);

/** Colors per branch (Tailwind-ish hues) */
const COLORS = {
  pos: "#22c55e",      // green-500
  neutral: "#f59e0b",  // amber-500
  neg: "#ef4444",      // red-500
};

/** Build a colored segment object */
const seg = (color, keys) => ({ color, points: pts(...keys) });

export default function GamePage() {
  const { query, push } = useRouter();
  const name = useMemo(
    () => (typeof query.name === "string" ? query.name : "Player"),
    [query.name]
  );

  // story state
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState("neutral");
  const [score, setScore] = useState(0);
  const [speaking, setSpeaking] = useState(true);

  /**
   * NEW: segments array (each with its own color + list of points).
   * We begin from the **left side** and walk to the KAKAKA dot.
   */
  const [segments, setSegments] = useState([
    seg("#3b82f6", ["LEFT_GATE", "KAKAKA"]), // intro leg (blue)
  ]);

  // choice segments per step (each path is DOT→DOT with its own color)
  const choiceToSegments = [
    // step 0 (from KAKAKA onwards)
    {
      pos: [seg(COLORS.pos, ["KAKAKA", "AWA", "ARA", "OTUALEA"])],
      neutral: [seg(COLORS.neutral, ["KAKAKA", "AWA", "OTUALEA"])],
      neg: [seg(COLORS.neg, ["KAKAKA", "LUTOVYA"])],
    },
    // step 1
    {
      pos: [seg(COLORS.pos, ["OTUALEA", "START_SPOT", "SPILIALA"])],
      neutral: [seg(COLORS.neutral, ["OTUALEA", "START_SPOT", "ASK_SPOT", "ROLJOAKA"])],
      neg: [seg(COLORS.neg, ["OTUALEA", "LUTOVYA", "KAI_KAIA"])],
    },
    // step 2
    {
      pos: [seg(COLORS.pos, ["ROLJOAKA", "MOTUOLANI", "WAIATA"])],
      neutral: [seg(COLORS.neutral, ["ROLJOAKA", "PUEPORA", "KAI_TKA"])],
      neg: [seg(COLORS.neg, ["LUTOVYA", "AWA"])],
    },
  ];

  const endingMood = score > 0 ? "happy" : score < 0 ? "sad" : "neutral";

  const script = [
    {
      title: `Kia ora, ${name} 👋`,
      body:
        "I’m Mara. The lake’s stories are fading. Will you help me carry them to the next generation?",
      choices: [
        { label: "Āe, absolutely!", value: "pos" },
        { label: "Maybe—what do I need to do?", value: "neutral" },
        { label: "Not my thing.", value: "neg" },
      ],
    },
    {
      title: "Mara (speaking)",
      body:
        "First task: follow the river, climb the hill, or sit and listen. Which calls to you?",
      choices: [
        { label: "Follow the river", value: "pos" },
        { label: "Climb the hill", value: "neutral" },
        { label: "Wait and do nothing", value: "neg" },
      ],
    },
    {
      title: "Mara (speaking)",
      body:
        "A wairua appears. Offer a waiata, share a story of your own, or stay silent?",
      choices: [
        { label: "Offer a waiata (song)", value: "pos" },
        { label: "Share a short story", value: "neutral" },
        { label: "Stay silent", value: "neg" },
      ],
    },
    {
      title:
        endingMood === "happy"
          ? "The lake smiles ✨"
          : endingMood === "sad"
          ? "The lake grows quiet…"
          : "The lake watches and waits",
      body:
        (endingMood === "happy"
          ? "Your choices warmed the guardian’s heart. New stories flow like the river—ka pai!"
          : endingMood === "sad"
          ? "The wairua dims. The stories drift apart. Perhaps next time you’ll lean in."
          : "Not all tales reveal themselves at once. Listen longer; new paths may open.") +
        `\n\nFinal score: ${score}`,
      choices: null,
      ending: true,
    },
  ];

  const line = script[Math.min(step, script.length - 1)];

  const choose = (value) => {
    if (value === "pos") {
      setScore((v) => v + 1);
      setMood("happy");
    } else if (value === "neg") {
      setScore((v) => v - 1);
      setMood("sad");
    } else {
      setMood("neutral");
    }

    const segs = choiceToSegments[step]?.[value];
    if (segs?.length) {
      setSegments((prev) => {
        return [...prev, ...segs];
      });
    }
    setStep((s) => s + 1);
  };

  const next = () => {
    if (step >= 3) {
      setStep(0);
      setMood("neutral");
      setScore(0);
      setSpeaking(true);
      setSegments([seg("#3b82f6", ["LEFT_GATE", "KAKAKA"])]); // back to left start
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <main className="relative isolate min-h-dvh w-full overflow-hidden bg-[#0e1b14]">
      {/* background (non-cropping) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/25" />
      </div>

      {/* ✅ Exit button */}
      <button
        onClick={() => push("/")}
        className="absolute right-4 bottom-4 z-30 rounded-lg bg-red-600/80 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition"
      >
        Exit
      </button>

      {/* score chip when ending */}
      {step >= 3 && (
        <div className="absolute left-4 top-4 z-30 rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md">
          Score: {score}
        </div>
      )}

      {/* Map */}
      <MapToggle mapImageSrc="/map2.png" mapAspect="1106 / 732" segments={segments} />

      {/* Character */}
      <CharacterSprite mood={line?.ending ? endingMood : mood} speaking={speaking} />

      <DialogueBox
        title={line.title}
        body={line.body}
        choices={line.choices}
        onChoice={choose}
        onNext={next}
        onTypingChange={setSpeaking}
      />
    </main>
  );
}
