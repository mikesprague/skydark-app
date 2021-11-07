import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatSummary, formatCondition, scaleDivisor } from '../modules/helpers';
import { Hour } from './Hour';
import { NextHour } from './NextHour';
import { Pill } from './Pill';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import './CurrentHourly.scss';

export const CurrentHourly = () => {
  const [hourlyConditionToShow, setHourlyConditionToShow] = useState('temperature');
  const containerRef = useRef();
  const data = useContext(WeatherDataContext);

  const [valScale, setValScale] = useState(1);
  useEffect(() => {
    if (data) {
      const allVals = data.weather.hourly.data.slice(0, 23).map((hour) => hour[hourlyConditionToShow]);
      const max = Math.max(...allVals);
      const scale = scaleDivisor / max;
      setValScale(scale);
    }
  }, [hourlyConditionToShow, data]);

  const changeHandler = (event) => {
    const lastSelected = containerRef.current.querySelector('.pill-selected');
    const newSelection = event.target;
    setHourlyConditionToShow(newSelection.dataset.label);
    newSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
              Math.max(...data.weather.hourly.data.slice(0, 23).map((hour) => Math.round(hour.temperature))),
              'temperature',
            )} `}
            Low:{' '}
            {` ${formatCondition(
              Math.min(...data.weather.hourly.data.slice(0, 23).map((hour) => Math.round(hour.temperature))),
              'temperature',
            )} `}
            {`\u00a0${data.weather.hourly.summary}`}
          </em>
        </p>
        {data.weather.hourly.data.map((hourData, index) => {
          const startIndex =
            dayjs().format('m') <= 30 &&
            dayjs.unix(data.weather.hourly.data[0].time).format('h') === dayjs().format('h')
              ? 0
              : 1;
          const endIndex = startIndex + 22;
          const isFirst = index === startIndex;
          const isLast = index === endIndex;
          const summaryText = formatSummary(hourData, data.weather.hourly.data, index, startIndex);
          const dayDataIndex = dayjs.unix(hourData.time).format('D') > dayjs().format('D') ? 1 : 0;
          return index >= startIndex && index <= endIndex && index % 2 === startIndex ? (
            <Hour
              key={nanoid(7)}
              data={hourData}
              summary={summaryText}
              isFirst={isFirst}
              isLast={isLast}
              conditionToShow={hourlyConditionToShow}
              dayData={data.weather.daily.data[dayDataIndex]}
              valScale={valScale}
            />
          ) : (
            ''
          );
        })}
      </ul>
      <div ref={containerRef} className="flex condition-select-container">
        <Pill dataLabel="temperature" label="Temp (&deg;F)" selected={true} clickHandler={changeHandler} />
        <Pill dataLabel="apparentTemperature" label="Feels-Like (&deg;F)" clickHandler={changeHandler} />
        <Pill dataLabel="precipProbability" label="Precip Prob (%)" clickHandler={changeHandler} />
        <Pill dataLabel="precipIntensity" label="Precip Rate (IN/HR)" clickHandler={changeHandler} />
        <Pill dataLabel="windSpeed" label="Wind (MPH)" clickHandler={changeHandler} />
        <Pill dataLabel="windGust" label="Wind Gust (MPH)" clickHandler={changeHandler} />
        <Pill dataLabel="humidity" label="Humidity (%)" clickHandler={changeHandler} />
        <Pill dataLabel="dewPoint" label="Dew Point (&deg;F)" clickHandler={changeHandler} />
        <Pill dataLabel="uvIndex" label="UV Index" clickHandler={changeHandler} />
        <Pill dataLabel="cloudCover" label="Cloud Cover (%)" clickHandler={changeHandler} />
        <Pill dataLabel="pressure" label="Pressure (MB)" clickHandler={changeHandler} />
      </div>
    </div>
  );
};

export default CurrentHourly;
