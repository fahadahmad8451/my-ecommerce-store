"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float wave = sin((uv.y * 18.0) + uTime * 2.2) * 0.018;
    float threshold = uProgress + wave;
    float mask = smoothstep(threshold - 0.08, threshold + 0.08, uv.x);
    float grain = random(uv + uTime) * 0.04;

    vec3 dark = vec3(0.025, 0.03, 0.045);
    vec3 blue = vec3(0.12, 0.22, 0.62);
    vec3 color = mix(blue, dark, uv.y) + grain;

    float alpha = (1.0 - mask) * smoothstep(0.0, 0.12, uProgress) * smoothstep(1.0, 0.82, uProgress);
    gl_FragColor = vec4(color, alpha);
  }
`;

function ShaderPlane({ trigger, onDone }: { trigger: number; onDone: () => void }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const progress = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    progress.current = 0;
    startTime.current = performance.now();
  }, [trigger]);

  useFrame((state) => {
    if (!material.current) return;

    const elapsed = (performance.now() - startTime.current) / 1000;
    const p = Math.min(1, elapsed / 0.85);
    progress.current = p;

    material.current.uniforms.uProgress.value = p;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;

    if (p >= 1) onDone();
  });

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 }
    }),
    []
  );

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        transparent
        depthTest={false}
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function RouteShaderTransition() {
  const pathname = usePathname();
  const [trigger, setTrigger] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setTrigger((v) => v + 1);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="route-shader-transition" aria-hidden="true">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <ShaderPlane trigger={trigger} onDone={() => setVisible(false)} />
      </Canvas>
    </div>
  );
}
