/* eslint-disable arrow-body-style */
import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useState } from 'react';
import { Day } from './Day';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import './Daily.scss';

export const Daily = () => {
  const [dailyData, setDailyData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) { return; }

    setDailyData(data.weather);
  }, [data]);

  const [valScale, setValScale] = useState(2);
  const [lowScale, setLowScale] = useState(1);
  const [minLow, setMinLow] = useState(0);
  useEffect(() => {
    if (dailyData) {
      const allVals = dailyData.daily.data.slice(0, 8);
      const allDiffs = allVals.map((val) => val.temperatureMax - val.temperatureMin);
      const allLows = allVals.map((val) => val.temperatureMin);
      const largeDiff = Math.round(Math.max(...allDiffs));
      const lowMin = Math.round(Math.min(...allLows));
      const maxLow = Math.round(Math.max(...allLows));
      const lowDiff = maxLow - lowMin;
      const scaleLow = 20 / lowDiff;
      const scale = 50 / largeDiff;
      setValScale(scale);
      setLowScale(scaleLow);
      setMinLow(lowMin);
    }
  }, [dailyData]);

  return dailyData && dailyData.daily ? (
    <div className="daily-container">
      <div className="daily">
        {dailyData.daily.data.map((dayData, dayIndex) => {
          return dayIndex <= 7 ? (
            <Day
              key={nanoid(7)}
              data={dayData}
              dayIndex={dayIndex}
              valScale={valScale}
              lowScale={lowScale}
              minLow={minLow}
            />
          ) : (
            ''
          );
        })}
      </div>
    </div>
  ) : '';
};

export default Daily;
