"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const galaxyVert = `
  attribute float aRadius;
  attribute float aAngle;
  attribute float aSize;
  attribute float aY;
  uniform float uTime;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Rotazione differenziale: il centro gira più veloce dei bordi
    float speed = 0.18 / (0.4 + aRadius * 0.06);
    float angle = aAngle + uTime * speed;
    vec3 pos = vec3(cos(angle) * aRadius, aY, sin(angle) * aRadius);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = length(mv.xyz);

    // Onda di luce che respira dal centro verso fuori
    float wave = 0.65 + 0.35 * sin(uTime * 0.7 - aRadius * 0.45);

    gl_PointSize = aSize * wave * (90.0 / max(1.0, dist));
    gl_Position = projectionMatrix * mv;

    vAlpha = wave * smoothstep(80.0, 8.0, dist);
    vColor = color;
  }
`;

const galaxyFrag = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = exp(-d * 14.0);
    float glow = exp(-d * 4.5) * 0.4;
    float b = core + glow;
    gl_FragColor = vec4(vColor * b, b * vAlpha);
  }
`;

function Galaxy() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 22000;
  const ARMS = 3;

  const [positions, colors, radii, angles, sizes, ys] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const rad = new Float32Array(count);
    const ang = new Float32Array(count);
    const siz = new Float32Array(count);
    const yArr = new Float32Array(count);

    const inner = new THREE.Color("#f1f0ff");
    const mid = new THREE.Color("#6366f1");
    const outer = new THREE.Color("#8b5cf6");
    const edge = new THREE.Color("#22d3ee");

    for (let i = 0; i < count; i++) {
      // Distribuzione: più densa al centro
      const r = Math.pow(Math.random(), 1.6) * 26 + 0.4;
      const arm = i % ARMS;
      const armAngle = (arm / ARMS) * Math.PI * 2;
      const spiral = r * 0.28;
      const spread = (Math.random() - 0.5) * (0.5 + r * 0.06);
      const angle = armAngle + spiral + spread;

      const thickness = Math.max(0.15, 1.6 - r * 0.05);
      const y = (Math.random() - 0.5) * thickness * (Math.random() < 0.5 ? 1 : 0.4);

      rad[i] = r;
      ang[i] = angle;
      yArr[i] = y;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      const t = r / 26;
      let c: THREE.Color;
      if (t < 0.18) c = inner.clone().lerp(mid, t / 0.18);
      else if (t < 0.6) c = mid.clone().lerp(outer, (t - 0.18) / 0.42);
      else c = outer.clone().lerp(edge, (t - 0.6) / 0.4);
      // Qualche stella brillante sparsa
      if (Math.random() < 0.015) c = new THREE.Color("#ffffff");

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = Math.random() < 0.03 ? Math.random() * 3.5 + 2 : Math.random() * 1.6 + 0.5;
    }
    return [pos, col, rad, ang, siz, yArr];
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (groupRef.current) {
      // La galassia si inclina dolcemente verso il mouse — ipnosi, non inseguimento
      groupRef.current.rotation.x += (mouse.current.y * 0.12 - groupRef.current.rotation.x) * 0.015;
      groupRef.current.rotation.z += (mouse.current.x * 0.1 - groupRef.current.rotation.z) * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
          <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aY" args={[ys, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={galaxyVert}
          fragmentShader={galaxyFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>

      {/* Nucleo */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="#f1f0ff" emissive="#c7d2fe" emissiveIntensity={2.8} roughness={1} />
      </mesh>
      <pointLight color="#a5b4fc" intensity={80} distance={40} />
    </group>
  );
}

function CameraDive() {
  const { camera } = useThree();
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    const p = scroll.current;
    // Immersione lenta: da vista dall'alto a dentro il piano galattico
    const targetY = 17 - p * 14.2;
    const targetZ = 27 - p * 19.5;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    // Orbita lentissima attorno al nucleo
    const orbit = state.clock.elapsedTime * 0.02 + p * 1.2;
    camera.position.x += (Math.sin(orbit) * 4 - camera.position.x) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function GalaxyScene() {
  return (
    <Canvas
      camera={{ position: [0, 17, 27], fov: 55, near: 0.1, far: 200 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1.25]}
    >
      <color attach="background" args={["#010108"]} />
      <ambientLight intensity={0.15} />

      <Galaxy />
      <CameraDive />

      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
