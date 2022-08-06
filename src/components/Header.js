import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { WeatherDataContext } from '../contexts/WeatherDataContext';

import { About } from './About';
import { Settings } from './Settings';
import { WeatherMapFull } from './WeatherMapFull';

import './Header.scss';

const MySwal = withReactContent(Swal);

export const Header = ({ OPENWEATHERMAP_API_KEY }) => {
  const [locationName, setLocationName] = useState('Acquiring location');
  const headerRef = useRef();
  const data = useContext(WeatherDataContext);

  const mapIconClickHandler = () => {
    MySwal.fire({
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      backdrop: true,
      position: 'top',
      padding: '0',
      width: '28rem',
      html: <WeatherMapFull OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />,
    });
  };

  const settingsIconClickHandler = () => {
    MySwal.fire({
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      backdrop: true,
      position: 'top',
      padding: '0',
      heightAuto: false,
      width: '28rem',
      html: <Settings />,
    });
  };

  const aboutIconClickHandler = () => {
    MySwal.fire({
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      backdrop: true,
      position: 'top',
      heightAuto: false,
      padding: '0',
      width: '28rem',
      html: <About />,
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
