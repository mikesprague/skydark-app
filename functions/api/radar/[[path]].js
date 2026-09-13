/**
 * Rainbow Weather radar tile proxy.
 *
 * MapLibre GL JS loads raster tiles with `crossOrigin="anonymous"` because
 * WebGL textures must be CORS-clean, but api.rainbow.ai does not send an
 * `Access-Control-Allow-Origin` header, so direct tile requests fail. (Leaflet
 * rendered tiles as plain DOM `<img>` elements, which have no CORS
 * requirement, which is why the legacy map worked.)
 *
 * This proxies the upstream tile and adds CORS headers. It also keeps the API
 * token server-side rather than shipping it in the client bundle.
 *
 * Routes: /api/radar/precip/{ts}/{offset}/{z}/{x}/{y}?color=2
 *         /api/radar/clouds/{ts}/{z}/{x}/{y}
 */

const ALLOWED_LAYERS = new Set(['precip', 'clouds']);
const UPSTREAM_BASE = 'https://api.rainbow.ai/tiles/v1';

// Tiles for a given timestamp are immutable, so they can be cached hard.
const CACHE_CONTROL = 'public, max-age=600, s-maxage=600';

export const onRequestGet = async (context) => {
  const { env, request, params, waitUntil } = context;

  const segments = Array.isArray(params.path) ? params.path : [params.path];
  const [layer, ...rest] = segments;

  if (!ALLOWED_LAYERS.has(layer)) {
    return new Response('Unsupported radar layer', { status: 404 });
  }

  // Every remaining segment is a timestamp, offset, or tile coordinate. Reject
  // anything else so the path cannot be used to reach other upstream routes.
  if (rest.length === 0 || !rest.every((segment) => /^\d+$/.test(segment))) {
    return new Response('Malformed tile path', { status: 400 });
  }

  const token = env.RAINBOW_API_TOKEN || env.VITE_RAINBOW_API_TOKEN;

  if (!token) {
    return new Response('Radar token is not configured', { status: 500 });
  }

  const cache = await caches.open('rainbow-tiles');
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const upstreamUrl = new URL(`${UPSTREAM_BASE}/${layer}/${rest.join('/')}`);
  upstreamUrl.searchParams.set('token', token);

  // `color` is the only upstream option the client controls.
  const color = new URL(request.url).searchParams.get('color');
  if (color && /^\d+$/.test(color)) {
    upstreamUrl.searchParams.set('color', color);
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: { Accept: 'image/png,image/*' },
  });

  if (!upstreamResponse.ok) {
    return new Response('Upstream tile request failed', {
      status: upstreamResponse.status,
    });
  }

  const response = new Response(upstreamResponse.body, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': CACHE_CONTROL,
      'Content-Type':
        upstreamResponse.headers.get('content-type') || 'image/png',
    },
  });

  waitUntil(cache.put(request, response.clone()));

  return response;
};

export default onRequestGet;
