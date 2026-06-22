"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデド<>/{}[]|&%^$#@!";
const ATLAS_COLS = 16;
const ATLAS_ROWS = Math.ceil(chars.length / ATLAS_COLS);
const CHAR_SIZE = 32;

function buildAtlas() {
  const w = ATLAS_COLS * CHAR_SIZE;
  const h = ATLAS_ROWS * CHAR_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `bold ${CHAR_SIZE * 0.75}px 'Courier New', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < chars.length; i++) {
    const col = i % ATLAS_COLS;
    const row = Math.floor(i / ATLAS_COLS);
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#fff";
    ctx.fillText(chars[i], col * CHAR_SIZE + CHAR_SIZE / 2, row * CHAR_SIZE + CHAR_SIZE / 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const TRAIL_LEN_MAX = 24;
const COL_COUNT = 55;
const CHAR_H = 0.9;
const RESET_Y = -28;
const START_Y = 20;
const DROP_MIN = 0.04;
const DROP_MAX = 0.14;

export default function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cols = window.innerWidth < 768 ? Math.floor(COL_COUNT / 2) : COL_COUNT;
    const total = cols * TRAIL_LEN_MAX;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020808, 0.022);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020808, 1);
    container.appendChild(renderer.domElement);

    const atlas = buildAtlas();

    const geo = new THREE.PlaneGeometry(0.7, CHAR_H * 0.92);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uAtlas: { value: atlas as THREE.Texture },
        uAtlasCols: { value: ATLAS_COLS },
        uAtlasRows: { value: ATLAS_ROWS },
      },
      vertexShader: `
        attribute float aCharIdx;
        attribute float aAlpha;
        attribute float aHead;
        varying vec2 vUv;
        varying float vAlpha;
        varying float vHead;
        uniform float uAtlasCols;
        uniform float uAtlasRows;

        void main() {
          float col = mod(aCharIdx, uAtlasCols);
          float row = floor(aCharIdx / uAtlasCols);
          float cw = 1.0 / uAtlasCols;
          float ch = 1.0 / uAtlasRows;
          vUv = vec2(col * cw + uv.x * cw, 1.0 - (row * ch + (1.0 - uv.y) * ch));
          vAlpha = aAlpha;
          vHead = aHead;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlas;
        varying vec2 vUv;
        varying float vAlpha;
        varying float vHead;

        void main() {
          vec4 tex = texture2D(uAtlas, vUv);
          vec3 headColor = vec3(0.85, 1.0, 0.92);
          vec3 trailColor = vec3(0.11, 0.78, 0.46);
          vec3 col = mix(trailColor, headColor, vHead);
          gl_FragColor = vec4(col * tex.r, tex.r * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.InstancedMesh(geo, mat, total);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const aCharIdx = new Float32Array(total);
    const aAlpha = new Float32Array(total);
    const aHead = new Float32Array(total);
    mesh.geometry.setAttribute("aCharIdx", new THREE.InstancedBufferAttribute(aCharIdx, 1));
    mesh.geometry.setAttribute("aAlpha", new THREE.InstancedBufferAttribute(aAlpha, 1));
    mesh.geometry.setAttribute("aHead", new THREE.InstancedBufferAttribute(aHead, 1));
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const columns: { x: number; z: number; y: number; speed: number; trail: number; chars: number[]; baseIdx: number }[] = [];

    for (let i = 0; i < cols; i++) {
      const trailLen = 6 + Math.floor(Math.random() * (TRAIL_LEN_MAX - 6));
      columns.push({
        x: (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.5) * 18,
        y: Math.random() * -30,
        speed: DROP_MIN + Math.random() * (DROP_MAX - DROP_MIN),
        trail: trailLen,
        chars: Array.from({ length: trailLen }, () => Math.floor(Math.random() * chars.length)),
        baseIdx: i * TRAIL_LEN_MAX,
      });
    }

    function updateMatrix() {
      for (let ci = 0; ci < columns.length; ci++) {
        const col = columns[ci];
        if (Math.random() < 0.08) {
          const r = Math.floor(Math.random() * col.trail);
          col.chars[r] = Math.floor(Math.random() * chars.length);
        }
        for (let ti = 0; ti < TRAIL_LEN_MAX; ti++) {
          const g = col.baseIdx + ti;
          if (ti >= col.trail) {
            dummy.position.set(9999, 9999, 9999);
            dummy.updateMatrix();
            mesh.setMatrixAt(g, dummy.matrix);
            aAlpha[g] = 0;
            continue;
          }
          const isHead = ti === 0;
          const alpha = isHead ? 1 : Math.max(0, 1 - ti / col.trail) * 0.9;
          dummy.position.set(col.x, col.y - ti * CHAR_H, col.z);
          dummy.updateMatrix();
          mesh.setMatrixAt(g, dummy.matrix);
          aCharIdx[g] = col.chars[ti] ?? 0;
          aAlpha[g] = alpha;
          aHead[g] = isHead ? 1 : 0;
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.geometry.attributes.aCharIdx.needsUpdate = true;
      mesh.geometry.attributes.aAlpha.needsUpdate = true;
      mesh.geometry.attributes.aHead.needsUpdate = true;
    }

    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let scrollProgress = 0;
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => { scrollProgress = s.progress; },
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let speedMult = 1;
    let camTargetX = 0;
    let camTargetY = 0;

    const tick = () => {
      for (let i = 0; i < columns.length; i++) {
        columns[i].y -= columns[i].speed * speedMult;
        if (columns[i].y < RESET_Y) {
          columns[i].y = START_Y + Math.random() * 12;
          columns[i].x = (Math.random() - 0.5) * 60;
          columns[i].speed = DROP_MIN + Math.random() * (DROP_MAX - DROP_MIN);
          columns[i].trail = 6 + Math.floor(Math.random() * (TRAIL_LEN_MAX - 6));
          columns[i].chars = Array.from({ length: columns[i].trail }, () => Math.floor(Math.random() * chars.length));
        }
      }
      updateMatrix();

      camTargetX += (mouse.x * 1.2 - camTargetX) * 0.04;
      camTargetY += (-mouse.y * 0.6 - camTargetY) * 0.04;
      camera.position.x = camTargetX;
      camera.position.y = camTargetY;
      camera.position.z = 22 - scrollProgress * 14;
      camera.rotation.z = scrollProgress * 0.08;

      renderer.render(scene, camera);
    };

    gsap.ticker.add(tick);

    ScrollTrigger.create({
      trigger: "#about",
      start: "top 90%",
      onEnter: () => {
        gsap.fromTo({ s: speedMult },
          { s: 1 },
          {
            s: 3.5, duration: 0.25, ease: "power2.in",
            onUpdate: function () { speedMult = this.targets()[0].s; },
            onComplete: () => {
              gsap.to({ s: 3.5 }, {
                s: 1, duration: 0.7, ease: "power2.out",
                onUpdate: function () { speedMult = this.targets()[0].s; },
              });
            },
          },
        );
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[2]"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_30%,rgba(2,8,8,0.92)_100%)]" />
      <div className="fixed inset-0 z-[4] pointer-events-none bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />
    </>
  );
}
