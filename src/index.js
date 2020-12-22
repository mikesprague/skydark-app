import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// eslint-disable-next-line import/named
import { App } from './components/App';
import { ErrorView } from './components/ErrorView';
import { initDarkMode, initServiceWorker, isDev } from './modules/helpers';
import { initAppSettings } from './modules/settings';

const initSkyDark = () => {
  if (!isDev()) {
    initServiceWorker();
  }
  initAppSettings();
  initDarkMode();
  Bugsnag.start({
    apiKey: 'c439d6280bb7eada679ad4c6ef66ab5b',
    plugins: [new BugsnagPluginReact()],
  });
};

initSkyDark();

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

ReactDOM.render(
  <ErrorBoundary FallbackComponent={ErrorView}>
    <React.StrictMode>
      <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
    </React.StrictMode>
  </ErrorBoundary>, document.getElementById('root'),
);
