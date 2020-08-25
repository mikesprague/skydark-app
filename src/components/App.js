import React from "react";
import { hot } from 'react-hot-loader/root';
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
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
import { getData } from '../modules/local-storage';
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
          <WeatherMap OPENWEATHERMAP_API_KEY={props.OPENWEATHERMAP_API_KEY} />
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

function WeatherMap(props) {
  const coordinates = getData('coordinates') || null;
  return coordinates ? (
    <div className="h-full min-h-screen contents v-full">
      <div className="min-h-screen map-container">
        <Map
          center={[coordinates.lat, coordinates.lng]}
          zoom={10}
          doubleClickZoom={true}
          dragging={true}
          keyboard={false}
          scrollWheelZoom={false}
          touchZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={1}
            zIndex={1}
          />
          <WMSTileLayer
            layer="precipitation_new"
            url={`https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
            opacity={1}
            zIndex={10}
          />
          <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
        </Map>
      </div>
    </div>
  ) : '';
}

export default hot(App);
