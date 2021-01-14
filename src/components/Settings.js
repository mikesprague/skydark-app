import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultAppSettings } from '../modules/settings';
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
        <h2>Coming Soon!</h2>
        <p>This page and it&apos;s features are in progress, check back for updates.</p>
      </div>
    </div>
  );
};

export default Settings;
