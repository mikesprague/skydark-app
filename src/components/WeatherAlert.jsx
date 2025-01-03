import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

import { openModalWithComponent } from '../modules/helpers.js';

import './WeatherAlert.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const WeatherAlert = () => {
  const [alertData, setAlertData] = useState(null);

  const { weatherData: weather } = useWeatherDataContext();

  useEffect(() => {
    if (!weather.weatherAlertsData || !weather.weatherAlertsData.length) {
      setAlertData(null);

      return;
    }

    setAlertData(weather.weatherAlertsData);

    return () => {
      setAlertData(null);
    };
  }, [weather]);

  const formatAlert = (alert) => {
    let alertParts = alert.includes('\n* ')
      ? alert.split('\n* ')
      : alert.split('...\n');

    alertParts = alertParts.map((alertPart, idx) => {
      if (idx === 0) {
        return alertPart.replace(/\.\.\./g, ' ').trim();
      }

      return `${alertPart.replace(/\.\.\./, ': ').trim()}\n\n`;
    });

    return alertParts;
  };

  const weatherAlertHandler = () => {
    openModalWithComponent(
      <div>
        {alertData.map((alert, alertIdx) => (
          <div className="weatherAlertItem" key={nanoid(7)}>
            <h3 className="modal-heading" id="modal-headline">
              {alert.description}
            </h3>
            <p className="pl-4 mb-4 text-sm text-left">
              <strong>Issued: </strong>
              {dayjs(alert.issuedTime).format('ddd, D MMM YYYY h:mm:ss A')}
              <br />
              <strong>Effective: </strong>
              {dayjs(alert.effectiveTime).format('ddd, D MMM YYYY h:mm:ss A')}
              <br />
              <strong>Expires: </strong>
              {dayjs(alert.expireTime).format('ddd, D MMM YYYY h:mm:ss A')}
            </p>
            <p className="mb-6 text-center">
              <strong>
                {alert?.messages[0]?.text
                  ? formatAlert(alert.messages[0].text)[0]
                  : ''}
              </strong>
            </p>
            {alert.messages[0]?.text
              ? formatAlert(alert.messages[0].text).map((alertPart, idx) => {
                  if (idx >= 1) {
                    return (
                      <p className="px-3 mb-6 text-left" key={nanoid(6)}>
                        {alertPart}
                      </p>
                    );
                  }

                  return '';
                })
              : ''}
            <p className="m-4 text-center">
              <a
                className="px-4 py-2 my-6 text-sm bg-blue-500"
                href={alert.attributionURL}
                rel="noopener noreferrer"
                target="_blank"
              >
                Source
              </a>
            </p>
            {alertData.length > 1 && alertIdx + 1 < alertData.length ? (
              <hr />
            ) : (
              ''
            )}
          </div>
        ))}
      </div>,
      {
        position: 'center',
        padding: '1rem',
      }
    );
  };

  return alertData ? (
    <div className="weather-alert-container">
      <button
        type="button"
        onClick={weatherAlertHandler}
        className="weather-alert-button"
      >
        <span className="leading-loose">
          <FontAwesomeIcon icon={['far', 'circle-exclamation']} />
          &nbsp;
          {alertData.length > 1
            ? `${alertData[0].description} | +${alertData.length - 1}`
            : alertData[0].description}
        </span>
      </button>
    </div>
  ) : (
    ''
  );
};

export default WeatherAlert;
