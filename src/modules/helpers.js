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
  faExclamationCircle,
} from '@fortawesome/pro-regular-svg-icons';
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

export const apiUrl = (useLocalhost = false) => {
  if (useLocalhost) {
    return 'http://localhost:9000';
  }
  if (!isDev()) {
    return `https://${window.location.hostname}/.netlify/functions`
  }
  return 'https://skydark.app/.netlify/functions';
}

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
    faUmbrella, faCloud, faChrome, faDev, faEdge, faFirefoxBrowser, faLocationArrow, faHouseDay, faGlobeStand, faExclamationCircle,
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

export const getRadarTs = () => {
  const now = dayjs();
  const hours = now.hour();
  let minutes = now.minute();
  const seconds = now.second();
  minutes = minutes - (minutes % 10);
  minutes = minutes % 10 === 0 && seconds < 10 ? minutes -= 10 : minutes;
  const millisecondTs = dayjs().hour(hours).minute(minutes).second(0).millisecond(0).valueOf();
  const ts = millisecondTs / 1000;
  // console.log(ts);
  return ts;
};

export const getConditionBarClass = (data) => {
  const { icon, cloudCover, summary } = data;
  const clouds = Math.round(cloudCover * 100);
  const isCloudy = icon.includes('cloudy') || clouds >= 40;
  const isRaining = (icon.includes('rain') || icon.includes('thunderstorm'));
  const isSnowing = (icon.includes('snow') || icon.includes('sleet'));
  const isClear = icon.includes('clear');
  if (isRaining) {
    return summary.toLowerCase().includes('light') || summary.toLowerCase().includes('drizzle') ? 'bg-blue-400' : 'bg-blue-500';
  }
  if (isSnowing) {
    return summary.toLowerCase().includes('light') || summary.toLowerCase().includes('flurries') ? 'bg-purple-400' : 'bg-purple-500';
  }
  if (isCloudy) {
    return icon.includes('mostly') || summary.toLowerCase().includes('mostly') || clouds >= 60 ? 'bg-gray-500' : 'bg-gray-400';
  }
  if (isClear) {
    return 'bg-white';
  }
  console.log(data);
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
