import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { apiUrl, formatCondition, sleep } from '../modules/helpers';
import { getWeatherIcon } from '../modules/icons';
import { isCacheExpired } from '../modules/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Hourly } from './Hourly';
import { Loading } from './Loading';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import './Day.scss';

export const Day = ({ data, dayIndex, minLow }) => {
  const [hourlyData, setHourlyData] = useLocalStorage(`hourlyData_${data.time}`, null);
  const fullData = useContext(WeatherDataContext);

  const getDailyWeatherData = async (lat, lng, date) => {
    const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}&time=${date}`;
    const weatherApiData = await axios.get(weatherApiurl).then((response) => response.data);

    return weatherApiData;
  };

  const clickHandler = async (event) => {
    const clickedEl = event.target;
    const allDetails = document.querySelectorAll('details');
    const currentDetail = clickedEl.closest('details');
    const currentSummary = clickedEl.closest('summary');
    const scrollMarker = currentDetail.querySelector('.scroll-marker');
    const isOpen = currentDetail.getAttribute('open') === null;
    const date = currentSummary.dataset.time;

    allDetails.forEach((detail) => {
      if (detail !== currentDetail) {
        detail.removeAttribute('open');
        detail.querySelector('.scroll-marker').classList.add('hidden');
      }
    });

    if (isOpen) {
      if (!hourlyData || isCacheExpired(hourlyData.lastUpdated, 60)) {
        const weatherData = await getDailyWeatherData(fullData.weather.latitude, fullData.weather.longitude, date);

        setHourlyData({
          lastUpdated: dayjs().toString(),
          data: weatherData.weather.hourly.data,
        });
      }

      scrollMarker.classList.remove('hidden');
      sleep(250).then(() => {
        scrollMarker.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      });
    } else {
      scrollMarker.classList.add('hidden');
    }
  };

  return (
    <details className="day">
      <summary data-time={data.time} onClick={clickHandler}>
        <div className="relative hidden w-0 h-0 text-transparent scroll-marker -top-12">&nbsp;</div>
        <div className="flex flex-grow">
          <div className="name">
            <strong>{dayIndex === 0 ? 'TODAY' : dayjs.unix(data.time).format('ddd').toUpperCase()}</strong>
            <br />
            <span className="precip">
              <FontAwesomeIcon icon={['fad', 'droplet']} />
              {` ${formatCondition(data.precipProbability, 'precipProbability')}`}
            </span>
          </div>
          <div className="icon">
            <FontAwesomeIcon
              icon={['fad', getWeatherIcon(data.icon).icon]}
              style={getWeatherIcon(data.icon).iconStyles}
              size="2x"
              fixedWidth
            />
          </div>
          <div
            className="temps"
            style={{ position: 'relative', left: `${(Math.round(data.temperatureMin) - minLow)}%` }}
          >
            {formatCondition(data.temperatureMin, 'temperature').trim()}
            <span
              className="temps-spacer"
              style={{
                width: `${(data.temperatureMax - data.temperatureMin) * 1.5}%`,
              }}
            />
            {formatCondition(data.temperatureMax, 'temperature').trim()}
          </div>
        </div>
      </summary>
      {hourlyData ? <Hourly data={hourlyData} dayData={data} /> : <Loading fullHeight={false} />}
    </details>
  );
};

Day.displayName = 'Day';
Day.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]))
    .isRequired,
  dayIndex: PropTypes.number.isRequired,
  minLow: PropTypes.number.isRequired,
};

export default Day;
