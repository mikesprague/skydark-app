import React, { useContext, useEffect, useState } from 'react';

import { PrecipChart } from './PrecipChart';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import {
  titleCaseToSentenceCase,
  isRaining,
  isSnowing,
} from '../modules/helpers';

import './NextHour.scss';

export const NextHour = () => {
  const [summaryText, setSummaryText] = useState(null);
  const [minutesData, setMinutesData] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data.weather) {
      return;
    }

    const { weather } = data;

    const hour = new Date().getMinutes() > 30 ? 1 : 0;
    const summary = weather.forecastHourly.hours[hour].conditionCode;
    const minutes = weather.forecastNextHour.minutes.slice(0, 59);

    setSummaryText(titleCaseToSentenceCase(summary));
    setMinutesData(minutes);

    return () => setSummaryText(null);
  }, [data]);

  const [nextHourPrecipitation, setNextHourPrecipitation] = useState(false);

  useEffect(() => {
    if (!summaryText || !minutesData) {
      return;
    }

    const precipNextHour = minutesData.filter(
      (minute) => minute.precipitationIntensity > 0,
    );

    if (
      (isRaining(summaryText.toLowerCase()) ||
        isSnowing(summaryText.toLowerCase())) &&
      precipNextHour.length
    ) {
      setNextHourPrecipitation(true);
    }

    return () => setNextHourPrecipitation(false);
  }, [minutesData, summaryText]);

  return data ? (
    <>
      {nextHourPrecipitation ? <PrecipChart /> : ''}
      <p
        className={`px-2 mb-4 text-base text-center ${
          nextHourPrecipitation ? ' -mt-8' : ''
        }`}
      >
        {`Next Hour: ${summaryText}`}
      </p>
    </>
  ) : (
    ''
  );
};

export default NextHour;
