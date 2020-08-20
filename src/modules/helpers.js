import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChrome, faDev, faEdge, faFirefoxBrowser, faGithub, faHackerNews, faProductHunt, faRedditAlien,
} from '@fortawesome/free-brands-svg-icons';
import {
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBolt, faCalendar, faHourglassHalf, faImage, faLocationCircle, faShareAlt, faSync, faUser, faTint, faClock, faCode,
  faWifiSlash, faMoonStars, faCloudRain, faCloudSnow, faCloudSleet, faFog, faClouds, faCloudsSun, faCloudsMoon,
  faCloudHail, faHurricane, faThunderstorm, faTornado, faTemperatureHigh, faTemperatureLow, faSpinner, faGlobe,
  faMapMarkerAlt, faExclamationTriangle, faArrowAltCircleDown, faArrowAltCircleUp, faBan, faSignal, faLongArrowAltDown,
  faLongArrowAltUp, faExternalLinkAlt, faCircle, faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt, faTachometer,
  faAngleUp, faInfoCircle, faChevronCircleUp, faDewpoint, faHumidity, faWind, faSunrise, faSunset, faEye, faUmbrella,
  faSun, faCloud, faThermometerHalf, faHouseDay, faGlobeStand,
} from '@fortawesome/pro-duotone-svg-icons';
import { register } from 'register-service-worker';
import { resetData } from './local-storage';
dayjs.extend(relativeTime)

export const isDev = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return true;
  }
  return false;
};

export const apiUrl = (useLocalhost = false) => useLocalhost ? 'http://localhost:9000' : 'https://dark-sky.netlify.app/.netlify/functions';

export const handleError = (error) => {
  console.error(error);
};

export const initServiceWorker = () => {
  register('/service-worker.js', {
    updated(registration) {
      console.log(`Updated to the latest version.\n${registration}`);
      resetData();
      window.location.reload(true);
    },
    offline() {
      console.info('No internet connection found. App is currently offline.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
};

export const initIcons = () => {
  library.add(
    faImage, faUser, faGithub, faHackerNews, faProductHunt, faRedditAlien, faThermometerHalf, faInfoCircle, faBolt,
    faCalendar, faHourglassHalf, faImage, faLocationCircle, faShareAlt, faSync, faUser, faTint, faClock, faCode,
    faWifiSlash, faMoonStars, faCloudRain, faCloudSnow, faCloudSleet, faCloudsSun, faCloudsMoon, faCloudHail,
    faHurricane, faThunderstorm, faTornado, faTemperatureHigh, faTemperatureLow, faSpinner, faGlobe, faMapMarkerAlt,
    faExclamationTriangle, faArrowAltCircleDown, faArrowAltCircleUp, faBan, faSignal, faLongArrowAltDown, faFog,
    faLongArrowAltUp, faExternalLinkAlt, faCircle, faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt, faClouds,
    faTachometer, faAngleUp, faChevronCircleUp, faDewpoint, faHumidity, faWind, faSunrise, faSunset, faEye, faSun,
    faUmbrella, faCloud, faChrome, faDev, faEdge, faFirefoxBrowser, faLocationArrow, faHouseDay, faGlobeStand,
  );
};

export const getWeatherIcon = (icon) => {
  const iconMap = {
    'clear-day': 'sun',
    'clear-night': 'moon-stars',
    rain: 'cloud-rain',
    snow: 'cloud-snow',
    sleet: 'cloud-sleet',
    wind: 'wind',
    fog: 'fog',
    cloudy: 'clouds',
    'partly-cloudy-day': 'clouds-sun',
    'partly-cloudy-night': 'clouds-moon',
    hail: 'cloud-hail',
    hurricane: 'hurricane',
    thunderstorm: 'thunderstorm',
    tornado: 'tornado',
  };
  return iconMap[icon];
};

const formatTemp = temp => `${Math.round(temp).toString().padStart(2, String.fromCharCode(160))}${String.fromCharCode(176)}`;
const formatPercent = num => `${Math.round(num * 100).toString().padStart(2, String.fromCharCode(160))}%`;
const formatNumWithLabel = (num, label) => `${Math.round(num).toString().padStart(2, String.fromCharCode(160))}${label}`;

export const formatCondition = (value, condition) => {
  switch (condition) {
    case 'temperature':
    case 'apparentTemperature':
    case 'dewPoint':
      return formatTemp(value);
      break;
    case 'precipProbability':
    case 'humidity':
    case 'cloudCover':
      return formatPercent(value);
      break;
    case 'precipIntensity':
      return `${Math.round(value)}in/hr`;
      break;
    case 'pressure':
      return `${Math.round(value)}mb`;
      break;
    case 'sunriseTime':
    case 'sunsetTime':
      return `${dayjs.unix(value).format('h:mm A')}`
      break;
    case 'visibility':
      return `${Math.round(value)}mi`;
      break;
    case 'windSpeed':
    case 'windGust':
      return `${Math.round(value)}mph`;
      break;
    default:
      return value;
      break;
  }
};

export const getConditionBarClass = (icon, clouds) => {
  const cloudCover = Math.round(clouds * 100);
  const isCloudy = icon.includes('cloudy') || cloudCover >= 40;
  const isRaining = (icon.includes('rain') || icon.includes('thunderstorm'));
  const isSnowing = (icon.includes('snow') || icon.includes('sleet'));
  const isClear = icon.includes('clear');
  if (isRaining) {
    return 'bg-blue-500';
  }
  if (isSnowing) {
    return 'bg-gray-200 opacity-75';
  }
  if (isCloudy) {
    return icon.includes('mostly') || cloudCover >= 60 ? 'bg-gray-600' : 'bg-gray-500';
  }
  if (isClear) {
    return 'bg-white';
  }
  return 'unknown-condition-bar-class';
};

export const formatSummary = (currentHourData, allHourlyData, index, startIndex) => {
  if (index === startIndex) {
    return currentHourData.summary;
  }
  return index >= 2 && currentHourData.summary === allHourlyData[index - 2].summary ? '' : currentHourData.summary;
};

export const getUvIndexClasses = (uvIndex) => {
  if (uvIndex <= 2) {
    return 'pill green';
  }
  if (uvIndex <= 5) {
    return 'pill yellow';
  }
  if (uvIndex <= 7) {
    return 'pill orange';
  }
  if (uvIndex <= 10) {
    return 'pill red';
  }
  if (uvIndex >= 11) {
    return 'pill purple';
  }
};
