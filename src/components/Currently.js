import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCondition } from '../modules/helpers';
import { getWeatherIcon } from '../modules/icons';

import { CurrentConditions } from './CurrentConditions';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './Currently.scss';

export const Currently = () => {
  const [currentData, setCurrentData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) {
      return;
    }

    setCurrentData(data.weather);
  }, [data]);

  const clickHandler = () => {
    const overlayContainer = document.getElementById('current-conditions-modal');
    const overlay = overlayContainer.querySelector('.overlay');
    const modal = overlayContainer.querySelector('.modal');
    const elementsToHide = [overlayContainer, overlay, modal];

    elementsToHide.forEach((elem) => elem.classList.remove('hidden'));
  };

  return currentData ? (
    <div className="current-conditions" onClick={clickHandler}>
      <div className="icon">
        <FontAwesomeIcon
          icon={['fad', getWeatherIcon(currentData.currently.icon).icon]}
          style={getWeatherIcon(currentData.currently.icon).iconStyles}
          fixedWidth
          size="4x"
        />
      </div>
      <div className="temperature">
        <h2 className="actual-temp">{formatCondition(currentData.currently.temperature, 'temperature').trim()}</h2>
        <h3 className="feels-like-temp">{`Feels ${formatCondition(
          currentData.currently.apparentTemperature,
          'apparentTemperature',
        ).trim()}`}</h3>
      </div>
      <CurrentConditions data={currentData} />
    </div>
  ) : (
    ''
  );
};

export default Currently;
