import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './components/App';
import { resetData } from './modules/local-storage';
import {
  initServiceWorker,
  isDev,
} from './modules/helpers';

Bugsnag.start({
  apiKey: 'c439d6280bb7eada679ad4c6ef66ab5b',
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const ErrorView = () => {
  const clickHandler = (event) => {
    // console.log(event);
    resetData();
    window.location.href = '/';
  };

  return (
    <div className="w-full text-center">
      <h3 className="text-2xl text-red-500">Sorry, an error has occured.</h3>
      <br />
      <br />
      <button onClick={clickHandler} className="p-6 text-lg font-bold leading-loose text-red-500 bg-gray-200" type="button">&nbsp;&nbsp;Click Here to Reset and Reload&nbsp;&nbsp;</button>
    </div>
  );
};

const handleError = (error) => {
  if (isDev()) {
    console.error(error);
  }
};

ReactDOM.render(
  <ErrorBoundary FallbackComponent={ErrorView} onError={handleError}>
    <React.StrictMode>
      <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
    </React.StrictMode>
  </ErrorBoundary>, document.getElementById('root'),
);

if (!isDev()) {
  initServiceWorker();
}
