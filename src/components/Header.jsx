import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import { WeatherDataContext } from '../contexts/WeatherDataContext.js';

import { openModalWithComponent } from '../modules/helpers.js';

import { About } from './About.jsx';
import { Settings } from './Settings.jsx';
import { WeatherMapFull } from './WeatherMapFull.jsx';

import './Header.scss';

export const Header = ({ OPENWEATHERMAP_API_KEY }) => {
  const [locationName, setLocationName] = useState('Acquiring location');
  const headerRef = useRef();
  const data = useContext(WeatherDataContext);

  const dontAnimateModalConfig = {
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster',
    },
  };

  const mapIconClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModalWithComponent(
      <WeatherMapFull OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />,
      {
        didOpen: () => {
          const closeButton = document.querySelector('.swal2-close');

          closeButton.style.position = 'relative';
          closeButton.style.top = '2rem';
          closeButton.style.marginRight = '0.65rem';
          // closeButton.blur();
        },
        ...dontAnimateModalConfig,
      },
    );
  };

  const settingsIconClickHandler = () => {
    openModalWithComponent(<Settings />, dontAnimateModalConfig);
  };

  const aboutIconClickHandler = () => {
    openModalWithComponent(<About />, dontAnimateModalConfig);
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    setLocationName(data.location.locationName);
  }, [data]);

  useLayoutEffect(() => {
    const initScroll = () => {
      window.onscroll = () => {
        if (
          (document.body.scrollTop || document.documentElement.scrollTop) &&
          (document.body.scrollTop > 5 ||
            document.documentElement.scrollTop > 5)
        ) {
          headerRef.current.classList.add('shadow-md');
        } else if (headerRef.current) {
          headerRef.current.classList.remove('shadow-md');
        }
      };
    };

    initScroll();
  });

  return (
    <div ref={headerRef} className="header">
      <div className="location-name">
        <h1>
          <FontAwesomeIcon icon={['fad', 'location-dot']} fixedWidth />
          {` ${locationName}`}
        </h1>
      </div>
      <div className="flex-spacer">&nbsp;</div>
      <div className="icons">
        <button type="button" href="#" onClick={mapIconClickHandler}>
          <FontAwesomeIcon icon={['fad', 'map-location-dot']} fixedWidth />
        </button>
        <button type="button" href="#" onClick={settingsIconClickHandler}>
          <FontAwesomeIcon icon={['fad', 'gear']} fixedWidth />
        </button>
        <button type="button" href="#" onClick={aboutIconClickHandler}>
          <FontAwesomeIcon icon={['fad', 'circle-info']} fixedWidth />
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default Header;
