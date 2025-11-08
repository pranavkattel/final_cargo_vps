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
  popularCountries: string[];
}

// Continent coordinates with popular destination countries
const continentCoordinates: Record<string, { 
  lat: number; 
  lng: number; 
  popularCountries: string[];
}> = {
  'North America': { 
    lat: 39.8283, lng: -98.5795,
    popularCountries: ['United States', 'Canada', 'Mexico']
  },
  'South America': { 
    lat: -14.2350, lng: -51.9253,
    popularCountries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru']
  },
  'Europe': { 
    lat: 54.5260, lng: 15.2551,
    popularCountries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland']
  },
  'Africa': { 
    lat: -8.7832, lng: 34.5085,
    popularCountries: ['South Africa', 'Egypt', 'Kenya', 'Nigeria', 'Morocco']
  },
  'Asia': { 
    lat: 34.0479, lng: 100.6197,
    popularCountries: ['China', 'Japan', 'South Korea', 'India', 'Singapore', 'Thailand', 'Malaysia', 'United Arab Emirates']
  },
  'Oceania': { 
    lat: -25.2744, lng: 133.7751,
    popularCountries: ['Australia', 'New Zealand']
  }
};

const Globe = ({ onLocationClick }: { onLocationClick: (location: CargoLocationData) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [cargoLocations, setCargoLocations] = useState<CargoLocationData[]>([]);

  const globeRadius = 2.5; // Increased size for better visibility

  // Load Earth texture - land only, no oceans
  const earthTexture = useTexture('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg');

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
              shipments: [],
              type: 'continent',
              popularCountries: continentData.popularCountries
            });
          }
        });
        
        setCargoLocations(Array.from(locationMap.values()));
        console.log('Loaded continent locations:', Array.from(locationMap.values())); // Debug log
      } catch (error) {
        console.error('Error fetching shipments for globe:', error);
        
        // Fallback: show continents even if API fails
        const continents = Object.keys(continentCoordinates);
        
        const fallbackLocations = continents.map((continentName) => {
          const continentData = continentCoordinates[continentName];
          
          return {
            id: `${continentName}_continent`,
            name: continentName,
            lat: continentData.lat,
            lng: continentData.lng,
            shipments: [],
            type: 'continent',
            popularCountries: continentData.popularCountries
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
      {/* Main globe with land masses only */}
      <mesh 
        ref={meshRef} 
        geometry={useMemo(() => new THREE.SphereGeometry(globeRadius, 64, 64), [])}
      >
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.5}
          metalness={0.1}
          transparent={false}
          opacity={1.0}
        />
      </mesh>

      {/* Subtle atmospheric glow */}
      <mesh geometry={useMemo(() => new THREE.SphereGeometry(globeRadius * 1.02, 64, 64), [])}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
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

      {/* Bright lighting for land visibility */}
      <ambientLight intensity={1.2} color="#FFFFFF" />
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={2.0} 
        color="#FFFFFF"
        castShadow={false}
      />
      <directionalLight 
        position={[-3, 2, -3]} 
        intensity={1.5} 
        color="#FFFFFF"
      />
      <directionalLight 
        position={[0, 5, 0]} 
        intensity={1.2} 
        color="#FFFFFF"
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
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px]">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.3}
            minDistance={5}
            maxDistance={12}
            enableDamping={true}
            dampingFactor={0.1}
            target={[0, 0, 0]}
            makeDefault
          />
          <Globe onLocationClick={handleLocationClick} />
        </Suspense>
      </Canvas>
      
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-white p-6 rounded-lg shadow-2xl max-w-sm border-2" style={{ borderColor: '#f9b222' }}>
          <button
            onClick={handleCloseDetailPanel}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            ✕
          </button>
          <h3 className="font-bold text-xl mb-3 text-black" style={{ color: '#0096C7' }}>
            {selectedLocation.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">Select a country to get a shipping quote:</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedLocation.popularCountries.map((country: string, index: number) => (
              <a
                key={index}
                href={`/quote?destination=${encodeURIComponent(country)}`}
                className="block px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-blue-400 text-gray-800"
                style={{ backgroundColor: '#f6f6f6', color: '#1a1a1a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9b222';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f6f6f6';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{country}</span>
                  <span className="text-sm">→</span>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href="/quote"
              className="block text-center px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200"
              style={{ backgroundColor: '#0096C7' }}
            >
              View All Destinations
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Globe3D;
