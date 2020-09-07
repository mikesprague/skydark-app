import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Currently } from './Currently';
import { CurrentHourly } from './CurrentHourly';
import { Daily } from './Daily';
import { Header } from './Header';
import { LastUpdated } from './LastUpdated';
import { Loading } from './Loading';
import { SunriseSunset } from './SunriseSunset';
import { WeatherAlert } from './WeatherAlert';
import { WeatherMapSmall } from './WeatherMapSmall';
import './Forecast.scss';

dayjs.extend(relativeTime);

export const Forecast = () => {
  const [locationName, setLocationName] = useState('Determining location');
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
      const nextUpdateTime = dayjs(weatherData.lastUpdated).add(20, 'minute');
      if (dayjs().isAfter(nextUpdateTime)) {
        clearData('coordinates');
        doGeolocation();
      }
    } else {
      doGeolocation();
    }

    // return () => {};
  }, [coordinates, setCoordinates, weatherData]);

  // const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // setIsLoading(true);
    if (coordinates) {
      const { lat, lng } = coordinates;
      const getWeatherData = async (latitude, longitude) => {
        setLocationName('Loading weather data');
        const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${latitude}&lng=${longitude}`;
        const weatherApiData =  await axios
          .get(weatherApiurl)
          .then(response => response.data);
        setWeatherData({
          lastUpdated: dayjs().toString(),
          data: weatherApiData,
        });
        // setIsLoading(false);
        setLocationName(weatherApiData.location.locationName);
      };
      if (weatherData && weatherData.lastUpdated) {
        const nextUpdateTime = dayjs(weatherData.lastUpdated).add(20, 'minute');
        if (dayjs().isAfter(nextUpdateTime)) {
          getWeatherData(lat, lng);
        }
      } else {
        getWeatherData(lat, lng);
      }
      if (weatherData && weatherData.data) {
        setLocationName(weatherData.data.location.locationName);
      }
    }

    // return () => {};
  }, [coordinates, weatherData, setWeatherData]);

  return weatherData && coordinates ? (
    <div className="contents">

      <Header name={locationName} />

      <div className="my-16">

        <Currently data={weatherData.data.weather} />

        <WeatherAlert data={weatherData.data.weather} />

        <WeatherMapSmall coordinates={coordinates} />

        <CurrentHourly data={weatherData.data.weather} />

        <SunriseSunset data={weatherData.data.weather.daily.data} />

        <Daily data={weatherData.data.weather} coordinates={coordinates} />

        <LastUpdated time={weatherData.lastUpdated} />

      </div>

    </div>
  ) : <Loading />;
};

export default Forecast;
