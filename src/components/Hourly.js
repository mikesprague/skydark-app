import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { formatSummary } from '../modules/helpers';
import { Hour } from './Hour';
import { Loading } from './Loading';
import './Hourly.scss';

export const Hourly = ({ data, summary }) => {
  const [hourlyData, setHourlyData] = useState(null);
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');

  useEffect(() => {
    if (!data) { return; }

    setHourlyData(data.data);

    // return () => {};
  }, [data]);

  const changeHandler = (event) => {
    const lastSelected = document.querySelector('.hourly-container .condition-select-container .pill-selected');
    setHourlyConditionToShow(event.target.dataset.label);
    event.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    lastSelected.classList.add('pill');
    lastSelected.classList.remove('pill-selected');
    event.target.classList.add('pill-selected');
  };

  return hourlyData ? (
    <div className="hourly-container">
      <p className="mb-2 -mt-2 text-base leading-normal text-center">{summary}</p>
      <ul className="hourly">
        {hourlyData.map((hour, index) => {
          const isFirst = index === 0;
          const isLast = index === 22;
          const summaryText = formatSummary(hour, hourlyData, index, 0);
          return (index % 2 === 0) ? (
            <Hour
              key={nanoid(7)}
              data={hour}
              summary={summaryText}
              isFirst={isFirst}
              isLast={isLast}
              conditionToShow={hourlyConditionToShow}
            />
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
  ) : <Loading />;
};

Hourly.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
  summary: PropTypes.string.isRequired,
};

export default Hourly;
