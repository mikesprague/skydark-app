import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect } from 'react';
import { apiUrl } from '../modules/helpers';
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
  const [weatherData, setWeatherData] = useLocalStorage('weatherData', null);

  useEffect(() => {
    async function getPosition(position) {
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }
    async function geolocationError(error) {
      console.error(error);
    }
    async function doGeolocation() {
      const geolocationOptions = {
        enableHighAccuracy: true,
        maximumAge: 3600000 // 1 hour (number of seconds * 1000 milliseconds)
      };
      await navigator.geolocation.getCurrentPosition(getPosition, geolocationError, geolocationOptions);
    }

    if (coordinates && weatherData && weatherData.lastUpdated) {
      const nextUpdateTime = dayjs(weatherData.lastUpdated).add(10, 'minute');
      if (dayjs().isAfter(nextUpdateTime)) {
        clearData('coordinates');
        doGeolocation();
      }
    } else {
      doGeolocation();
    }

    // return () => {};
  }, []);

  useEffect(() => {
    if (!coordinates) { return; }

    const { lat, lng } = coordinates;
    const getWeatherData = async (latitude, longitude) => {
      // setLocationName('Loading weather data');
      const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${latitude}&lng=${longitude}`;
      const weatherApiData = await axios
        .get(weatherApiurl)
        .then((response) => response.data);
      setWeatherData({
        lastUpdated: dayjs().toString(),
        data: weatherApiData,
      });
      // setLocationName(weatherApiData.location.locationName);
    };
    if (weatherData && weatherData.lastUpdated) {
      const nextUpdateTime = dayjs(weatherData.lastUpdated).add(10, 'minute');
      if (dayjs().isAfter(nextUpdateTime)) {
        clearData('weatherData');
        getWeatherData(lat, lng);
      }
    } else {
      clearData('weatherData');
      getWeatherData(lat, lng);
    }

    // return() => {};
  }, [coordinates]);

  return weatherData && weatherData.data ? (
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
  ) : <Loading className="min-h-screen" />;
};

export default Forecast;
