/**
 * Build-time feature flag for the MapLibre migration.
 *
 * Set `VITE_FEATURE_MAPLIBRE=true` to render the MapLibre map components.
 * Defaults to false so the legacy Leaflet components stay in use until the
 * new path is verified.
 */
export const USE_MAPLIBRE = import.meta.env.VITE_FEATURE_MAPLIBRE === 'true';
