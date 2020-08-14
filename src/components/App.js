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
import { apiUrl, formatCondition, formatSummary, getUvIndexClasses, getWeatherIcon, initIcons } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './App.scss';
import { Conditions } from '../components/Conditions';
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

  const getConditionBarClass = (data) => {
    const cloudCover = Math.round(data.cloudCover * 100);
    const currentIcon = data.icon;
    const isCloudy = currentIcon.includes('cloudy') || cloudCover >= 40;
    const isRaining = (currentIcon.includes('rain') || currentIcon.includes('thunderstorm'));
    const isSnowing = (currentIcon.includes('snow') || currentIcon.includes('sleet'));

    let returnClass = 'bg-white';

    if (isSnowing) {
      returnClass = 'bg-gray-100';
    }
    if (isRaining) {
      returnClass = 'bg-blue-400';
    }
    if (isCloudy) {
      returnClass = cloudCover >= 60 || currentIcon.includes('mostly') ? 'bg-gray-600' : 'bg-gray-500';
    }

    return returnClass;
  };

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
    console.log('dayClickHandler', event.target);
  }

  return (
    <Fragment>

      <Location name={locationName} />

      <div className="content">
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

        <div className="hourly-container">
          <ul className="hourly">
          {weatherData && weatherData.data.weather && weatherData.data.weather.hourly.data.map((hourData, index) => {
            const startIndex = dayjs().format('m') >= 30 ? 1 : 0;
            const endIndex = startIndex + 20;
            return (index >= startIndex && index <= endIndex) && index % 2 === startIndex ? (
              <li key={nanoid(7)} className="hour">
                <div className={`condition-bar ${index === endIndex ? 'rounded-b-md' : ''} ${index === startIndex ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData)}`}></div>
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
        <ul className="daily">
          {weatherData && weatherData.data.weather ? weatherData.data.weather.daily.data.map((dayData, index) => {
            return index <= 7 ? (
              <li key={nanoid(7)} className="day" onClick={dayClickHandler}>
                <div className="name">
                  <strong>{index === 0 ? 'TODAY' : dayjs.unix(dayData.time).format('ddd').toUpperCase()}</strong>
                  <br />
                  <span className="precip">
                    <FontAwesomeIcon icon={['fad', 'tint']} /> {Math.round(dayData.precipProbability * 100)}%
                  </span>
                </div>
                <div className="icon">
                  <FontAwesomeIcon icon={['fad', getWeatherIcon(dayData.icon)]} size="2x" />
                </div>
                <div className="temps">
                  {formatCondition(dayData.temperatureLow, 'temperature')}<span className="w-2/3 temps-spacer sm:w-3/4"></span>{formatCondition(dayData.temperatureHigh, 'temperature')}
                </div>
              </li>
            ) : '';
          }) : ''}
          </ul>
        </div>
      </div>

      {weatherData ? <LastUpdated time={weatherData.lastUpdated} /> : ''}

      {weatherData ? <Conditions data={weatherData.data.weather} isVisible={false} /> : ''}

    </Fragment>
  );
}

export default hot(App);
