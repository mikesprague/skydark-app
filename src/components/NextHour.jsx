import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

import { PrecipChart } from './PrecipChart.jsx';

import {
  capitalizeWord,
  isRaining,
  isSnowing,
  titleCaseToSentenceCase,
} from '../modules/helpers.js';

import './NextHour.css';

export const NextHour = () => {
  const [summaryText, setSummaryText] = useState(null);
  const [minutesData, setMinutesData] = useState(null);
  const [nextHourPrecipitation, setNextHourPrecipitation] = useState(false);
  const [longSummaryText, setLongSummaryText] = useState(null);

  const { weatherData: weather } = useWeatherDataContext();

  useEffect(() => {
    if (!weather) {
      return;
    }

    const hour = dayjs().minute() > 30 ? 1 : 0;

    if (
      weather.forecastNextHour.metadata.temporarilyUnavailable ||
      !weather.forecastNextHour.minutes.length
    ) {
      setSummaryText(
        titleCaseToSentenceCase(
          weather.forecastHourly.hours[hour].conditionCode
        )
      );
    } else {
      const summary = capitalizeWord(
        weather.forecastNextHour.summary[0].condition
      );

      // if (
      //   !weather.forecastHourly.hours[hour].conditionCode
      //     .toLowerCase()
      //     .includes(weather.forecastNextHour.summary[0].condition.toLowerCase())
      // ) {
      //   // console.log("let's use current condition code");
      //   summary = capitalizeWord(weather.currentWeather.conditionCode);
      // }

      const minutes = weather.forecastNextHour.minutes.slice(0, 59);

      setSummaryText(
        titleCaseToSentenceCase(
          summary?.trim().toLowerCase() === 'clear'
            ? 'No precipitation'
            : summary
        )
      );
      setMinutesData(minutes);
    }

    return () => setSummaryText(null);
  }, [weather]);

  useEffect(() => {
    if (!summaryText || !minutesData) {
      return;
    }

    const precipNextHour = minutesData.filter(
      (minute) => minute.precipitationIntensity > 0
    );

    const summaryHasPrecip = (summary) => {
      if (summary.length === 1) {
        return (
          isSnowing(summary[0].condition) || isRaining(summary[0].condition)
        );
      }

      if (summary.length >= 2) {
        return (
          isSnowing(summary[0].condition) ||
          isSnowing(summary[1].condition) ||
          isRaining(summary[0].condition) ||
          isRaining(summary[1].condition)
        );
      }

      return false;
    };

    if (
      precipNextHour.length &&
      summaryHasPrecip(weather.forecastNextHour.summary)
    ) {
      setNextHourPrecipitation(true);
    }

    return () => setNextHourPrecipitation(false);
  }, [weather.forecastNextHour.summary, minutesData, summaryText]);

  useEffect(() => {
    if (!summaryText || !weather) {
      return;
    }

    if (nextHourPrecipitation) {
      const nextHourParts = weather.forecastNextHour.summary;

      if (nextHourParts.length) {
        // console.log("it's precipitating!");
        if (
          nextHourParts.length === 1 &&
          nextHourParts[0].condition.trim() !== 'clear'
        ) {
          setLongSummaryText(`${summaryText} for the hour`);
        }

        if (
          nextHourParts.length === 1 &&
          nextHourParts[0].condition.trim() !== 'clear'
        ) {
          if (nextHourParts[0].endTime) {
            // console.log("it's stropping!");
            const stopTime = dayjs(nextHourParts[0].endTime).diff(dayjs(), 'm');

            setLongSummaryText(
              `${summaryText} stopping in ${stopTime} minutes`
            );
          } else {
            // console.log('precipitation through the hour!');
            setLongSummaryText(`${summaryText} for the hour`);
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
              'm'
            );

            setLongSummaryText(
              `${capitalizeWord(
                nextHourParts[1].condition.trim()
              )} starting in ${stopTime} minutes`
            );
          }

          if (nextHourParts[1].condition.trim() === 'clear') {
            // console.log("it's stopping!");
            const stopTime = dayjs(nextHourParts[0].endTime).diff(dayjs(), 'm');

            setLongSummaryText(
              `${summaryText} stopping in ${stopTime} minutes`
            );
          }
        }
      }
    } else {
      setLongSummaryText(`${summaryText} for the hour`);
    }
  }, [weather, nextHourPrecipitation, summaryText]);

  return longSummaryText || summaryText ? (
    <>
      {nextHourPrecipitation ? <PrecipChart /> : ''}
      <p
        className={`px-2 mb-4 text-base text-center ${
          nextHourPrecipitation ? ' -mt-8' : ''
        }`}
      >
        {longSummaryText?.length ? longSummaryText : summaryText}
      </p>
    </>
  ) : (
    ''
  );
};

export default NextHour;
