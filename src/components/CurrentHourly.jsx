import React, { useContext, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import {
  formatCondition,
  formatSummary,
  metricToImperial,
  titleCaseAddSpace,
} from '../modules/helpers';
import { Hour } from './Hour';
import { NextHour } from './NextHour';
import { Pill } from './Pill';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './CurrentHourly.scss';

export const CurrentHourly = () => {
  const [hourlyConditionToShow, setHourlyConditionToShow] =
    useState('temperature');
  const containerRef = useRef();
  const data = useContext(WeatherDataContext);

  const [maxValue, setMaxValue] = useState(0);
  const [valueRange, setValueRange] = useState(0);

  useEffect(() => {
    if (data) {
      const allVals = data.weather.forecastHourly.hours
        .slice(0, 23)
        .map((hour) => hour[hourlyConditionToShow]);
      const max = metricToImperial.cToF(Math.max(...allVals));
      const min = metricToImperial.cToF(Math.min(...allVals));
      const range = max - min;

      setMaxValue(max);
      setValueRange(range);
    }
  }, [hourlyConditionToShow, data]);

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

  return (
    <div className="current-hourly-container">
      <NextHour />
      <ul className="hourly">
        <p className="mt-3 mb-5 ml-2 text-base leading-none">
          <strong className="text-lg font-medium">Next 24 Hours</strong>
          <br />
          <em className="text-sm">
            High:{' '}
            {` ${formatCondition(
              Math.max(
                ...data.weather.forecastHourly.hours
                  .slice(0, 23)
                  .map((hour) => Math.round(hour.temperature)),
              ),
              'temperature',
            )} `}
            Low:{' '}
            {` ${formatCondition(
              Math.min(
                ...data.weather.forecastHourly.hours
                  .slice(0, 23)
                  .map((hour) => Math.round(hour.temperature)),
              ),
              'temperature',
            )} `}
            {`\u00a0${titleCaseAddSpace(
              data.weather.forecastDaily.days[0].conditionCode,
            )}`}
          </em>
        </p>
        {data.weather.forecastHourly.hours.map((hourData, index) => {
          const startIndex =
            dayjs().format('m') <= 30 &&
            dayjs(data.weather.forecastHourly.hours[0].hourlyStart).format(
              'h',
            ) === dayjs().format('h')
              ? 0
              : 1;
          const endIndex = startIndex + 22;
          const isFirst = index === startIndex;
          const isLast = index === endIndex;
          const summaryText = formatSummary(
            hourData,
            data.weather.forecastHourly.hours,
            index,
            startIndex,
          );
          const dayDataIndex =
            dayjs(hourData.hourlyStart).format('D') > dayjs().format('D')
              ? 1
              : 0;

          return index >= startIndex &&
            index <= endIndex &&
            index % 2 === startIndex ? (
            <Hour
              key={nanoid(7)}
              data={hourData}
              summary={summaryText || ''}
              isFirst={isFirst}
              isLast={isLast}
              conditionToShow={hourlyConditionToShow}
              dayData={data.weather.forecastDaily.days[dayDataIndex]}
              valueRange={valueRange}
              maxValue={maxValue}
            />
          ) : (
            ''
          );
        })}
      </ul>
      <div ref={containerRef} className="flex condition-select-container">
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
  );
};

export default CurrentHourly;
