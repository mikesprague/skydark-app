import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Location.scss';

export const Location = (props) => {
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    const { name } = props;
    const initScrollAndSetLocation = () => {
      const headerEl = document.querySelector('.header');
      window.onscroll = () => {
        if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
          headerEl.classList.add('shadow-md')
        } else {
          headerEl.classList.remove('shadow-md')
        }
      };
      setLocationName(name);
    }
    initScrollAndSetLocation();

    return () => {};
  }, [props]);

  return locationName ? (
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
