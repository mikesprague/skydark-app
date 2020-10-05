import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
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

Bugsnag.start({
  apiKey: 'c439d6280bb7eada679ad4c6ef66ab5b',
  plugins: [new BugsnagPluginReact()],
});

LogRocket.init('skxlwh/sky-dark');
setupLogRocketReact(LogRocket);

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

ReactDOM.render(
  <ErrorBoundary>
    <React.StrictMode>
      <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
    </React.StrictMode>
  </ErrorBoundary>, document.getElementById('root'),
);

if (!isDev()) {
  initServiceWorker();
}
