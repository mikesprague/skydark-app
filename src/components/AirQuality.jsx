import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
// import { nanoid } from 'nanoid';

import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { openModalWithComponent } from '../modules/helpers';

import './AirQuality.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const AirQuality = () => {
  const [aqiData, setAqiData] = useState(null);
  const data = useContext(WeatherDataContext);

  const { weather } = data;

  useEffect(() => {
    if (!weather.airQualityData || !weather.airQualityData.length) {
      setAqiData(null);

      return;
    }

    setAqiData(weather.airQualityData);
  }, [weather]);

  const getAirQualityClass = (data) => {
    const { Category } = data;
    const { Number: aqiNumber } = Category;

    switch (aqiNumber) {
      case 1:
        return 'air-quality-text good';
      case 2:
        return 'air-quality-text moderate';
      case 3:
        return 'air-quality-text unhealthy-for-sensitive-groups';
      case 4:
        return 'air-quality-text unhealthy';
      case 5:
        return 'air-quality-text very-unhealthy';
      case 6:
        return 'air-quality-text hazardous';
      default:
        return 'air-quality-text unknown';
    }
  };

  const airQualityHandler = () => {
    return;
    openModalWithComponent(
      <>
        <h3 className="modal-heading" id="aqi-headline">
          Air Quality Index
        </h3>
        <h4 className="mb-2 text-lg"><span className={getAirQualityClass(aqiData[0])}>{aqiData[0].AQI} {aqiData[0].Category.Name}</span></h4>
        <p>Primary Polutant: {aqiData[0].ParameterName} {aqiData[0].AQI}</p>
      </>,
      {
        position: 'center',
        padding: '1rem',
      },
    );
  };

  return aqiData ? (
    <div className="air-quality-container">
      <button type="button" onClick={airQualityHandler} className="air-quality-button" title={`Air Quality Index: ${aqiData[0].AQI} (${aqiData[0].Category.Name})`}>
        <span className="leading-loose">
          {/* <FontAwesomeIcon icon={['fad', 'wind']} />
          &nbsp; AQI {aqiData[0].AQI} {aqiData[0].Category.Name} */}
          <strong>AQI</strong> <span className={getAirQualityClass(aqiData[0])}>{aqiData[0].AQI}</span>
        </span>
      </button>
    </div>
  ) : (
    ''
  );
};

export default AirQuality;
