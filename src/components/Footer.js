import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import React from 'react';

import './Footer.scss';

export const Footer = () => (
  <div className="footer">
    <div className="flex text-sm">
      <div className="footer-column">
        <NavLink to="/" end>
          <FontAwesomeIcon
            icon={['fad', 'house-day']}
            className="footer-icon"
            fixedWidth
          />
          <br />
          <small>Forecast</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink to="/map">
          <FontAwesomeIcon
            icon={['fad', 'globe-stand']}
            className="footer-icon"
            fixedWidth
          />
          <br />
          <small>Map</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink to="/settings">
          <FontAwesomeIcon
            icon={['fad', 'gear']}
            className="footer-icon"
            fixedWidth
          />
          <br />
          <small>Settings</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink to="/about">
          <FontAwesomeIcon
            icon={['fad', 'circle-info']}
            className="footer-icon"
            fixedWidth
          />
          <br />
          <small>About</small>
        </NavLink>
      </div>
    </div>
  </div>
);

export default Footer;
