import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useLocalStorageState from 'use-local-storage-state';

import { apiUrl, handleError } from '../modules/helpers';
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

  useEffect(() => {
    async function getPosition(position) {
      const { latitude, longitude, accuracy } = position.coords;

      setCoordinates({
        lat: latitude,
        lng: longitude,
        accuracy,
        lastUpdated: dayjs().toString(),
      });
    }

    async function geolocationError(error) {
      handleError(error);
    }

    async function doGeolocation() {
      const geolocationOptions = {
        enableHighAccuracy: true,
        maximumAge: 3600000, // 1 hour (60 seconds * 60 minutes) * 1000 milliseconds
      };

      await navigator.geolocation.getCurrentPosition(
        getPosition,
        geolocationError,
        geolocationOptions,
      );
    }

    if (
      !coordinates ||
      (coordinates && isCacheExpired(coordinates.lastUpdated, 10))
    ) {
      doGeolocation();
    }
  }, [coordinates, setCoordinates]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

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
