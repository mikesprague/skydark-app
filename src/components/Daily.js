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

  return dailyData && dailyData.daily ? (
    <div className="daily-container">
      <div className="daily">
        {dailyData.daily.data.map((dayData, dayIndex) => {
          return dayIndex <= 7 ? (
            <Day key={nanoid(7)} data={dayData} dayIndex={dayIndex} />
          ) : '';
        })}
      </div>
    </div>
  ) : '';
};

export default Daily;
