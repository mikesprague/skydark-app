import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
// import { nanoid } from 'nanoid';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { openModalWithComponent } from '../modules/helpers';

import './AirQuality.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const AirQuality = () => {
  const [aqiData, setAqiData] = useState(null);
  const data = useContext(WeatherDataContext);

  const { weather, location } = data;

  useEffect(() => {
    if (!weather.airQualityData || !weather.airQualityData.length) {
      setAqiData(null);

      return;
    }

    setAqiData(weather.airQualityData);
  }, [weather]);

  const getAirQualityColor = (airQualityData) => {
    const { Category } = airQualityData;
    const { Number: aqiNumber } = Category;

    switch (aqiNumber) {
      case 1:
        return 'good';
      case 2:
        return 'moderate';
      case 3:
        return 'unhealthy-for-sensitive-groups';
      case 4:
        return 'unhealthy';
      case 5:
        return 'very-unhealthy';
      case 6:
        return 'hazardous';
      default:
        return 'unknown';
    }
  };

  const formatAirQualityHour = (hour) => {
    const now = new Date();

    now.setHours(hour);

    const timeString = dayjs.tz(now).format('h A z');
    const dateString = dayjs.tz(now).format('MMM D');

    return [timeString, dateString];
  };

  const airQualityHandler = () => {
    openModalWithComponent(
      <>
        <h3 className="modal-heading" id="aqi-headline">
          Air Quality Index
        </h3>
        <h4 className="mb-2 text-lg">
          {`Current Air Quality ${
            formatAirQualityHour(aqiData[0].HourObserved)[0]
          } ${formatAirQualityHour(aqiData[0].HourObserved)[1]}`}
        </h4>
        <h5 className="mb-2 text-base">{`${aqiData[0].ReportingArea} Reporting Area`}</h5>
        <div className="aqi-modal-container">
          <div className="aqi-modal-item leading-8">
            <strong className="text-base">
              {aqiData[0].ParameterName.trim().toLowerCase() === 'o3'
                ? 'Ozone'
                : aqiData[0].ParameterName}
            </strong>
            <br />
            <br />
            <span
              className={`text-xl aqi-bubble aqi-color-${getAirQualityColor(
                aqiData[0],
              )}`}
            >
              {aqiData[0].AQI}
            </span>
            <br />
            <br />
            {aqiData[0].Category.Name}
          </div>
          <div className="aqi-modal-item">
            <strong className="text-base">
              {aqiData[1].ParameterName.trim().toLowerCase() === 'o3'
                ? 'Ozone'
                : aqiData[1].ParameterName}
            </strong>
            <br />
            <br />
            <span
              className={`text-xl aqi-bubble aqi-color-${getAirQualityColor(
                aqiData[1],
              )} mt-3`}
            >
              {aqiData[1].AQI}
            </span>
            <br />
            <br />
            {aqiData[1].Category.Name}
          </div>
        </div>
        <p className="mt-2 text-sm">
          <a
            href={`https://www.airnow.gov/?city=${location.locationName
              .split(',')[0]
              .trim()}&state=${location.locationName.split(',')[1].trim()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={['fad', 'arrow-up-right-from-square']} />{' '}
            &nbsp;View more at AirNow.gov
          </a>
        </p>
      </>,
      {
        position: 'center',
        padding: '1rem',
      },
    );
  };

  return aqiData ? (
    <div className="aqi-container">
      <button
        type="button"
        onClick={airQualityHandler}
        className="aqi-button"
        title={`Air Quality Index: ${aqiData[0].AQI} (${aqiData[0].Category.Name})`}
      >
        <span className="leading-loose">
          {/* <FontAwesomeIcon icon={['fad', 'wind']} />
          &nbsp; AQI {aqiData[0].AQI} {aqiData[0].Category.Name} */}
          <strong>AQI</strong>{' '}
          <span
            className={`aqi-bubble aqi-color-${getAirQualityColor(aqiData[0])}`}
          >
            {aqiData[0].AQI}
          </span>
        </span>
      </button>
    </div>
  ) : (
    ''
  );
};

export default AirQuality;
