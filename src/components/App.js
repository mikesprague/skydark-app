import PropTypes from 'prop-types';
import React from 'react';

import { Forecast } from './Forecast';
import { initIcons } from '../modules/icons';

import './App.scss';

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  initIcons();

  return <Forecast OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />;
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default App;
