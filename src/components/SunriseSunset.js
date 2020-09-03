import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { memo, useEffect, useState } from 'react';
import './SunriseSunset.scss';
dayjs.extend(relativeTime);

export const SunriseSunset = memo(({ data }) => {
  const [next, setNext] = useState(null);

  const formatTimeString = (time) => {
    const hours = dayjs(dayjs.unix(time)).diff(dayjs(), 'hour');
    const minutes = (dayjs(dayjs.unix(time)).diff(dayjs(), 'minute') % 60);
    const hoursText = hours > 0 ? hours : '';
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

    return `${hoursText}${minutesFraction} hours`;
  };

  useEffect(() => {
    const init = () => {
      const { sunsetTime } = data[0];
      const { sunriseTime } = data[1];
      const isSunset = dayjs(dayjs()).isBefore(dayjs.unix(sunsetTime));
      const event = isSunset ? 'Sunset' : 'Sunrise';
      const time = isSunset ? dayjs.unix(sunsetTime).format('h:mm A') : dayjs.unix(sunriseTime).format('h:mm A');
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
  }, [data]);

  return (
    <div className="sunrise-sunset-time">
      {next && next.event ? `${next.event} in ${next.timeString} (${next.time})` : ''}
    </div>
  );
});

export default SunriseSunset;
