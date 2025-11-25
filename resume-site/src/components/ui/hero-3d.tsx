"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

function AnimatedSphere() {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Sphere args={[1, 64, 64]} scale={2} ref={meshRef}>
            <MeshDistortMaterial
                color="#3b82f6"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

export function Hero3D() {
    return (
        <div className="absolute inset-0 -z-5 opacity-30 dark:opacity-50 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 2]} gl={{ antialias: true }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <AnimatedSphere />
                </Float>
            </Canvas>
        </div>
    );
}
