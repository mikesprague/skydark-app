import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import { dayjs } from '../lib/time/dayjs.js';

import './LastUpdated.css';

export const LastUpdated = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  const { lastUpdated } = useWeatherDataContext();

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10 * 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const lastUpdatedString = lastUpdated
    ? dayjs(lastUpdated).from(currentTime)
    : null;

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
