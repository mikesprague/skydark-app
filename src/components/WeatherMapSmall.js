import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import './WeatherMapSmall.scss';

export const WeatherMapSmall = memo(({ coordinates, apiKey }) => {
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  useEffect(() => {
    setLocationCoordinates(coordinates);

    return () => {};
  }, [coordinates]);

  return (
    <div className="map">
    {coordinates && coordinates.lat ? (
      <Link to="/map">
        <Map
          center={[coordinates.lat, coordinates.lng]}
          zoom={4}
          doubleClickZoom={false}
          dragging={false}
          keyboard={false}
          scrollWheelZoom={false}
          touchZoom={false}
        >
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" //https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png, https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            opacity={.85}
          />
          <TileLayer
            url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
            layers="nexrad-n0q-900913"
            transparent="true"
            opacity={.85}
          />
          <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
        </Map>
      </Link>
      ) : ''}
    </div>
  );
});

export default WeatherMapSmall;
