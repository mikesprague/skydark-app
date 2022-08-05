import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { WeatherMapFull } from './WeatherMapFull';

import './Header.scss';

const MySwal = withReactContent(Swal);

export const Header = ({ OPENWEATHERMAP_API_KEY }) => {
  const [locationName, setLocationName] = useState('Acquiring location');
  const headerRef = useRef();
  const data = useContext(WeatherDataContext);

  const clickHandler = () => {
    MySwal.fire({
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      backdrop: true,
      heightAuto: false,
      position: 'center',
      html: <WeatherMapFull OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />,
    });
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
          <FontAwesomeIcon icon={['fas', 'location-arrow']} fixedWidth />
          {` ${locationName}`}
        </h1>
      </div>
      <div className="flex-spacer">&nbsp;</div>
      <div className="icons">
        <button
          type="button"
          className="mapLink"
          href="#"
          onClick={clickHandler}
        >
          <FontAwesomeIcon
            icon={['fad', 'globe-stand']}
            className="footer-icon"
            fixedWidth
          />
        </button>
        <NavLink to="/settings">
          <FontAwesomeIcon
            icon={['fad', 'gear']}
            className="footer-icon"
            fixedWidth
          />
        </NavLink>
        <NavLink to="/about">
          <FontAwesomeIcon
            icon={['fad', 'circle-info']}
            className="footer-icon"
            fixedWidth
          />
        </NavLink>
      </div>
    </div>
  );
};

Header.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default Header;
