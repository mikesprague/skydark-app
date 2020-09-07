import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Day } from './Day';
import './Daily.scss';

export const Daily = ({ data, coordinates }) => {
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    if (data) {
      setDailyData(data);
    }

    // return () => {};
  }, [data]);

  return dailyData ? (
    <div className="daily-container">
      <div className="daily">
        {dailyData.daily.data.map((dayData, dayIndex) => {
          return dayIndex <= 7 ? (
            <Day key={nanoid(7)} data={dayData} dayIndex={dayIndex} coordinates={coordinates} />
          ) : '';
        })}
      </div>
    </div>
  ) : '';
};

Daily.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
  coordinates: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default Daily;
