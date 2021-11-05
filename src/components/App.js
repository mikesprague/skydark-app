import PropTypes from 'prop-types';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loading } from './Loading';
import { initIcons } from '../modules/icons';
import './App.scss';

const Forecast = lazy(() => import('./Forecast'));
const Settings = lazy(() => import('./Settings'));
const About = lazy(() => import('./About'));
const WeatherMapFull = lazy(() => import('./WeatherMapFull'));
const Footer = lazy(() => import('./Footer'));

export const App = ({ OPENWEATHERMAP_API_KEY }) => {
  initIcons();

  return (
    <Router>
      <Suspense fallback={<Loading fullHeight={true} />}>
        <Routes>
          <Route path="/about" className={({ isActive }) => (isActive ? 'active' : '')} element={<About />} />
          <Route
            path="/map"
            className={({ isActive }) => (isActive ? 'active' : '')}
            element={<WeatherMapFull OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />}
          />
          <Route path="/settings" className={({ isActive }) => (isActive ? 'active' : '')} element={<Settings />} />
          <Route path="/" className={({ isActive }) => (isActive ? 'active' : '')} element={<Forecast />} end />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
};

App.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default App;
