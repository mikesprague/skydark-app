/**
 * MapLibre GL JS v6 worker registration.
 *
 * v6 is ESM-only and loads its worker from a real URL rather than an inlined
 * blob, resolving `maplibre-gl-worker.mjs` relative to its own module URL. Vite
 * bundles MapLibre into an app chunk, so that sibling file is never emitted and
 * the runtime request for `/assets/maplibre-gl-worker.mjs` falls through to the
 * SPA's index.html — which fails strict MIME checking and leaves the map blank.
 *
 * `?worker&url` routes the file through Vite's worker pipeline, emitting a
 * self-contained chunk. Plain `?url` would emit the worker verbatim without its
 * `maplibre-gl-shared.mjs` sibling, and the worker would fail on first import
 * with no tiles loading.
 *
 * Importing this module for its side effect registers the URL once, before any
 * map is constructed.
 */
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);
