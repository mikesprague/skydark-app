import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import './SunriseSunset.scss';

dayjs.extend(relativeTime);

export const SunriseSunset = () => {
  const [next, setNext] = useState(null);
  const data = useContext(WeatherDataContext);

  const formatTimeString = (time) => {
    const totalMinutes = dayjs(dayjs.unix(time)).diff(dayjs(), 'minute');
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let hoursText = totalMinutes > 54 ? hours : '';

    if (hoursText === '' && (totalMinutes > 54 && totalMinutes < 67)) {
      hoursText = 1;
    }

    if (totalMinutes > 54 && (minutes > 54 || minutes < 7)) {
      hoursText = hours + 1;
    }

    let minutesFraction = '';

    if (minutes > 7 && minutes <= 22) {
      minutesFraction = String.fromCharCode(188);
    }

    if (minutes > 22 && minutes <= 37) {
      minutesFraction = String.fromCharCode(189);
    }

    if (minutes > 37 && minutes <= 54) {
      minutesFraction = String.fromCharCode(190);
    }

    return (hoursText === '' && minutesFraction === '')
      ? 'now'
      : `in ${hoursText}${minutesFraction} hour${hoursText === 1 || (hoursText === '' && minutesFraction !== '') ? '' : 's'}`;
  };

  useEffect(() => {
    const init = () => {
      const [today, tomorrow] = data.weather.forecastDaily.days;
      const now = dayjs();
      let isSunset = false;
      let datetime = today.sunrise;

      if (
        dayjs(now).isAfter(dayjs.unix(today.sunrise)) &&
        dayjs(now).isBefore(dayjs.unix(today.sunset))
      ) {
        datetime = today.sunset;
        isSunset = true;
      }

      if (
        dayjs(now).isAfter(dayjs.unix(today.sunset)) &&
        dayjs(now).isBefore(dayjs.unix(tomorrow.sunrise))
      ) {
        datetime = tomorrow.sunrise;
      }

      const event = isSunset ? 'Sunset' : 'Sunrise';
      const time = dayjs.unix(datetime).format('h:mm A');
      const timeString = formatTimeString(datetime);

      setNext({
        event,
        time,
        timeString,
      });
    };

    init();
    const clockInterval = setInterval(init, (1000));

    return () => clearInterval(clockInterval);
  }, [data]);

  return next && next.event ? (
    <div className="sunrise-sunset-time">
      {`${next.event} ${next.timeString} (${next.time})`}
    </div>
  ) : '';
};

export default SunriseSunset;
