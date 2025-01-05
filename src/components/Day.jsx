import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import {
  apiUrl,
  formatCondition,
  metricToImperial,
  sleep,
} from '../modules/helpers.js';
import { getWeatherIcon } from '../modules/icons.js';
import { getData, isCacheExpired } from '../modules/local-storage.js';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

import { Hourly } from './Hourly.jsx';
import { Loading } from './Loading.jsx';

import './Day.scss';

export const Day = ({ data, dayIndex, minLow, maxHigh }) => {
  const [hourlyData, setHourlyData] = useLocalStorageState(
    `hourlyData_${dayjs(data.forecastStart).unix()}`,
    {
      defaultValue: null,
    }
  );

  const { weatherData: weather } = useWeatherDataContext();

  const getDailyWeatherData = useCallback(async (lat, lng, date) => {
    try {
      const endDate = dayjs(date).add(1, 'day').toISOString();
      const weatherApiUrl = `${apiUrl()}/apple-weather/?lat=${lat}&lng=${lng}&dailyStart=${date}&dailyEnd=${endDate}&hourlyStart=${date}&hourlyEnd=${endDate}`;
      const weatherApiData = await fetch(weatherApiUrl).then((response) =>
        response.json()
      );

      return weatherApiData.weather;
    } catch (error) {
      console.error('Failed to fetch daily weather data:', error);
      return null;
    }
  }, []);

  const clickHandler = useMemo(
    () => async (event) => {
      const clickedEl = event.target;
      const allDetails = document.querySelectorAll('details');
      const currentDetail = clickedEl.closest('details');
      const currentSummary = clickedEl.closest('summary');
      const scrollMarker = currentDetail.querySelector('.scroll-marker');
      const isOpen = currentDetail.getAttribute('open') === null;
      const date = currentSummary.dataset.time;
      const midnightAsIsoDate = dayjs(date)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .toISOString();

      for (const detail of allDetails) {
        if (detail !== currentDetail) {
          detail.removeAttribute('open');
          detail.querySelector('.scroll-marker').classList.add('hidden');
        }
      }

      if (isOpen) {
        if (!hourlyData || isCacheExpired(hourlyData.lastUpdated, 15)) {
          setHourlyData(null);

          const coordinates = getData('coordinates');
          let { latitude, longitude } = coordinates;

          if (!latitude || !longitude) {
            latitude = weather.currentWeather.metadata.latitude;
            longitude = weather.currentWeather.metadata.longitude;
          }

          const weatherData = await getDailyWeatherData(
            latitude,
            longitude,
            midnightAsIsoDate
          );

          setHourlyData({
            lastUpdated: dayjs().toString(),
            data: weatherData,
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
    },
    [hourlyData, setHourlyData, weather, getDailyWeatherData]
  );

  return data ? (
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
                : dayjs(data.forecastStart).format('ddd').toUpperCase()}
            </strong>
            <br />
            <span className="precip">
              <FontAwesomeIcon icon={['fad', 'droplet']} />
              {` ${formatCondition(
                data.precipitationChance,
                'precipitationChance'
              )}`}
            </span>
          </div>
          <div className="icon">
            <FontAwesomeIcon
              icon={[
                'fad',
                getWeatherIcon(data.daytimeForecast.conditionCode).icon,
              ]}
              style={
                getWeatherIcon(data.daytimeForecast.conditionCode).iconStyles
              }
              size="2x"
              fixedWidth
            />
          </div>
          <div
            className="temps"
            style={{
              position: 'relative',
              left: `${Math.round(
                Math.round(metricToImperial.cToF(data.temperatureMin)) - minLow
              )}%`,
            }}
          >
            {formatCondition(data.temperatureMin, 'temperature').trim()}
            <span
              className="temps-spacer"
              style={{
                width: `${Math.round(
                  (metricToImperial.cToF(data.temperatureMax) -
                    metricToImperial.cToF(data.temperatureMin)) *
                    (50 / (maxHigh - minLow))
                )}%`,
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
  ) : (
    ''
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
    ])
  ).isRequired,
  dayIndex: PropTypes.number.isRequired,
  minLow: PropTypes.number.isRequired,
  maxHigh: PropTypes.number.isRequired,
};

export default Day;
