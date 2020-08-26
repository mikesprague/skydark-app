import React, { useEffect, useState } from 'react';
import { Map, Marker, TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";
import { getData } from '../modules/local-storage';
import './WeatherMapFull.scss';

export const WeatherMapFull = (props) => {
  const [mapView, setMapView] = useState('precipitation_new');
  const coordinates = getData('coordinates') || null;

  useEffect(() => {

    return () => {};
  }, [mapView]);

  const changeHandler = (event) => {
    console.log(event.target.value);
    setMapView(event.target.value);
  };

  return (
    <div className="contents">
      <div className="header">
        <div className="section-name">
          <select className="" onChange={changeHandler}>
            <option value="precipitation_new">Precipitation</option>
            <option value="clouds_new">Clouds</option>
            <option value="temp_new">Temperature</option>
            <option value="wind_new">Wind Speed</option>
            <option value="pressure_new">Sea Level Pressure</option>
          </select>
        </div>
      </div>
      <div className="h-full min-h-screen contents v-full">
        <div className="min-h-screen map-container">
          <Map
            center={[coordinates.lat, coordinates.lng]}
            zoom={7}
            doubleClickZoom={true}
            dragging={true}
            keyboard={false}
            scrollWheelZoom={false}
            touchZoom={true}
          >
            {/* <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" //https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png, https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              opacity={.9}
              zIndex={1}
            /> */}
            <Marker position={[coordinates.lat, coordinates.lng]} opacity={.75} />
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Dark (default)" checked>
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                  opacity={.95}
                  zIndex={1}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Standard">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={.85}
                  zIndex={1}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="B/W">
                <TileLayer
                  url="http://{s}.tile.stamen.com/toner/{z}/{x}/{y}@2x.png"
                  opacity={.9}
                  zIndex={1}
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="Conditions" checked>
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/${mapView}/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                />
              </LayersControl.Overlay>
            </LayersControl>
            {/* <LayersControl position="topright">
              <LayersControl.BaseLayer name="Precipitation" checked>
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Clouds">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Temperature">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Wind Speed">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Sea Level Pressure">
                <WMSTileLayer
                  url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${props.OPENWEATHERMAP_API_KEY}`}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.BaseLayer>
            </LayersControl> */}
          </Map>
        </div>
      </div>
    </div>
  );
};

export default WeatherMapFull;
