"use client";

import { useEffect, useState } from "react";

const bootLines = [
  "INITIALIZING PRIYANKA_OS...",
  "LOADING CORE MODULES.......... OK",
  "MOUNTING SKILL STACK........... OK",
  "CONNECTING TO INTERNET......... OK",
  "VERIFYING IDENTITY............. OK",
  "WELCOME. PROFILE: PRIYANKA BHANDARI",
  "B.TECH INFORMATION TECHNOLOGY  | CGPA: 8.86",
  "STATUS: AVAILABLE FOR HIRE",
  "LAUNCHING PORTFOLIO...",
];

const boldIndices = new Set([5, 8]);

export default function BootScreen() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"lines" | "bar" | "ready" | "done">("lines");
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const navEntry = performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
    const navType = navEntry?.type;
    const bootDone = sessionStorage.getItem("bootDone") === "true";

    if (navType === "back_forward" && bootDone) {
      setPhase("done");
      return;
    }

    sessionStorage.removeItem("bootDone");

    const skip = () => setSkipped(true);
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, []);

  useEffect(() => {
    if (!skipped) return;
    sessionStorage.setItem("bootDone", "true");
    setPhase("done");
  }, [skipped]);

  useEffect(() => {
    if (phase !== "lines") return;
    if (visibleCount >= bootLines.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 600);
    return () => clearTimeout(t);
  }, [visibleCount, phase]);

  useEffect(() => {
    if (visibleCount < bootLines.length) return;
    if (phase !== "lines") return;
    const t = setTimeout(() => setPhase("bar"), 400);
    return () => clearTimeout(t);
  }, [visibleCount, phase]);

  useEffect(() => {
    if (phase !== "bar") return;
    const t = setTimeout(() => setPhase("ready"), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => {
      sessionStorage.setItem("bootDone", "true");
      setPhase("done");
    }, 800);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#010810]">
      <div className="max-w-[90vw] w-[520px]">
        {bootLines.map((line, idx) => (
          <p
            key={idx}
            className={`font-mono text-sm leading-relaxed ${
              boldIndices.has(idx) ? "font-bold" : ""
            }`}
            style={{
              color: "#00d4ff",
              opacity: idx < visibleCount ? 1 : 0,
              transform: idx < visibleCount ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
              minHeight: "1.5em",
            }}
          >
            &gt; {line}
            {idx === Math.min(visibleCount - 1, bootLines.length - 1) && visibleCount <= bootLines.length && (
              <span className="animate-pulse ml-0.5" style={{ color: "#00d4ff" }}>|</span>
            )}
          </p>
        ))}

        {visibleCount >= bootLines.length && (
          <div
            className="mt-6"
            style={{
              opacity: phase === "lines" ? 0 : 1,
              transition: "opacity 0.4s ease-out",
            }}
          >
            <div className="w-full">
              <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full w-0"
                  style={{
                    background: "#00d4ff",
                    boxShadow: "0 0 10px #00d4ff",
                    animation:
                      phase === "bar" ? "boot-fill 2s ease-out forwards" : "none",
                    width: phase === "ready" ? "100%" : undefined,
                  }}
                />
              </div>
              <p
                className="text-xs tracking-[0.3em] uppercase mt-4 text-left"
                style={{
                  color: "#00d4ff",
                  fontFamily: "var(--font-orbitron)",
                    opacity:
                      phase === "ready" ? 1 : 0,
                  animation:
                    phase === "ready"
                      ? "boot-ready-flash 0.6s ease-out forwards"
                      : "none",
                }}
              >
                System Ready
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
