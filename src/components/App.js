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
  const coordinates = {"lat":42.45254800065394,"lng":-76.49500060656183};
  return (
    <div className="h-full min-h-screen contents v-full">
      {/* <div className="header">
        <div className="section-name">
          <h1>Map</h1>
        </div>
      </div> */}
      <div className="min-h-screen map-container">
        <Map
          center={[coordinates.lat, coordinates.lng]}
          zoom={8}
          // doubleClickZoom={false}
          // dragging={false}
          keyboard={false}
          scrollWheelZoom={false}
          touchZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={.85}
          />
          <WMSTileLayer
            layer="precipitation_new"
            url={`https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
          />
          <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
        </Map>
      </div>
    </div>
  )
}

export default hot(App);
