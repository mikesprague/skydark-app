import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { PrecipChart } from './PrecipChart';
import { WeatherDataContext } from '../contexts/WeatherDataContext';

import {
  capitalizeWord,
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
    const hour = dayjs().minute() > 30 ? 1 : 0;

    if (
      weather.forecastNextHour.metadata.temporarilyUnavailable ||
      !weather.forecastNextHour.minutes.length
    ) {
      setSummaryText(
        titleCaseToSentenceCase(
          weather.forecastHourly.hours[hour].conditionCode,
        ),
      );
    } else {
      let summary = capitalizeWord(
        weather.forecastNextHour.summary[0].condition,
      );

      if (
        !weather.forecastHourly.hours[hour].conditionCode
          .toLowerCase()
          .includes(weather.forecastNextHour.summary[0].condition.toLowerCase())
      ) {
        // console.log("let's use current condition code");
        summary = capitalizeWord(weather.currentWeather.conditionCode);
      }

      if (summary.toLowerCase() === 'cloudy') {
        summary = 'Overcast';
      }

      const minutes = weather.forecastNextHour.minutes.slice(0, 59);

      setSummaryText(titleCaseToSentenceCase(summary));
      setMinutesData(minutes);
    }

    // return () => setSummaryText(null);
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
  }, [minutesData, summaryText, data]);

  const [longSummaryText, setLongSummaryText] = useState(null);

  useEffect(() => {
    if (!summaryText || !data) {
      return;
    }

    if (nextHourPrecipitation) {
      const nextHourParts = data.weather.forecastNextHour.summary;
      let tmpSummaryText = '';
      // if (
      //   !summaryText.toLowerCase().includes(nextHourParts[0].condition.trim())
      // ) {
      //   if (summaryText.includes('Drizzle')) {
      //     tmpSummaryText = summaryText.replace('Drizzle', 'Flurries');
      //   }

      //   if (summaryText.includes('Flurries')) {
      //     tmpSummaryText = summaryText.replace('Flurries', 'Drizzle');
      //   }
      // }
      // console.log(tmpSummaryText);

      if (nextHourParts.length) {
        // console.log("it's precipitating!");
        if (
          nextHourParts.length === 1 &&
          nextHourParts[0].condition.trim() !== 'clear'
        ) {
          setLongSummaryText(
            // `${tmpSummaryText.trim().length ? tmpSummaryText : summaryText} for the hour`,
            `${summaryText} for the hour`,
          );
        }

        if (
          nextHourParts.length === 1 &&
          nextHourParts[0].condition.trim() !== 'clear'
        ) {
          if (nextHourParts[0].endTime) {
            // console.log("it's stropping!");
            const stopTime = dayjs(nextHourParts[0].endTime).diff(dayjs(), 'm');

            setLongSummaryText(
              `${
                tmpSummaryText.trim().length ? tmpSummaryText : summaryText
              } stopping in ${stopTime} minutes`,
            );
          } else {
            // console.log('precipitation through the hour!');
            setLongSummaryText(
              `${
                tmpSummaryText.trim().length ? tmpSummaryText : summaryText
              } for the hour`,
            );
          }
        }

        if (nextHourParts.length > 1) {
          if (
            nextHourParts[0].condition.trim() === 'clear' &&
            nextHourParts[1].condition.trim() !== 'clear'
          ) {
            // console.log("it's starting!");
            const stopTime = dayjs(nextHourParts[1].startTime).diff(
              dayjs(),
              'm',
            );

            setLongSummaryText(
              `${capitalizeWord(
                nextHourParts[1].condition.trim(),
              )} starting in ${stopTime} minutes`,
            );
          }

          if (nextHourParts[1].condition.trim() === 'clear') {
            // console.log("it's stopping!");
            const stopTime = dayjs(nextHourParts[0].endTime).diff(dayjs(), 'm');

            setLongSummaryText(
              `${
                tmpSummaryText.trim().length ? tmpSummaryText : summaryText
              } stopping in ${stopTime} minutes`,
            );
          }
        }
      }
    } else {
      setLongSummaryText(`${summaryText} for the hour`);
    }
  }, [data, nextHourPrecipitation, summaryText, longSummaryText]);

  return longSummaryText || summaryText ? (
    <>
      {nextHourPrecipitation ? <PrecipChart /> : ''}
      <p
        className={`px-2 mb-4 text-base text-center ${
          nextHourPrecipitation ? ' -mt-8' : ''
        }`}
      >
        {longSummaryText && longSummaryText.length
          ? longSummaryText
          : summaryText}
      </p>
    </>
  ) : (
    ''
  );
};

export default NextHour;
