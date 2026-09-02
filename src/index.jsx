import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

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
          RAINBOW_API_TOKEN={import.meta.env.VITE_RAINBOW_API_TOKEN}
          CARTO_MAPS_API_KEY={import.meta.env.VITE_CARTO_MAPS_API_KEY}
        />
      </WeatherDataProvider>
    </StrictMode>
  </ErrorBoundary>
);

const updateSW = registerSW({
  onNeedRefresh() {
    openToastWithContent({
      icon: 'info',
      title: 'Sky Dark Updated',
      text: 'New content available, click Reload to update.',
      showConfirmButton: true,
      confirmButtonText: 'Reload',
      showCancelButton: true,
      cancelButtonText: 'Later',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        resetData();
        updateSW(true);
      }
    });
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

initSkyDark();
