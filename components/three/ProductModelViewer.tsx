"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function FallbackProduct() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.22;
  });

  return (
    <group ref={group} rotation={[0.08, -0.35, 0]}>
      <mesh position={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[3.6, 0.22, 2.15]} />
        <meshStandardMaterial color="#252b35" metalness={0.72} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.65, -0.1]} castShadow>
        <boxGeometry args={[2.4, 1.45, 0.1]} />
        <meshStandardMaterial color="#101318" metalness={0.55} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.05, -0.12]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.15, 32]} />
        <meshStandardMaterial color="#303744" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function GLBModel({ path }: { path: string }) {
  const gltf = useGLTF(path);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      state.pointer.x * 0.35,
      0.05
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -state.pointer.y * 0.12,
      0.05
    );
  });

  return (
    <group ref={ref}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export function ProductModelViewer({ model }: { model?: string }) {
  return (
    <div className="real-model-viewer">
      <Canvas camera={{ position: [0, 1.25, 6], fov: 38 }} dpr={[1, 1.7]} shadows>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={3} castShadow />
        <pointLight position={[-4, 2, 1]} intensity={7} color="#496fff" />

        <Suspense fallback={null}>
          {model ? <GLBModel path={model} /> : <FallbackProduct />}
          <ContactShadows position={[0, -0.58, 0]} scale={7} blur={2.4} opacity={0.45} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={4}
          maxDistance={8}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.67}
        />
      </Canvas>

      <div className="model-viewer-hud">
        <span>360° VIEW</span>
        <span>{model ? "GLB MODEL" : "PROCEDURAL FALLBACK"}</span>
      </div>
    </div>
  );
}
