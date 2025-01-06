import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const WeatherDataContext = createContext(null);

export const WeatherDataProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useLocalStorageState('coordinates', {
    defaultValue: null,
  });

  const [weatherData, setWeatherData] = useLocalStorageState('weatherData', {
    defaultValue: null,
  });
  const [locationData, setLocationData] = useLocalStorageState('locationData', {
    defaultValue: null,
  });
  const [lastUpdated, setLastUpdated] = useLocalStorageState('lastUpdated', {
    defaultValue: null,
  });

  const handleSetWeatherData = useCallback(
    (data) => setWeatherData(data),
    [setWeatherData]
  );
  const handleSetLocationData = useCallback(
    (data) => setLocationData(data),
    [setLocationData]
  );
  const handleSetLastUpdated = useCallback(
    (time) => setLastUpdated(time),
    [setLastUpdated]
  );
  const handleSetCoordinates = useCallback(
    (coords) => setCoordinates(coords),
    [setCoordinates]
  );

  const value = useMemo(
    () => ({
      weatherData,
      locationData,
      lastUpdated,
      coordinates,
      setWeatherData: handleSetWeatherData,
      setLocationData: handleSetLocationData,
      setLastUpdated: handleSetLastUpdated,
      setCoordinates: handleSetCoordinates,
    }),
    [
      weatherData,
      locationData,
      lastUpdated,
      coordinates,
      handleSetWeatherData,
      handleSetLocationData,
      handleSetLastUpdated,
      handleSetCoordinates,
    ]
  );

  return (
    <WeatherDataContext.Provider value={value}>
      {children}
    </WeatherDataContext.Provider>
  );
};

export const useWeatherDataContext = () => {
  const context = useContext(WeatherDataContext);
  if (context === null) {
    throw new Error(
      'useWeatherDataContext must be used within a WeatherDataProvider'
    );
  }
  return context;
};

export default WeatherDataContext;
