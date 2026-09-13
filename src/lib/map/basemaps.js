/**
 * CARTO vector basemap registry.
 *
 * MapLibre renders a basemap from a style document, so each entry is a CARTO
 * vector style (the same provider as the legacy raster tiles). The style JSON
 * carries its own tile source, glyphs, and sprite URLs; attribution is not
 * embedded in these styles, so it is declared here for the map to render.
 *
 * These style URLs load without an API key today. `CARTO_BASEMAPS_API_KEY` is
 * retained for the key mechanism should CARTO require one.
 */

const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">CARTO</a>';

const cartoStyleUrl = (style) =>
  `https://basemaps.cartocdn.com/gl/${style}-gl-style/style.json`;

export const basemaps = {
  'dark-matter': {
    id: 'dark-matter',
    name: 'Dark',
    styleUrl: cartoStyleUrl('dark-matter'),
    attribution: CARTO_ATTRIBUTION,
  },
  voyager: {
    id: 'voyager',
    name: 'Color',
    styleUrl: cartoStyleUrl('voyager'),
    attribution: CARTO_ATTRIBUTION,
  },
  positron: {
    id: 'positron',
    name: 'Light',
    styleUrl: cartoStyleUrl('positron'),
    attribution: CARTO_ATTRIBUTION,
  },
};

export const basemapList = Object.values(basemaps);

export const defaultBasemapId = 'dark-matter';

export const getBasemap = (id) => basemaps[id] ?? basemaps[defaultBasemapId];

/**
 * Basemap for a resolved app theme. Mirrors the legacy full-map defaults
 * (Dark / Color); `positron` remains available as the explicit "Light" choice.
 */
export const getBasemapForTheme = (isDark) =>
  isDark ? basemaps['dark-matter'] : basemaps.voyager;
