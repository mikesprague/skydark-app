import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
  }, [time, lastUpdatedString]);

  return (
    <div className="last-updated-container">
      <small>
        {`Last updated ${lastUpdatedString}`}
        <br />
        <a href="https://darksky.net/poweredby/" rel="noopener noreferrer" target="_blank">Powered by Dark Sky</a>
      </small>
    </div>
  );
};

LastUpdated.propTypes = {
  time: PropTypes.string.isRequired,
};

export default LastUpdated;
