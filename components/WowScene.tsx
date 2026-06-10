"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Stazioni del viaggio: un oggetto cosmico per servizio
const STATIONS = [
  { z: -45, x: -9, y: 1, color: "#6366f1" },   // holo-sphere
  { z: -88, x: 9, y: -1, color: "#8b5cf6" },   // stargate
  { z: -132, x: -9, y: 2, color: "#22d3ee" },  // crystal
  { z: -175, x: 9, y: -2, color: "#a78bfa" },  // mini galaxy
];

/* ---------- Star tunnel con warp ---------- */

const starsVert = `
  attribute float aSize;
  attribute float aFlicker;
  uniform float uTime;
  uniform float uCamZ;
  uniform float uWarp;
  varying float vAlpha;
  varying float vStretch;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    pos.z = uCamZ + 10.0 - mod(uCamZ + 10.0 - pos.z, 400.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = length(mv.xyz);
    float flicker = sin(uTime * aFlicker + aFlicker * 37.0) * 0.3 + 0.7;

    gl_PointSize = aSize * flicker * (1.0 + uWarp * 1.5) * (140.0 / max(1.0, dist));
    gl_Position = projectionMatrix * mv;

    vAlpha = flicker * smoothstep(320.0, 30.0, dist);
    vStretch = uWarp;
    vColor = color;
  }
`;

const starsFrag = `
  varying float vAlpha;
  varying float vStretch;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    uv.y /= (1.0 + vStretch * 3.0);
    float d = length(uv);
    if (d > 0.5) discard;

    float core = exp(-d * 16.0);
    float glow = exp(-d * 5.0) * 0.5;
    float streak = exp(-abs(uv.x) * 30.0) * exp(-abs(uv.y) * (3.0 - vStretch * 2.0)) * (0.2 + vStretch * 0.9);
    float b = core + glow + streak;

    vec3 col = mix(vColor, vec3(0.6, 0.75, 1.0), vStretch * 0.6);
    gl_FragColor = vec4(col * b, b * vAlpha);
  }
`;

function StarTunnel() {
  const count = 4500;

  const [positions, colors, sizes, flickers] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const fli = new Float32Array(count);
    const palette: [number, number, number][] = [
      [1.0, 1.0, 1.0],
      [0.78, 0.82, 1.0],
      [1.0, 0.86, 0.7],
      [0.65, 0.78, 1.0],
      [0.85, 0.7, 1.0],
    ];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 48;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r * 0.7;
      pos[i * 3 + 2] = -Math.random() * 400;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
      siz[i] = Math.random() < 0.04 ? Math.random() * 6 + 4 : Math.random() * 2.2 + 0.8;
      fli[i] = Math.random() * 4 + 1;
    }
    return [pos, col, siz, fli];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCamZ: { value: 20 },
    uWarp: { value: 0 },
  }), []);

  const prevZ = useRef(20);

  useFrame((state) => {
    const camZ = state.camera.position.z;
    const dz = Math.abs(camZ - prevZ.current);
    prevZ.current = camZ;

    let targetWarp = Math.min(dz * 2.2, 3);
    if (camZ < -200) targetWarp += Math.min((-200 - camZ) / 35, 1) * 1.2;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uCamZ.value = camZ;
    uniforms.uWarp.value += (targetWarp - uniforms.uWarp.value) * 0.08;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aFlicker" args={[flickers, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starsVert}
        fragmentShader={starsFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

/* ---------- Fresnel glow shell (alone atmosferico) ---------- */

const fresnelVert = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fresnelFrag = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - abs(dot(vNormal, vView)), 2.5);
    gl_FragColor = vec4(uColor, f * uIntensity);
  }
`;

function FresnelShell({ radius, color, intensity = 0.8 }: { radius: number; color: string; intensity?: number }) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uIntensity: { value: intensity },
  }), [color, intensity]);

  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <shaderMaterial
        vertexShader={fresnelVert}
        fragmentShader={fresnelFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ---------- Tappa 01: Sfera olografica (Consulenza IT) ---------- */

function HoloSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const satsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.6;
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.25;
      wireRef.current.rotation.x = Math.sin(t * 0.15) * 0.3;
    }
    if (satsRef.current) satsRef.current.rotation.y = t * 0.7;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Nucleo */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#e0e7ff" emissive={color} emissiveIntensity={1.8} roughness={1} />
      </mesh>
      {/* Gabbia wireframe */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[3.4, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
      <FresnelShell radius={3.9} color={color} intensity={0.6} />
      {/* Satelliti in orbita */}
      <group ref={satsRef}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 4.6, Math.sin(a * 2) * 0.4, Math.sin(a) * 4.6]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#fff" emissive="#c7d2fe" emissiveIntensity={2.5} roughness={1} />
            </mesh>
          );
        })}
      </group>
      <pointLight color={color} intensity={50} distance={30} />
    </group>
  );
}

/* ---------- Tappa 02: Stargate (Domini) ---------- */

const portalFrag = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float r = length(c) * 2.0;
    float a = atan(c.y, c.x);
    float swirl = sin(a * 3.0 + uTime * 2.2 - r * 9.0) * 0.5 + 0.5;
    float fade = smoothstep(1.0, 0.15, r);
    float core = exp(-r * 3.5);
    vec3 col = uColor * (swirl * 0.7 + 0.3) + vec3(1.0) * core * 0.7;
    gl_FragColor = vec4(col, fade * (0.3 + swirl * 0.5));
  }
`;

const portalVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Stargate({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), [color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.35 + 2) * 0.6;
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.35 - 0.4;
    }
    if (ringRef.current) ringRef.current.rotation.z = t * 0.3;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Anello */}
      <mesh ref={ringRef}>
        <torusGeometry args={[4, 0.28, 24, 90]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Vortice interno */}
      <mesh>
        <circleGeometry args={[3.7, 64]} />
        <shaderMaterial
          vertexShader={portalVert}
          fragmentShader={portalFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight color={color} intensity={55} distance={30} />
    </group>
  );
}

