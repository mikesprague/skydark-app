import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  formatCondition, formatSummary, getConditionBarClass, getUvIndexClasses,
} from '../modules/helpers';
import './CurrentHourly.scss';

export const CurrentHourly = ({ data }) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');

  const changeHandler = (event) => {
    const lastSelected = document.querySelector('.current-hourly-container .condition-select-container .pill-selected');
    setHourlyConditionToShow(event.target.dataset.label);
    event.target.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
    lastSelected.classList.add('pill');
    lastSelected.classList.remove('pill-selected');
    event.target.classList.add('pill-selected');
  };

  return (
    <div className="current-hourly-container">
      <p className="mb-2 text-base text-center">
        {`Next Hour: ${data.minutely.summary.replace(' for the hour.', '')}`}
      </p>
      <ul className="hourly">
        {data.hourly.data.map((hourData, index) => {
          const startIndex = dayjs().format('m') <= 30 && dayjs.unix(data.hourly.data[0].time).format('h') === dayjs().format('h') ? 0 : 1;
          const endIndex = startIndex + 20;
          return (index >= startIndex && index <= endIndex) && index % 2 === startIndex ? (
            <li key={nanoid(7)} className="hour">
              <div className={`condition-bar ${index === endIndex ? 'rounded-b-md' : ''} ${index === startIndex ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData)}`} />
              <div className="time">{dayjs.unix(hourData.time).format('h a').toUpperCase()}</div>
              <div className="summary">{hourData && data && formatSummary(hourData, data.hourly.data, index, startIndex)}</div>
              <div className="condition">
                <span className={hourlyConditionToShow === 'uvIndex' ? getUvIndexClasses(hourData[hourlyConditionToShow]) : 'pill'}>
                  {formatCondition(hourData[hourlyConditionToShow], hourlyConditionToShow)}
                </span>
              </div>
            </li>
          ) : '';
        })}
      </ul>
      <div className="flex condition-select-container">
        <div className="pill-selected" onClick={changeHandler} data-label="temperature">Temp (&deg;F)</div>
        <div className="pill" onClick={changeHandler} data-label="apparentTemperature">Feels-Like (&deg;F)</div>
        <div className="pill" onClick={changeHandler} data-label="precipProbability">Precip Prob (%)</div>
        <div className="pill" onClick={changeHandler} data-label="precipIntensity">Precip Rate (IN/HR)</div>
        <div className="pill" onClick={changeHandler} data-label="windSpeed">Wind (MPH)</div>
        <div className="pill" onClick={changeHandler} data-label="windGust">Wind Gust (MPH)</div>
        <div className="pill" onClick={changeHandler} data-label="humidity">Humidity (%)</div>
        <div className="pill" onClick={changeHandler} data-label="dewPoint">Dew Point (&deg;F)</div>
        <div className="pill" onClick={changeHandler} data-label="uvIndex">UV Index</div>
        <div className="pill" onClick={changeHandler} data-label="cloudCover">Cloud Cover (%)</div>
        <div className="pill" onClick={changeHandler} data-label="pressure">Pressure (MB)</div>
      </div>
    </div>
  );
};

CurrentHourly.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
  ).isRequired,
};

export default CurrentHourly;
