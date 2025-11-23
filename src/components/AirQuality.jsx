import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { dayjs } from '../lib/time/dayjs.js';

import {
  formatAirQualityHour,
  getAirQualityClass,
  openModalWithComponent,
} from '../modules/helpers.js';

import './AirQuality.css';

export const AirQuality = () => {
  const [aqiData, setAqiData] = useState(null);
  const { weatherData: weather, locationData: location } =
    useWeatherDataContext();

  useEffect(() => {
    if (!weather?.airQualityData?.length) {
      setAqiData(null);
      return;
    }

    setAqiData(weather.airQualityData);
  }, [weather]);

  const airQualityHandler = () => {
    if (!aqiData || !aqiData.length) {
      return;
    }

    openModalWithComponent(
      <>
        <h3 className="modal-heading" id="aqi-headline">
          Air Quality Index
        </h3>
        <h4 className="mb-2 text-lg">
          {`${aqiData[0].ReportingArea} Reporting Area`}
        </h4>
        <h5 className="mb-2 -mt-1 text-base">
          <strong>Current Air Quality</strong>
          <br />
          <small>{`Reported at ${
            formatAirQualityHour(aqiData[0].HourObserved)[0]
          } ${formatAirQualityHour(aqiData[0].HourObserved)[1]}`}</small>
        </h5>
        <div
          className={`aqi-modal-container ${aqiData.length === 1 ? 'justify-center' : ''}`}
        >
          <div className="leading-8 aqi-modal-item">
            <strong className="text-base">
              {aqiData[0].ParameterName.trim().toLowerCase() === 'o3'
                ? 'Ozone'
                : aqiData[0].ParameterName}
            </strong>
            <br />
            <br />
            <span
              className={`text-xl aqi-bubble aqi-color-${getAirQualityClass(
                aqiData[0]
              )}`}
            >
              {aqiData[0].AQI}
            </span>
            <br />
            <br />
            {aqiData[0].Category.Name}
          </div>
          {aqiData[1] && (
            <div className="aqi-modal-item">
              <strong className="text-base">
                {aqiData[1].ParameterName.trim().toLowerCase() === 'o3'
                  ? 'Ozone'
                  : aqiData[1].ParameterName}
              </strong>
              <br />
              <br />
              <span
                className={`text-xl aqi-bubble aqi-color-${getAirQualityClass(
                  aqiData[1]
                )} mt-3`}
              >
                {aqiData[1].AQI}
              </span>
              <br />
              <br />
              {aqiData[1].Category.Name}
            </div>
          )}
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
      }
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
            className={`aqi-bubble aqi-color-${getAirQualityClass(aqiData[0])}`}
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
