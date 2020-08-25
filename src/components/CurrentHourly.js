import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React, { memo, useEffect, useState } from 'react';
import { formatCondition, formatSummary, getConditionBarClass, getUvIndexClasses } from '../modules/helpers'
import './CurrentHourly.scss';

export const CurrentHourly = memo(({data}) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');

  useEffect(() => {
    // setHourlyConditionToShow(conditionToShow);

    return () => {};
  }, [hourlyConditionToShow]);

  const changeHandler = (event) => {
    // console.log(event.target.value);
    setHourlyConditionToShow(event.target.value);
  };

  return (
    <div className="hourly-container">
      <ul className="hourly">
      {data.hourly.data.map((hourData, index) => {
        const startIndex = dayjs().format('m') <= 30 && dayjs.unix(data.hourly.data[0].time).format('h') === dayjs().format('h') ? 0 : 1;
        const endIndex = startIndex + 20;
        return (index >= startIndex && index <= endIndex) && index % 2 === startIndex ? (
          <li key={nanoid(7)} className="hour">
            <div className={`condition-bar ${index === endIndex ? 'rounded-b-md' : ''} ${index === startIndex ? 'rounded-t-md' : ''} ${getConditionBarClass(hourData)}`}></div>
            <div className="time">{dayjs.unix(hourData.time).format('h a').toUpperCase()}</div>
            <div className="summary">{hourData && data && formatSummary(hourData, data.hourly.data, index, startIndex)}</div>
            <div className="spacer">&nbsp;</div>
            <div className="condition">
              <span className={hourlyConditionToShow === 'uvIndex' ? getUvIndexClasses(hourData[hourlyConditionToShow]) : 'pill'}>{formatCondition(hourData[hourlyConditionToShow], hourlyConditionToShow)}</span>
            </div>
          </li>
        ) : '';
      })}
      </ul>
      <div className="condition-select-container">
        <select className="select" onChange={changeHandler}>
          <option value="temperature">Temp (&deg;F)</option>
          <option value="apparentTemperature">Feels-Like (&deg;F)</option>
          <option value="precipProbability">Precip Prob (%)</option>
          <option value="precipIntensity">Precip Rate (IN/HR)</option>
          <option value="windSpeed">Wind (MPH)</option>
          <option value="windGust">Wind Gust (MPH)</option>
          <option value="humidity">Humidity (%)</option>
          <option value="dewPoint">Dew Point (&deg;F)</option>
          <option value="uvIndex">UV Index</option>
          <option value="cloudCover">Cloud Cover (%)</option>
          <option value="pressure">Pressure (MB)</option>
        </select>
      </div>
    </div>
  );
});
