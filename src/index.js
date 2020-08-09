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
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (!isDev()) {
  initServiceWorker();
}
