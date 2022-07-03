import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import LogRocket from 'logrocket';
import React from 'react';
import { createRoot } from 'react-dom/client';
import setupLogRocketReact from 'logrocket-react';

import './index.scss';
import { App } from './components/App';
import { ErrorView } from './components/ErrorView';
import { initSkyDark } from './modules/helpers';

Bugsnag.start({
  apiKey: `${process.env.BUGSNAG_CLIENT_API_KEY}`,
  plugins: [new BugsnagPluginReact()],
});

LogRocket.init('skxlwh/sky-dark');
setupLogRocketReact(LogRocket);

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary FallbackComponent={ErrorView}>
    <React.StrictMode>
      <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
    </React.StrictMode>
  </ErrorBoundary>,
);

initSkyDark();
