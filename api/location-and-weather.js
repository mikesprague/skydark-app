const axios = require('axios');
const Bugsnag = require('@bugsnag/js');

Bugsnag.start({ apiKey: process.env.BUGSNAG_API_KEY });

module.exports = async (req, res) => {
  const { lat, lng, time, healthcheck } = req.query || null;

  if (healthcheck) {
    res.status(200).json('API is up and running');
    return;
  }

  if (!lat) {
    res.status(400).json('Missing "lat" parameter');
    return;
  }
  if (!lng) {
    res.status(400).json('Missing "lng" parameter');
    return;
  }

  const {
    GOOGLE_MAPS_API_KEY,
    DARK_SKY_API_KEY,
    // OPEN_WEATHERMAP_API_KEY,
  } = process.env;

  const units = req.query.units || 'auto';
  const timeString = time ? `,${time}` : '';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}${timeString}/?units=${units}`;
  // const openWeatherMapApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&&units=${units}&appid=${OPEN_WEATHERMAP_API_KEY}`;

  const geocodePromise = await axios
    .get(geocodeApiUrl)
    .then((response) => {
      const fullResults = response.data.results;
      const formattedAddress = fullResults[0].formatted_address;
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
                if (!locationName.length && component.types.indexOf(target) > -1) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });
      fullResults[0].address_components.forEach((component) => {
        if (isUSA && component.types.indexOf('administrative_area_level_1') > -1) {
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
      res.status(500).json(error);
    });

  const weatherPromise = await axios
    .get(weatherApiUrl)
    .then((response) => {
      const weatherData = {
        weather: response.data,
      };
      return weatherData;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=300');
  res.status(200).json({
    location: geocodePromise.location,
    weather: weatherPromise.weather,
  });
};
