"use client";

import { useState, useCallback, useRef } from "react";
import SectionWrapper from "./SectionWrapper";

const projects = [
  {
    title: "EduTrack",
    description:
      "A comprehensive college discovery platform helping students search, compare, and shortlist colleges using AI-driven recommendations.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "AI/ML", "Tailwind CSS"],
    features: [
      "AI-powered college recommendations",
      "Admission prediction engine",
      "College comparison system",
      "Community discussion forum",
      "Real-time notifications",
      "Personalized dashboard",
    ],
    github: "https://github.com/priyankabhandari22/College-Discovery-Platform.git",
    live: "https://college-discovery-platform-frontend-rho.vercel.app/",
  },
  {
    title: "Gap2Grow",
    description:
      "An AI-powered employability platform designed to analyze resumes, identify skill gaps, and generate personalized career roadmaps.",
    tags: ["React.js", "Node.js", "MongoDB", "FastAPI", "Python", "Gemini AI"],
    features: [
      "Resume parsing",
      "Skill gap analysis using NLP",
      "AI-generated career reports",
      "Learning roadmap generation",
    ],
    github: "https://github.com/priyankabhandari22/Gap2Grow.git",
    live: "https://gap2-grow-zeta.vercel.app",
  },
  {
    title: "Vero",
    description:
      "A smart attendance management system that automates attendance tracking and academic record management.",
    tags: ["React.js", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
    features: [
      "Student & Faculty Login",
      "Real-time attendance tracking",
      "Admin dashboard",
      "Attendance analytics",
      "Leave approval system",
    ],
    github: "https://github.com/priyankabhandari22/Vero-AttendanceManagemenetSystem.git",
    live: "https://vero-attendance-managemenet-system.vercel.app/",
  },
  {
    title: "ClinerVa",
    description:
      "AI-powered healthcare platform designed to match patients with suitable clinical trials based on medical requirements and eligibility criteria.",
    tags: ["Full Stack", "AI Integration"],
    features: [
      "AI-powered matching",
      "Clinical trial recommendation",
      "Patient requirement analysis",
    ],
    github: "https://github.com/priyankabhandari22/ClinerVa-v1.git",
    live: "https://cliner-va-v1.vercel.app/",
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [struck, setStruck] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    setStruck(true);
    setTimeout(() => setStruck(false), 1000);
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy * -8;
    const ry = (x - cx) / cx * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, []);

  const handleLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <SectionWrapper>
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="tilt-card panel p-6 md:p-8 h-full transition-transform duration-150 ease-out cursor-pointer select-none relative overflow-hidden"
      >
        <div className="hud-overlay" />

        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ${
            struck ? "animate-lightning-glow opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-500 origin-left ${
            struck ? "animate-lightning-top" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-amber-500 to-cyan-400 origin-top ${
            struck ? "animate-lightning-right" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-500 origin-right ${
            struck ? "animate-lightning-bottom" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-amber-500 to-cyan-400 origin-bottom ${
            struck ? "animate-lightning-left" : "opacity-0"
          }`}
        />

        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
          <ul className="space-y-1.5 mb-6">
            {project.features.map((f) => (
              <li key={f} className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0 blink-dot" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs rounded-[6px] border border-white/20 text-gray-300 hover:bg-white/5 transition-all inline-block font-mono"
            >
              GitHub
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs rounded-[6px] bg-gradient-to-r from-cyan-600 to-amber-500 text-white hover:opacity-90 transition-all inline-block font-mono"
            >
              Live Demo
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-16 md:py-28 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionWrapper>
          <p
            className="text-cyan-400 text-sm mb-3 tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            My Work
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-16">
            <span className="gradient-text">Featured Projects</span>
          </h2>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
