import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiUrl, handleError } from '../modules/helpers';
import { isCacheExpired } from '../modules/local-storage';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import { Currently } from './Currently';
import { CurrentHourly } from './CurrentHourly';
import { Daily } from './Daily';
import { Header } from './Header';
import { LastUpdated } from './LastUpdated';
import { SunriseSunset } from './SunriseSunset';
import { WeatherAlert } from './WeatherAlert';
import { WeatherMapSmall } from './WeatherMapSmall';
import { Loading } from './Loading';
import './Forecast.scss';

dayjs.extend(relativeTime);

export const Forecast = () => {
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
        maximumAge: 3600000, // 1 hour (number of seconds * 1000 milliseconds)
      };
      await navigator.geolocation.getCurrentPosition(getPosition, geolocationError, geolocationOptions);
    }

    if (!coordinates || (coordinates && isCacheExpired(coordinates.lastUpdated, 10))) {
      doGeolocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [weatherData, setWeatherData] = useLocalStorage('weatherData', null);
  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const getWeatherData = async (latitude, longitude) => {
      const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${latitude}&lng=${longitude}`;
      const weatherApiData = await axios.get(weatherApiurl).then((response) => response.data);
      setWeatherData({
        lastUpdated: dayjs().toString(),
        data: weatherApiData,
      });
    };

    const { lat, lng } = coordinates;
    if (weatherData && weatherData.lastUpdated) {
      if (isCacheExpired(weatherData.lastUpdated, 10)) {
        getWeatherData(lat, lng);
      }
    } else {
      getWeatherData(lat, lng);
    }
  }, [coordinates, setWeatherData, weatherData]);

  return coordinates && weatherData ? (
    <WeatherDataContext.Provider value={weatherData.data}>
      <Header />
      <div className="my-16">
        <Currently />
        <WeatherAlert />
        <WeatherMapSmall />
        <CurrentHourly />
        <SunriseSunset />
        <Daily />
        <LastUpdated time={weatherData.lastUpdated} />
      </div>
    </WeatherDataContext.Provider>
  ) : (
    <Loading fullHeight={true} />
  );
};

export default Forecast;
