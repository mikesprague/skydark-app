import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dompurify from 'dompurify';
import he from 'he';
import { nanoid } from 'nanoid';
import React, { Fragment, useEffect, useState } from 'react';
import './SunriseSunset.scss';
dayjs.extend(relativeTime);

export const SunriseSunset = ({ data }) => {
  const [next, setNext] = useState(null);

  useEffect(() => {
    const formatTimeString = (time) => {
      const hours = dayjs(dayjs.unix(time)).diff(dayjs(), 'hour');
      const minutes = dayjs(dayjs.unix(time)).diff(dayjs(), 'minute') % 60;
      return `${hours} hours ${minutes > 0 ? minutes + ' minutes' : ''}`;
    };
    const init = () => {
      const { sunsetTime } = data[0];
      const { sunriseTime } = data[1];
      const isSunset = dayjs(dayjs()).isBefore(dayjs.unix(sunsetTime));
      const event = isSunset ? 'Sunset' : 'Sunrise';
      const time = isSunset ? dayjs.unix(sunsetTime).format('h:mm A') : dayjs.unix(sunriseTime).format('h:mm A');
      // const timeString = isSunset ? dayjs.unix(sunsetTime).fromNow(true) : dayjs.unix(sunriseTime).fromNow();
      const timeString = isSunset ? formatTimeString(sunsetTime) : formatTimeString(sunriseTime);
      setNext({
        event,
        time,
        timeString,
      });
    }
    init();
    const clockInterval = setInterval(init, (1000));

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="sunrise-sunset-time">
      {next && next.event ? `${next.event} in ${next.timeString} (${next.time})` : ''}
    </div>
  );
}

export default SunriseSunset;
