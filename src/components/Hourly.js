import axios from 'axios';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { apiUrl, formatCondition, formatSummary, getConditionBarClass, getUvIndexClasses } from '../modules/helpers'
import { getData } from '../modules/local-storage';
import { Hour } from '../components/Hour';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Hourly.scss';

export const Hourly = ({ date }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hourlyData, setHourlyData] = useLocalStorage(`hourlyData_${date}`, null);
  const { lat, lng } = getData('coordinates');

  useEffect(() => {
    if (lat && lng) {
      setIsLoading(true);

      const getWeatherData = async (lat, lng) => {
        const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}&time=${date}`;
        const weatherApiData =  await axios
          .get(weatherApiurl)
          .then(response => response.data);
        setHourlyData({
          lastUpdated: dayjs().toString(),
          data: weatherApiData.weather.hourly.data,
        });
        setIsLoading(false);
      };

      if (hourlyData && hourlyData.lastUpdated) {
        const nextUpdateTime = dayjs(hourlyData.lastUpdated).add(20, 'minute');
        if (dayjs().isAfter(nextUpdateTime)) {
          getWeatherData(lat, lng);
        }
      } else {
        getWeatherData(lat, lng);
      }
    }

    // return () => {};
  }, []);


  return (
    <div className="hourly-container">
      <ul className="hourly">
      {hourlyData && hourlyData.data.map((hour, index) => {
        const isFirst = index === 0;
        const isLast = index === 22;
        const showSummary = hourlyData.data && formatSummary(hour, hourlyData.data, index, 0).length;
        return (index % 2 === 0) ? (
          <Hour key={nanoid(7)} data={hour} showSummary={showSummary} isFirst={isFirst} isLast={isLast} />
        ) : '';
      })}
      </ul>
    </div>
  );
};
