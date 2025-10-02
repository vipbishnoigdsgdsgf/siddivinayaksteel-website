
import { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  // Updated coordinates for Chengicherla X Road, Peerzadiguda, Hyderabad
  const location = { lat: 17.4343, lng: 78.5426 };
  const address = "Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098, India";

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only after Google Maps API is loaded
    const initMap = () => {
      try {
        if (!window.google || !mapRef.current) {
          setMapError(true);
          return;
        }
        
        map.current = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{"color": "#212121"}]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{"visibility": "off"}]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#757575"}]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{"color": "#212121"}]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [{"color": "#757575"}]
            },
            {
              "featureType": "administrative.country",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#9e9e9e"}]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [{"visibility": "off"}]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#bdbdbd"}]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#757575"}]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{"color": "#181818"}]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#616161"}]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.stroke",
              "stylers": [{"color": "#1b1b1b"}]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [{"color": "#2c2c2c"}]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#8a8a8a"}]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [{"color": "#373737"}]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{"color": "#3c3c3c"}]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [{"color": "#4e4e4e"}]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#616161"}]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#757575"}]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{"color": "#000000"}]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#3d3d3d"}]
            }
          ]
        });

        // Add marker for the location
        new window.google.maps.Marker({
          position: location,
          map: map.current,
          title: "Siddi Vinayaka Steel",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#0eb7ea",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            scale: 8
          }
        });
        
        setMapLoaded(true);
        setMapError(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapLoaded(false);
      }
    };

    // Add error handling for script loading
    const handleScriptError = () => {
      console.error('Failed to load Google Maps API');
      setMapError(true);
      setMapLoaded(false);
    };

    // For now, show fallback UI since Google Maps API key is not available
    // This prevents errors and shows a user-friendly alternative
    console.log('Google Maps API not configured, showing fallback UI');
    setMapError(true);
    return;
    
    // Load Google Maps API if not already loaded (disabled for now)
    // if (!window.google) {
    //   const script = document.createElement("script");
    //   const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    //   if (!GOOGLE_MAPS_API_KEY) {
    //     console.warn('Google Maps API key not found, showing fallback UI');
    //     setMapError(true);
    //     return;
    //   }
    //   script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    //   script.async = true;
    //   script.defer = true;
    //   script.onerror = handleScriptError;
    //   window.initMap = initMap;
    //   document.head.appendChild(script);
    //   
    //   // Set a timeout to show fallback if map doesn't load
    //   setTimeout(() => {
    //     if (!mapLoaded && !window.google) {
    //       setMapError(true);
    //     }
    //   }, 5000);
    // } else {
    //   initMap();
    // }

    return () => {
      if (map.current) {
        map.current = null;
      }
    };
  }, []);

  const openInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Show fallback if map failed to load
  if (mapError) {
    return (
      <div className="w-full h-full rounded-lg border border-gray-700 bg-dark-300 flex flex-col items-center justify-center p-6 text-center">
        <MapPin className="h-12 w-12 text-steel mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">Our Location</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {address}
        </p>
        <Button 
          onClick={openInGoogleMaps}
          className="bg-steel hover:bg-steel-light text-white flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Google Maps
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg border border-gray-700 shadow-lg"
      style={{ minHeight: "300px" }}
    >
      {!mapLoaded && (
        <div className="flex justify-center items-center h-full bg-dark-300 text-gray-400">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-steel mx-auto mb-2"></div>
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
