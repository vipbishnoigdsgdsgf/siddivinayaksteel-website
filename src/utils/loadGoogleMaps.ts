
/**
 * Utility function to load the Google Maps API script
 */
export const loadGoogleMapsScript = (callback: () => void) => {
  // Check if the Google Maps API is already loaded
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  // Create script element
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBRgJHkjNUqysPrEpkafUnNbDBMXZmabxQ&libraries=places`;
  script.async = true;
  script.defer = true;

  // Execute callback when script loads
  script.onload = () => {
    callback();
  };

  // Append script to document
  document.head.appendChild(script);
};

// Add Google Maps types - this is already handled by @types/google.maps
// but we'll keep this declaration for backward compatibility
declare global {
  interface Window {
    google: typeof google;
  }
}
