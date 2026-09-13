import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AttributionControl,
  MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from 'maplibre-gl';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import '../lib/map/worker.js';
import { basemaps, getBasemapIdForTheme } from '../lib/map/basemaps.js';
import {
  addOverlays,
  buildOverlays,
  cloudsTileUrl,
  preserveLayers,
  radarTileUrl,
  temperatureTileUrl,
} from '../lib/map/overlays.js';
import { dayjs } from '../lib/time/dayjs.js';
import { generateSnapshotHistory } from '../modules/helpers.js';
import { getData } from '../modules/local-storage.js';
import { isDarkModeEnabled } from '../modules/theme.js';

import './WeatherMapFull.css';

const EARTH_RADIUS_METERS = 6378137;
const OVERLAY_IDS = ['radar', 'clouds', 'temperature'];

// Everything added at runtime must be carried across a setStyle basemap switch.
const RUNTIME_SOURCE_IDS = [...OVERLAY_IDS, 'accuracy-circle'];
const RUNTIME_LAYER_IDS = [
  ...OVERLAY_IDS,
  'accuracy-circle-fill',
  'accuracy-circle-outline',
];

/**
 * MapLibre has no circle primitive, so the geolocation accuracy radius is
 * drawn as a GeoJSON polygon approximating the circle.
 */
const accuracyCircleFeature = (
  longitude,
  latitude,
  radiusMeters,
  steps = 64
) => {
  const coordinates = [];
  const latitudeRadians = (latitude * Math.PI) / 180;

  for (let step = 0; step <= steps; step += 1) {
    const angle = (step / steps) * 2 * Math.PI;
    const offsetX = radiusMeters * Math.cos(angle);
    const offsetY = radiusMeters * Math.sin(angle);

    const deltaLatitude = (offsetY / EARTH_RADIUS_METERS) * (180 / Math.PI);
    const deltaLongitude =
      (offsetX / (EARTH_RADIUS_METERS * Math.cos(latitudeRadians))) *
      (180 / Math.PI);

    coordinates.push([longitude + deltaLongitude, latitude + deltaLatitude]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coordinates] },
  };
};

