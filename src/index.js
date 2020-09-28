import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './components/App';
import {
  initServiceWorker,
  isDev,
} from './modules/helpers';

LogRocket.init('skxlwh/sky-dark');
setupLogRocketReact(LogRocket);

window.screen.lockOrientationUniversal = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation;
if (window.screen.lockOrientationUniversal) {
  window.screen.lockOrientationUniversal('portrait');
}

ReactDOM.render(
  <React.StrictMode>
    <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (!isDev()) {
  initServiceWorker();
}
