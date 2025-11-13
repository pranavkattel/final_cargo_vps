import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import earthTextureImg from '../assets/images/earth_texture.jpg';

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const globeRadius = 2.5; // Increased size for better visibility

  // Load Earth texture from local assets for reliable rendering
  const earthTexture = useTexture(earthTextureImg);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} scale={[1.1, 1.1, 1.1]}>
      {/* Main globe with land masses only - Light grey tinted */}
      <mesh 
        ref={meshRef} 
        geometry={useMemo(() => new THREE.SphereGeometry(globeRadius, 64, 64), [])}
      >
        <meshStandardMaterial 
          map={earthTexture}
          color="#CBD5E0"
          roughness={0.4}
          metalness={0.1}
          transparent={false}
          opacity={1.0}
        />
      </mesh>

      {/* Subtle atmospheric glow - Light smoke grey */}
      <mesh geometry={useMemo(() => new THREE.SphereGeometry(globeRadius * 1.02, 64, 64), [])}>
        <meshBasicMaterial 
          color="#E2E8F0" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Continent markers removed - now showing on hero background */}

      {/* Bright lighting for land visibility - Light grey tones */}
      <ambientLight intensity={1.5} color="#E2E8F0" />
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={2.2} 
        color="#F7FAFC"
        castShadow={false}
      />
      <directionalLight 
        position={[-3, 2, -3]} 
        intensity={1.8} 
        color="#E2E8F0"
      />
      <directionalLight 
        position={[0, 5, 0]} 
        intensity={1.5} 
        color="#CBD5E0"
      />
    </group>
  );
};

const Globe3D = () => {
  return (
    <div className="relative h-full w-full">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            minDistance={8}
            maxDistance={8}
            enableDamping={true}
            dampingFactor={0.1}
            target={[0, 0, 0]}
            makeDefault
          />
          <Globe />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Globe3D;
