import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LastUpdated.scss';
dayjs.extend(relativeTime);

export const LastUpdated = ({ time }) => {
  const [lastUpdatedString, setLastUpdatedString] = useState(null);

  useEffect(() => {
    const updateString = () => {
      setLastUpdatedString(dayjs(dayjs(time)).from());
    };
    const clockInterval = setInterval(updateString, (1000));
    updateString();

    return () => clearInterval(clockInterval);
  });

  return (
    <div className="text-center last-updated-container">
      <small>
        Last updated {lastUpdatedString} &middot; <a href="https://darksky.net/poweredby/" rel="noopener" target="_blank">Powered by <FontAwesomeIcon icon={['fad', 'tint']} /> Dark Sky</a>
      </small>
    </div>
  );
};

  export default LastUpdated;
