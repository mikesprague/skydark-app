import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useGeolocation from 'beautiful-react-hooks/useGeolocation';
import useLocalStorageState from 'use-local-storage-state';

import { apiUrl } from '../modules/helpers';
import { initIcons } from '../modules/icons';
import { isCacheExpired } from '../modules/local-storage';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import 'sweetalert2/src/sweetalert2';
import './App.scss';

const CurrentHourly = lazy(() => import('./CurrentHourly'));
const Currently = lazy(() => import('./Currently'));
const Daily = lazy(() => import('./Daily'));
const Header = lazy(() => import('./Header'));
const LastUpdated = lazy(() => import('./LastUpdated'));
const LayoutContainer = lazy(() => import('./LayoutContainer'));
const Loading = lazy(() => import('./Loading'));
const SunriseSunset = lazy(() => import('./SunriseSunset'));
const WeatherAlert = lazy(() => import('./WeatherAlert'));
const WeatherMapSmall = lazy(() => import('./WeatherMapSmall'));

dayjs.extend(relativeTime);

initIcons();

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  const [coordinates, setCoordinates] = useLocalStorageState('coordinates', {
    defaultValue: null,
  });

  const [geoState, { onChange }] = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3600000,
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

  useEffect(() => {
    const handleGeoChange = (geo) => {
      if (geo && geo.position && geo.position.coords) {
        const { latitude, longitude, accuracy } = geo.position.coords;

        if (coordinates && coordinates.lat && coordinates.lng) {
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

    if (!coordinates || isCacheExpired(coordinates.lastUpdated, 5)) {
      // console.log('useEffect');
      handleGeoChange(geoState);
    } else {
      const { lat, lng } = coordinates;

      if (weatherData && lastUpdated) {
        if (isCacheExpired(lastUpdated, 5)) {
          getWeatherData(lat, lng);
        }
      } else {
        getWeatherData(lat, lng);
      }
    }
  }, [
    coordinates,
    geoState,
    lastUpdated,
    weatherData,
    setWeatherData,
    setLastUpdated,
    setLocationData,
    setCoordinates,
  ]);

  onChange(() => {
    // console.log('onChange');
    if (geoState && geoState.position && geoState.position.coords) {
      const { latitude, longitude, accuracy } = geoState.position.coords;

      if (coordinates && coordinates.lat && coordinates.lng) {
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
  });

  const returnData = useMemo(
    () => ({
      weather: weatherData,
      location: locationData,
      lastUpdated,
    }),
    [lastUpdated, locationData, weatherData],
  );

  return weatherData && locationData ? (
    <Suspense fallback={<Loading fullHeight={true} />}>
      <WeatherDataContext.Provider value={returnData}>
        <Header OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />
        <LayoutContainer>
          <Currently />
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
