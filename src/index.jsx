import React, { StrictMode } from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import { App } from './components/App';
import { ErrorView } from './components/ErrorView';

import { initSkyDark, openToastWithContent } from './modules/helpers';
import { resetData } from './modules/local-storage';

import './index.scss';

Bugsnag.start({
  apiKey: `${import.meta.env.VITE_BUGSNAG_CLIENT_API_KEY}`,
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary FallbackComponent={ErrorView}>
    <StrictMode>
      <App
        OPENWEATHERMAP_API_KEY={import.meta.env.VITE_OPENWEATHERMAP_API_KEY}
      />
    </StrictMode>
  </ErrorBoundary>,
);

registerSW({
  onNeedRefresh() {
    openToastWithContent({
      icon: 'info',
      title: 'Sky Dark Updated',
      text: 'Click this message to reload',
      didClose: () => {
        resetData();
        window.location.reload(true);
      },
    });
  },
  onOfflineReady() {},
  immediate: true,
});

initSkyDark();

