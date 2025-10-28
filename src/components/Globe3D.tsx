import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { trackingAPI, ShipmentData } from '../services/trackingService';

interface CargoLocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  shipments: ShipmentData[];
  type: 'continent';
  commonCargoTypes: string[];
  majorExports: string[];
  majorImports: string[];
}

// Continent coordinates for major shipping locations with cargo type data
const continentCoordinates: Record<string, { 
  lat: number; 
  lng: number; 
  commonCargoTypes: string[];
  majorExports: string[];
  majorImports: string[];
}> = {
  'North America': { 
    lat: 39.8283, lng: -98.5795, // Geographic center of continental United States
    commonCargoTypes: ['Technology', 'Agricultural Products', 'Automotive Parts', 'Pharmaceuticals'],
    majorExports: ['Technology', 'Agricultural Products', 'Machinery', 'Entertainment'],
    majorImports: ['Electronics', 'Textiles', 'Raw Materials', 'Energy']
  },
  'South America': { 
    lat: -14.2350, lng: -51.9253, // Geographic center of Brazil
    commonCargoTypes: ['Coffee', 'Soybeans', 'Beef', 'Minerals'],
    majorExports: ['Agricultural Products', 'Minerals', 'Coffee', 'Beef'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals', 'Energy']
  },
  'Europe': { 
    lat: 54.5260, lng: 15.2551, // Geographic center of Europe
    commonCargoTypes: ['Luxury Goods', 'Automotive Parts', 'Pharmaceuticals', 'Machinery'],
    majorExports: ['Machinery', 'Automotive Parts', 'Luxury Goods', 'Pharmaceuticals'],
    majorImports: ['Energy', 'Electronics', 'Raw Materials', 'Food Products']
  },
  'Africa': { 
    lat: -8.7832, lng: 34.5085, // Geographic center of Africa
    commonCargoTypes: ['Minerals', 'Agricultural Products', 'Textiles', 'Oil'],
    majorExports: ['Minerals', 'Oil', 'Agricultural Products', 'Diamonds'],
    majorImports: ['Machinery', 'Electronics', 'Food Products', 'Textiles']
  },
  'Asia': { 
    lat: 34.0479, lng: 100.6197, // Geographic center of Asia
    commonCargoTypes: ['Electronics', 'Textiles', 'Machinery', 'Chemicals'],
    majorExports: ['Electronics', 'Textiles', 'Machinery', 'Chemicals'],
    majorImports: ['Raw Materials', 'Energy', 'Food Products', 'Minerals']
  },
  'Oceania': { 
    lat: -25.2744, lng: 133.7751, // Geographic center of Australia
    commonCargoTypes: ['Mining Equipment', 'Agricultural Products', 'Wool', 'Minerals'],
    majorExports: ['Minerals', 'Agricultural Products', 'Wool', 'Coal'],
    majorImports: ['Machinery', 'Electronics', 'Oil', 'Textiles']
  }
};

const Globe = ({ onLocationClick }: { onLocationClick: (location: CargoLocationData) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [cargoLocations, setCargoLocations] = useState<CargoLocationData[]>([]);

  const globeRadius = 2; // Back to reasonable size

  // Load realistic Earth texture
  const earthTexture = useTexture('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg');

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await trackingAPI.getAllShipments(1, 100);
        const shipments = response.data || [];
        
        // Create locations from continents with realistic cargo information
        const locationMap = new Map<string, CargoLocationData>();
        
        // Add all continents as potential shipping locations
        const continents = Object.keys(continentCoordinates);
        
        continents.forEach((continentName, index) => {
          const continentData = continentCoordinates[continentName];
          if (continentData) {
            const key = `${continentName}_continent`;
            locationMap.set(key, {
              id: key,
              name: continentName,
              lat: continentData.lat,
              lng: continentData.lng,
              shipments: [], // We'll show cargo types instead of actual shipments
              type: 'continent',
              commonCargoTypes: continentData.commonCargoTypes,
              majorExports: continentData.majorExports,
              majorImports: continentData.majorImports
            });
          }
        });
        
        setCargoLocations(Array.from(locationMap.values()));
        console.log('Loaded continent locations:', Array.from(locationMap.values())); // Debug log
      } catch (error) {
        console.error('Error fetching shipments for globe:', error);
        
        // Fallback: show continents even if API fails
        const continents = Object.keys(continentCoordinates);
        
        const fallbackLocations = continents.map((continentName, index) => {
          const continentData = continentCoordinates[continentName];
          
          return {
            id: `${continentName}_continent`,
            name: continentName,
            lat: continentData.lat,
            lng: continentData.lng,
            shipments: [],
            type: 'continent',
            commonCargoTypes: continentData.commonCargoTypes,
            majorExports: continentData.majorExports,
            majorImports: continentData.majorImports
          } as CargoLocationData;
        });
        
        setCargoLocations(fallbackLocations);
        console.log('Loaded fallback continent locations:', fallbackLocations); // Debug log
      }
    };
    
    fetchShipments();
  }, []);

  const getPosition = (lat: number, lng: number, radius: number) => {
    // Convert lat/lng to Three.js coordinates for proper Earth texture alignment
    // Standard Earth texture mapping in Three.js
    const phi = (90 - lat) * (Math.PI / 180); // Polar angle from north pole
    const theta = (lng + 180) * (Math.PI / 180); // Azimuthal angle, offset by 180°
    
    // Convert to Cartesian coordinates with proper orientation
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return [x, y, z] as [number, number, number];
  };

  return (
    <group ref={groupRef}>
      {/* Main globe with very bright, bluish Earth texture */}
      <mesh 
        ref={meshRef} 
        geometry={useMemo(() => new THREE.SphereGeometry(globeRadius, 64, 64), [])}
      >
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.3}
          metalness={0.1}
          emissive="#004080"
          emissiveIntensity={0.6}
          color="#E3F2FD"
          transparent={false}
          opacity={1.0}
        />
      </mesh>

      {/* Very bright blue atmospheric glow effect */}
      <mesh geometry={useMemo(() => new THREE.SphereGeometry(globeRadius * 1.02, 64, 64), [])}>
        <meshBasicMaterial 
          color="#29B6F6" 
          transparent 
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Additional intense outer glow for maximum brightness */}
      <mesh geometry={useMemo(() => new THREE.SphereGeometry(globeRadius * 1.05, 32, 32), [])}>
        <meshBasicMaterial 
          color="#03A9F4" 
          transparent 
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Extra bright blue rim light */}
      <mesh geometry={useMemo(() => new THREE.SphereGeometry(globeRadius * 1.08, 16, 16), [])}>
        <meshBasicMaterial 
          color="#0288D1" 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Continent markers */}
      {cargoLocations.map((location) => (
        <Sphere
          key={location.id}
          args={[0.15, 16, 16]} // Larger spheres for better visibility
          position={getPosition(location.lat, location.lng, globeRadius + 0.05)}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Clicked continent:', location.name); // Debug log
            onLocationClick(location);
          }}
          onPointerOver={(e) => {
            e.object.scale.set(1.5, 1.5, 1.5);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.object.scale.set(1, 1, 1);
            document.body.style.cursor = 'auto';
          }}
        >
          <meshBasicMaterial 
            color="#FF6B35" 
            transparent 
            opacity={1.0}
          />
        </Sphere>
      ))}

      {/* Enhanced bright and bluish lighting - increased intensities */}
      <ambientLight intensity={1.5} color="#E1F5FE" />
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={2.8} 
        color="#FFFFFF"
        castShadow={false}
      />
      <directionalLight 
        position={[-3, 2, -3]} 
        intensity={2.0} 
        color="#E1F5FE"
      />
      <directionalLight 
        position={[0, 5, 0]} 
        intensity={1.8} 
        color="#BBDEFB"
      />
      <directionalLight 
        position={[0, -3, 3]} 
        intensity={1.5} 
        color="#90CAF9"
      />
    </group>
  );
};

