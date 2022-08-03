import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from './Modal';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './WeatherAlert.scss';

export const WeatherAlert = () => {
  const [alertData, setAlertData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data.weather.alerts) {
      return;
    }

    setAlertData(data.weather.alerts);

    return () => { setAlertData(null); }
  }, [data]);

  const weatherAlertHandler = () => {
    const overlayContainer = document.getElementById('weather-alerts-modal');
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    elementsToHide.forEach((elem) => elem.classList.remove('hidden'));
  };

  return alertData ? (
    <div className="weather-alert-container">
      <button type="button" onClick={weatherAlertHandler} className="weather-alert-button">
        <span className="leading-loose">
          <FontAwesomeIcon icon={['far', 'circle-exclamation']} />
          &nbsp;
          {alertData.length > 1 ? `${alertData[0].title} | +${alertData.length - 1}` : alertData[0].title}
        </span>
      </button>
      <Modal id="weather-alerts-modal" weatherAlertData={alertData} weatherAlert={true} />
    </div>
  ) : (
    ''
  );
};

export default WeatherAlert;
