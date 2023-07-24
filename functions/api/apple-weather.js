import * as jose from 'jose';
import dayjs from 'dayjs';
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
    AIR_NOW_API_KEY,
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

  const alertId = urlParams.get('alertId') || null;

  let lat = urlParams.get('lat') || latitude;
  let lng = urlParams.get('lng') || longitude;

  const currentHourAsIsoDate = dayjs()
    .set('hour', dayjs().hour())
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .toISOString();

  const dailyStart = urlParams.get('dailyStart') || currentHourAsIsoDate;
  const dailyEnd = urlParams.get('dailyEnd');
  const hourlyStart = urlParams.get('hourlyStart') || currentHourAsIsoDate;
  const hourlyEnd = urlParams.get('hourlyEnd');

  const defaultLat = '40.71455';
  const defaultLng = '-74.00712';

  lat = lat || defaultLat;
  lng = lng || defaultLng;

  let locationData = [];

  if (!alertId) {
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

    locationData = await fetch(geocodeApiUrl)
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
  }

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
    dailyEnd,
    hourlyStart,
    hourlyEnd,
  };

  const qs = queryString.stringify(queryParams, {
    arrayFormat: 'comma',
  });

  const appleWeatherApiUrlPrefix = 'https://weatherkit.apple.com/api/v1/';

  let appleWeatherApiUrl = `${appleWeatherApiUrlPrefix}weather/en-US/${lat}/${lng}?${qs}`;

  if (alertId) {
    appleWeatherApiUrl = `${appleWeatherApiUrlPrefix}weatherAlert/en-US/${alertId}`;
  }

  const weatherData = await fetch(appleWeatherApiUrl, {
    headers,
  }).then(async (response) => {
    const weather = await response.json();

    weather.weatherAlertsData = [];

    if (weather.weatherAlerts && weather.weatherAlerts.alerts) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const alert of weather.weatherAlerts.alerts) {
        await fetch(
          `${appleWeatherApiUrlPrefix}weatherAlert/en-US/${alert.id}`,
          {
            headers,
          },
        ).then(async (alertResponse) => {
          const alertData = await alertResponse.json();

          // console.log(JSON.stringify(alertData));
          weather.weatherAlertsData.push(alertData);
        });
      }
    }

    weather.radarData = {};
    weather.radarData.past = [];
    weather.radarData.nowcast = [];
    await fetch(`https://api.rainviewer.com/public/weather-maps.json`).then(
      async (radarResponse) => {
        const radarJson = await radarResponse.json();

        weather.radarData.past = [...radarJson.radar.past];
        weather.radarData.nowcast = [...radarJson.radar.nowcast];
      },
    );

    weather.airQualityData = {};
    await fetch(
      `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${weather.currentWeather.metadata.latitude}&longitude=${weather.currentWeather.metadata.longitude}&distance=100&API_KEY=${AIR_NOW_API_KEY}`,
    ).then(async (airQualityResponse) => {
      const airQualityJson = await airQualityResponse.json();

      // eslint-disable-next-line no-confusing-arrow
      const airQualityObject = airQualityJson.sort((a, b) =>
        a.AQI > b.AQI ? -1 : 1,
      );

      weather.airQualityData = airQualityObject;
    });

    const returnData = {
      weather,
    };

    return returnData;
  });

  // console.log(weatherData);

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
