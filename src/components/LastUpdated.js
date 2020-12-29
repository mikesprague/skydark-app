import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { memo, useContext, useEffect, useState } from 'react';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import './LastUpdated.scss';

dayjs.extend(relativeTime);

export const LastUpdated = memo(() => {
  const [lastUpdatedString, setLastUpdatedString] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) {
      return;
    }
    const updateString = () => {
      setLastUpdatedString(dayjs(dayjs(data.lastUpdated)).from());
    };
    const clockInterval = setInterval(updateString, (1000));
    updateString();

    return () => clearInterval(clockInterval);
  }, [data]);

  return (
    <div className="last-updated-container">
      <small>
        {`Last updated ${lastUpdatedString}`}
        <br />
        <a href="https://darksky.net/poweredby/" rel="noopener noreferrer" target="_blank">Powered by Dark Sky</a>
      </small>
    </div>
  );
});
LastUpdated.displayName = 'LastUpdated';

export default LastUpdated;
