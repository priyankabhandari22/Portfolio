"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Starfield() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const zDepths = new Float32Array(count);

    const c1 = new THREE.Color("#ffffff");
    const c2 = new THREE.Color("#00d4ff");
    const c3 = new THREE.Color("#ffd700");
    const c4 = new THREE.Color("#66e5ff");

    for (let i = 0; i < count; i++) {
      const z = -10 - Math.random() * 90;
      zDepths[i] = z;
      positions[i * 3] = (Math.random() - 0.5) * (80 + Math.abs(z) * 0.8);
      positions[i * 3 + 1] = (Math.random() - 0.5) * (60 + Math.abs(z) * 0.6);
      positions[i * 3 + 2] = z;

      const c = [c1, c1, c1, c2, c2, c3, c4][Math.floor(Math.random() * 7)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.3 + Math.random() * 1.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geo, mat);
    scene.add(stars);

    const mouseTarget = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    let cameraZ = 15;
    let targetZ = 15;

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const section = Math.floor(self.progress * 5);
        targetZ = 15 - section * 6;
      },
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        targetZ = 15 - self.progress * 25;
      },
    });

    const animate = () => {
      currentMouse.x += (mouseTarget.x - currentMouse.x) * 0.05;
      currentMouse.y += (mouseTarget.y - currentMouse.y) * 0.05;

      cameraZ += (targetZ - cameraZ) * 0.04;
      camera.position.z = cameraZ;

      stars.rotation.x = currentMouse.y * 0.1;
      stars.rotation.y = currentMouse.x * 0.15;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
      geo.dispose();
      mat.dispose();
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
