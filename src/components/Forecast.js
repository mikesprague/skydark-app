/* eslint-disable node/no-unsupported-features/es-syntax */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { apiUrl, handleError } from '../modules/helpers';
import { isCacheExpired } from '../modules/local-storage';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { CurrentHourly } from './CurrentHourly';
import { Currently } from './Currently';
import { Daily } from './Daily';
import { Header } from './Header';
import { LastUpdated } from './LastUpdated';
import { LayoutContainer } from './LayoutContainer';
import { Loading } from './Loading';
import { SunriseSunset } from './SunriseSunset';
import { WeatherAlert } from './WeatherAlert';
import { WeatherMapSmall } from './WeatherMapSmall';

import './Forecast.scss';

dayjs.extend(relativeTime);

export const Forecast = ({ OPENWEATHERMAP_API_KEY }) => {
  const [coordinates, setCoordinates] = useLocalStorage('coordinates', null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [weatherData, setWeatherData] = useLocalStorage('weatherData', null);
  const [locationData, setLocationData] = useLocalStorage('locationData', null);
  const [lastUpdated, setLastUpdated] = useLocalStorage('lastUpdated', null);

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const getWeatherData = async (latitude, longitude) => {
      const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${latitude}&lng=${longitude}`;
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

  return locationData && weatherData ? (
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
  ) : (
    <Loading fullHeight={true} />
  );
};

Forecast.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default Forecast;
