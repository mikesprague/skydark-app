import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

import { Day } from './Day.jsx';

import { metricToImperial } from '../modules/helpers.js';

import './Daily.css';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

export const Daily = () => {
  const [dailyData, setDailyData] = useState(null);
  const [minLow, setMinLow] = useState(0);
  const [maxHigh, setMaxHigh] = useState(0);

  const { weatherData: weather } = useWeatherDataContext();

  useEffect(() => {
    if (weather) {
      setDailyData(weather);
    }
  }, [weather]);

  useEffect(() => {
    if (dailyData) {
      const slicedData = dailyData.forecastDaily.days.slice(0, 8);
      const allLows = slicedData.map((val) => val.temperatureMin);
      const allHighs = slicedData.map((val) => val.temperatureMax);

      setMinLow(Math.round(metricToImperial.cToF(Math.min(...allLows))));
      setMaxHigh(Math.round(metricToImperial.cToF(Math.max(...allHighs))));
    }
  }, [dailyData]);

  return dailyData?.forecastDaily ? (
    <div className="daily-container">
      <div className="daily">
        {dailyData.forecastDaily.days.slice(0, 8).map((dayData, dayIndex) => (
          <Day
            key={nanoid(7)}
            data={dayData}
            dayIndex={dayIndex}
            minLow={minLow}
            maxHigh={maxHigh}
          />
        ))}
      </div>
    </div>
  ) : (
    ''
  );
};

export default Daily;
