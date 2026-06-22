"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParticleNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count = 100;
    const radius = 25;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities: { x: number; y: number; z: number }[] = [];

    const c1 = new THREE.Color("#00d4ff");
    const c2 = new THREE.Color("#66e5ff");
    const c3 = new THREE.Color("#ffd700");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = [c1, c2, c3][Math.floor(Math.random() * 3)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.4 + Math.random() * 0.8;
      velocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.004,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    const initPos = new Float32Array(positions);

    const lineGeo = new THREE.BufferGeometry();
    const maxLines = count * 3;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    let lineCount = 0;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 7 && lineCount < maxLines) {
          linePositions[lineCount * 6] = positions[i * 3];
          linePositions[lineCount * 6 + 1] = positions[i * 3 + 1];
          linePositions[lineCount * 6 + 2] = positions[i * 3 + 2];
          linePositions[lineCount * 6 + 3] = positions[j * 3];
          linePositions[lineCount * 6 + 4] = positions[j * 3 + 1];
          linePositions[lineCount * 6 + 5] = positions[j * 3 + 2];
          const alpha = 1 - dist / 7;
          for (let k = 0; k < 2; k++) {
            lineColors[lineCount * 6 + k * 3] = colors[i * 3] * alpha;
            lineColors[lineCount * 6 + k * 3 + 1] = colors[i * 3 + 1] * alpha;
            lineColors[lineCount * 6 + k * 3 + 2] = colors[i * 3 + 2] * alpha;
          }
          lineCount++;
        }
      }
    }

    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions.slice(0, lineCount * 6), 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors.slice(0, lineCount * 6), 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const group = new THREE.Group();
    group.add(particleSystem);
    group.add(lines);
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

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
        const rot = self.progress * Math.PI * 0.8;
        group.rotation.x = rot * 0.3;
        group.rotation.z = rot * 0.15;
      },
    });

    const timer = new THREE.Timer();

    const animate = () => {
      const t = timer.getElapsed();
      const pos = particleGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        pos[i * 3] = initPos[i * 3] + Math.sin(t * 0.2 + i * 0.1) * 1.5;
        pos[i * 3 + 1] = initPos[i * 3 + 1] + Math.cos(t * 0.15 + i * 0.08) * 1.2;
        pos[i * 3 + 2] = initPos[i * 3 + 2] + Math.sin(t * 0.12 + i * 0.05) * 1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(particleSystem);
      let hovered = -1;
      if (intersects.length > 0) {
        const idx = intersects[0].index;
        if (idx !== undefined) hovered = idx;
      }

      const sizesAttrib = particleGeo.attributes.size;
      const sizesArr = sizesAttrib.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const baseSize = 0.4 + (i % 10) * 0.08;
        sizesArr[i] = i === hovered ? baseSize * 3 : baseSize + Math.sin(t * 0.5 + i) * 0.1;
      }
      sizesAttrib.needsUpdate = true;

      const linePos = lineGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < lineCount; i++) {
        const pi = linePositions[i * 6];
        const pj = linePositions[i * 6 + 3];
        let idx1 = -1;
        let idx2 = -1;
        for (let k = 0; k < count; k++) {
          if (Math.abs(initPos[k * 3] - pi) < 0.01) { idx1 = k; break; }
        }
        for (let k = 0; k < count; k++) {
          if (Math.abs(initPos[k * 3] - pj) < 0.01 && k !== idx1) { idx2 = k; break; }
        }
        if (idx1 >= 0 && idx2 >= 0) {
          linePos[i * 6] = pos[idx1 * 3];
          linePos[i * 6 + 1] = pos[idx1 * 3 + 1];
          linePos[i * 6 + 2] = pos[idx1 * 3 + 2];
          linePos[i * 6 + 3] = pos[idx2 * 3];
          linePos[i * 6 + 4] = pos[idx2 * 3 + 1];
          linePos[i * 6 + 5] = pos[idx2 * 3 + 2];
        }
      }
      lineGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
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
