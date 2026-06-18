"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || "ontouchstart" in window) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - 12;
      const y = e.clientY - 12;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onOver = () => cursor.classList.add("hovering");
    const onOut = () => cursor.classList.remove("hovering");

    document.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll(
      "a, button, [role='button'], .btn-charge, .tilt-card, .panel"
    );

    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onOver);
      el.addEventListener("mouseleave", onOut);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onOver);
        el.removeEventListener("mouseleave", onOut);
      });
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <div className="cv" />
      <div className="ch" />
      <div className="cr" />
    </div>
  );
}
