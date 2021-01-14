import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.scss';

export const Footer = () => (
  <div className="footer">
    <div className="flex text-sm">
      <div className="footer-column">
        <NavLink activeClassName="active" to="/" end>
          <FontAwesomeIcon icon={['fad', 'house-day']} className="footer-icon" fixedWidth />
          <br />
          <small>Forecast</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink activeClassName="active" to="/map">
          <FontAwesomeIcon icon={['fad', 'globe-stand']} className="footer-icon" fixedWidth />
          <br />
          <small>Map</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink activeClassName="active" to="/settings">
          <FontAwesomeIcon icon={['fad', 'gear']} className="footer-icon" fixedWidth />
          <br />
          <small>Settings</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink activeClassName="active" to="/about">
          <FontAwesomeIcon icon={['fad', 'circle-info']} className="footer-icon" fixedWidth />
          <br />
          <small>About</small>
        </NavLink>
      </div>
    </div>
  </div>
);

export default Footer;
