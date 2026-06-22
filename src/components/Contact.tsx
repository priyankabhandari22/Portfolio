"use client";

import { useState, FormEvent } from "react";
import SectionWrapper from "./SectionWrapper";


const FORMSPREE_ID = "mgobjlzl";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const urlPattern = /https?:\/\//i;
const spamPattern = /(<[^>]*>|http|www\.|\[url\])/i;

function validateName(v: string): string | undefined {
  const trimmed = v.trim();
  if (!trimmed) return "Name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 100) return "Name is too long (max 100 characters)";
  if (urlPattern.test(trimmed)) return "Name cannot contain URLs";
  return undefined;
}

function validateEmail(v: string): string | undefined {
  const trimmed = v.trim();
  if (!trimmed) return "Email is required";
  if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
  if (trimmed.length > 254) return "Email is too long";
  return undefined;
}

function validateMessage(v: string): string | undefined {
  const trimmed = v.trim();
  if (!trimmed) return "Message is required";
  if (trimmed.length < 10) return "Message must be at least 10 characters";
  if (trimmed.length > 5000) return "Message is too long (max 5000 characters)";
  if (spamPattern.test(trimmed)) return "Message contains invalid content";
  return undefined;
}

const socials = [
  { label: "GitHub", href: "https://github.com/priyankabhandari22", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
  )},
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pr-bhandari/", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )},
  { label: "Email", href: "mailto:bhandaripriyanka028@gmail.com", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 8 10-8"/></svg>
  )},
  { label: "LeetCode", href: "https://leetcode.com/u/priyankabhandari2203", icon: (
    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold border border-current rounded">LC</span>
  )},
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const message = (data.get("message") as string) || "";

    const newErrors: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.message) return;

    setStatus("sending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        setErrors({});
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-16 md:py-28 px-6 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <SectionWrapper>
          <p
            className="text-cyan-400 text-sm mb-3 tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Contact
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center">
            <span className="gradient-text">Let&apos;s Connect</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-center">
            Interested in collaborating, hiring, or building something impactful
            together? Let&apos;s connect.
          </p>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-8 items-start mt-16">
          <SectionWrapper>
            <form
              action={`https://formspree.io/f/${FORMSPREE_ID}`}
              method="POST"
              onSubmit={handleSubmit}
              className="panel p-6 md:p-8 space-y-5"
            >
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  onChange={() => setErrors((p) => ({ ...p, name: undefined }))}
                  onBlur={(e) => {
                    const err = validateName(e.target.value);
                    if (err) setErrors((p) => ({ ...p, name: err }));
                  }}
                  className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm font-mono"
                />
                {errors.name && <p className="text-red-400 text-[11px] mt-1 font-mono">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  onChange={() => setErrors((p) => ({ ...p, email: undefined }))}
                  onBlur={(e) => {
                    const err = validateEmail(e.target.value);
                    if (err) setErrors((p) => ({ ...p, email: err }));
                  }}
                  className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm font-mono"
                />
                {errors.email && <p className="text-red-400 text-[11px] mt-1 font-mono">{errors.email}</p>}
              </div>
              <div>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Your Message"
                  onChange={() => setErrors((p) => ({ ...p, message: undefined }))}
                  onBlur={(e) => {
                    const err = validateMessage(e.target.value);
                    if (err) setErrors((p) => ({ ...p, message: err }));
                  }}
                  className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm font-mono resize-none"
                />
                {errors.message && <p className="text-red-400 text-[11px] mt-1 font-mono">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3 rounded-[6px] bg-gradient-to-r from-cyan-600 to-amber-500 text-white font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.05em" }}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
              {status === "sent" && (
                <p className="text-green-400 text-xs text-center font-mono">
                  ✓ Message sent! I&apos;ll get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-xs text-center font-mono">
                  ✗ Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>
          </SectionWrapper>

          <div className="space-y-4">
            <SectionWrapper>
              <div className="panel p-6 space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                  Email
                </p>
                <p className="text-white text-sm">bhandaripriyanka028@gmail.com</p>
              </div>
            </SectionWrapper>
            <SectionWrapper>
              <div className="panel p-6 space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                  Location
                </p>
                <p className="text-white text-sm">Mira Road ,Mumbai, Maharashtra</p>
              </div>
            </SectionWrapper>
            <SectionWrapper>
              <div className="panel p-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-mono">
                  Social
                </p>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="w-10 h-10 rounded-[6px] bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all font-mono"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
