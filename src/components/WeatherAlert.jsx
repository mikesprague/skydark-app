import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { openModalWithComponent } from '../modules/helpers';

import './WeatherAlert.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const WeatherAlert = () => {
  const [alertData, setAlertData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data.weather.weatherAlerts.alerts.length) {
      return;
    }

    setAlertData(data.weather.weatherAlerts.alerts);

    return () => {
      setAlertData(null);
    };
  }, [data, data.weather.weatherAlerts.alerts]);

  const weatherAlertHandler = () => {
    openModalWithComponent(
      <>
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
            <p className="mb-6 text-center">{alert.messages}</p>
            <p className="m-4 text-center">
              <a
                className="px-4 py-2 my-6 text-sm bg-blue-500"
                href={alert.detailsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                More Info
              </a>
            </p>
            {alertData.length > 1 && alertIdx + 1 < alertData.length ? (
              <hr />
            ) : (
              ''
            )}
          </div>
        ))}
      </>,
      {
        position: 'center',
        padding: '1rem',
      },
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
