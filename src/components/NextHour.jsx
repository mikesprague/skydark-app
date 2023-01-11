import React, { useContext, useEffect, useState } from 'react';

import { PrecipChart } from './PrecipChart';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import {
  isRaining,
  isSnowing,
  titleCaseToSentenceCase,
} from '../modules/helpers';

import './NextHour.scss';

export const NextHour = () => {
  const [summaryText, setSummaryText] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data.weather) {
      return;
    }

    const summary =
      data.weather.forecastHourly.hours[new Date().getMinutes() > 30 ? 1 : 0]
        .conditionCode;

    setSummaryText(titleCaseToSentenceCase(summary));

    return () => setSummaryText(null);
  }, [data]);

  const [nextHourPrecipitation, setNextHourPrecipitation] = useState(false);

  useEffect(() => {
    if (!summaryText) {
      return;
    }

    if (isRaining(summaryText) || isSnowing(summaryText)) {
      setNextHourPrecipitation(true);
    }

    return () => setNextHourPrecipitation(false);
  }, [summaryText]);

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
