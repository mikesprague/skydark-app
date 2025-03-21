import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';

import './LastUpdated.css';

dayjs.extend(relativeTime);

export const LastUpdated = () => {
  const [lastUpdatedString, setLastUpdatedString] = useState(null);

  const { lastUpdated } = useWeatherDataContext();

  useEffect(() => {
    if (!lastUpdated) {
      return;
    }

    const clockInterval = setInterval(() => {
      setLastUpdatedString(dayjs(dayjs(lastUpdated)).from());
    }, 10 * 1000);

    setLastUpdatedString(dayjs(dayjs(lastUpdated)).from());

    return () => clearInterval(clockInterval);
  }, [lastUpdated]);

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
