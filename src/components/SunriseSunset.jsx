import { useCallback, useEffect, useMemo, useState } from 'react';

import { dayjs } from '../lib/time/dayjs.js';
import './SunriseSunset.css';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

export const SunriseSunset = () => {
  const { weatherData: weather } = useWeatherDataContext();
  const [currentTime, setCurrentTime] = useState(dayjs());

  const formatTimeString = useCallback((time) => {
    const totalMinutes = dayjs(time).diff(dayjs(), 'minute');

    // Handle "now" case (within 7 minutes)
    if (totalMinutes <= 7) {
      return 'now';
    }

    // Round to nearest quarter hour for display
    const roundedMinutes = Math.round(totalMinutes / 15) * 15;
    const hours = Math.floor(roundedMinutes / 60);
    const remainderMinutes = roundedMinutes % 60;

    // Determine fractional display
    let minutesFraction = '';
    if (remainderMinutes === 15) {
      minutesFraction = String.fromCharCode(188); // ¼
    } else if (remainderMinutes === 30) {
      minutesFraction = String.fromCharCode(189); // ½
    } else if (remainderMinutes === 45) {
      minutesFraction = String.fromCharCode(190); // ¾
    }

    // Format the output
    if (hours === 0 && minutesFraction !== '') {
      return `in ${minutesFraction} hour`;
    }

    if (hours > 0 && remainderMinutes === 0) {
      return `in ${hours} hour${hours === 1 ? '' : 's'}`;
    }

    return `in ${hours}${minutesFraction} hour${hours === 1 && minutesFraction === '' ? '' : 's'}`;
  }, []);

  const next = useMemo(() => {
    if (!weather) {
      return null;
    }

    const [today, tomorrow] = weather.forecastDaily.days;
    const now = currentTime;
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

    return {
      event,
      time,
      timeString,
    };
  }, [weather, currentTime, formatTimeString]);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60 * 1000);

    return () => clearInterval(clockInterval);
  }, []);

  return next?.event ? (
    <div className="sunrise-sunset-time">
      {`${next.event} ${next.timeString} (${next.time})`}
    </div>
  ) : null;
};

export default SunriseSunset;
