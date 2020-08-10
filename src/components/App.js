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
import { getWeatherIcon, initIcons } from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './App.scss';

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
        const weatherApiurl = `https://cleanst.art/.netlify/functions/location-and-weather/?lat=${lat}&lng=${lng}`;
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
    const isCloudy = currentIcon.includes('cloudy') || cloudCover >= 60;
    const isRaining = (currentIcon.includes('rain') || currentIcon.includes('thunderstorm'));
    const isSnowing = (currentIcon.includes('snow') || currentIcon.includes('sleet'));

    let returnClass = 'bg-white';

    if (isSnowing) {
      returnClass = 'bg-gray-100';
    }
    if (isRaining) {
      returnClass = 'bg-blue-300';
    }
    if (isCloudy) {
      cloudCover >= 67 ? returnClass = 'bg-gray-800' : 'bg-gray-400';
    }

    return returnClass;
  };

  const formatTemp = temp => `${Math.round(temp)}${String.fromCharCode(176)}`;

  const formatSummary = (currentHourData, allHourlyData, index) => {
    if (index === 0) {
      return currentHourData.summary;
    }
    return currentHourData.summary === allHourlyData[index - 1].summary ? '' : currentHourData.summary;
  };

  return (
    <Fragment>
      <div className="header">
        <div className="location-name">
          <h1>
            <FontAwesomeIcon icon="location-arrow" fixedWidth /> {locationName}
          </h1>
        </div>
      </div>
      <div className="content">
        <div className="current-conditions">
          <div className="icon">
            <FontAwesomeIcon
              icon={weatherData && weatherData.data && ['fad', getWeatherIcon(weatherData.data.weather.currently.icon)]}
              fixedWidth
              size="4x"
            />
          </div>
          <div className="temperature">
            <h2 className="actual-temp">{weatherData && weatherData.data ? formatTemp(weatherData.data.weather.currently.temperature) : ''}</h2>
            <h3 className="feels-like-temp">{weatherData && weatherData.data ? 'Feels ' + formatTemp(weatherData.data.weather.currently.apparentTemperature) : ''}</h3>
          </div>
        </div>
        <div className="map">
        {coordinates && coordinates.lat ? (
          <Map
            center={[coordinates.lat, coordinates.lng]}
            zoom={4}
            doubleClickZoom={false}
            dragging={false}
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
              opacity={.85}
            />
            <WMSTileLayer
              layer="precipitation_new"
              url={`https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
            />
            <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
          </Map>
          ) : ''}
        </div>
        <div className="p-3 today-hourly">
          <ul className="flex flex-wrap">
          {weatherData && weatherData.data && weatherData.data.weather.hourly.data.map((hourData, index) => {
            return index <= 20 && index % 2 === 0 ? (
              <li key={nanoid(7)} className="flex w-full h-12 m-0 text-lg leading-10 hour">
                <div className={`inline-block w-6 h-full condition-bar${index === 20 ? 'rounded-b-md' : ''}${index === 0 ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData)}`}></div>
                <div className="inline-block w-16 mr-4 text-right align-top">{dayjs.unix(hourData.time).format('h a').toUpperCase()}</div>
                <div className="inline-block align-top">{formatSummary(hourData, weatherData.data.weather.hourly.data, index)}</div>
                <div className="flex-auto inline-block overflow-hidden align-top">&nbsp;</div>
                <div className="inline-block mr-4 align-top">
                  <span className="px-3 py-1 font-medium tracking-widest text-black bg-white rounded-full">{formatTemp(hourData.temperature)}</span>
                </div>
                {/* <FontAwesomeIcon icon={['fad', getWeatherIcon(weatherData.data.weather.hourly.data[0].icon)]} /> */}
              </li>
            ) : '';
          })}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default hot(App);
