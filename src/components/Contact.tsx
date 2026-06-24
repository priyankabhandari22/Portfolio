"use client";

import SectionWrapper from "./SectionWrapper";

const links = [
  { label: "Email", value: "bhandaripriyanka028@gmail.com", href: "mailto:bhandaripriyanka028@gmail.com" },
  { label: "GitHub", value: "priyankabhandari22", href: "https://github.com/priyankabhandari22" },
  { label: "LinkedIn", value: "pr-bhandari", href: "https://www.linkedin.com/in/pr-bhandari/" },
  { label: "LeetCode", value: "priyankabhandari2203", href: "https://leetcode.com/u/priyankabhandari2203" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-16 md:py-28 px-6 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 items-start gap-8">
          <SectionWrapper>
            <p
              className="text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Contact
            </p>
            <h2 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.9] mb-5">
              Let&apos;s<br />Connect
            </h2>
            <p className="text-gray-400 text-[clamp(0.9rem,1.7vw,1.05rem)] max-w-[31ch] leading-relaxed">
              Currently available for internships, freelance &amp; collaborations.
            </p>
          </SectionWrapper>

          <SectionWrapper>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group grid grid-cols-[minmax(72px,95px)_1fr_auto] items-center gap-3 py-3 border-b border-white/10 no-underline transition-colors duration-300 hover:text-cyan-400 relative"
                >
                  <span className="text-gray-500 text-xs uppercase tracking-wider font-mono">{link.label}</span>
                  <span className="text-white text-[clamp(1rem,2.1vw,1.45rem)] group-hover:text-cyan-400 transition-colors">
                    {link.value}
                  </span>
                  <span className="text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-lg">
                    &rarr;
                  </span>
                  <span className="absolute bottom-0 left-0 h-[1px] bg-cyan-400 w-0 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}
