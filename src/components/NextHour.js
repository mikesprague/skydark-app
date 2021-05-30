import React, { useContext, useEffect, useState } from 'react';
import './NextHour.scss';
import { PrecipChart } from './PrecipChart';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

export const NextHour = () => {
  const [summaryText, setSummaryText] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data.weather.minutely) {
      return;
    }

    let { summary } = data.weather.minutely;
    summary = summary.replace('Possible ', '').replace(' for the hour.', '');
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);
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
      <p className={`px-4 mb-4 text-sm text-center ${nextHourPrecipitation ? ' -mt-6' : ''}`}>
        {`Next Hour: ${summaryText}`}
      </p>
    </>
  ) : (
    (
    ''
  )
  );
};

export default NextHour;
