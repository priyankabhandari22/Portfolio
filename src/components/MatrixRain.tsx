"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function createCharTexture(char: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 48, 64);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 24, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

interface Drop {
  x: number;
  y: number;
  z: number;
  speed: number;
  sprite: THREE.Sprite;
}

export default function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010810, 0.02);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const drops: Drop[] = [];
    const columnCount = 25;
    const baseSpeed = 0.1;
    let speedMultiplier = 1;

    for (let i = 0; i < columnCount; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const tex = createCharTexture(char);
      const color = Math.random() > 0.7 ? "#ffd700" : "#00d4ff";
      const mat = new THREE.SpriteMaterial({
        map: tex,
        color: color,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      const z = -3 - Math.random() * 15;
      sprite.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        z
      );
      const scale = 1 + (z + 18) / 20 * 2;
      sprite.scale.set(scale * 0.6, scale, 1);
      scene.add(sprite);

      drops.push({
        x: sprite.position.x,
        y: sprite.position.y,
        z,
        speed: baseSpeed + Math.random() * 0.08,
        sprite,
      });
    }

    let extraDrops: Drop[] = [];
    for (let i = 0; i < 8; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const tex = createCharTexture(char);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        color: "#ffd700",
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(
        (Math.random() - 0.5) * 30,
        -12,
        -3 - Math.random() * 15
      );
      const z = sprite.position.z;
      const scale = 1 + (z + 18) / 20 * 2;
      sprite.scale.set(scale * 0.6, scale, 1);
      sprite.visible = false;
      scene.add(sprite);

      extraDrops.push({
        x: sprite.position.x,
        y: sprite.position.y,
        z,
        speed: baseSpeed * 2 + Math.random() * 0.15,
        sprite,
      });
    }

    let lastSection = 0;
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const section = Math.floor(self.progress * 5);
        if (section !== lastSection) {
          lastSection = section;
          gsap.to({ v: speedMultiplier }, {
            v: 3,
            duration: 0.2,
            ease: "power2.out",
            onUpdate: function () { speedMultiplier = this.targets()[0].v; },
            onComplete: () => {
              gsap.to({ v: speedMultiplier }, {
                v: 1,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: function () { speedMultiplier = this.targets()[0].v; },
              });
            },
          });

          extraDrops.forEach((d) => {
            d.sprite.visible = true;
            gsap.to(d.sprite.material, { opacity: 0.5, duration: 0.15 });
            d.y = -15;
            d.x = (Math.random() - 0.5) * 30;
            d.sprite.position.x = d.x;
          });
        }
      },
    });

    let frameCount = 0;
    const animate = () => {
      frameCount++;

      for (const d of drops) {
        d.y += d.speed * speedMultiplier;
        if (d.y > 12) {
          d.y = -12;
          d.x = (Math.random() - 0.5) * 30;
          const newChar = chars[Math.floor(Math.random() * chars.length)];
          (d.sprite.material as THREE.SpriteMaterial).map = createCharTexture(newChar);
          (d.sprite.material as THREE.SpriteMaterial).needsUpdate = true;
        }
        d.sprite.position.y = d.y;
      }

      for (const d of extraDrops) {
        if (!d.sprite.visible) continue;
        d.y += d.speed * speedMultiplier;
        d.sprite.position.y = d.y;
        if (d.y > 15) {
          d.sprite.visible = false;
          d.sprite.material.opacity = 0;
        }
      }

      if (frameCount % 20 === 0) {
        const idx = Math.floor(Math.random() * drops.length);
        const newChar = chars[Math.floor(Math.random() * chars.length)];
        (drops[idx].sprite.material as THREE.SpriteMaterial).map = createCharTexture(newChar);
        (drops[idx].sprite.material as THREE.SpriteMaterial).needsUpdate = true;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
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
