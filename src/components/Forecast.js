import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiUrl, handleError, isCacheExpired } from '../modules/helpers';
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
  }, []);

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
        getWeatherData(lat, lng);
      }
    } else {
      getWeatherData(lat, lng);
    }
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
