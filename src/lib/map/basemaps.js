/**
 * CARTO vector basemap registry.
 *
 * MapLibre renders a basemap from a style document, so each entry is a CARTO
 * vector style (the same provider as the legacy raster tiles). The style JSON
 * carries its own tile source, glyphs, and sprite URLs, and its TileJSON
 * supplies the CARTO + OpenStreetMap attribution, which MapLibre's
 * AttributionControl renders automatically — so no attribution is declared here.
 *
 * These style URLs load without an API key today. `CARTO_BASEMAPS_API_KEY` is
 * retained for the key mechanism should CARTO require one.
 */

const cartoStyleUrl = (style) =>
  `https://basemaps.cartocdn.com/gl/${style}-gl-style/style.json`;

export const basemaps = {
  'dark-matter': {
    name: 'Dark',
    styleUrl: cartoStyleUrl('dark-matter'),
  },
  voyager: {
    name: 'Color',
    styleUrl: cartoStyleUrl('voyager'),
  },
  positron: {
    name: 'Light',
    styleUrl: cartoStyleUrl('positron'),
  },
};

/**
 * Basemap for a resolved app theme: `dark-matter` for dark, `voyager` for
 * light. This is the single shared default for both the small and full maps
 * (the legacy small map used `light_all` in light mode, which was an oversight;
 * `voyager`/"Color" is the intended light default). `positron` stays available
 * as an explicit "Light" choice in the full map's base-layer switcher.
 */
export const getBasemapIdForTheme = (isDark) =>
  isDark ? 'dark-matter' : 'voyager';

export const getBasemapForTheme = (isDark) =>
  basemaps[getBasemapIdForTheme(isDark)];
