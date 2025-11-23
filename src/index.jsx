// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App.jsx';
import { ErrorView } from './components/ErrorView.jsx';

import { WeatherDataProvider } from './contexts/WeatherDataContext.jsx';

import { initSkyDark, openToastWithContent } from './modules/helpers.js';
import { resetData } from './modules/local-storage.js';

import './index.css';

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
      <WeatherDataProvider>
        <App
          OPENWEATHERMAP_API_KEY={import.meta.env.VITE_OPENWEATHERMAP_API_KEY}
        />
      </WeatherDataProvider>
    </StrictMode>
  </ErrorBoundary>
);

registerSW({
  onNeedRefresh() {
    openToastWithContent({
      icon: 'info',
      title: 'Sky Dark Updated',
      text: 'Click this message to reload',
      timer: 10000,
      showConfirmButton: true,
      confirmButtonText: 'Reload',
    }).then((result) => {
      // Only reload if user clicked the button, not on timer close
      if (result.isConfirmed) {
        resetData();
        window.location.reload(true);
      }
    });
  },
  onOfflineReady() {},
  // immediate: true,
});

initSkyDark();
