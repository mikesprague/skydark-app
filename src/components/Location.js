import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Location.scss';

export const Location = (props) => {
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    const { name } = props;
    setLocationName(name);

    return () => {};
  }, [props]);

  return props.name && locationName ? (
    <div className="header">
      <div className="location-name">
        <h1>
          <FontAwesomeIcon icon="location-arrow" fixedWidth /> {locationName}
        </h1>
      </div>
    </div>
  ) : '';
};

export default Location;
