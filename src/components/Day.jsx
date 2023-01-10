import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';

import {
  apiUrl,
  formatCondition,
  metricToImperial,
  sleep,
} from '../modules/helpers';
import { getWeatherIcon } from '../modules/icons';
import { isCacheExpired } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { Hourly } from './Hourly';
import { Loading } from './Loading';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './Day.scss';

export const Day = ({ data, dayIndex, minLow }) => {
  const [hourlyData, setHourlyData] = useLocalStorage(
    `hourlyData_${dayjs(data.forecastStart).unix()}`,
    null,
  );
  const fullData = useContext(WeatherDataContext);

  const getDailyWeatherData = async (lat, lng, date) => {
    const weatherApiurl = `${apiUrl()}/apple-weather/?lat=${lat}&lng=${lng}&dailyStart=${date}&hourlyStart=`;
    const weatherApiData = await axios
      .get(weatherApiurl)
      .then((response) => response.data);
    console.log(weatherApiData);

    return weatherApiData;
  };

  const clickHandler = async (event) => {
    const clickedEl = event.target;
    const allDetails = document.querySelectorAll('details');
    const currentDetail = clickedEl.closest('details');
    const currentSummary = clickedEl.closest('summary');
    const scrollMarker = currentDetail.querySelector('.scroll-marker');
    const isOpen = currentDetail.getAttribute('open') === null;
    const date = currentSummary.dataset.time;

    allDetails.forEach((detail) => {
      if (detail !== currentDetail) {
        detail.removeAttribute('open');
        detail.querySelector('.scroll-marker').classList.add('hidden');
      }
    });

    if (isOpen) {
      if (!hourlyData || isCacheExpired(hourlyData.lastUpdated, 15)) {
        const weatherData = await getDailyWeatherData(
          fullData.weather.currentWeather.metadata.latitude,
          fullData.weather.currentWeather.metadata.longitude,
          date,
        );

        setHourlyData({
          lastUpdated: dayjs().toString(),
          data: weatherData.weather,
        });
      }

      scrollMarker.classList.remove('hidden');
      sleep(250).then(() => {
        scrollMarker.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        });
      });
    } else {
      scrollMarker.classList.add('hidden');
    }
  };

  return (
    <details className="day">
      <summary data-time={data.forecastStart} onClick={clickHandler}>
        <div className="relative hidden w-0 h-0 text-transparent scroll-marker -top-12">
          &nbsp;
        </div>
        <div className="flex flex-grow">
          <div className="name">
            <strong>
              {dayIndex === 0
                ? 'TODAY'
                : dayjs(data.dailyStart).format('ddd').toUpperCase()}
            </strong>
            <br />
            <span className="precip">
              <FontAwesomeIcon icon={['fad', 'droplet']} />
              {` ${formatCondition(
                data.precipitationChance,
                'precipitationChance',
              )}`}
            </span>
          </div>
          <div className="icon">
            <FontAwesomeIcon
              icon={['fad', getWeatherIcon(data.conditionCode).icon]}
              style={getWeatherIcon(data.conditionCode).iconStyles}
              size="2x"
              fixedWidth
            />
          </div>
          <div
            className="temps"
            style={{
              position: 'relative',
              left: `${Math.round(
                Math.round(metricToImperial.cToF(data.temperatureMin)) -
                  metricToImperial.cToF(minLow) * 0.75,
              )}%`,
            }}
          >
            {formatCondition(data.temperatureMin, 'temperature').trim()}
            <span
              className="temps-spacer"
              style={{
                width: `${
                  (metricToImperial.cToF(data.temperatureMax) -
                    metricToImperial.cToF(data.temperatureMin)) *
                  1.5
                }%`,
              }}
            />
            {formatCondition(data.temperatureMax, 'temperature').trim()}
          </div>
        </div>
      </summary>
      {hourlyData ? (
        <Hourly data={hourlyData} dayData={data} />
      ) : (
        <Loading fullHeight={false} />
      )}
    </details>
  );
};

Day.displayName = 'Day';
Day.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.object,
      PropTypes.bool,
    ]),
  ).isRequired,
  dayIndex: PropTypes.number.isRequired,
  minLow: PropTypes.number.isRequired,
};

export default Day;
