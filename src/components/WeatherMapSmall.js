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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" //https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png, https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            opacity={.85}
          />
          <WMSTileLayer
            layer="precipitation_new"
            url={`https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${apiKey}`}
          />
          <Marker position={[coordinates.lat, coordinates.lng]} opacity={.85} />
        </Map>
      </Link>
      ) : ''}
    </div>
  );
});

export default WeatherMapSmall;
