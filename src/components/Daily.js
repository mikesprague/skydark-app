import axios from 'axios';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React from 'react';
import { apiUrl, formatCondition, getWeatherIcon, } from '../modules/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Hourly } from '../components/Hourly';
import './Daily.scss';

export const Daily = ({ data, coordinates }) => {
  const [hourlyData, setHourlyData] = useLocalStorage('hourlyData', null);

  const getWeatherData = async (lat, lng, date) => {
    const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}&time=${date}`;
    const weatherApiData =  await axios
      .get(weatherApiurl)
      .then(response => response.data);
    return weatherApiData;
  };

  const clickHandler = async (event) => {
    const allDetails = document.querySelectorAll("details");
    const currentDetail = event.target.closest('details');
    const { lat, lng } = coordinates;
    const isOpen = currentDetail.getAttribute('open') === null;
    const time = event.target.closest('summary').dataset.time;

    allDetails.forEach(detail => {
      if (detail !== currentDetail) {
        detail.removeAttribute('open');
      }
    });

    if (isOpen) {
      if (!hourlyData || (hourlyData && dayjs().isAfter(dayjs(hourlyData.lastUpdated).add(20, 'minute')))) {
        const weatherData = await getWeatherData(lat, lng, time);
        setHourlyData({
          lastUpdated: dayjs().toString(),
          data: weatherData.weather.hourly.data,
        });
      }
    }
  }

  return (
    <div className="daily-container">
      <div className="daily">
      {data.map((dayData, dayIndex) => {
        return dayIndex <= 7 ? (
          <details key={nanoid(7)} className="day">
            <summary data-time={dayData.time} onClick={clickHandler}>
              <div className="name">
                <strong>{dayIndex === 0 ? 'TODAY' : dayjs.unix(dayData.time).format('ddd').toUpperCase()}</strong>
                <br />
                <span className="precip">
                  <FontAwesomeIcon icon={['fad', 'tint']} /> {Math.round(dayData.precipProbability * 100)}%
                </span>
              </div>
              <div className="icon">
                <FontAwesomeIcon icon={['fad', getWeatherIcon(dayData.icon).icon]} size="2x" fixedWidth />
              </div>
              <div className="temps">
                {formatCondition(dayData.temperatureMin, 'temperature')}<span className="temps-spacer"></span>{formatCondition(dayData.temperatureMax, 'temperature')}
              </div>
            </summary>
            <Hourly data={hourlyData.data} date={dayData.time} />
          </details>
        ) : '';
      })}
      </div>
    </div>
  );
};

export default Daily;
