import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  apiUrl, formatCondition, getWeatherIcon,
} from '../modules/helpers';
import { clearData } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Forecast.scss';
import { Conditions } from '../components/Conditions';
import { CurrentHourly } from '../components/CurrentHourly';
import { Header } from '../components/Header';
import { Hourly } from '../components/Hourly';
import { LastUpdated } from '../components/LastUpdated';
import { Loading } from '../components/Loading';
import { SunriseSunset } from '../components/SunriseSunset';
import { WeatherAlert } from '../components/WeatherAlert';
import { WeatherMapSmall } from '../components/WeatherMapSmall';

dayjs.extend(relativeTime);

export const Forecast = (props) => {
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
      const getWeatherData = async (lat, lng) => {
        setLocationName('Loading weather data');
        const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
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
      weatherData && weatherData.data && setLocationName(weatherData.data.location.locationName);
    }

    // return () => {};
  }, [coordinates, weatherData, setWeatherData]);

  const currentConditionsHandler = (event) => {
    const overlayContainer = document.getElementById('conditions-modal');
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    overlayContainer.classList.add('fixed');
    elementsToHide.forEach(elem => elem.classList.remove('hidden'));
  };

  const dayClickHandler = (event) => {
    const allDetails = document.querySelectorAll('details');
    const currentDetail = event.target.closest('details');
    // console.log(event.target.closest('summary').dataset.time);
    allDetails.forEach(detail => {
      if (detail !== currentDetail) {
        detail.removeAttribute('open');
      }
    });
  };

  return weatherData && coordinates ? (
    <div className="contents">

      <Header name={locationName} />

      <div className="my-16">

        <div className="current-conditions" onClick={currentConditionsHandler}>
          <div className="icon">
            <FontAwesomeIcon
              icon={['fad', getWeatherIcon(weatherData.data.weather.currently.icon).icon]}
              style={getWeatherIcon(weatherData.data.weather.currently.icon).iconStyles}
              fixedWidth
              size="4x"
            />
          </div>
          <div className="temperature">
            <h2 className="actual-temp">{formatCondition(weatherData.data.weather.currently.temperature, 'temperature')}</h2>
            <h3 className="feels-like-temp">{'Feels ' + formatCondition(weatherData.data.weather.currently.apparentTemperature, 'apparentTemperature')}</h3>
          </div>
          <Conditions data={weatherData.data.weather} />
        </div>

        <WeatherAlert data={weatherData.data.weather} />

        <WeatherMapSmall coordinates={coordinates} apiKey={props.OPENWEATHERMAP_API_KEY} />

        <CurrentHourly data={weatherData.data.weather} />

        <SunriseSunset data={weatherData.data.weather.daily.data} />

        <div className="daily-container">
          <div className="daily">
            {weatherData.data.weather.daily.data.map((dayData, dayIndex) => {
              return dayIndex <= 7 ? (
                <details key={nanoid(7)} className="day">
                  <summary data-time={dayData.time} onClick={dayClickHandler}>
                    <div className="name">
                      <strong>{dayIndex === 0 ? 'TODAY' : dayjs.unix(dayData.time).format('ddd').toUpperCase()}</strong>
                      <br />
                      <span className="precip">
                        <FontAwesomeIcon icon={['fad', 'tint']} />
                        {` ${Math.round(dayData.precipProbability * 100)}%`}
                      </span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={['fad', getWeatherIcon(dayData.icon).icon]} style={getWeatherIcon(dayData.icon).iconStyles} size="2x" fixedWidth />
                    </div>
                    <div className="temps">
                      {formatCondition(dayData.temperatureMin, 'temperature')}<span className="temps-spacer"></span>{formatCondition(dayData.temperatureMax, 'temperature')}
                    </div>
                  </summary>
                  <Hourly coordinates={coordinates} date={dayData.time} />
                </details>
              ) : '';
            })}
          </div>
        </div>

        <LastUpdated time={weatherData.lastUpdated} />

      </div>

    </div>
  ) : <Loading />;
};

export default Forecast;
