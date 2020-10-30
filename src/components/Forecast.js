import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect } from 'react';
import { apiUrl, handleError, isCacheExpired } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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

    if (coordinates) {
      if (isCacheExpired(coordinates.lastUpdated, 10)) {
        clearData('coordinates');
        doGeolocation();
      }
    } else {
      clearData('coordinates');
      doGeolocation();
    }

    // return () => {};
  }, [coordinates, setCoordinates]);

  const [weatherData, setWeatherData] = useLocalStorage('weatherData', null);
  useEffect(() => {
    if (!coordinates) { return; }

    const getWeatherData = async (latitude, longitude) => {
      const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${latitude}&lng=${longitude}`;
      const weatherApiData = await axios
        .get(weatherApiurl)
        .then((response) => response.data);
      setWeatherData({
        lastUpdated: dayjs().toString(),
        data: weatherApiData,
      });
    };

    const { lat, lng } = coordinates;
    if (weatherData && weatherData.lastUpdated) {
      if (isCacheExpired(weatherData.lastUpdated, 10)) {
        clearData('weatherData');
        getWeatherData(lat, lng);
      }
    } else {
      clearData('weatherData');
      getWeatherData(lat, lng);
    }

    // return() => {};
  }, [coordinates, weatherData, setWeatherData]);

  return coordinates && weatherData ? (
    <>
      <Header data={weatherData.data.location} />

      <div className="my-16">

        <Currently data={weatherData.data.weather} />

        <WeatherAlert data={weatherData.data.weather} />

        <WeatherMapSmall data={weatherData.data.weather} />

        <CurrentHourly data={weatherData.data.weather} />

        <SunriseSunset data={weatherData.data.weather} />

        <Daily data={weatherData.data.weather} />

        <LastUpdated time={weatherData.lastUpdated} />

      </div>
    </>
  ) : <Loading fullHeight={true} />;
};

export default Forecast;
