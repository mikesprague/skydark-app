import { nanoid } from 'nanoid';
/* eslint-disable arrow-body-style */
import React, { useContext, useEffect, useState } from 'react';

import { Day } from './Day.jsx';

import { WeatherDataContext } from '../contexts/WeatherDataContext.js';

import { metricToImperial } from '../modules/helpers.js';

import './Daily.scss';

export const Daily = () => {
  const [dailyData, setDailyData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) {
      return;
    }

    setDailyData(data.weather);
  }, [data]);

  const [minLow, setMinLow] = useState(0);
  const [maxHigh, setMaxHigh] = useState(0);

  useEffect(() => {
    if (!dailyData) {
      return;
    }

    const slicedData = dailyData.forecastDaily.days.slice(0, 8);
    const allLows = slicedData.map((val) => val.temperatureMin);
    const allHighs = slicedData.map((val) => val.temperatureMax);

    setMinLow(Math.round(metricToImperial.cToF(Math.min(...allLows))));
    setMaxHigh(Math.round(metricToImperial.cToF(Math.max(...allHighs))));
  }, [dailyData]);

  return dailyData?.forecastDaily ? (
    <div className="daily-container">
      <div className="daily">
        {dailyData.forecastDaily.days.map((dayData, dayIndex) => {
          return dayIndex <= 7 ? (
            <Day
              key={nanoid(7)}
              data={dayData}
              dayIndex={dayIndex}
              minLow={minLow}
              maxHigh={maxHigh}
            />
          ) : (
            ''
          );
        })}
      </div>
    </div>
  ) : (
    ''
  );
};

export default Daily;
