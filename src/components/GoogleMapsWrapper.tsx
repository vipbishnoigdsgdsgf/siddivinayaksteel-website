
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';

interface GoogleMapsWrapperProps {
  children: (googleMaps: typeof google.maps) => ReactNode;
}

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ children }) => {
  const [mapsLoaded, setMapsLoaded] = useState<boolean>(false);
  const googleMapsRef = useRef<typeof google.maps | null>(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      googleMapsRef.current = window.google.maps;
      setMapsLoaded(true);
    });
  }, []);

  if (!mapsLoaded || !googleMapsRef.current) {
    return <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">Loading map...</div>;
  }

  return <>{children(googleMapsRef.current)}</>;
};

export default GoogleMapsWrapper;