const Globe3D = () => {
  const [selectedLocation, setSelectedLocation] = useState<CargoLocationData | null>(null);

  const handleLocationClick = (location: CargoLocationData) => {
    setSelectedLocation(location);
  };

  const handleCloseDetailPanel = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[380px] lg:h-[450px]">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.3}
            minDistance={3}
            maxDistance={8}
            enableDamping={true}
            dampingFactor={0.1}
            target={[0, 0, 0]}
            makeDefault={false}
          />++
          <Globe onLocationClick={handleLocationClick} />
        </Suspense>
      </Canvas>
      
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <button
            onClick={handleCloseDetailPanel}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-2 text-black">{selectedLocation.name}</h3>
          <div className="text-sm text-black">
            <div className="mb-2">
              <strong className="text-black">Common Cargo Types:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedLocation.commonCargoTypes.map((type, index) => (
                  <span key={index} className="bg-blue-100 text-black px-2 py-1 rounded text-xs">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <strong className="text-black">Major Exports:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedLocation.majorExports.map((export_, index) => (
                  <span key={index} className="bg-green-100 text-black px-2 py-1 rounded text-xs">
                    {export_}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong className="text-black">Major Imports:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedLocation.majorImports.map((import_, index) => (
                  <span key={index} className="bg-orange-100 text-black px-2 py-1 rounded text-xs">
                    {import_}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Globe3D;
