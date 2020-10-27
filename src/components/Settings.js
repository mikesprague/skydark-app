import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Settings.scss';

export const Settings = () => (
  <div className="contents">
    <div className="header">
      <div className="section-name">
        <h1>
          <FontAwesomeIcon icon={['fas', 'cog']} className="footer-icon" fixedWidth />
          {' Settings'}
        </h1>
      </div>
    </div>
    <div className="about-content">
      <h2>Coming Soon!</h2>
      <p>This page and it's features are in progress, check back for updates.</p>
    </div>
  </div>
);

export default Settings;
