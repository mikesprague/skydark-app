import PropTypes from 'prop-types';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.scss';

export const Header = ({ data }) => {
  const [locationName, setLocationName] = useState('Acquiring location');
  const headerRef = useRef();

  useLayoutEffect(() => {
    const initScrollAndSetLocation = () => {
      window.onscroll = () => {
        if (
          (document.body.scrollTop || document.documentElement.scrollTop) &&
          (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5)
        ) {
          headerRef.current.classList.add('shadow-md');
        } else {
          headerRef.current.classList.remove('shadow-md');
        }
      };
      setLocationName(data.locationName);
    };
    initScrollAndSetLocation();
  }, [data, headerRef]);

  return (
    <div ref={headerRef} className="header">
      <div className="location-name">
        <h1>
          <FontAwesomeIcon icon={['fas', 'location-arrow']} fixedWidth />
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
