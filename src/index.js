import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import {
  initServiceWorker,
  isDev
} from './modules/helpers';

ReactDOM.render(
  <React.StrictMode>
    <App OPENWEATHERMAP_API_KEY={process.env.OPENWEATHERMAP_API_KEY} />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (!isDev()) {
  initServiceWorker();
}
