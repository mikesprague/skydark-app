import { useMemo } from 'react';
import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { dayjs } from '../lib/time/dayjs.js';
import {
  capitalizeWord,
  isRaining,
  isSnowing,
  titleCaseToSentenceCase,
} from '../modules/helpers.js';
import { PrecipChart } from './PrecipChart.jsx';

import './NextHour.css';

export const NextHour = () => {
  const { weatherData: weather } = useWeatherDataContext();

  const { summaryText, minutesData, nextHourPrecipitation, longSummaryText } =
    useMemo(() => {
      if (!weather) {
        return {
          summaryText: null,
          minutesData: null,
          nextHourPrecipitation: false,
          longSummaryText: null,
        };
      }

      const hour = dayjs().minute() > 30 ? 1 : 0;
      let summary = '';
      let minutes = null;

      // Calculate summary and minutes data
      if (
        weather.forecastNextHour.metadata.temporarilyUnavailable ||
        !weather.forecastNextHour.minutes.length
      ) {
        summary = titleCaseToSentenceCase(
          weather.forecastHourly.hours[hour].conditionCode
        );
      } else {
        summary = capitalizeWord(weather.forecastNextHour.summary[0].condition);
        minutes = weather.forecastNextHour.minutes.slice(0, 59);
        summary = titleCaseToSentenceCase(
          summary?.trim().toLowerCase() === 'clear'
            ? 'No precipitation'
            : summary
        );
      }

      // Check if there's precipitation in the next hour
      let hasPrecip = false;
      if (minutes) {
        const precipNextHour = minutes.filter(
          (minute) => minute.precipitationIntensity > 0
        );

        const summaryHasPrecip = (summaryParts) => {
          if (summaryParts.length === 1) {
            return (
              isSnowing(summaryParts[0].condition) ||
              isRaining(summaryParts[0].condition)
            );
          }

          if (summaryParts.length >= 2) {
            return (
              isSnowing(summaryParts[0].condition) ||
              isSnowing(summaryParts[1].condition) ||
              isRaining(summaryParts[0].condition) ||
              isRaining(summaryParts[1].condition)
            );
          }

          return false;
        };

        if (
          precipNextHour.length &&
          summaryHasPrecip(weather.forecastNextHour.summary)
        ) {
          hasPrecip = true;
        }
      }

      // Calculate long summary text
      let longSummary = null;
      if (summary) {
        if (hasPrecip) {
          const nextHourParts = weather.forecastNextHour.summary;

          if (nextHourParts.length) {
            if (
              nextHourParts.length === 1 &&
              nextHourParts[0].condition.trim() !== 'clear'
            ) {
              if (nextHourParts[0].endTime) {
                const stopTime = dayjs(nextHourParts[0].endTime).diff(
                  dayjs(),
                  'm'
                );
                longSummary = `${summary} stopping in ${stopTime} minutes`;
              } else {
                longSummary = `${summary} for the hour`;
              }
            }

            if (nextHourParts.length > 1) {
              if (
                nextHourParts[0].condition.trim() === 'clear' &&
                nextHourParts[1].condition.trim() !== 'clear'
              ) {
                const stopTime = dayjs(nextHourParts[1].startTime).diff(
                  dayjs(),
                  'm'
                );
                longSummary = `${capitalizeWord(
                  nextHourParts[1].condition.trim()
                )} starting in ${stopTime} minutes`;
              }

              if (nextHourParts[1].condition.trim() === 'clear') {
                const stopTime = dayjs(nextHourParts[0].endTime).diff(
                  dayjs(),
                  'm'
                );
                longSummary = `${summary} stopping in ${stopTime} minutes`;
              }
            }
          }
        } else {
          longSummary = `${summary} for the hour`;
        }
      }

      return {
        summaryText: summary,
        minutesData: minutes,
        nextHourPrecipitation: hasPrecip,
        longSummaryText: longSummary,
      };
    }, [weather]);

  return longSummaryText || summaryText ? (
    <>
      {nextHourPrecipitation && <PrecipChart />}
      <p
        className={`px-2 mb-4 text-base text-center ${
          nextHourPrecipitation ? ' -mt-8' : ''
        }`}
      >
        {longSummaryText?.length ? longSummaryText : summaryText}
      </p>
    </>
  ) : null;
};

export default NextHour;
