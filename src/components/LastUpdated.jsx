import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import React, { useContext, useEffect, useState } from 'react';

import { WeatherDataContext } from '../contexts/WeatherDataContext.js';

import './LastUpdated.scss';

dayjs.extend(relativeTime);

export const LastUpdated = () => {
  const [lastUpdatedString, setLastUpdatedString] = useState(null);
  const data = useContext(WeatherDataContext);

  useEffect(() => {
    if (!data) {
      return;
    }

    const updateString = () => {
      setLastUpdatedString(dayjs(dayjs(data.lastUpdated)).from());
    };
    const clockInterval = setInterval(updateString, 1000);

    updateString();

    return () => clearInterval(clockInterval);
  }, [data]);

  return (
    <div className="last-updated-container">
      <small>
        {`Last updated ${lastUpdatedString}`}
        <p style={{ marginTop: '0.25rem' }}>
          <a
            href="https://weatherkit.apple.com/legal-attribution.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Powered by{' '}
            <span style={{ fontSize: '1.2rem' }}>
              <FontAwesomeIcon icon={['fab', 'apple']} fixedWidth />
            </span>{' '}
            Weather
          </a>
        </p>
      </small>
    </div>
  );
};

export default LastUpdated;
