import { useState, useEffect } from "react";

export const useGeolocation = (options = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute)
  maximumAge: 1000 * 60 * 60 * 1 // 1 hour (1000 ms * 60 sec * 60 min * 1 hour)
}) => {
  const [location, setLocation] = useState();
  const [error, setError] = useState();

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

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};

export default useGeolocation;
