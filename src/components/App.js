import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import {
  apiUrl, formatCondition, formatSummary, getConditionBarClass, getUvIndexClasses, getWeatherIcon, initIcons,
} from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './App.scss';
import { Conditions } from '../components/Conditions';
import { CurrentHourly } from '../components/CurrentHourly';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hourly } from '../components/Hourly';
import { LastUpdated } from '../components/LastUpdated';
import { Modal } from '../components/Modal';
import { SunriseSunset } from '../components/SunriseSunset';
import { WeatherMap } from '../components/WeatherMap';

dayjs.extend(relativeTime)
initIcons();

const App = (props) => {
  const [locationName, setLocationName] = useState('Determining location');
  const [coordinates, setCoordinates] = useLocalStorage('coordinates', null);

  useEffect(() => {
    async function getPosition(position) {
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
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
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useLocalStorage('weatherData', null);
  useEffect(() => {
    setIsLoading(true);
    if (coordinates) {
      const { lat, lng } = coordinates;
      const getWeatherData = async (lat, lng) => {
        setLocationName('Loading weather data')
        const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
        const weatherApiData =  await axios
          .get(weatherApiurl)
          .then(response => response.data);
        setWeatherData({
          lastUpdated: dayjs().toString(),
          data: weatherApiData,
        });
        setIsLoading(false);
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
      weatherData && weatherData.data && setLocationName(weatherData.data.location.locationName);
    }

    // return () => {};
  }, [coordinates]);

  const currentConditionsHandler = (event) => {
    const overlayContainer = document.getElementById('conditions-modal');
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    overlayContainer.classList.add('fixed');
    elementsToHide.forEach(elem => elem.classList.remove('hidden'));
  };

  const dayClickHandler = (event) => {
    const allDetails = document.querySelectorAll("details");
    const currentDetail = event.target.closest('details');
    allDetails.forEach(detail => {
      if (detail !== currentDetail) {
        detail.removeAttribute('open');
      }
    });
  }

  return (
    <div className="contents">

      <Header name={locationName} />

      <div className="my-16">
        <div className="current-conditions" onClick={currentConditionsHandler}>
          {weatherData && weatherData.data.weather ? (
            <div className="icon">
              <FontAwesomeIcon
                icon={['fad', getWeatherIcon(weatherData.data.weather.currently.icon)]}
                fixedWidth
                size="4x"
              />
            </div>
          ) : ''}
          <div className="temperature">
            <h2 className="actual-temp">{weatherData && weatherData.data.weather ? formatCondition(weatherData.data.weather.currently.temperature, 'temperature') : ''}</h2>
            <h3 className="feels-like-temp">{weatherData && weatherData.data.weather ? 'Feels ' + formatCondition(weatherData.data.weather.currently.apparentTemperature, 'apparentTemperature') : ''}</h3>
          </div>
        </div>

        {weatherData && weatherData.data ? <Conditions data={weatherData.data.weather} /> : ''}

        {weatherData && weatherData.data.weather.alerts ? <WeatherAlert alerts={weatherData.data.weather.alerts} /> : ''}

        {coordinates && coordinates.lat ? <WeatherMap coordinates={coordinates} apiKey={props.OPENWEATHERMAP_API_KEY} /> : ''}

        {weatherData && weatherData.data.weather ? <CurrentHourly data={weatherData.data.weather} /> : ''}

        {weatherData && weatherData.data.weather ? <SunriseSunset data={weatherData.data.weather.daily.data} /> : ''}

        <div className="daily-container">
          <div className="daily">
          {weatherData && weatherData.data.weather ? weatherData.data.weather.daily.data.map((dayData, dayIndex) => {
            return dayIndex <= 7 ? (
              <details key={nanoid(7)} className="day" onClick={dayClickHandler}>
                <summary>
                  <div className="name">
                    <strong>{dayIndex === 0 ? 'TODAY' : dayjs.unix(dayData.time).format('ddd').toUpperCase()}</strong>
                    <br />
                    <span className="precip">
                      <FontAwesomeIcon icon={['fad', 'tint']} /> {Math.round(dayData.precipProbability * 100)}%
                    </span>
                  </div>
                  <div className="icon">
                    <FontAwesomeIcon icon={['fad', getWeatherIcon(dayData.icon)]} size="2x" fixedWidth />
                  </div>
                  <div className="temps">
                    {formatCondition(dayData.temperatureMin, 'temperature')}<span className="temps-spacer"></span>{formatCondition(dayData.temperatureMax, 'temperature')}
                  </div>
                </summary>
                <Hourly coordinates={coordinates} date={dayData.time} />
              </details>
            ) : '';
          }) : ''}
          </div>
        </div>

        {weatherData ? <LastUpdated time={weatherData.lastUpdated} /> : ''}
      </div>

      <Footer />

    </div>
  );
}

export default hot(App);
