import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { defaultAppSettings } from '../modules/settings';

import './Settings.scss';

const appSettingsAtom = atomWithStorage('appSettings', defaultAppSettings);

export const Settings = () => {
  const [_appSettings, _setAppSettings] = useAtom(appSettingsAtom);

  return (
    <div className="contents">
      <div className="header not-fixed">
        <div className="section-name">
          <h1>
            <FontAwesomeIcon
              icon={['fas', 'gear']}
              className="footer-icon"
              fixedWidth
            />
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
