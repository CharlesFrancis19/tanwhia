import { useEffect, useMemo, useState } from "react";
import MapIcon from "./MapIcon";

export default function MapToggle({
  mapImageSrc = "/map.png",
  tooltip = "Open map (M)",
  path = [],
  segments = [],
  mapAspect = "1106 / 732",
}) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // keyboard: M to toggle, ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key?.toLowerCase() === "m") toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Normalize to segments for a single place to read points from
  const normalizedSegments = useMemo(() => {
    if (segments && segments.length) return segments;
    if (path && path.length) return [{ points: path }];
    return [];
  }, [segments, path]);

  // Flatten pins in order, dedup consecutive
  const flatPoints = useMemo(() => {
    const out = [];
    normalizedSegments.forEach((seg) => {
      seg.points?.forEach((p) => {
        const prev = out[out.length - 1];
        if (!prev || prev.x !== p.x || prev.y !== p.y) out.push(p);
      });
    });
    return out;
  }, [normalizedSegments]);

  return (
    <>
      {/* Toggle button ALWAYS visible */}
      <button
        title={tooltip}
        aria-label="Toggle map"
        aria-pressed={open}
        onClick={toggle}
        className="fixed right-4 top-4 z-[90] flex items-center gap-2 rounded-xl bg-black/70 px-3 py-2 text-white shadow-xl backdrop-blur-md"
      >
        <MapIcon size={18} />
        <span className="text-sm font-semibold">
          {open ? "Hide map" : "Show map"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[92vw] max-w-[1100px] overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl"
            style={{ aspectRatio: mapAspect }}
          >
            {!imgError ? (
              <div className="relative h-full w-full">
                {/* Map image */}
                <img
                  src={mapImageSrc}
                  alt="Game map"
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                  draggable={false}
                />

                {/* Pins only (no polylines) */}
                {flatPoints.map((p, i) => {
                  const isLast = i === flatPoints.length - 1;
                  return (
                    <div
                      key={`${p.x}-${p.y}-${i}`}
                      className="absolute"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: "translate(-50%, -100%)",
                        transition: "left 220ms ease, top 220ms ease",
                      }}
                    >
                      <div className="relative flex flex-col items-center gap-1">
                        <span className="relative inline-block">
                          {isLast && (
                            <span className="absolute -inset-3 rounded-full bg-emerald-400/25 blur-sm animate-ping" />
                          )}
                          <span className="relative inline-block h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-emerald-200" />
                        </span>
                        {p.label && (
                          <span className="rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                            {p.label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center p-8 text-center text-white/85">
                Map not found. Check the file path:
                <code className="ml-2 rounded bg-white/10 px-2 py-1">
                  public{mapImageSrc}
                </code>
              </div>
            )}

            <button
              onClick={close}
              aria-label="Close map"
              className="absolute right-3 top-3 z-[65] rounded-lg bg-black/70 px-3 py-2 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
