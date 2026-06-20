"use client";

import { useEffect, useState } from "react";

const roles = [
  "Full Stack Developer",
  "MERN Developer",
  "Next.js Developer",
  "Problem Solver",
  "React Developer",
  "Backend Builder",
  "Data Science Enthusiast"

];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIndex < currentRole.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 80);
    } else if (!deleting && charIndex === currentRole.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 40);
    } else if (deleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, 80);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, roleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px] animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px] animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          className="section-reveal"
          style={{
            opacity: revealed ? 1 : 0,
            animation: revealed ? "section-reveal 0.8s ease-out forwards" : "none",
          }}
        >
          <p
            className="text-cyan-400 text-sm mb-4 tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Welcome to my portfolio
          </p>

          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Hi, I&apos;m </span>
            <span className="gradient-text text-glow">Priyanka Bhandari</span>
          </h1>

          <div className="h-12 md:h-14 flex items-center justify-center mb-8">
            <span className="text-xl md:text-2xl text-gray-300 font-mono">
              {roles[roleIndex].substring(0, charIndex)}
              <span className="animate-pulse text-cyan-400">|</span>
            </span>
          </div>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Passionate developer focused on building scalable, modern, and
            impactful web applications.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#work" className="btn-charge">
              View Work
            </a>
            <a href="/Priyanka-Bhandari-Resume-1.pdf" download="Priyanka-Bhandari-Resume-1.pdf" className="btn-charge">
              Download Resume
            </a>
          </div>

          <p className="text-gray-500 text-sm md:text-base font-mono mt-8 tracking-wider">
            B.Tech IT, CGPA 8.86 &middot; Class of 2028
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-cyan-400 rounded-full mt-2 animate-float" />
        </div>
      </div>
    </section>
  );
}
