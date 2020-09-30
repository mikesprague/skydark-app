import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { apiUrl, formatCondition, getWeatherIcon } from '../modules/helpers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Hourly } from './Hourly';
import { Loading } from './Loading';
import './Day.scss';

export const Day = ({ data, dayIndex, coordinates }) => {
  const [hourlyData, setHourlyData] = useLocalStorage(`hourlyData_${data.time}`, null);

  const getDailyWeatherData = async (lat, lng, date) => {
    const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}&time=${date}`;
    const weatherApiData = await axios
      .get(weatherApiurl)
      .then((response) => response.data);
    return weatherApiData;
  };

  const clickHandler = async (event) => {
    const allDetails = document.querySelectorAll('details');
    const currentDetail = event.target.closest('details');
    const { lat, lng } = coordinates;
    const isOpen = currentDetail.getAttribute('open') === null;
    const date = event.target.closest('summary').dataset.time;

    allDetails.forEach((detail) => {
      if (detail !== currentDetail) {
        detail.removeAttribute('open');
      }
    });

    if (isOpen) {
      if (!hourlyData || (hourlyData && dayjs().isAfter(dayjs(hourlyData.lastUpdated).add(60, 'minute')))) {
        const weatherData = await getDailyWeatherData(lat, lng, date);
        setHourlyData({
          lastUpdated: dayjs().toString(),
          data: weatherData.weather.hourly.data,
        });
      }
    }
  };

  return (
    <details className="day">
      <summary data-time={data.time} onClick={clickHandler}>
        <div className="flex flex-grow">
          <div className="name">
            <strong>{dayIndex === 0 ? 'TODAY' : dayjs.unix(data.time).format('ddd').toUpperCase()}</strong>
            <br />
            <span className="precip">
              <FontAwesomeIcon icon={['fad', 'tint']} />
              {` ${Math.round(data.precipProbability * 100)}%`}
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
          <div className="temps">
            {formatCondition(data.temperatureMin, 'temperature').trim()}
            <span className="temps-spacer" />
            {formatCondition(data.temperatureMax, 'temperature').trim()}
          </div>
        </div>
      </summary>
      {hourlyData ? <Hourly data={hourlyData} summary={data.summary} /> : <Loading fullHeight={false} />}
    </details>
  );
};

Day.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
  dayIndex: PropTypes.number.isRequired,
  coordinates: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default Day;
