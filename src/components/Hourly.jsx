import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';

import { calculateConditionRange } from '../lib/conditions/ranges.js';
import {
  formatSummary,
  // titleCaseToSentenceCase,
} from '../modules/helpers.js';

import { Hour } from './Hour.jsx';
import { Loading } from './Loading.jsx';
import { Pill } from './Pill.jsx';

import './Hourly.css';

export const Hourly = ({ data, dayData }) => {
  const [hourlyConditionToShow, setHourlyConditionToShow] =
    useState('temperature');
  const containerRef = useRef();

  const { hourlyData, maxValue, valueRange } = useMemo(() => {
    if (!data) {
      return { hourlyData: null, maxValue: 0, valueRange: 0 };
    }

    const hourlyData = data.data.forecastHourly.hours.slice(0, 23);
    const rangeData = calculateConditionRange(
      hourlyData,
      hourlyConditionToShow
    );

    return {
      hourlyData,
      maxValue: rangeData.maxValue,
      valueRange: rangeData.effectiveRange,
    };
  }, [data, hourlyConditionToShow]);

  const changeHandler = useMemo(
    () => (event) => {
      const newSelection = event.target;

      setHourlyConditionToShow(newSelection.dataset.label);
      newSelection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    },
    []
  );

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
          selected={hourlyConditionToShow === 'temperature'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="temperatureApparent"
          label="Feels-Like (&deg;F)"
          selected={hourlyConditionToShow === 'temperatureApparent'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="precipitationChance"
          label="Precip Prob (%)"
          selected={hourlyConditionToShow === 'precipitationChance'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="precipitationIntensity"
          label="Precip Rate (IN/HR)"
          selected={hourlyConditionToShow === 'precipitationIntensity'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="windSpeed"
          label="Wind (MPH)"
          selected={hourlyConditionToShow === 'windSpeed'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="windGust"
          label="Wind Gust (MPH)"
          selected={hourlyConditionToShow === 'windGust'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="humidity"
          label="Humidity (%)"
          selected={hourlyConditionToShow === 'humidity'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="temperatureDewPoint"
          label="Dew Point (&deg;F)"
          selected={hourlyConditionToShow === 'temperatureDewPoint'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="uvIndex"
          label="UV Index"
          selected={hourlyConditionToShow === 'uvIndex'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="cloudCover"
          label="Cloud Cover (%)"
          selected={hourlyConditionToShow === 'cloudCover'}
          clickHandler={changeHandler}
        />
        <Pill
          dataLabel="pressure"
          label="Pressure (MB)"
          selected={hourlyConditionToShow === 'pressure'}
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
