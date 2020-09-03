import React, { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.scss';

export const Header = memo(({ name }) => {
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    const initScrollAndSetLocation = () => {
      const headerEl = document.querySelector('.header');
      window.onscroll = () => {
        if ((document.body.scrollTop || document.documentElement.scrollTop) && (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5)) {
          headerEl.classList.add('shadow-md');
        } else {
          headerEl.classList.remove('shadow-md');
        }
      };
      setLocationName(name);
    };
    initScrollAndSetLocation();

    return () => {};
  }, [name]);

  return locationName ? (
    <div className="header">
      <div className="location-name">
        <h1>
          <FontAwesomeIcon icon="location-arrow" fixedWidth /> {locationName}
        </h1>
      </div>
    </div>
  ) : '';
});

export default Header;
