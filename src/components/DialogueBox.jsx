// src/components/DialogueBox.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function DialogueBox({
  title,
  body,
  choices = null,   // [{label, value}]
  onChoice,         // (value) => void
  onNext,           // () => void
  onTypingChange,   // (isTyping:boolean) => void
}) {
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timer = useRef(null);

  useEffect(() => {
    setTyped("");
    setIsTyping(true);
    onTypingChange?.(true);                 // typing started

    clearInterval(timer.current);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setTyped(body.slice(0, i));
      if (i >= body.length) {
        clearInterval(timer.current);
        setIsTyping(false);
        onTypingChange?.(false);            // typing finished
      }
    }, 18);

    return () => clearInterval(timer.current);
  }, [body, onTypingChange]);

  const showNext = useMemo(() => !choices || choices.length === 0, [choices]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-5xl p-4">
      <div className="relative rounded-2xl border border-white/10 bg-black/70 p-4 text-white shadow-2xl backdrop-blur-md">
        {title && <div className="mb-1 text-xl font-bold">{title}</div>}
        <p className="min-h-[3.2rem] text-lg text-white/90">{typed}</p>
        <div className="absolute left-10 -top-2 h-4 w-4 rotate-45 rounded-sm bg-black/70" />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {choices && choices.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {choices.map((c) => (
                <button
                  key={c.value}
                  disabled={isTyping}
                  onClick={() => onChoice?.(c.value)}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs text-white/60">Press Next to continue</span>
          )}

          {showNext && (
            <button
              onClick={() => {
                onTypingChange?.(true);     // prepare next line as speaking
                onNext?.();
              }}
              disabled={isTyping}
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-black hover:bg-white disabled:opacity-60"
            >
              Next ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
