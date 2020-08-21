import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import { nanoid } from 'nanoid';
import React, { Fragment, useEffect, useState } from 'react';
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
import { Hourly } from '../components/Hourly';
import { LastUpdated } from '../components/LastUpdated';
import { Location } from '../components/Location';
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
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');
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

  const changeHandler = (event) => {
    // console.log(event.target.value);
    setHourlyConditionToShow(event.target.value);
  };

  const currentConditionsHandler = (event) => {
    const overlayContainer = document.querySelector('.overlay-container');
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
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
    <Fragment>

      <Location name={locationName} />

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

        {coordinates && coordinates.lat ? <WeatherMap coordinates={coordinates} apiKey={props.OPENWEATHERMAP_API_KEY} /> : ''}

        {weatherData && weatherData.data ? <Conditions data={weatherData.data.weather} /> : ''}

        <div className="hourly-container">
          <ul className="hourly">
          {weatherData && weatherData.data.weather && weatherData.data.weather.hourly.data.map((hourData, index) => {
            const startIndex = dayjs().format('m') <= 30 && dayjs.unix(weatherData.data.weather.hourly.data[0].time).format('h') === dayjs().format('h') ? 0 : 1;
            const endIndex = startIndex + 20;
            return (index >= startIndex && index <= endIndex) && index % 2 === startIndex ? (
              <li key={nanoid(7)} className="hour">
                <div className={`condition-bar ${index === endIndex ? 'rounded-b-md' : ''} ${index === startIndex ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData.icon, hourData.cloudCover)}`}></div>
                <div className="time">{dayjs.unix(hourData.time).format('h a').toUpperCase()}</div>
                <div className="summary">{hourData && weatherData.data.weather && formatSummary(hourData, weatherData.data.weather.hourly.data, index, startIndex)}</div>
                <div className="spacer">&nbsp;</div>
                <div className="condition">
                  <span className={hourlyConditionToShow === 'uvIndex' ? getUvIndexClasses(hourData[hourlyConditionToShow]) : 'pill'}>{formatCondition(hourData[hourlyConditionToShow], hourlyConditionToShow)}</span>
                </div>
              </li>
            ) : '';
          })}
          </ul>
          <div className={weatherData && weatherData.data ? 'condition-select-container' : 'condition-select-container hidden'}>
            <select className="select" onChange={changeHandler}>
              <option value="temperature">Temp (&deg;F)</option>
              <option value="apparentTemperature">Feels-Like (&deg;F)</option>
              <option value="precipProbability">Precip Prob (%)</option>
              <option value="precipIntensity">Precip Rate (IN/HR)</option>
              <option value="windSpeed">Wind (MPH)</option>
              <option value="windGust">Wind Gust (MPH)</option>
              <option value="humidity">Humidity (%)</option>
              <option value="dewPoint">Dew Point (&deg;F)</option>
              <option value="uvIndex">UV Index</option>
              <option value="cloudCover">Cloud Cover (%)</option>
              <option value="pressure">Pressure (MB)</option>
            </select>
          </div>
        </div>

        {weatherData && weatherData.data.weather ? <SunriseSunset data={weatherData.data.weather.daily.data} /> : ''}

        <div className="daily-container">
          <div className="daily">
          {weatherData && weatherData.data.weather ? weatherData.data.weather.daily.data.map((dayData, dayIndex) => {
            return dayIndex <= 7 ? (
              <details key={nanoid(7)} className="day focus:outline-none" onClick={dayClickHandler}>
                <summary className="focus:outline-none">
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
                    {formatCondition(dayData.temperatureLow, 'temperature')}<span className="w-2/3 temps-spacer"></span>{formatCondition(dayData.temperatureHigh, 'temperature')}
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

      <div className="footer">
        <div className="flex text-sm">
          <div className="footer-column">
            <a className="active" onClick={event => event.preventDefault()}>
              <FontAwesomeIcon icon={['fad', 'house-day']} className="footer-icon" fixedWidth />
              <br />
              <small>Forecast</small>
            </a>
          </div>
          <div className="footer-column">
            <a onClick={event => event.preventDefault()}>
              <FontAwesomeIcon icon={['fad', 'globe-stand']} className="footer-icon" fixedWidth />
              <br />
              <small>Map</small>
            </a>
          </div>
          <div className="footer-column">
            <a onClick={event => event.preventDefault()}>
              <FontAwesomeIcon icon={['fad', 'info-circle']} className="footer-icon" fixedWidth />
              <br />
              <small>About</small>
            </a>
          </div>
        </div>
      </div>

    </Fragment>
  );
}

export default hot(App);