export const WeatherMapFull = ({ OPENWEATHERMAP_API_KEY }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const timerHandle = useRef();
  const rangeSliderRef = useRef();

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [, startTransition] = useTransition();

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
  const latestTsIndex = useMemo(
    () => (tsData ? tsData.length - 1 : null),
    [tsData]
  );
  const rangeMaxValue = useMemo(
    () => (latestTsIndex !== null ? latestTsIndex + 10 : null),
    [latestTsIndex]
  );

  const [ts, setTs] = useState(initialTs);
  const [rangeValue, setRangeValue] = useState(latestTsIndex);
  const [radarMapUrl, setRadarMapUrl] = useState(() =>
    initialTs ? radarTileUrl(initialTs, 0) : null
  );
  const [cloudMapUrl, setCloudMapUrl] = useState(() =>
    initialTs ? cloudsTileUrl(initialTs - 600) : null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const [basemapId, setBasemapId] = useState(() =>
    getBasemapIdForTheme(isDarkModeEnabled())
  );
  const [visibleOverlays, setVisibleOverlays] = useState(() => ({
    radar: true,
    clouds: false,
    temperature: false,
  }));

  // These are the initial tile URLs only. Later frames are pushed with
  // setTiles so the overlay layers are never torn down and rebuilt.
  const overlays = useMemo(() => {
    const baseTs = initialTs ?? tsData[0];

    return buildOverlays({
      radarUrl: radarTileUrl(baseTs, 0),
      cloudsUrl: cloudsTileUrl(baseTs - 600),
      temperatureUrl: temperatureTileUrl(OPENWEATHERMAP_API_KEY),
    });
  }, [initialTs, tsData, OPENWEATHERMAP_API_KEY]);

  // Create the map once.
  useEffect(() => {
    if (!coordinates?.latitude || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      center: [coordinates.longitude, coordinates.latitude],
      // MapLibre's 512px tiles render one level closer than Leaflet's 256px,
      // so legacy zoom 9 / maxZoom 12 become 8 / 11.
      zoom: 8,
      maxZoom: 11,
      scrollZoom: false,
      style: basemaps[basemapId].styleUrl,
      // Added explicitly below so it lands top-right like the legacy map,
      // rather than the default bottom-right.
      attributionControl: false,
    });

    // Controls stack in the order they are added. Legacy Leaflet showed the
    // scale bars above the zoom buttons, and both metric and imperial.
    map.addControl(new ScaleControl({ unit: 'metric' }), 'top-left');
    map.addControl(new ScaleControl({ unit: 'imperial' }), 'top-left');
    // Legacy had zoom in/out only, no compass/pitch reset.
    map.addControl(
      new NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      'top-left'
    );
    map.addControl(new AttributionControl({ compact: false }), 'top-right');

    map.on('load', () => setIsMapLoaded(true));

    if (import.meta.env.DEV) {
      map.on('error', (event) => console.error('MapLibre error:', event.error));
    }

    mapRef.current = map;

    // The map lives inside a SweetAlert modal, so the container can be sized
    // after the map is constructed. WebGL needs an explicit resize.
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
    // Basemap changes are applied with setStyle, not by recreating the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates?.latitude, coordinates?.longitude]);

  // Overlays, marker, popup and accuracy circle, once the style is ready.
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapLoaded || !map) {
      return;
    }

    addOverlays(map, overlays);

    if (!map.getSource('accuracy-circle')) {
      map.addSource('accuracy-circle', {
        type: 'geojson',
        data: accuracyCircleFeature(
          coordinates.longitude,
          coordinates.latitude,
          coordinates.accuracy
        ),
      });
      map.addLayer({
        id: 'accuracy-circle-fill',
        type: 'fill',
        source: 'accuracy-circle',
        paint: { 'fill-color': '#3388ff', 'fill-opacity': 0.2 },
      });
      map.addLayer({
        id: 'accuracy-circle-outline',
        type: 'line',
        source: 'accuracy-circle',
        paint: {
          'line-color': '#3388ff',
          'line-opacity': 0.5,
          'line-width': 1,
        },
      });
    }

    const marker = new Marker()
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .setPopup(new Popup({ offset: 25 }).setText(popupAddress))
      .addTo(map);

    return () => marker.remove();
  }, [isMapLoaded, overlays, coordinates, popupAddress]);

  // Push new radar/cloud frames without rebuilding the layers.
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapLoaded || !map) {
      return;
    }

    if (radarMapUrl) {
      map.getSource('radar')?.setTiles([radarMapUrl]);
    }
    if (cloudMapUrl) {
      map.getSource('clouds')?.setTiles([cloudMapUrl]);
    }
  }, [isMapLoaded, radarMapUrl, cloudMapUrl]);

  const basemapChangeHandler = useCallback((nextBasemapId) => {
    const map = mapRef.current;

    setBasemapId(nextBasemapId);

    if (!map) {
      return;
    }

    // transformStyle carries the overlay sources/layers into the new style so
    // they survive the basemap switch atomically.
    map.setStyle(basemaps[nextBasemapId].styleUrl, {
      transformStyle: preserveLayers({
        sourceIds: RUNTIME_SOURCE_IDS,
        layerIds: RUNTIME_LAYER_IDS,
      }),
    });
  }, []);

  const overlayToggleHandler = useCallback((overlayId) => {
    const map = mapRef.current;

    setVisibleOverlays((current) => {
      const nextVisible = !current[overlayId];

      map?.setLayoutProperty(
        overlayId,
        'visibility',
        nextVisible ? 'visible' : 'none'
      );

      return { ...current, [overlayId]: nextVisible };
    });
  }, []);

  const advanceRangeSlider = useCallback(
    (value) => {
      const isForecastFrame = value > latestTsIndex;
      const nextForecastTime = isForecastFrame
        ? (value - latestTsIndex) * 600
        : 0;
      const baseTs = isForecastFrame ? tsData[latestTsIndex] : tsData[value];

      setTs(baseTs + nextForecastTime);
      setRadarMapUrl(radarTileUrl(baseTs, nextForecastTime));
      setCloudMapUrl(cloudsTileUrl(baseTs - 600));
      setRangeValue(value);
    },
    [latestTsIndex, tsData]
  );

  const rangeSliderHandler = (event) => {
    const value = Number(event.target.value);

    startTransition(() => advanceRangeSlider(value));
  };

  const btnClickHandler = useCallback(() => {
    setIsPlaying((i) => !i);

    if (isPlaying) {
      clearInterval(timerHandle.current);
    } else {
      timerHandle.current = setInterval(() => {
        const currentVal = Number.parseInt(rangeSliderRef.current.value, 10);
        const nextVal = currentVal === rangeMaxValue ? 0 : currentVal + 1;

        rangeSliderRef.current.value = nextVal;
        startTransition(() => advanceRangeSlider(nextVal));
      }, 500);
    }
  }, [advanceRangeSlider, isPlaying, rangeMaxValue]);

  // Stop the loop if the map is closed mid-playback.
  useEffect(() => () => clearInterval(timerHandle.current), []);

  return tsData && ts ? (
    <>
      <div className='map-container'>
        <div className='weather-map-full' ref={mapContainerRef} />
        <div className='map-layers-control'>
          <button
            type='button'
            className='btn-toggle-layers'
            onClick={() => setIsLayersPanelOpen((open) => !open)}
            aria-expanded={isLayersPanelOpen}
            aria-label={
              isLayersPanelOpen ? 'Hide map layers' : 'Show map layers'
            }
          >
            <FontAwesomeIcon icon={['fad', 'layer-group']} fixedWidth />
          </button>
          <div className='layers-panel' hidden={!isLayersPanelOpen}>
            <fieldset>
              <legend>Base map</legend>
              {Object.entries(basemaps).map(([id, basemap]) => (
                <label key={id}>
                  <input
                    type='radio'
                    name='basemap'
                    value={id}
                    checked={basemapId === id}
                    onChange={() => basemapChangeHandler(id)}
                  />
                  {basemap.name}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Overlays</legend>
              {overlays.map((overlay) => (
                <label key={overlay.id}>
                  <input
                    type='checkbox'
                    checked={visibleOverlays[overlay.id]}
                    onChange={() => overlayToggleHandler(overlay.id)}
                  />
                  {overlay.label}
                </label>
              ))}
            </fieldset>
          </div>
        </div>
      </div>
      <div className='slider-container'>
        <div className='slider'>
          <div className='value-label'>{dayjs.unix(ts).format('h:mmA')}</div>
          <input
            className='range-slider'
            type='range'
            min={0}
            max={rangeMaxValue}
            step={1}
            value={rangeValue}
            onChange={rangeSliderHandler}
            onInput={rangeSliderHandler}
            ref={rangeSliderRef}
            aria-label='Radar timestamp'
          />
          <button
            type='button'
            className='btn-play-radar-loop'
            onClick={btnClickHandler}
            aria-label={isPlaying ? 'Stop radar loop' : 'Play radar loop'}
          >
            {isPlaying ? (
              <FontAwesomeIcon icon={['fad', 'stop']} fixedWidth />
            ) : (
              <FontAwesomeIcon icon={['fad', 'play']} fixedWidth />
            )}
          </button>
        </div>
      </div>
    </>
  ) : (
    ''
  );
};

WeatherMapFull.displayName = 'WeatherMapFull';
WeatherMapFull.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapFull;
