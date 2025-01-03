import { createContext, useContext } from 'react';
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

  return (
    <WeatherDataContext.Provider
      value={{
        coordinates,
        lastUpdated,
        locationData,
        weatherData,
        setCoordinates,
        setLastUpdated,
        setLocationData,
        setWeatherData,
      }}
    >
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
