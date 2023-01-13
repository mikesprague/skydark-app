import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { PrecipChart } from './PrecipChart';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import {
  isDrizzle,
  isFlurries,
  isRaining,
  isSnowing,
  titleCaseToSentenceCase,
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
    let summary = weather.forecastHourly.hours[hour].conditionCode;
    const minutes = weather.forecastNextHour.minutes.slice(0, 59);

    if (isDrizzle(summary)) {
      summary = 'LightRain';
    }

    if (isFlurries(summary)) {
      summary = 'LightSnow';
    }

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

  const [longSummaryText, setLongSummaryText] = useState(null);

  useEffect(() => {
    if (!summaryText || !data) {
      return;
    }

    if (nextHourPrecipitation) {
      const nextHourParts = data.weather.forecastNextHour.summary;
      const conditions = ['clear', 'precipitation'];

      if (nextHourParts.length) {
        // const firstCondition = nextHourParts[0].condition
        //   .trim()
        //   .replace(/^\w/, (c) => c.toUpperCase());
        if (
          nextHourParts.length === 1 &&
          !conditions.includes(nextHourParts[0].condition.trim())
        ) {
          // console.log("it's precipitating!");
          if (nextHourParts[0].endTime) {
            // console.log("it's stropping!");
            const stopTime = dayjs().diff(nextHourParts[0].endTime, 'm');

            setLongSummaryText(
              `${summaryText} stopping in ${stopTime} minutes`,
            );
          } else {
            setLongSummaryText(summaryText);
            // console.log('precipitation through the hour!');
          }
        }

        if (nextHourParts.length === 1) {
          console.log('starting/stopping');
        }

        // nextHourParts.forEach((part, idx) => {
        //   console.log(part, idx);
        // });
      }
    }
  }, [summaryText, data, nextHourPrecipitation]);

  return data ? (
    <>
      {nextHourPrecipitation ? <PrecipChart /> : ''}
      <p
        className={`px-2 mb-4 text-base text-center ${
          nextHourPrecipitation ? ' -mt-8' : ''
        }`}
      >
        {`Next Hour: ${longSummaryText || summaryText}`}
      </p>
    </>
  ) : (
    ''
  );
};

export default NextHour;
