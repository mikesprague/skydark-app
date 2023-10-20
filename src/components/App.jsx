import axios from 'axios';
import useGeolocation from 'beautiful-react-hooks/useGeolocation';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import relativeTime from 'dayjs/plugin/relativeTime.js';

import { apiUrl } from '../modules/helpers.js';
import { initIcons } from '../modules/icons.js';
import { isCacheExpired } from '../modules/local-storage.js';

import { WeatherDataContext } from '../contexts/WeatherDataContext.js';

import 'sweetalert2/src/sweetalert2.scss';
import './App.scss';

const AirQuality = lazy(() => import('./AirQuality.jsx'));
const CurrentHourly = lazy(() => import('./CurrentHourly.jsx'));
const Currently = lazy(() => import('./Currently.jsx'));
const Daily = lazy(() => import('./Daily.jsx'));
const Header = lazy(() => import('./Header.jsx'));
const LastUpdated = lazy(() => import('./LastUpdated.jsx'));
const LayoutContainer = lazy(() => import('./LayoutContainer.jsx'));
const Loading = lazy(() => import('./Loading.jsx'));
const SunriseSunset = lazy(() => import('./SunriseSunset.jsx'));
const WeatherAlert = lazy(() => import('./WeatherAlert.jsx'));
const WeatherMapSmall = lazy(() => import('./WeatherMapSmall.jsx'));

dayjs.extend(relativeTime);

initIcons();

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  const [coordinates, setCoordinates] = useLocalStorageState('coordinates', {
    defaultValue: null,
  });

  const [geoState] = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3600000,
  });

  // geoState.onError,
  // geoState.isSupported,
  // geoState.isRetrieving,
  // geoState.position

  const handleGeoChange = (geo) => {
    if (geo?.position?.coords) {
      const { latitude, longitude, accuracy } = geo.position.coords;

      if (coordinates?.lat && coordinates?.lng) {
        if (
          Number(coordinates.lat).toFixed(6) === latitude.toFixed(6) &&
          Number(coordinates.lng).toFixed(6) === longitude.toFixed(6) &&
          !isCacheExpired(coordinates.lastUpdated, 5)
        ) {
          // console.log('same coords in cache ttl, no update');
          return;
        }
      }
      // console.log('handleGeoChange:', geoState);

      setCoordinates({
        lat: latitude,
        lng: longitude,
        accuracy,
        lastUpdated: dayjs().toString(),
      });
    }
  };

  useEffect(() => {
    if (coordinates && !isCacheExpired(coordinates.lastUpdated, 5)) {
      return;
    }

    handleGeoChange(geoState);
  }, [coordinates, geoState, handleGeoChange]);

  const [weatherData, setWeatherData] = useLocalStorageState('weatherData', {
    defaultValue: null,
  });
  const [locationData, setLocationData] = useLocalStorageState('locationData', {
    defaultValue: null,
  });
  const [lastUpdated, setLastUpdated] = useLocalStorageState('lastUpdated', {
    defaultValue: null,
  });

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const getWeatherData = async (latitude, longitude) => {
      const weatherApiurl = `${apiUrl()}/apple-weather/?lat=${latitude}&lng=${longitude}`;
      const weatherApiData = await axios
        .get(weatherApiurl)
        .then((response) => response.data);
      const lastUpdatedString = dayjs().toString();

      setWeatherData(weatherApiData.weather);
      setLocationData(weatherApiData.location);
      setLastUpdated(lastUpdatedString);
    };

    const { lat, lng } = coordinates;

    if (weatherData && lastUpdated) {
      if (isCacheExpired(lastUpdated, 5)) {
        getWeatherData(lat, lng);
      }
    } else {
      getWeatherData(lat, lng);
    }
  }, [
    coordinates,
    lastUpdated,
    weatherData,
    setWeatherData,
    setLastUpdated,
    setLocationData,
  ]);

  const returnData = useMemo(
    () => ({
      weather: weatherData,
      location: locationData,
      lastUpdated,
    }),
    [lastUpdated, locationData, weatherData]
  );

  return weatherData && locationData ? (
    <Suspense fallback={<Loading fullHeight={true} />}>
      <WeatherDataContext.Provider value={returnData}>
        <Header OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />
        <LayoutContainer>
          <Currently />
          <AirQuality />
          <WeatherAlert />
          <WeatherMapSmall OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />
          <CurrentHourly />
          <SunriseSunset />
          <Daily />
          <LastUpdated />
        </LayoutContainer>
      </WeatherDataContext.Provider>
    </Suspense>
  ) : (
    <Loading fullHeight={true} />
  );
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default App;
