import React, { StrictMode } from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import { createRoot } from 'react-dom/client';

import './index.scss';
import { App } from './components/App';
import { ErrorView } from './components/ErrorView';
import { initSkyDark } from './modules/helpers';

Bugsnag.start({
  apiKey: `${process.env.BUGSNAG_CLIENT_API_KEY}`,
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary FallbackComponent={ErrorView}>
    <StrictMode>
      <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
    </StrictMode>
  </ErrorBoundary>,
);

initSkyDark();
