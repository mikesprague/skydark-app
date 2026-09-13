/**
 * Weather overlay tile sources for the MapLibre maps.
 *
 * Rainbow Weather tiles are served through the `/api/radar` proxy because
 * api.rainbow.ai sends no CORS headers and MapLibre requires CORS-clean
 * images for WebGL textures. OpenWeatherMap sends
 * `Access-Control-Allow-Origin: *`, so it is requested directly.
 *
 * The basemap's CARTO/OpenStreetMap credit arrives via its TileJSON, but these
 * sources carry none, so each declares its own `attribution`.
 */

const RAINBOW_ATTRIBUTION =
  '&copy; <a href="https://rainbow.ai/" rel="noopener noreferrer" target="_blank">Rainbow Weather</a>';

const OPENWEATHERMAP_ATTRIBUTION =
  '&copy; <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank">OpenWeatherMap</a>';

export const radarTileUrl = (timestamp, forecastOffset = 0) =>
  `/api/radar/precip/${timestamp}/${forecastOffset}/{z}/{x}/{y}?color=2`;

export const cloudsTileUrl = (timestamp) =>
  `/api/radar/clouds/${timestamp}/{z}/{x}/{y}`;

export const temperatureTileUrl = (apiKey) =>
  `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`;

/**
 * Overlay definitions in render order (bottom to top). `visible` mirrors the
 * legacy LayersControl defaults, where only Radar was checked.
 */
export const buildOverlays = ({ radarUrl, cloudsUrl, temperatureUrl }) => [
  {
    id: 'radar',
    label: 'Radar',
    tiles: [radarUrl],
    maxzoom: 12,
    opacity: 0.8,
    attribution: RAINBOW_ATTRIBUTION,
    visible: true,
  },
  {
    id: 'clouds',
    label: 'Clouds',
    tiles: [cloudsUrl],
    maxzoom: 7,
    opacity: 0.8,
    attribution: RAINBOW_ATTRIBUTION,
    visible: false,
  },
  {
    id: 'temperature',
    label: 'Temperature',
    tiles: [temperatureUrl],
    opacity: 1,
    attribution: OPENWEATHERMAP_ATTRIBUTION,
    visible: false,
  },
];

/**
 * Add every overlay as a raster source + layer. Safe to call repeatedly; an
 * overlay that is already present is skipped.
 */
export const addOverlays = (map, overlays) => {
  for (const overlay of overlays) {
    if (map.getSource(overlay.id)) {
      continue;
    }

    map.addSource(overlay.id, {
      type: 'raster',
      tiles: overlay.tiles,
      tileSize: 256,
      attribution: overlay.attribution,
      ...(overlay.maxzoom ? { maxzoom: overlay.maxzoom } : {}),
    });

    map.addLayer({
      id: overlay.id,
      type: 'raster',
      source: overlay.id,
      layout: {
        visibility: overlay.visible ? 'visible' : 'none',
      },
      paint: {
        'raster-opacity': overlay.opacity,
      },
    });
  }
};

/**
 * `setStyle` replaces the whole style, which would drop every runtime-added
 * source and layer. This carries the named ones into the incoming style so a
 * basemap switch never flashes without weather data.
 *
 * Used instead of re-adding them on a `style.load` listener: that event is
 * fired at runtime but is absent from MapLibre's typed event map.
 *
 * Source and layer ids are listed separately because one source can back
 * several layers (the accuracy circle has both a fill and an outline).
 */
export const preserveLayers =
  ({ sourceIds, layerIds }) =>
  (previousStyle, nextStyle) => {
    if (!previousStyle) {
      return nextStyle;
    }

    const carriedSources = {};
    const carriedLayers = [];

    for (const id of sourceIds) {
      if (previousStyle.sources?.[id]) {
        carriedSources[id] = previousStyle.sources[id];
      }
    }

    for (const id of layerIds) {
      const layer = previousStyle.layers?.find((entry) => entry.id === id);
      if (layer) {
        carriedLayers.push(layer);
      }
    }

    return {
      ...nextStyle,
      sources: { ...nextStyle.sources, ...carriedSources },
      layers: [...nextStyle.layers, ...carriedLayers],
    };
  };
