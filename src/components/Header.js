import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.scss';

export const Header = ({ data }) => {
  const [locationName, setLocationName] = useState('Acquiring location');

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
      setLocationName(data.locationName);
    };
    initScrollAndSetLocation();

    // return () => {};
  }, [data]);

  return (
    <div className="header">
      <div className="location-name">
        <h1>
          <FontAwesomeIcon icon="location-arrow" fixedWidth />
          {` ${locationName}`}
        </h1>
      </div>
    </div>
  );
};

Header.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object])).isRequired,
};

export default Header;
