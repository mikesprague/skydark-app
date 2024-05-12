import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import './LastUpdated.scss';

dayjs.extend(relativeTime);

import { lastUpdatedAtom } from './App';

const lastUpdatedStringAtom = atom(null);

export const LastUpdated = () => {
  const [lastUpdatedString, setLastUpdatedString] = useAtom(
    lastUpdatedStringAtom
  );

  const lastUpdated = useAtomValue(lastUpdatedAtom);

  useEffect(() => {
    if (!lastUpdated) {
      return;
    }

    const updateString = () => {
      setLastUpdatedString(dayjs(dayjs(lastUpdated)).from());
    };
    const clockInterval = setInterval(updateString, 10000);

    updateString();

    return () => clearInterval(clockInterval);
  }, [lastUpdated, setLastUpdatedString]);

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
