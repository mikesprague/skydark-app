import { nanoid } from 'nanoid';
import { useMemo, useState } from 'react';

import { metricToImperial } from '../modules/helpers.js';

import { Day } from './Day.jsx';

import './Daily.css';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

export const Daily = () => {
  const [expandedDayIndex, setExpandedDayIndex] = useState(null);
  const { weatherData: weather } = useWeatherDataContext();

  const { minLow, maxHigh } = useMemo(() => {
    if (!weather) {
      return { minLow: 0, maxHigh: 0 };
    }

    const slicedData = weather.forecastDaily.days.slice(0, 8);
    const allLows = slicedData.map((val) => val.temperatureMin);
    const allHighs = slicedData.map((val) => val.temperatureMax);

    return {
      minLow: Math.round(metricToImperial.cToF(Math.min(...allLows))),
      maxHigh: Math.round(metricToImperial.cToF(Math.max(...allHighs))),
    };
  }, [weather]);

  return weather?.forecastDaily ? (
    <div className="daily-container">
      <div className="daily">
        {weather.forecastDaily.days.slice(0, 8).map((dayData, dayIndex) => (
          <Day
            key={nanoid(7)}
            data={dayData}
            dayIndex={dayIndex}
            minLow={minLow}
            maxHigh={maxHigh}
            isExpanded={expandedDayIndex === dayIndex}
            onToggle={() =>
              setExpandedDayIndex(
                expandedDayIndex === dayIndex ? null : dayIndex
              )
            }
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default Daily;
