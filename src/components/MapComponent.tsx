
import React, { useEffect, useRef } from 'react';
import GoogleMapsWrapper from './GoogleMapsWrapper';

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = { lat: 13.0827, lng: 80.2707 }, // Default to Chennai
  zoom = 10,
  className = "w-full h-96",
  markers = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  const renderMap = (googleMaps: typeof google.maps) => {
    const renderGoogleMap = () => {
      if (!mapRef.current) return;

      // Create new map instance
      googleMapRef.current = new googleMaps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Add markers to the map
      markers.forEach(marker => {
        new googleMaps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: googleMapRef.current,
          title: marker.title
        });
      });
    };

    // Initialize map
    renderGoogleMap();

    // Clean up function to prevent memory leaks
    return () => {
      googleMapRef.current = null;
    };
  };

  return (
    <div className={className}>
      <GoogleMapsWrapper>
        {(googleMaps) => {
          useEffect(() => renderMap(googleMaps), [googleMaps, center, zoom, markers]);
          return <div ref={mapRef} className="w-full h-full rounded-md" />;
        }}
      </GoogleMapsWrapper>
    </div>
  );
};

export default MapComponent;
