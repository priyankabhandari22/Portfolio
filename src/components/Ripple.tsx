"use client";

import { useEffect } from "react";

export default function Ripple() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      ripple.className = "click-ripple";
      ripple.style.left = `${e.clientX - 150}px`;
      ripple.style.top = `${e.clientY - 150}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);

      for (let i = 0; i < 12; i++) {
        const bubble = document.createElement("div");
        bubble.className = "click-bubble";
        const angle = (Math.PI * 2 * i) / 12;
        const dist = 80 + Math.random() * 120;
        bubble.style.setProperty("--bx", `${Math.cos(angle) * dist}px`);
        bubble.style.setProperty("--by", `${-Math.abs(Math.sin(angle)) * dist - 60}px`);
        bubble.style.left = `${e.clientX - 5}px`;
        bubble.style.top = `${e.clientY - 5}px`;
        bubble.style.background = i % 3 === 0
          ? "rgba(255, 215, 0, 0.6)"
          : "rgba(0, 212, 255, 0.6)";
        bubble.style.width = `${6 + Math.random() * 10}px`;
        bubble.style.height = bubble.style.width;
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1000);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
