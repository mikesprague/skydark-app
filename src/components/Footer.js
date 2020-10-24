import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.scss';

export const Footer = () => (
  <div className="footer">
    <div className="flex text-sm">
      <div className="footer-column">
        <NavLink activeClassName="active" exact="true" to="/">
          <FontAwesomeIcon icon={['fad', 'house-day']} className="footer-icon" fixedWidth />
          <br />
          <small>Forecast</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink activeClassName="active" exact="true" to="/map">
          <FontAwesomeIcon icon={['fad', 'globe-stand']} className="footer-icon" fixedWidth />
          <br />
          <small>Map</small>
        </NavLink>
      </div>
      <div className="footer-column">
        <NavLink activeClassName="active" exact="true" to="/about">
          <FontAwesomeIcon icon={['fad', 'info-circle']} className="footer-icon" fixedWidth />
          <br />
          <small>About</small>
        </NavLink>
      </div>
    </div>
  </div>
);

export default Footer;
