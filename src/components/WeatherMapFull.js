import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer, Marker, TileLayer, WMSTileLayer, LayersControl, ScaleControl, ZoomControl, AttributionControl,
} from 'react-leaflet';
import { getRadarTs } from '../modules/helpers';
import { getData } from '../modules/local-storage';
import './WeatherMapFull.scss';

// {/* <TileLayer
// url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
// layers="nexrad-n0q-900913"
// transparent="true"
// /> */}

export const WeatherMapFull = ({ OPENWEATHERMAP_API_KEY }) => {
  const [mapView, setMapView] = useState(null);
  const coordinates = getData('coordinates') || null;

  const [tsData, setTsData] = useState(null);
  useEffect(() => {
    if (!coordinates) {
      window.location.replace('/');
    }

    const getTimestamps = async () => {
      const timestampsData = await axios
        .get('https://api.rainviewer.com/public/maps.json')
        .then((response) => {
          // console.log(response.data);
          setTsData(response.data);
          return response.data;
        });
      return timestampsData;
    };

    getTimestamps();

    // return () => {};
  }, []);

  const [ts, setTs] = useState(null);
  useEffect(() => {
    if (!tsData) { return; }
    setTs(tsData[tsData.length - 1]);
  }, [tsData]);

  const [rangeMax, setRangeMax] = useState(13);
  useEffect(() => {
    if (!tsData) { return; }
    setRangeMax(tsData.length - 1);
  }, [tsData]);

  const [rangeValue, setRangeValue] = useState(13);
  useEffect(() => {
    if (!tsData) { return; }
    setRangeValue(tsData.length - 1);
  }, [tsData]);

  const [radarMapUrl, setRadarMapUrl] = useState(`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/512/{z}/{x}/{y}/8/1_1.png`);
  useEffect(() => {
    if (!ts) { return; }
    setRadarMapUrl(`https://tilecache.rainviewer.com/v2/radar/${ts}/512/{z}/{x}/{y}/8/1_1.png`);
  }, [ts]);

  const createdHandler = () => {
    const checkBoxes = Array.from(document.querySelectorAll('.leaflet-control-layers-selector[type=checkbox]'));
    checkBoxes.forEach((cb) => {
      cb.addEventListener('click', (event) => {
        if (event.srcElement.nextSibling.textContent.trim().toLowerCase() === 'temperature' && event.srcElement.checked) {
          setMapView('temp_new');
        } else {
          setMapView(null);
        }
      });
    });
  };

  const radarTileLayerRef = useRef();
  useEffect(() => {
    // console.log(tileLayerRef.current);
    if (radarTileLayerRef.current) {
      radarTileLayerRef.current.setUrl(radarMapUrl);
    }
  }, [radarMapUrl]);

  const rangeSliderHandler = (event) => {
    const { value } = event.target;
    setTs(tsData[value]);
    setRadarMapUrl(`https://tilecache.rainviewer.com/v2/radar/${tsData[value]}/512/{z}/{x}/{y}/8/1_1.png`);
    setRangeValue(value);
    // console.log(radarMapUrl);
  };

  return (
    <div className="map-container">
      <div className="slider-container">
        <div className="slider">
          {tsData ? `${dayjs.unix(ts).format('h:mma')} ` : ''}
          {tsData ? (
            <input
              className="range-slider"
              type="range"
              min={0}
              max={rangeMax}
              step={1}
              value={rangeValue || rangeMax}
              onChange={rangeSliderHandler}
            />
          ) : ''}
        </div>
      </div>
      <MapContainer
        animate={true}
        boxZoom={true}
        center={[coordinates.lat, coordinates.lng]}
        doubleClickZoom={true}
        dragging={true}
        className="weather-map-full"
        keyboard={false}
        whenCreated={createdHandler}
        scrollWheelZoom={false}
        tap={true}
        touchZoom={true}
        zoom={9}
        zoomControl={false}
      >
        <Marker position={[coordinates.lat, coordinates.lng]} opacity={0.9} />
        <ScaleControl position="topleft" />
        <ZoomControl position="topleft" />
        <AttributionControl position="bottomleft" />
        <LayersControl>
          <LayersControl.BaseLayer name="Dark" checked>
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              opacity={1}
              attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Color">
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
              opacity={1}
              attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light">
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
              opacity={1}
              attribution={'&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={1}
              attribution={'&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street (Gray)">
            <TileLayer
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              opacity={1}
              attribution={'&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Black/White">
            <TileLayer
              url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}@2x.png"
              opacity={1}
              attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Black/White/Gray">
            <TileLayer
              url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png"
              opacity={1}
              attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Watercolor">
            <TileLayer
              url="https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
              opacity={1}
              attribution={'&copy; <a href="https://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a>'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Radar" checked>
            <WMSTileLayer
              url={`https://tilecache.rainviewer.com/v2/radar/${getRadarTs()}/512/{z}/{x}/{y}/8/1_1.png`}
              attribution={'&copy; <a href="https://www.rainviewer.com/api.html" rel="noopener noreferrer" target="_blank">RainViewer</a>'}
              ref={radarTileLayerRef}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Temperature">
            <WMSTileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`}
              attribution={'&copy; <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank">OpenWeatherMap</a>'}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      <div className="radar-key">
        <img src="/images/radar-key.png" alt="Radar Key" />
      </div>
      <div className={mapView === 'temp_new' ? 'temp-key' : 'hidden'}>
        <img src="/images/temp-key.png" alt="Temperature Key" />
      </div>
    </div>
  );
};

WeatherMapFull.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapFull;
