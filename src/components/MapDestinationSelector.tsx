import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  formattedAddress: string;
}

interface MapDestinationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  className?: string;
}

// Component to handle map clicks
function LocationMarker({ 
  onLocationSelect, 
  position, 
  setPosition 
}: { 
  onLocationSelect: (location: LocationData) => void;
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );
        const data = await response.json();
        
        const locationData: LocationData = {
          lat,
          lng,
          address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
          country: data.address?.country || 'Unknown',
          formattedAddress: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        };
        
        onLocationSelect(locationData);
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        // Fallback if geocoding fails
        const locationData: LocationData = {
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          city: 'Unknown',
          country: 'Unknown',
          formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        };
        onLocationSelect(locationData);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Selected destination<br />
        Lat: {position[0].toFixed(6)}<br />
        Lng: {position[1].toFixed(6)}
      </Popup>
    </Marker>
  );
}

export const MapDestinationSelector: React.FC<MapDestinationSelectorProps> = ({
  onLocationSelect,
  initialLocation,
  className = ''
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef<any>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Search for locations using OpenStreetMap Nominatim
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Select a location from search results
  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newPosition: [number, number] = [lat, lng];
    
    setPosition(newPosition);
    setSearchQuery(result.display_name);
    setSearchResults([]);

    // Pan map to selected location
    if (mapRef.current) {
      mapRef.current.setView(newPosition, 13);
    }

    const locationData: LocationData = {
      lat,
      lng,
      address: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village || 'Unknown',
      country: result.address?.country || 'Unknown',
      formattedAddress: result.display_name
    };

    onLocationSelect(locationData);
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition: [number, number] = [latitude, longitude];
          setPosition(newPosition);
          
          if (mapRef.current) {
            mapRef.current.setView(newPosition, 13);
          }

          // Reverse geocode current location
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
          )
            .then(response => response.json())
            .then(data => {
              const locationData: LocationData = {
                lat: latitude,
                lng: longitude,
                address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                city: data.address?.city || data.address?.town || 'Unknown',
                country: data.address?.country || 'Unknown',
                formattedAddress: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              };
              setSearchQuery(locationData.formattedAddress);
              onLocationSelect(locationData);
            })
            .catch(error => {
              console.error('Error reverse geocoding current location:', error);
            });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Controls */}
      <div className="mb-4 space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-5 w-5 border-2 border-primary-blue border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results - Using React Portal to render outside parent DOM */}
      {searchResults.length > 0 && createPortal(
        <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4">
          {/* Backdrop overlay - Click to close */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setSearchResults([]);
            }}
          />
          
          {/* Dropdown - ALWAYS CENTERED */}
          <div 
            className="relative bg-primary-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden z-[99999]"
            style={{
              width: isMobile ? '90vw' : '500px',
              maxWidth: '95vw',
              maxHeight: '70vh'
            }}
          >
            <div className="overflow-y-auto max-h-full">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-200 last:border-b-0 active:bg-gray-200 transition-colors"
                >
                  <div className="font-medium text-base">{result.display_name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.type} • {result.lat.substring(0, 8)}, {result.lon.substring(0, 8)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Control Buttons */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-accent-orange transition-colors flex items-center space-x-2"
          >
            <span>📍</span>
            <span>Use My Location</span>
          </button>
          <button
            onClick={() => {
              setPosition(null);
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={position || [40.7128, -74.0060]} // Default to NYC
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            onLocationSelect={onLocationSelect}
            position={position}
            setPosition={setPosition}
          />
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      {position && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Selected Destination</h4>
          <p className="text-sm text-green-700">
            <strong>Coordinates:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
          {searchQuery && (
            <p className="text-sm text-green-700 mt-1">
              <strong>Address:</strong> {searchQuery}
            </p>
          )}
          <p className="text-xs text-green-600 mt-2">
            💡 Click anywhere on the map to change the destination
          </p>
        </div>
      )}
    </div>
  );
};

export default MapDestinationSelector;
