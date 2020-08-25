import React, { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from '../components/Modal';
import './WeatherAlert.scss';

export const WeatherAlert = memo(({ alerts }) => {
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    setAlertData(alerts[0]);

    return () => {};
  }, [alertData, alerts]);

  const weatherAlertHandler = (event) => {
    const overlayContainer = document.getElementById('weather-alerts-modal');
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    overlayContainer.classList.add('fixed');
    elementsToHide.forEach(elem => elem.classList.remove('hidden'));
  };

  return alertData ? (
    <div className="mb-1 text-center weather-alert-container">
      <button onClick={weatherAlertHandler} className="px-3 mt-1 mb-2 text-sm font-medium leading-6 tracking-wide text-orange-400 border border-orange-400 rounded-full focus:outline-none">
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        &nbsp;
        {alertData.title}
      </button>
      <Modal id="weather-alerts-modal" content={alertData.description} heading={alertData.title} />
    </div>
  ) : '';
});

export default WeatherAlert;
