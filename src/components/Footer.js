import React, { memo } from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.scss';

export const Footer = memo(() => {
  return (
    <div className="footer">
      <div className="flex text-sm">
        <div className="footer-column">
          <NavLink activeClassName="active" exact to="/">
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
          <NavLink activeClassName="active" to="/about">
            <FontAwesomeIcon icon={['fad', 'info-circle']} className="footer-icon" fixedWidth />
            <br />
            <small>About</small>
          </NavLink>
        </div>
      </div>
    </div>
  )
});
