import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useEffect, useState } from 'react';

import './SunriseSunset.css';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

dayjs.extend(relativeTime);

export const SunriseSunset = () => {
  const [next, setNext] = useState(null);

  const { weatherData: weather } = useWeatherDataContext();

  const formatTimeString = useCallback((time) => {
    const totalMinutes = dayjs(dayjs(time)).diff(dayjs(), 'minute');
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let hoursText = totalMinutes > 54 ? hours : '';

    if (hoursText === '' && totalMinutes > 54 && totalMinutes < 67) {
      hoursText = 1;
    }

    if (totalMinutes > 54 && (minutes > 54 || minutes < 7)) {
      hoursText += 1;
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

    return hoursText === '' && minutesFraction === ''
      ? 'now'
      : `in ${hoursText}${minutesFraction} hour${
          hoursText === 1 || (hoursText === '' && minutesFraction !== '')
            ? ''
            : 's'
        }`;
  }, []);

  useEffect(() => {
    const init = () => {
      const [today, tomorrow] = weather.forecastDaily.days;
      const now = dayjs();
      let isSunset = false;
      let dateTime = today.sunrise;

      if (
        dayjs(now).isAfter(dayjs(today.sunrise)) &&
        dayjs(now).isBefore(dayjs(today.sunset))
      ) {
        dateTime = today.sunset;
        isSunset = true;
      }

      if (
        dayjs(now).isAfter(dayjs(today.sunset)) &&
        dayjs(now).isBefore(dayjs(tomorrow.sunrise))
      ) {
        dateTime = tomorrow.sunrise;
      }

      const event = isSunset ? 'Sunset' : 'Sunrise';
      const time = dayjs(dateTime).format('h:mm A');
      const timeString = formatTimeString(dateTime);

      setNext({
        event,
        time,
        timeString,
      });
    };

    init();
    const clockInterval = setInterval(init, 60 * 1000);

    return () => clearInterval(clockInterval);
  }, [formatTimeString, weather]);

  return next?.event ? (
    <div className="sunrise-sunset-time">
      {`${next.event} ${next.timeString} (${next.time})`}
    </div>
  ) : (
    ''
  );
};

export default SunriseSunset;
