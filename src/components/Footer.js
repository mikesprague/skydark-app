import React, { memo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.scss';

export const Footer = memo(() => {
  return (
    <div className="footer">
      <div className="flex text-sm">
        <div className="footer-column">
          <a className="active" onClick={event => event.preventDefault()}>
            <FontAwesomeIcon icon={['fad', 'house-day']} className="footer-icon" fixedWidth />
            <br />
            <small>Forecast</small>
          </a>
        </div>
        <div className="footer-column">
          <a onClick={event => event.preventDefault()}>
            <FontAwesomeIcon icon={['fad', 'globe-stand']} className="footer-icon" fixedWidth />
            <br />
            <small>Map</small>
          </a>
        </div>
        <div className="footer-column">
          <a onClick={event => event.preventDefault()}>
            <FontAwesomeIcon icon={['fad', 'info-circle']} className="footer-icon" fixedWidth />
            <br />
            <small>About</small>
          </a>
        </div>
      </div>
    </div>
  )
});
