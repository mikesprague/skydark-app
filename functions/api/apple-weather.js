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
    GOOGLE_MAPS_API_KEY,
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

  const dailyStart = urlParams.get('dailyStart');
  const hourlyStart = urlParams.get('hourlyStart');
  const forecastStart = urlParams.get('forecastStart');
  const startTime = urlParams.get('startTime');

  const defaultLat = '40.71455';
  const defaultLng = '-74.00712';

  lat = lat || defaultLat;
  lng = lng || defaultLng;

  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const locationData = await fetch(geocodeApiUrl)
    .then(async (response) => {
      const data = await response.json();
      // console.log(data);
      const fullResults = data.results;
      const formattedAddress = fullResults[0].formatted_address.replace(
        'Seneca Falls',
        'Seneca Moistens',
      );
      let locationName = '';
      const isUSA = formattedAddress.toLowerCase().includes('usa');
      const addressTargets = [
        'postal_town',
        'locality',
        'neighborhood',
        'administrative_area_level_2',
        'administrative_area_level_1',
        'country',
      ];

      addressTargets.forEach((target) => {
        if (!locationName.length) {
          fullResults.forEach((result) => {
            if (!locationName.length) {
              result.address_components.forEach((component) => {
                if (
                  !locationName.length &&
                  component.types.indexOf(target) > -1
                ) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });

      fullResults[0].address_components.forEach((component) => {
        if (
          isUSA &&
          component.types.indexOf('administrative_area_level_1') > -1
        ) {
          locationName = `${locationName}, ${component.short_name}`;
        }

        if (!isUSA && component.types.indexOf('country') > -1) {
          locationName = `${locationName}, ${component.short_name}`;
        }
      });
      // console.log(locationName);
      const returnData = {
        location: {
          locationName,
          formattedAddress,
          fullResults,
        },
      };

      return returnData;
    })
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });

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
    dailyStart,
    forecastStart,
    hourlyStart,
    startTime,
  };

  const qs = queryString.stringify(queryParams, {
    arrayFormat: 'comma',
  });

  const weatherData = await fetch(
    `https://weatherkit.apple.com/api/v1/weather/en-US/${lat}/${lng}?${qs}`,
    {
      headers,
    },
  ).then(async (response) => {
    const weather = await response.json();
    const returnData = {
      weather,
    };

    return returnData;
  });

  // console.log(weatherData);

  // const returnData = JSON.stringify({
  //   location: locationData.location,
  //   weather: weatherData.weather,
  // });

  const response = new Response(
    JSON.stringify({
      location: locationData.location,
      weather: weatherData.weather,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300, s-maxage=300',
      },
    },
  );

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
