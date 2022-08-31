// eslint-disable-next-line import/prefer-default-export
export const onRequestGet = async (context) => {
  const { cf, url } = context.request;

  const urlParams = new URL(url).searchParams;

  const healthcheck = urlParams.get('healthcheck');
  const lat = urlParams.get('lat') || cf.latitude;
  const lng = urlParams.get('lng') || cf.longitude;
  const units = urlParams.get('units') || 'auto';
  const time = urlParams.get('time');

  // const {
  //   request, // same as existing Worker API
  //   env, // same as existing Worker API
  //   params, // if filename includes [id] or [[path]]
  //   waitUntil, // same as ctx.waitUntil in existing Worker API
  //   next, // used for middleware or to fetch assets
  //   data, // arbitrary space for passing data between middlewares
  // } = context;

  /**
  {
    clientTcpRtt: 26,
    longitude: '-76.49260',
    latitude: '42.44440',
    tlsCipher: 'AEAD-AES256-GCM-SHA384',
    continent: 'NA',
    asn: 11351,
    clientAcceptEncoding: 'gzip, deflate, br',
    country: 'US',
    tlsClientAuth: {...},
    tlsExportedAuthenticator: {...},
    tlsVersion: 'TLSv1.3',
    colo: 'EWR',
    timezone: 'America/New_York',
    city: 'Ithaca',
    httpProtocol: 'HTTP/1.1',
    edgeRequestKeepAliveStatus: 1,
    requestPriority: '',
    botManagement: {...},
    clientTrustScore: 18,
    region: 'New York',
    regionCode: 'NY',
    asOrganization: 'Spectrum',
    metroCode: '555',
    postalCode: '14850'
  }
  */

  if (healthcheck) {
    return new Response(JSON.stringify('API is up and running'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // return new Response('short circuited');

  const {
    GOOGLE_MAPS_API_KEY,
    DARK_SKY_API_KEY,
    // OPEN_WEATHERMAP_API_KEY,
  } = context.env;

  const timeString = time ? `,${time}` : '';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}${timeString}/?units=${units}`;
  // const openWeatherMapApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&&units=${units}&appid=${OPEN_WEATHERMAP_API_KEY}`;

  const geocodePromise = await fetch(geocodeApiUrl)
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
      const locationData = {
        location: {
          locationName,
          formattedAddress,
          fullResults,
        },
      };

      return locationData;
    })
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });

  const weatherPromise = await fetch(weatherApiUrl)
    .then(async (response) => {
      const weather = await response.json();
      const weatherData = {
        weather,
      };

      return weatherData;
    })
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });

  // console.log(geocodePromise.location);

  return new Response(
    JSON.stringify({
      location: geocodePromise.location,
      weather: geocodePromise.location.locationName.includes('Seneca Falls')
        ? JSON.parse(
            JSON.stringify(weatherPromise.weather)
              .replace(/Humid /g, 'Moist ')
              .replace(/humid /g, 'moist ')
              .replace(/humidity /g, 'moistivity'),
          )
        : weatherPromise.weather,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300, s-maxage=300',
      },
    },
  );
};
