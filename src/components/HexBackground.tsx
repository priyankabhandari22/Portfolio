"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function createHexTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.6)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function HexBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const hexTexture = createHexTexture();
    const count = 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const spreads = new Float32Array(count);

    const c1 = new THREE.Color("#00d4ff");
    const c2 = new THREE.Color("#66e5ff");
    const c3 = new THREE.Color("#ffd700");

    const spawnDepth = -60;
    const despawnDepth = 20;

    for (let i = 0; i < count; i++) {
      const spread = 0.3 + Math.random() * 2;
      spreads[i] = spread;
      positions[i * 3] = (Math.random() - 0.5) * spread * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 10;
      positions[i * 3 + 2] = spawnDepth + Math.random() * (despawnDepth - spawnDepth);

      const c = [c1, c2, c3][Math.floor(Math.random() * 3)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.03 + Math.random() * 0.08;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      map: hexTexture,
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        points.rotation.x = self.progress * 0.2;
        points.rotation.y = self.progress * 0.4;
      },
    });

    const animate = () => {
      const pos = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 2] += speeds[i];

        const spread = spreads[i];
        const targetSpread = 0.2 + (pos[i * 3 + 2] - spawnDepth) / (despawnDepth - spawnDepth) * 0.5;
        pos[i * 3] *= targetSpread / spread;
        pos[i * 3 + 1] *= targetSpread / spread;

        if (pos[i * 3 + 2] > despawnDepth) {
          pos[i * 3 + 2] = spawnDepth;
          const newSpread = 0.3 + Math.random() * 2;
          spreads[i] = newSpread;
          pos[i * 3] = (Math.random() - 0.5) * newSpread * 15;
          pos[i * 3 + 1] = (Math.random() - 0.5) * newSpread * 10;
        }
      }
      geo.attributes.position.needsUpdate = true;

      mat.opacity = 0.6 + Math.sin(Date.now() * 0.0005) * 0.2;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      hexTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      aria-hidden="true"
    />
  );
}
