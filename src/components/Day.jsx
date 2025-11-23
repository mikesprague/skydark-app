import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { fetchJSONWithRetry, getErrorMessage } from '../lib/api/errors.js';
import { dayjs } from '../lib/time/dayjs.js';
import {
  apiUrl,
  formatCondition,
  metricToImperial,
} from '../modules/helpers.js';
import { getWeatherIcon } from '../modules/icons.js';
import { getData, isCacheExpired } from '../modules/local-storage.js';

import { Hourly } from './Hourly.jsx';
import { Loading } from './Loading.jsx';

import './Day.css';

/**
 * Fetch daily weather data for a specific date
 * Defined outside component since it doesn't depend on props/state
 */
const getDailyWeatherData = async (lat, lng, date) => {
  try {
    const endDate = dayjs(date).add(1, 'day').toISOString();
    const weatherApiUrl = `${apiUrl()}/apple-weather/?lat=${lat}&lng=${lng}&dailyStart=${date}&dailyEnd=${endDate}&hourlyStart=${date}&hourlyEnd=${endDate}`;
    const weatherApiData = await fetchJSONWithRetry(weatherApiUrl);

    return weatherApiData.weather;
  } catch (error) {
    console.error('Failed to fetch daily weather data:', error);
    throw error;
  }
};

export const Day = ({
  data,
  dayIndex,
  minLow,
  maxHigh,
  isExpanded,
  onToggle,
}) => {
  const scrollMarkerRef = useRef();
  const [fetchError, setFetchError] = useState(null);
  const [hourlyData, setHourlyData] = useLocalStorageState(
    `hourlyData_${dayjs(data.forecastStart).unix()}`,
    {
      defaultValue: null,
    }
  );

  const { weatherData: weather } = useWeatherDataContext();

  useEffect(() => {
    if (isExpanded && hourlyData && scrollMarkerRef.current) {
      const timer = setTimeout(() => {
        scrollMarkerRef.current?.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isExpanded, hourlyData]);

  const clickHandler = useMemo(
    () => async (event) => {
      event.preventDefault(); // Prevent native <details> toggle
      const currentSummary = event.target.closest('summary');
      const date = currentSummary.dataset.time;
      const midnightAsIsoDate = dayjs(date)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .toISOString();

      const willBeExpanded = !isExpanded;
      onToggle();

      if (willBeExpanded) {
        if (!hourlyData || isCacheExpired(hourlyData.lastUpdated, 15)) {
          setHourlyData(null);
          setFetchError(null);

          const coordinates = getData('coordinates');
          let { latitude, longitude } = coordinates;

          if (!latitude || !longitude) {
            latitude = weather.currentWeather.metadata.latitude;
            longitude = weather.currentWeather.metadata.longitude;
          }

          try {
            const weatherData = await getDailyWeatherData(
              latitude,
              longitude,
              midnightAsIsoDate
            );

            setHourlyData({
              lastUpdated: dayjs().toString(),
              data: weatherData,
            });
          } catch (error) {
            setFetchError(error);
          }
        }
      }
    },
    [isExpanded, onToggle, hourlyData, setHourlyData, weather]
  );

  return data ? (
    <details className="day" open={isExpanded}>
      <summary
        data-time={data.forecastStart}
        onClick={clickHandler}
        className="flex grow"
      >
        <div
          ref={scrollMarkerRef}
          className={`relative w-0 h-0 text-transparent scroll-marker -top-12 ${isExpanded ? '' : 'hidden'}`}
        >
          &nbsp;
        </div>
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
            left: `${((Math.round(metricToImperial.cToF(data.temperatureMin)) - minLow) / (maxHigh - minLow)) * 50}%`,
          }}
        >
          {formatCondition(data.temperatureMin, 'temperature').trim()}
          <span
            className="temps-spacer"
            style={{
              width: `${((metricToImperial.cToF(data.temperatureMax) - metricToImperial.cToF(data.temperatureMin)) / (maxHigh - minLow)) * 50}%`,
            }}
          />
          {formatCondition(data.temperatureMax, 'temperature').trim()}
        </div>
      </summary>
      {fetchError ? (
        <div className="p-4 text-center">
          <p className="text-red-500 dark:text-red-400 mb-2 text-sm">
            {getErrorMessage(fetchError)}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      ) : hourlyData ? (
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
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Day;
