import { MapLibreMap, Marker } from 'maplibre-gl';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useWeatherDataContext } from '../contexts/WeatherDataContext.jsx';
import '../lib/map/worker.js';
import { getBasemapForTheme } from '../lib/map/basemaps.js';
import { radarTileUrl } from '../lib/map/overlays.js';
import { openModalWithComponent } from '../modules/helpers.js';
import { isDarkModeEnabled } from '../modules/theme.js';
import { WeatherMapFullML } from './WeatherMapFullML.jsx';

import './WeatherMapSmall.css';

export const WeatherMapSmallML = ({ OPENWEATHERMAP_API_KEY }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { weatherData: weather } = useWeatherDataContext();

  const { locationCoordinates, radarMapUrl } = useMemo(() => {
    if (!weather) {
      return {
        locationCoordinates: null,
        radarMapUrl: null,
      };
    }

    const coordinates = {
      latitude: weather.currentWeather.metadata.latitude,
      longitude: weather.currentWeather.metadata.longitude,
    };

    let url = null;
    // Set the radar URL from the most recent past data. Tiles are proxied
    // through /api/radar because MapLibre requires CORS-clean images and
    // api.rainbow.ai does not send CORS headers.
    if (weather.radarData?.snapshot) {
      const { snapshot } = weather.radarData;
      url = radarTileUrl(snapshot, 0);
    }

    return {
      locationCoordinates: coordinates,
      radarMapUrl: url,
    };
  }, [weather]);

  const latitude = locationCoordinates?.latitude;
  const longitude = locationCoordinates?.longitude;

  const basemap = useMemo(() => getBasemapForTheme(isDarkModeEnabled()), []);

  const mapClickHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModalWithComponent(
        <WeatherMapFullML OPENWEATHERMAP_API_KEY={OPENWEATHERMAP_API_KEY} />,
        {
          didOpen: () => {
            const closeButton = document.querySelector('.swal2-close');

            closeButton.style.position = 'relative';
            closeButton.style.top = '2rem';
            closeButton.style.marginRight = '0.65rem';
          },
          showClass: {
            popup: 'animate__animated animate__fadeIn animate__faster',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster',
          },
        }
      );
    },
    [OPENWEATHERMAP_API_KEY]
  );

  useEffect(() => {
    if (!latitude || !longitude || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      center: [longitude, latitude],
      // MapLibre serves 512px vector tiles, so a given zoom renders one level
      // closer than Leaflet's 256px raster tiles. 6 here matches the legacy
      // Leaflet zoom of 7.
      zoom: 6,
      interactive: false,
      // Attribution is shown on the full map only, matching legacy behavior.
      attributionControl: false,
      style: basemap.styleUrl,
    });

    mapRef.current = map;

    // `load` fires once the style is fully parsed, which is the earliest point
    // addSource/addLayer are safe. Gating on this instead of construction
    // avoids racing the style fetch.
    map.on('load', () => setIsMapLoaded(true));

    if (import.meta.env.DEV) {
      map.on('error', (event) => console.error('MapLibre error:', event.error));
    }

    return () => {
      map.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, [latitude, longitude, basemap]);

  useEffect(() => {
    const map = mapRef.current;

    if (!isMapLoaded || !map || !radarMapUrl) {
      return;
    }

    const existingSource = map.getSource('radar');

    if (existingSource) {
      existingSource.setTiles([radarMapUrl]);
      return;
    }

    map.addSource('radar', {
      type: 'raster',
      tiles: [radarMapUrl],
      tileSize: 256,
      maxzoom: 12,
    });
    map.addLayer({
      id: 'radar',
      type: 'raster',
      source: 'radar',
      paint: {
        'raster-opacity': 0.9,
      },
    });
  }, [isMapLoaded, radarMapUrl]);

  useEffect(() => {
    const map = mapRef.current;

    if (!isMapLoaded || !map || !latitude || !longitude) {
      return;
    }

    const marker = new Marker().setLngLat([longitude, latitude]).addTo(map);

    return () => marker.remove();
  }, [isMapLoaded, latitude, longitude]);

  return weather ? (
    <div className='small-map-container'>
      {latitude ? (
        <div className='map-wrapper' onClick={mapClickHandler}>
          <div id='weather-map-small' ref={mapContainerRef} />
        </div>
      ) : (
        ''
      )}
    </div>
  ) : (
    ''
  );
};

WeatherMapSmallML.propTypes = {
  OPENWEATHERMAP_API_KEY: PropTypes.string.isRequired,
};

export default WeatherMapSmallML;
