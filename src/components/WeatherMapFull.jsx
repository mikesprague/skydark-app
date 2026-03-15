import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  AttributionControl,
  Circle,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import { dayjs } from '../lib/time/dayjs.js';
import 'leaflet/dist/leaflet.css';

import {
  generateSnapshotHistory,
  initLeafletImages,
} from '../modules/helpers.js';
import { getData } from '../modules/local-storage.js';
import { isDarkModeEnabled } from '../modules/theme.js';

import './WeatherMapFull.css';

initLeafletImages(L);

// {/* <TileLayer
// url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
// layers="nexrad-n0q-900913"
// transparent="true"
// /> */}

export const WeatherMapFull = ({
  OPENWEATHERMAP_API_KEY,
  RAINBOW_API_TOKEN,
}) => {
  const timerHandle = useRef();
  const rangeSliderRef = useRef();

  const coordinates = getData('coordinates');

  const { popupAddress, tsData } = useMemo(() => {
    const locationData = getData('locationData');
    const { radarData } = getData('weatherData');

    const snapshot = radarData?.snapshot;
    const timestamps = snapshot ? generateSnapshotHistory(snapshot) : null;

    return {
      popupAddress: locationData.formattedAddress,
      tsData: [...timestamps],
    };
  }, []);

  const initialTs = useMemo(
    () => (tsData ? tsData[tsData.length - 1] : null),
    [tsData]
  );
  const rangeMaxValue = useMemo(
    () => (tsData ? tsData.length - 1 : null),
    [tsData]
  );

  const initialRadarUrl = useMemo(
    () =>
      initialTs
        ? `https://api.rainbow.ai/tiles/v1/precip/${initialTs}/0/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}&color=2`
        : null,
    [initialTs, RAINBOW_API_TOKEN]
  );

  const initialCloudUrl = useMemo(
    () =>
      initialTs
        ? `https://api.rainbow.ai/tiles/v1/clouds/${initialTs}{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}&color=2`
        : null,
    [initialTs, RAINBOW_API_TOKEN]
  );

  const [ts, setTs] = useState(initialTs);
  const [rangeValue, setRangeValue] = useState(rangeMaxValue);
  const [radarMapUrl, setRadarMapUrl] = useState(initialRadarUrl);
  const [cloudMapUrl, setCloudMapUrl] = useState(initialCloudUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  const radarTileLayerRef = useRef();
  const cloudTileLayerRef = useRef();

  useLayoutEffect(() => {
    if (radarTileLayerRef.current && radarMapUrl) {
      radarTileLayerRef.current.setUrl(radarMapUrl);
    }
    if (cloudTileLayerRef.current && cloudMapUrl) {
      cloudTileLayerRef.current.setUrl(cloudMapUrl);
    }
  }, [radarMapUrl, cloudMapUrl]);

  const advanceRangeSlider = useCallback(
    (value) => {
      setTs(tsData[value]);
      setRadarMapUrl(
        `https://api.rainbow.ai/tiles/v1/precip/${tsData[value]}/0/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}&color=2`
      );
      setCloudMapUrl(
        `https://api.rainbow.ai/tiles/v1/clouds/${tsData[value]}/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}`
      );
      setRangeValue(value);
    },
    [tsData, RAINBOW_API_TOKEN]
  );

  const rangeSliderHandler = (event) => {
    const { value } = event.target;

    advanceRangeSlider(value);
  };

  const btnClickHandler = useCallback(() => {
    setIsPlaying((i) => !i);

    if (isPlaying) {
      clearInterval(timerHandle.current);
    } else {
      timerHandle.current = setInterval(() => {
        const currentVal = Number.parseInt(rangeSliderRef.current.value, 10);
        const nextVal = currentVal === rangeMaxValue ? 0 : currentVal + 1;

        // console.log(currentVal, nextVal);
        rangeSliderRef.current.value = nextVal;
        advanceRangeSlider(nextVal);
      }, 500);
    }
  }, [advanceRangeSlider, isPlaying, rangeMaxValue]);

  return tsData && ts ? (
    <>
      <div className="map-container">
        <MapContainer
          animate={true}
          boxZoom={true}
          center={[coordinates.latitude, coordinates.longitude]}
          doubleClickZoom={true}
          dragging={true}
          className="weather-map-full"
          keyboard={false}
          scrollWheelZoom={false}
          tap={true}
          touchZoom={true}
          zoom={9}
          maxZoom={12}
          zoomControl={false}
        >
          <Marker position={[coordinates.latitude, coordinates.longitude]}>
            <Popup>{popupAddress}</Popup>
          </Marker>
          <Circle
            center={[coordinates.latitude, coordinates.longitude]}
            pathOptions={{ weight: 1, opacity: 0.5 }}
            radius={coordinates.accuracy}
          />
          <ScaleControl position="topleft" />
          <ZoomControl position="topleft" />
          <AttributionControl position="topright" />
          <LayersControl>
            <LayersControl.BaseLayer name="Dark" checked={isDarkModeEnabled()}>
              <TileLayer
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}@2x.png"
                opacity={1}
                attribution={
                  '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                }
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer
              name="Color"
              checked={!isDarkModeEnabled()}
            >
              <TileLayer
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}@2x.png"
                opacity={1}
                attribution={
                  '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                }
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Light">
              <TileLayer
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png"
                opacity={1}
                attribution={
                  '&copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>'
                }
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Street">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                opacity={1}
                attribution={
                  '&copy; <a href="https://osm.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>'
                }
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Radar" checked="checked">
              <TileLayer
                url={
                  radarMapUrl ||
                  `https://api.rainbow.ai/tiles/v1/precip/${tsData[0]}/0/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}&color=2`
                }
                opacity={0.8}
                maxNativeZoom={12}
                attribution={
                  '&copy; <a href="https://rainbow.ai/" rel="noopener noreferrer" target="_blank">Rainbow Weather</a>'
                }
                ref={radarTileLayerRef}
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Clouds">
              <TileLayer
                url={
                  cloudMapUrl ||
                  `https://api.rainbow.ai/tiles/v1/clouds/${tsData[0]}/{z}/{x}/{y}?token=${RAINBOW_API_TOKEN}`
                }
                opacity={0.8}
                maxNativeZoom={7}
                attribution={
                  '&copy; <a href="https://rainbow.ai/" rel="noopener noreferrer" target="_blank">Rainbow Weather</a>'
                }
                ref={cloudTileLayerRef}
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Temperature">
              <TileLayer
                url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`}
                attribution={
                  '&copy; <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank">OpenWeatherMap</a>'
                }
              />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
      <div className="slider-container">
        {tsData && ts ? (
          <div className="slider">
            <div className="value-label">{dayjs.unix(ts).format('h:mmA')}</div>
            <input
              className="range-slider"
              type="range"
              min={0}
              max={rangeMaxValue}
              step={1}
              value={rangeValue}
              onChange={rangeSliderHandler}
              onInput={rangeSliderHandler}
              ref={rangeSliderRef}
            />
            <button
              type="button"
              className="btn-play-radar-loop"
              onClick={btnClickHandler}
            >
              {isPlaying ? (
                <FontAwesomeIcon icon={['fad', 'stop']} fixedWidth />
              ) : (
                <FontAwesomeIcon icon={['fad', 'play']} fixedWidth />
              )}
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  ) : (
    ''
  );
};

WeatherMapFull.displayName = 'WeatherMapFull';
WeatherMapFull.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
  RAINBOW_API_TOKEN: PropTypes.string.isRequired,
};

export default WeatherMapFull;
