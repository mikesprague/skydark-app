import React from "react";
import { hot } from 'react-hot-loader/root';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { Footer } from '../components/Footer';
import { Forecast } from '../components/Forecast';
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
          <Map />
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
  return <h2>About</h2>;
}

function Map() {
  return <h2>Map</h2>;
}

export default hot(App);
