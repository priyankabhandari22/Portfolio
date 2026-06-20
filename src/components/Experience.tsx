"use client";

import { useRef, useEffect, useState } from "react";
import SectionWrapper from "./SectionWrapper";

const experiences = [
  {
    role: "Full Stack Developer Intern",
    company: "DecodeLab",
    duration: "5 June 2026 – 5 July 2026",
    responsibilities: [
      "Developed responsive frontend components using React.js and Tailwind CSS",
      "Built backend APIs using Node.js and Express.js",
      "Integrated MongoDB database",
      "Implemented authentication systems",
      "Worked on deployment and production builds",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Freelancing",
    duration: "",
    responsibilities: [
      "Developed responsive websites",
      "Built reusable UI components",
      "Improved UX and performance",
      "Worked on modern UI design systems",
    ],
  },
  {
    role: "Academic Assistant",
    company: "Academic Institution",
    duration: "January 2025 – February 2026",
    responsibilities: [
      "Evaluated student answer sheets in PCM",
      "Provided academic support",
      "Assisted students with doubts",
      "Improved academic understanding",
    ],
  },
];

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`relative flex flex-col md:flex-row gap-6 md:gap-12 mb-12 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="hidden md:flex md:w-1/2 justify-end">
        {index % 2 === 0 && (
          <div className="text-right">
            <span className="text-xs text-cyan-400 font-mono">
              {exp.duration}
            </span>
          </div>
        )}
      </div>

      <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2">
        <div className="w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#010810] shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
      </div>

      <div className="md:w-1/2 pl-10 md:pl-0">
        {index % 2 !== 0 && (
          <span className="text-xs text-cyan-400 font-mono block mb-2 md:text-right">
            {exp.duration}
          </span>
        )}
        <div
          ref={ref}
          className={`timeline-draw border-l-2 pl-6 ${
            revealed ? "revealed" : ""
          }`}
        >
          <div className="timeline-content panel p-6">
            <h3 className="text-lg font-semibold text-white mb-1">{exp.role}</h3>
            <p className="text-sm text-cyan-400 mb-3">{exp.company}</p>
            {exp.duration && (
              <p className="text-xs text-gray-500 mb-3 md:hidden font-mono">
                {exp.duration}
              </p>
            )}
            <ul className="space-y-1.5">
              {exp.responsibilities.map((r) => (
                <li key={r} className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0 blink-dot" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-16 md:py-28 px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <SectionWrapper>
          <p
            className="text-cyan-400 text-sm mb-3 tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-16">
            <span className="gradient-text">My Journey</span>
          </h2>
        </SectionWrapper>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-amber-400 to-transparent" />
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.company + exp.role} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
