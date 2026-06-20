"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";

const skillCategories = [
  {
    title: "Languages",
    skills: ["C", "Java", "Python", "JavaScript"],
    accent: "cyan",
  },
  {
    title: "Frontend",
    skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Tailwind CSS"],
    accent: "amber",
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs","Socket.IO", "JWT Authentication", "OAuth 2.0"],
    accent: "green",
  },
  {
    title: "Databases",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "MongoDB Atlas", "MySQL Workbench", "Neon", "Prisma ORM"],
    accent: "cyan",
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "GitHub", "Postman", "VS Code", "Vercel", "Render"],
    accent: "purple",
  },
  {
    title: "Core Concepts",
    skills: ["DSA", "OOP", "DBMS", "Operating Systems", "Problem Solving"],
    accent: "amber",
  },
];

export default function Arsenal() {
  return (
    <section id="arsenal" className="relative py-16 md:py-28 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionWrapper>
          <p
            className="text-cyan-400 text-sm mb-3 tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            My Arsenal
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-16">
            <span className="gradient-text">Skills & Technologies</span>
          </h2>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <SectionWrapper key={category.title}>
              <div
                className="panel arsenal-card p-6 h-full"
                data-accent={category.accent}
              >
                <h3
                  className="text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2 relative z-10"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    color: "var(--card-accent)",
                  }}
                >
                  <span className="label-dot">●</span>
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-pill px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-300 border border-white/10 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          ))}
        </div>

        <SectionWrapper>
          <div className="mt-16 panel p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Proficiency Overview
            </h3>
            <div className="space-y-5 max-w-2xl mx-auto">
              {[
                { label: "Frontend Development", level: 90 },
                { label: "Backend Development", level: 85 },
                { label: "Database Management", level: 80 },
                { label: "Problem Solving (DSA)", level: 75 },
                { label: "DevOps & Deployment", level: 70 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-cyan-400">{item.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
}
