"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlobeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geo = new THREE.SphereGeometry(3, 24, 18);
    const edges = new THREE.EdgesGeometry(geo);

    const mat = new THREE.LineBasicMaterial({
      color: "#00d4ff",
      transparent: true,
      opacity: 0,
    });

    const wireframe = new THREE.LineSegments(edges, mat);
    wireframe.position.y = -0.5;
    scene.add(wireframe);

    const innerGeo = new THREE.SphereGeometry(2.5, 16, 12);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: "#ffd700",
      transparent: true,
      opacity: 0,
    });
    const innerWire = new THREE.LineSegments(innerEdges, innerMat);
    innerWire.position.y = -0.5;
    scene.add(innerWire);

    const latLines: THREE.LineSegments[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(3.2 + i * 0.6, 0.02, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? "#ffd700" : "#00d4ff",
        transparent: true,
        opacity: 0,
        wireframe: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.3;
      ring.rotation.z = i * 0.2;
      ring.position.y = -0.5;
      scene.add(ring);
      latLines.push(ring as unknown as THREE.LineSegments);
    }

    const allMeshes = [wireframe, innerWire, ...latLines];

    const onLoad = () => {
      gsap.to(mat, { opacity: 0.4, duration: 1.2, ease: "power2.out", delay: 0.2 });
      gsap.to(innerMat, { opacity: 0.25, duration: 1.2, ease: "power2.out", delay: 0.4 });
      latLines.forEach((m, i) => {
        gsap.to(m.material, { opacity: 0.15 + i * 0.05, duration: 1, ease: "power2.out", delay: 0.3 + i * 0.15 });
      });
      gsap.fromTo(wireframe.position, { y: 2 }, { y: -0.5, duration: 1.5, ease: "power3.out", delay: 0.1 });
    };
    onLoad();

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scale = 1 + self.progress * 0.15;
        allMeshes.forEach((m) => {
          m.scale.setScalar(scale);
        });
      },
    });

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    const animate = () => {
      wireframe.rotation.y += 0.004;
      wireframe.rotation.x += 0.001;
      innerWire.rotation.y -= 0.006;
      innerWire.rotation.x += 0.002;
      latLines.forEach((m, i) => {
        m.rotation.z += 0.002 * (i + 1);
        m.rotation.x += 0.001 * (i + 1);
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
      geo.dispose();
      edges.dispose();
      mat.dispose();
      innerGeo.dispose();
      innerEdges.dispose();
      innerMat.dispose();
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
