/* eslint-disable arrow-body-style */
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Day } from './Day';
import './Daily.scss';

export const Daily = ({ data }) => {
  const [dailyData, setDailyData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (!data) { return; }

    setDailyData(data);
    // return () => {};
  }, [data]);

  useEffect(() => {
    if (!data) { return; }

    setCoordinates({
      lat: data.latitude,
      lng: data.longitude,
    });

    // return () => {};
  }, [data]);

  return dailyData && dailyData.daily ? (
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
};

export default Daily;
