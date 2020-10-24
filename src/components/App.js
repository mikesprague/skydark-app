import PropTypes from 'prop-types';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import {
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Footer } from './Footer';
import { Forecast } from './Forecast';
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
        <Route path="/">
          <Forecast />
        </Route>
      </Routes>

      <Footer />

    </Router>
  );
};

export const About = () => (
  <div className="contents">
    <div className="header">
      <div className="section-name">
        <h1>About</h1>
      </div>
    </div>
    <div className="my-16">
      <p>Work in progress. This page will have content soon ...</p>
    </div>
  </div>
);

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default hot(App);
