import { nanoid } from 'nanoid';
import { useMemo, useRef, useState } from 'react';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { calculateConditionRange } from '../lib/conditions/ranges.js';
import { dayjs } from '../lib/time/dayjs.js';
import {
  formatCondition,
  formatSummary,
  getNextTwentyFourText,
} from '../modules/helpers.js';

import { Hour } from './Hour.jsx';
import { NextHour } from './NextHour.jsx';
import { Pill } from './Pill.jsx';

import './CurrentHourly.css';

export const CurrentHourly = () => {
  const [hourlyConditionToShow, setHourlyConditionToShow] =
    useState('temperature');
  const containerRef = useRef();

  const { weatherData: weather } = useWeatherDataContext();

  const { maxValue, valueRange } = useMemo(() => {
    if (!weather) {
      return { maxValue: 0, valueRange: 0 };
    }

    const rangeData = calculateConditionRange(
      weather.forecastHourly.hours.slice(0, 23),
      hourlyConditionToShow
    );

    return {
      maxValue: rangeData.maxValue,
      valueRange: rangeData.effectiveRange,
    };
  }, [hourlyConditionToShow, weather]);

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

  return weather ? (
    <div className="current-hourly-container">
      <NextHour />
      <p className="mt-3 mb-5 ml-2 text-base leading-none">
        <strong className="text-lg font-medium">Next 24 Hours</strong>
        <br />
        <em className="text-sm">
          High:{' '}
          {` ${formatCondition(
            Math.max(
              ...weather.forecastHourly.hours
                .slice(0, 23)
                .map((hour) => Math.round(hour.temperature))
            ),
            'temperature'
          )} `}
          Low:{' '}
          {` ${formatCondition(
            Math.min(
              ...weather.forecastHourly.hours
                .slice(0, 23)
                .map((hour) => Math.round(hour.temperature))
            ),
            'temperature'
          )} `}
          {`\u00a0${getNextTwentyFourText(weather)}`}
        </em>
      </p>
      <ul className="hourly">
        {weather.forecastHourly.hours.map((hourData, index) => {
          const startIndex =
            dayjs().format('m') <= 30 &&
            dayjs(weather.forecastHourly.hours[0].hourlyStart).format('h') ===
              dayjs().format('h')
              ? 0
              : 1;
          const endIndex = startIndex + 22;
          const isFirst = index === startIndex;
          const isLast = index === endIndex;
          const summaryText = formatSummary(
            hourData,
            weather.forecastHourly.hours,
            index,
            startIndex
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
              dayData={weather.forecastDaily.days[dayDataIndex]}
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
    ''
  );
};

export default CurrentHourly;
