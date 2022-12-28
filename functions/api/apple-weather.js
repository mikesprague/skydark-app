import * as jose from 'jose';
import queryString from 'query-string';

/* eslint-disable import/prefer-default-export */
export const onRequestGet = async (context) => {
  const CACHE_NAME = 'apple-weather';
  const { env, request } = context;
  const { cf, url } = request;

  const cache = await caches.open(CACHE_NAME);

  const cachedData = await cache.match(request);

  if (cachedData) {
    console.log('🚀 using cached data!');

    const returnData = await cachedData.json();

    return new Response(JSON.stringify(returnData), cachedData);
  }

  console.log('😢 no cache, fetching new data');

  const {
    APPLE_DEVELOPER_PRIVATE_KEY,
    APPLE_DEVELOPER_KEY_ID,
    APPLE_DEVELOPER_TEAM_ID,
    APPLE_DEVELOPER_APP_ID,
  } = env;

  const urlParams = new URL(url).searchParams;

  const algorithm = 'ES256';
  const pkcs8 = APPLE_DEVELOPER_PRIVATE_KEY;

  const privateKey = await jose.importPKCS8(pkcs8, algorithm);

  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({
      alg: 'ES256',
      kid: APPLE_DEVELOPER_KEY_ID,
      id: `${APPLE_DEVELOPER_TEAM_ID}.${APPLE_DEVELOPER_APP_ID}`,
    })
    .setIssuedAt()
    .setIssuer(APPLE_DEVELOPER_TEAM_ID)
    .setSubject(APPLE_DEVELOPER_APP_ID)
    .setExpirationTime('10m')
    .sign(privateKey);

  // console.log(jwt, await jose.decodeJwt(jwt));

  const headers = {
    Authorization: `Bearer ${jwt}`,
  };

  const { country, latitude, longitude, timezone } = cf;

  let lat = urlParams.get('lat') || latitude;
  let lng = urlParams.get('lng') || longitude;

  const defaultLat = '40.71455';
  const defaultLng = '-74.00712';

  lat = lat || defaultLat;
  lng = lng || defaultLng;

  const tz = timezone || 'America/New_York';
  const countryCode = country || 'US';

  const queryParams = {
    country: countryCode,
    dataSets: [
      'currentWeather',
      'forecastDaily',
      'forecastHourly',
      'forecastNextHour',
      'weatherAlerts',
    ],
    timezone: tz,
  };

  const qs = queryString.stringify(queryParams, {
    arrayFormat: 'comma',
  });

  const data = await fetch(
    `https://weatherkit.apple.com/api/v1/weather/en-US/${lat}/${lng}?${qs}`,
    {
      headers,
    },
  ).then(async (response) => response.json());

  // console.log(data);

  const response = new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300, s-maxage=300',
    },
  });

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
