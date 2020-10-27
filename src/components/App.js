import PropTypes from 'prop-types';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import {
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { About } from './About';
import { Footer } from './Footer';
import { Forecast } from './Forecast';
import { Settings } from './Settings';
import { WeatherMapFull } from './WeatherMapFull';
import { initIcons } from '../modules/helpers';
import './App.scss';

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  initIcons();

  return (
    <Router>
      <Routes>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/map">
          <WeatherMapFull OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/" end>
          <Forecast />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default hot(App);
