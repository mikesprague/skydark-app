import React, { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from '../components/Modal';
import './WeatherAlert.scss';

export const WeatherAlert = memo(({ data }) => {
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    if (data.alerts && data.alerts.length) {
      setAlertData(data.alerts[0]);
    }

    return () => {};
  }, [alertData, data]);

  const weatherAlertHandler = (event) => {
    const overlayContainer = document.getElementById('weather-alerts-modal');
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    overlayContainer.classList.add('fixed');
    elementsToHide.forEach(elem => elem.classList.remove('hidden'));
  };

  return alertData ? (
    <div className="weather-alert-container">
      <button onClick={weatherAlertHandler} className="weather-alert-button">
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        &nbsp;
        {alertData.title}
      </button>
      <Modal id="weather-alerts-modal" content="" heading="" weatherAlert={true} weatherAlertData={alertData}  />
    </div>
  ) : '';
});

export default WeatherAlert;
