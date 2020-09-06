import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { getRadarTs } from '../modules/helpers';
import './WeatherMapSmall.scss';

export const WeatherMapSmall = ({ coordinates }) => {
  const [locationCoordinates, setLocationCoordinates] = useState(null);

  useEffect(() => {
    setLocationCoordinates(coordinates);

    return () => {};
  }, [coordinates]);

  return (
    <div className="map">
    {locationCoordinates && locationCoordinates.lat ? (
      <Link to="/map">
        <Map
          center={[locationCoordinates.lat, locationCoordinates.lng]}
          zoom={4}
          doubleClickZoom={false}
          dragging={false}
          keyboard={false}
          scrollWheelZoom={false}
          touchZoom={false}
        >
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            opacity={.95}
          />
          <TileLayer
            url={`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/256/{z}/{x}/{y}/8/1_1.png`}
            opacity={1}
          />
          <Marker position={[locationCoordinates.lat, locationCoordinates.lng]} opacity={.85} />
        </Map>
      </Link>
      ) : ''}
    </div>
  );
};

export default WeatherMapSmall;
