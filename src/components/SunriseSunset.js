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
    const init = () => {
      const { sunsetTime } = data[0];
      const { sunriseTime } = data[1];
      const isSunset = dayjs(dayjs()).isBefore(dayjs.unix(sunsetTime));
      const event = isSunset ? 'Sunset' : 'Sunrise';
      const time = isSunset ? dayjs.unix(sunsetTime).format('h:mm A') : dayjs.unix(sunriseTime).format('h:mm A');
      const approxString = isSunset ? dayjs().to(dayjs.unix(sunsetTime), true) : dayjs().to(dayjs.unix(sunriseTime), true);
      setNext({
        event,
        time,
        approxString,
      });
    };
    init();

    // return () => {};
  }, [data]);

  return (
    <div className="sunrise-sunset-time">
      {next && next.event ? `${next.event} in approx ${next.approxString} (${next.time})` : ''}
    </div>
  );
}

export default SunriseSunset;
