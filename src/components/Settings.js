import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { defaultAppSettings } from '../modules/settings';
import { useLocalStorage } from '../hooks/useLocalStorage';

import './Settings.scss';

export const Settings = () => {
  const [appSettings, setAppSettings] = useLocalStorage('appSettings', defaultAppSettings);

  return (
    <div className="contents">
      <div className="header">
        <div className="section-name">
          <h1>
            <FontAwesomeIcon icon={['fas', 'gear']} className="footer-icon" fixedWidth />
            {' Settings'}
          </h1>
        </div>
      </div>
      <div className="about-content">
        <h2>Work in Progress</h2>
        <p>I may work on this page and it&apos;s features sometime soon</p>
      </div>
    </div>
  );
};

export default Settings;
