import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import {
  formatSummary,
  metricToImperial,
  titleCaseToSentenceCase,
} from '../modules/helpers';

import { Hour } from './Hour';
import { Loading } from './Loading';
import { Pill } from './Pill';

import './Hourly.scss';

export const Hourly = ({ data, dayData }) => {
  const [hourlyData, setHourlyData] = useState(null);
  const [hourlyConditionToShow, setHourlyConditionToShow] =
    useState('temperature');
  const containerRef = useRef();

  useEffect(() => {
    if (!data) {
      return;
    }

    setHourlyData(data.data.forecastHourly.hours.slice(0, 23));
  }, [data]);

  const [maxValue, setMaxValue] = useState(0);
  const [valueRange, setValueRange] = useState(0);

  useEffect(() => {
    if (hourlyData) {
      const allVals = hourlyData
        .slice(0, 23)
        .map((hour) => hour[hourlyConditionToShow]);
      const max = metricToImperial.cToF(Math.max(...allVals));
      const min = metricToImperial.cToF(Math.min(...allVals));
      const range = max - min;

      setMaxValue(max);
      setValueRange(range);
    }
  }, [hourlyConditionToShow, hourlyData]);

  const changeHandler = (event) => {
    const lastSelected = containerRef.current.querySelector('.pill-selected');
    const newSelection = event.target;

    setHourlyConditionToShow(newSelection.dataset.label);
    newSelection.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
    lastSelected.classList.add('pill');
    lastSelected.classList.remove('pill-selected');
    newSelection.classList.add('pill-selected');
  };

  return hourlyData ? (
    <div className="hourly-container">
      {/* <p className="mb-2 -mt-2 text-sm leading-normal text-center">
        {titleCaseToSentenceCase(dayData.conditionCode)}
      </p> */}
      <ul className="hourly">
        {hourlyData.map((hour, index) => {
          const lastHour =
            hourlyData.length === 24 ? 22 : hourlyData.length - 1;
          const firstHour = 0;
          const isFirst = index === firstHour;
          const isLast = index === lastHour;
          const summaryText = formatSummary(hour, hourlyData, index, firstHour);

          return index % 2 === 0 && index >= firstHour && index <= lastHour ? (
            <Hour
              key={nanoid(7)}
              data={hour}
              summary={summaryText}
              isFirst={isFirst}
              isLast={isLast}
              conditionToShow={hourlyConditionToShow}
              dayData={dayData}
              valueRange={valueRange}
              maxValue={maxValue}
            />
          ) : (
            ''
          );
        })}
      </ul>
      <div className="flex condition-select-container" ref={containerRef}>
        <Pill
          dataLabel="temperature"
          label="Temp (&deg;F)"
          selected={true}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="temperatureApparent"
          label="Feels-Like (&deg;F)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="precipitationChance"
          label="Precip Prob (%)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="precipitationIntensity"
          label="Precip Rate (IN/HR)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="windSpeed"
          label="Wind (MPH)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="windGust"
          label="Wind Gust (MPH)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="humidity"
          label="Humidity (%)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="temperatureDewPoint"
          label="Dew Point (&deg;F)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="uvIndex"
          label="UV Index"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="cloudCover"
          label="Cloud Cover (%)"
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="pressure"
          label="Pressure (MB)"
          clickHandler={changeHandler}
        />
      </div>
    </div>
  ) : (
    <Loading fullHeight={false} />
  );
};

Hourly.displayName = 'Hourly';
Hourly.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.object,
    ])
  ).isRequired,
  dayData: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.object,
    ])
  ).isRequired,
};

export default Hourly;
