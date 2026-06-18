"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Crack {
  points: { x: number; y: number }[];
  life: number;
  maxLife: number;
  alpha: number;
  width: number;
}

export default function CrackBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const sparks: Spark[] = [];
    const cracks: Crack[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnCrack = () => {
      const segments = 2 + Math.floor(Math.random() * 4);
      const points: { x: number; y: number }[] = [];
      let x = Math.random() * w;
      let y = Math.random() * h;
      let angle = Math.random() * Math.PI * 2;
      points.push({ x, y });
      for (let i = 0; i < segments; i++) {
        angle += (Math.random() - 0.5) * 1.2;
        const len = 20 + Math.random() * 60;
        x += Math.cos(angle) * len;
        y += Math.sin(angle) * len;
        points.push({ x, y });
      }
      cracks.push({
        points,
        life: 0,
        maxLife: 40 + Math.random() * 60,
        alpha: 1,
        width: 0.5 + Math.random() * 1.5,
      });
    };

    const spawnSpark = () => {
      const colors = ["#00d4ff", "#66e5ff", "#ffd700", "#0088aa"];
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.6,
        life: 0,
        maxLife: 60 + Math.random() * 120,
        size: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    let frame = 0;
    const draw = () => {
      ctx!.clearRect(0, 0, w, h);
      frame++;

      if (frame % 8 === 0 && cracks.length < 12) spawnCrack();
      if (frame % 3 === 0 && sparks.length < 80) spawnSpark();

      for (let i = cracks.length - 1; i >= 0; i--) {
        const c = cracks[i];
        c.life++;
        const progress = c.life / c.maxLife;
        if (progress >= 1) {
          cracks.splice(i, 1);
          continue;
        }
        c.alpha = progress < 0.15 ? progress / 0.15 : progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

        ctx!.beginPath();
        ctx!.moveTo(c.points[0].x, c.points[0].y);
        for (let j = 1; j < c.points.length; j++) {
          ctx!.lineTo(c.points[j].x, c.points[j].y);
        }
        ctx!.strokeStyle = `rgba(0, 212, 255, ${c.alpha * 0.35})`;
        ctx!.lineWidth = c.width;
        ctx!.shadowColor = `rgba(0, 212, 255, ${c.alpha * 0.5})`;
        ctx!.shadowBlur = 8;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.003;
        if (s.life >= s.maxLife || s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
          sparks.splice(i, 1);
          continue;
        }
        const alpha = s.life < 20 ? s.life / 20 : s.life > s.maxLife - 20 ? (s.maxLife - s.life) / 20 : 1;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fillStyle = s.color;
        ctx!.globalAlpha = alpha * 0.6;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}