/* ---------- Tappa 03: Cristallo (Grafica & Logo) ---------- */

function Crystal({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const mainRef = useRef<THREE.Mesh>(null);
  const shardsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.position.y = position[1] + Math.sin(t * 0.45 + 4) * 0.6;
    if (mainRef.current) {
      mainRef.current.rotation.y = t * 0.35;
      mainRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (shardsRef.current) shardsRef.current.rotation.y = -t * 0.5;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Cristallo principale — ottaedro allungato sfaccettato */}
      <mesh ref={mainRef} scale={[1, 1.7, 1]}>
        <octahedronGeometry args={[2.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.3}
          flatShading
        />
      </mesh>
      <FresnelShell radius={4.2} color={color} intensity={0.45} />
      {/* Schegge orbitanti */}
      <group ref={shardsRef}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2;
          const s = 0.4 + (i % 2) * 0.25;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 4.2, Math.sin(a * 3) * 0.8, Math.sin(a) * 4.2]}
              scale={[s, s * 1.6, s]}
              rotation={[a, a * 0.7, 0]}
            >
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.2} flatShading />
            </mesh>
          );
        })}
      </group>
      <pointLight color={color} intensity={50} distance={30} />
    </group>
  );
}

/* ---------- Tappa 04: Mini galassia (Siti Web) ---------- */

function MiniGalaxy({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 1200;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const cIn = new THREE.Color("#f1f0ff");
    const cOut = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.5) * 5 + 0.2;
      const arm = i % 2;
      const angle = (arm * Math.PI) + r * 0.55 + (Math.random() - 0.5) * 0.5;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * Math.max(0.1, 0.7 - r * 0.1);
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const c = cIn.clone().lerp(cOut, Math.min(1, r / 5));
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = Math.random() * 0.14 + 0.04;
    }
    return [pos, col, siz];
  }, [color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.32;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.4 + 6) * 0.6;
    }
  });

  return (
    <group position={position} rotation={[0.5, 0, 0.25]}>
      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.12}
            vertexColors
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color="#fff" emissive="#e0e7ff" emissiveIntensity={3} roughness={1} />
        </mesh>
      </group>
      <pointLight color={color} intensity={45} distance={28} />
    </group>
  );
}

/* ---------- Sole finale ---------- */

function FinalSun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <group position={[0, 0, -275]}>
      <mesh ref={ref}>
        <sphereGeometry args={[11, 48, 48]} />
        <meshStandardMaterial color="#e0e7ff" emissive="#c4b5fd" emissiveIntensity={3.5} roughness={1} />
      </mesh>
      <pointLight color="#c4b5fd" intensity={300} distance={120} />
    </group>
  );
}

/* ---------- Camera ---------- */

function CameraRig() {
  const { camera } = useThree();
  const scroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useFrame(() => {
    const targetZ = 20 - scroll.current * 260;
    camera.position.z += (targetZ - camera.position.z) * 0.07;
    camera.position.x += (mouse.current.x * 2.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.current.y * 1.8 - camera.position.y) * 0.04;
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, camera.position.z - 40);
  });

  return null;
}

export default function WowScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 500 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1.25]}
    >
      <color attach="background" args={["#000005"]} />
      <ambientLight intensity={0.25} />

      <StarTunnel />
      <HoloSphere position={[STATIONS[0].x, STATIONS[0].y, STATIONS[0].z]} color={STATIONS[0].color} />
      <Stargate position={[STATIONS[1].x, STATIONS[1].y, STATIONS[1].z]} color={STATIONS[1].color} />
      <Crystal position={[STATIONS[2].x, STATIONS[2].y, STATIONS[2].z]} color={STATIONS[2].color} />
      <MiniGalaxy position={[STATIONS[3].x, STATIONS[3].y, STATIONS[3].z]} color={STATIONS[3].color} />
      <FinalSun />
      <CameraRig />

      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.25} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
