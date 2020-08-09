import { useState, useEffect, useRef } from "react";

export const useGeolocationWatch = (options = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute)
  maximumAge: 1000 * 60 * 60 * 1 // 1 hour (1000 ms * 60 sec * 60 min * 1 hour)
}) => {
  const [location, setLocation] = useState();
  const [error, setError] = useState();
  const locationWatchId = useRef(null);

  const handleSuccess = (pos) => {
    const { latitude, longitude } = pos.coords;
    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (error) => {
    setError(error.message);
  };

  const cancelLocationWatch = () => {
    const { geolocation } = navigator;
    if (locationWatchId.current && geolocation) {
      geolocation.clearWatch(locationWatchId.current);
    }
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    locationWatchId.current = geolocation.watchPosition(handleSuccess, handleError, options);

    return cancelLocationWatch;
  }, [options]);

  return { location, cancelLocationWatch, error };
};

export default useGeolocationWatch;
