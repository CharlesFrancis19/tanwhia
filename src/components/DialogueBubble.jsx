// src/components/DialogueBubble.jsx
import { useEffect, useState } from "react";

export default function DialogueBubble({ title, body, speed = 18 }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(""); // reset when body changes
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(body.slice(0, i));
      if (i >= body.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [body, speed]);

  return (
    <div className="relative max-w-2xl rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-md animate-[fadeIn_300ms_ease-out]">
      <h1 className="mb-2 text-4xl font-extrabold leading-tight">{title}</h1>
      <p className="text-lg text-white/90">{text}</p>

      {/* little speech-tail */}
      <div className="absolute -left-2 bottom-6 h-4 w-4 rotate-45 rounded-sm bg-black/60" />
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
