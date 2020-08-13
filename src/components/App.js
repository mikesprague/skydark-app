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
import { apiUrl, getWeatherIcon, initIcons } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './App.scss';
import { SunriseSunset } from '../components/SunriseSunset';
import { WeatherMap } from '../components/WeatherMap';
import { Location } from '../components/Location';

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


  const formatCondition = (value, condition) => {
    switch (condition) {
      case 'temperature':
      case 'apparentTemperature':
      case 'dewPoint':
        return formatTemp(value);
        break;
      case 'precipProbability':
      case 'humidity':
      case 'cloudCover':
        return formatPercent(value);
        break;
      case 'precipIntensity':
        return `${Math.round(value)}in/hr`;
        break;
      case 'pressure':
        return `${Math.round(value)}mb`;
        break;
      case 'windSpeed':
      case 'windGust':
        return `${Math.round(value)}mph`;
        break;
      default:
        return value;
        break;
    }
  };

  const formatTemp = temp => `${Math.round(temp).toString().padStart(2, String.fromCharCode(160))}${String.fromCharCode(176)}`;
  const formatPercent = num => `${Math.round(num * 100).toString().padStart(2, String.fromCharCode(160))}%`;
  const formatNumWithLabel = (num, label) => `${Math.round(num).toString().padStart(2, String.fromCharCode(160))}${label}`

  const formatSummary = (currentHourData, allHourlyData, index) => {
    if (index === 0) {
      return currentHourData.summary;
    }
    return currentHourData.summary === allHourlyData[index - 2].summary ? '' : currentHourData.summary;
  };

  const getUvIndexClasses = (uvIndex) => {
    if (uvIndex <= 2) {
      return 'pill green';
    }
    if (uvIndex <= 5) {
      return 'pill yellow';
    }
    if (uvIndex <= 7) {
      return 'pill orange';
    }
    if (uvIndex <= 10) {
      return 'pill red';
    }
    if (uvIndex >= 11) {
      return 'pill purple';
    }
  };

  const changeHandler = (event) => {
    // console.log(event.target.value);
    setHourlyConditionToShow(event.target.value);
  };

  const currentConditionsHandler = (event) => {
    console.log('currentConditionsHandler', event.target);
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
            <h2 className="actual-temp">{weatherData && weatherData.data.weather ? formatTemp(weatherData.data.weather.currently.temperature) : ''}</h2>
            <h3 className="feels-like-temp">{weatherData && weatherData.data.weather ? 'Feels ' + formatTemp(weatherData.data.weather.currently.apparentTemperature) : ''}</h3>
          </div>
        </div>

        {coordinates && coordinates.lat ? <WeatherMap coordinates={coordinates} apiKey={props.OPENWEATHERMAP_API_KEY} /> : ''}

        <div className="hourly-container">
          <ul className="hourly">
          {weatherData && weatherData.data.weather && weatherData.data.weather.hourly.data.map((hourData, index) => {
            return index <= 20 && index % 2 === 0 ? (
              <li key={nanoid(7)} className="hour">
                <div className={`condition-bar ${index === 20 ? 'rounded-b-md' : ''} ${index === 0 ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData)}`}></div>
                <div className="time">{dayjs.unix(hourData.time).format('h a').toUpperCase()}</div>
                <div className="summary">{formatSummary(hourData, weatherData.data.weather.hourly.data, index)}</div>
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
                  {formatTemp(dayData.temperatureLow)}<span className="w-2/3 temps-spacer sm:w-3/4"></span>{formatTemp(dayData.temperatureHigh)}
                </div>
              </li>
            ) : '';
          }) : ''}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default hot(App);
