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
    setAlertData(data.weather.alerts[0]);

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
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        &nbsp;
        {alertData.title}
      </button>
      <Modal id="weather-alerts-modal" weatherAlertData={alertData} weatherAlert={true} />
    </div>
  ) : (
    ''
  );
};

export default WeatherAlert;
