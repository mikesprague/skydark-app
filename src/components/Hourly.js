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
    if (data) {
      setHourlyData(data.data);
    }

    // return () => {};
  }, [data]);

  const changeHandler = (event) => {
    setHourlyConditionToShow(event.target.value);
  };

  return hourlyData ? (
    <div className="hourly-container">
      <p className="mb-2 -mt-4 text-base text-center">{summary}</p>
      <ul className="hourly">
        {hourlyData.map((hour, index) => {
          const isFirst = index === 0;
          const isLast = index === 22;
          const showSummary = formatSummary(hour, hourlyData, index, 0);
          return (index % 2 === 0) ? (
            <Hour
              key={nanoid(7)}
              data={hour}
              showSummary={showSummary}
              isFirst={isFirst}
              isLast={isLast}
              conditionToShow={hourlyConditionToShow}
            />
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
  ) : <Loading />;
};

Hourly.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
  summary: PropTypes.string.isRequired,
};

export default Hourly;
