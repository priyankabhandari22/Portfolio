"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import SectionWrapper from "./SectionWrapper";
import profilePic from "@/app/profile.png";

export default function About() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
    <section id="about" className="relative py-16 md:py-28 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <SectionWrapper>
          <p
            className="text-cyan-400 text-sm mb-3 tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            About Me
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
            <span className="gradient-text">Get to Know Me</span>
          </h2>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <SectionWrapper>
            <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className="relative w-full max-w-[280px] md:max-w-[384px] mx-auto aspect-square tilt-card transition-transform duration-150 ease-out" style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-amber-500/10 rounded-2xl blur-2xl" />
              <div className="relative w-full h-full rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                <Image src={profilePic} alt="Priyanka Bhandari" fill className="object-cover" sizes="(max-width: 768px) 280px, 384px" />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper>
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-4">
              Hi, I&apos;m <span className="text-white font-semibold">Priyanka Bhandari</span>, Aspiring Full-Stack Web Developer And Data Science Enthusiast from Mumbai, India.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              Currently pursuing <span className="text-gray-300">Bachelor of Technology (B.Tech.) in Information Technology</span> at Thakur Shyamnarayan Engineering College, Mumbai.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              I specialize in building scalable, user-friendly, and impactful web applications. My primary focus is Full Stack Development, where I build seamless frontend experiences and robust backend systems.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              I enjoy solving real-world problems using technology and continuously improving my skills in modern software development.
            </p>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}
