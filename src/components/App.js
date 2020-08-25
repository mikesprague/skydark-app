import React from "react";
import { hot } from 'react-hot-loader/root';
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { Footer } from '../components/Footer';
import { Forecast } from '../components/Forecast';
import { WeatherMapFull } from '../components/WeatherMapFull';
import { initIcons } from '../modules/helpers';
import './App.scss';

export const App = (props) => {
  initIcons();

  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/map">
          <WeatherMapFull OPENWEATHERMAP_API_KEY={props.OPENWEATHERMAP_API_KEY} />
        </Route>
        <Route path="/">
          <Forecast OPENWEATHERMAP_API_KEY={props.OPENWEATHERMAP_API_KEY} />
        </Route>
      </Switch>

      <Footer />

    </Router>
  );
};

function About() {
  return (
    <div className="contents">
      <div className="header">
        <div className="section-name">
          <h1>About</h1>
        </div>
      </div>
    </div>
  )
}

export default hot(App);
