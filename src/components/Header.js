import React, {
  useContext, useEffect, useLayoutEffect, useRef, useState
} from 'react' ;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WeatherDataContext } from '../contexts/WeatherDataContext';
import './Header.scss';

export const Header = () => {
  const [locationName, setLocationName] = useState('Acquiring location');
  const headerRef = useRef();
  const data = useContext(WeatherDataContext);

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
          (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5)
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
    </div>
  );
};

export default Header;
