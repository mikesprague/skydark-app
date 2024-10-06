import { atom, useAtom, useAtomValue } from 'jotai';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

import { Day } from './Day';

import { metricToImperial } from '../modules/helpers';

import './Daily.scss';

import { weatherDataAtom } from './App';

export const Daily = () => {
  const dailyDataAtom = atom(null);
  const minLowAtom = atom(0);
  const maxHighAtom = atom(0);

  const [dailyData, setDailyData] = useAtom(dailyDataAtom);

  const weather = useAtomValue(weatherDataAtom);

  useEffect(() => {
    if (!weather) {
      return;
    }

    setDailyData(weather);
  }, [setDailyData, weather]);

  const [minLow, setMinLow] = useAtom(minLowAtom);
  const [maxHigh, setMaxHigh] = useAtom(maxHighAtom);

  useEffect(() => {
    if (!dailyData) {
      return;
    }

    const slicedData = dailyData.forecastDaily.days.slice(0, 8);
    const allLows = slicedData.map((val) => val.temperatureMin);
    const allHighs = slicedData.map((val) => val.temperatureMax);

    setMinLow(Math.round(metricToImperial.cToF(Math.min(...allLows))));
    setMaxHigh(Math.round(metricToImperial.cToF(Math.max(...allHighs))));
  }, [dailyData, setMaxHigh, setMinLow]);

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
