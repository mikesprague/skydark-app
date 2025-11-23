import { createContext, useContext, useMemo } from 'react';
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

  const value = useMemo(
    () => ({
      weatherData,
      locationData,
      lastUpdated,
      coordinates,
      setWeatherData,
      setLocationData,
      setLastUpdated,
      setCoordinates,
    }),
    [
      weatherData,
      locationData,
      lastUpdated,
      coordinates,
      setWeatherData,
      setLocationData,
      setLastUpdated,
      setCoordinates,
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
