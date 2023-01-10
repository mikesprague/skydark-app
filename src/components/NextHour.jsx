import React, { useContext, useEffect, useState } from 'react';

import { PrecipChart } from './PrecipChart';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './NextHour.scss';

export const NextHour = () => {
  const [summaryText, setSummaryText] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data.weather) {
      return;
    }

    let summary;

    if (data.weather.forecastNextHour) {
      summary = data.weather.forecastNextHour.summary[0].condition;
    } else {
      summary =
        data.weather.forecastHourly.hours[new Date().getMinutes() > 30 ? 1 : 0]
          .conditionCode;
    }

    summary =
      summary && summary.length ? summary.replace(' for the hour.', '') : '';
    summary = summary.length
      ? summary.charAt(0).toUpperCase() + summary.slice(1)
      : '';
    setSummaryText(summary);

    return () => setSummaryText(null);
  }, [data]);

  const [nextHourPrecipitation, setNextHourPrecipitation] = useState(false);

  useEffect(() => {
    if (!summaryText) {
      return;
    }

    if (
      summaryText.toLowerCase().includes('rain') ||
      summaryText.toLowerCase().includes('drizzle') ||
      summaryText.toLowerCase().includes('snow') ||
      summaryText.toLowerCase().includes('flurries') ||
      summaryText.toLowerCase().includes('sleet') ||
      summaryText.toLowerCase().includes('start') ||
      summaryText.toLowerCase().includes('stop')
    ) {
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
