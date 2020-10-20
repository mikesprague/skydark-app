import Bugsnag from '@bugsnag/js';
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
  faSun, faCloud, faThermometerHalf, faHouseDay, faGlobeStand, faRadar, faRaindrops, faThermometerFull, faWindTurbine,
  faTachometerAlt,
} from '@fortawesome/pro-duotone-svg-icons';
import { register } from 'register-service-worker';
import { resetData } from './local-storage';

dayjs.extend(relativeTime);

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
    return `https://${window.location.hostname}/.netlify/functions`;
  }
  return 'https://skydark.app/.netlify/functions';
};

export const handleError = (error) => {
  if (isDev()) {
    console.error(error);
  } else {
    Bugsnag.notify(error);
  }
};

export const initServiceWorker = () => {
  register('/service-worker.js', {
    updated(registration) {
      console.log(`Updated Sky Dark to the latest version.\n${registration}`);
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
    faExclamationCircle, faRadar, faRaindrops, faThermometerFull, faWindTurbine, faTachometerAlt,
  );
};

export const getWeatherIcon = (icon) => {
  const iconMap = {
    'clear-day': {
      icon: 'sun',
      iconStyles: { '--fa-primary-color': 'gold', '--fa-secondary-color': 'darkorange', '--fa-secondary-opacity': '.75' },
    },
    'clear-night': {
      icon: 'moon-stars',
      iconStyles: { '--fa-primary-color': 'plum', '--fa-secondary-color': 'palegoldenrod', '--fa-secondary-opacity': '1' },
    },
    rain: {
      icon: 'cloud-rain',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'dodgerblue', '--fa-secondary-opacity': '.75' },
    },
    snow: {
      icon: 'cloud-snow',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'white', '--fa-secondary-opacity': '1' },
    },
    sleet: {
      icon: 'cloud-sleet',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'white', '--fa-secondary-opacity': '.9' },
    },
    wind: {
      icon: 'wind',
      iconStyles: { '--fa-primary-color': 'skyblue', '--fa-secondary-color': 'lightgray', '--fa-secondary-opacity': '.75' },
    },
    fog: {
      icon: 'fog',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'silver', '--fa-secondary-opacity': '1' },
    },
    cloudy: {
      icon: 'clouds',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'darkgray', '--fa-secondary-opacity': '.75' },
    },
    'partly-cloudy-day': {
      icon: 'clouds-sun',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'gold', '--fa-secondary-opacity': '.75' },
    },
    'partly-cloudy-night': {
      icon: 'clouds-moon',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'plum', '--fa-secondary-opacity': '1' },
    },
    hail: {
      icon: 'cloud-hail',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'white', '--fa-secondary-opacity': '.9' },
    },
    hurricane: {
      icon: 'hurricane',
      iconStyles: { '--fa-primary-color': 'black', '--fa-secondary-color': 'crimson', '--fa-secondary-opacity': '.9' },
    },
    thunderstorm: {
      icon: 'thunderstorm',
      iconStyles: { '--fa-primary-color': 'lightgray', '--fa-secondary-color': 'yellow', '--fa-secondary-opacity': '.8' },
    },
    tornado: {
      icon: 'tornado',
      iconStyles: { '--fa-primary-color': 'skyblue', '--fa-secondary-color': 'lightgray', '--fa-secondary-opacity': '.75' },
    },
  };
  return iconMap[icon];
};

const formatTemp = (temp) => `${Math.round(temp).toString()}${String.fromCharCode(176)}`;
const formatPercent = (num) => `${Math.round(num * 100).toString()}%`;
const formatNum = (num) => `${Math.round(num).toString()}`;

export const formatCondition = (value, condition) => {
  switch (condition) {
    case 'temperature':
    case 'apparentTemperature':
    case 'dewPoint':
      return formatTemp(value);
    case 'precipProbability':
    case 'humidity':
    case 'cloudCover':
      return formatPercent(value);
    case 'precipIntensity':
      return formatNum(value);
    case 'pressure':
      return formatNum(value);
    case 'sunriseTime':
    case 'sunsetTime':
      return `${dayjs.unix(value).format('h:mm A')}`;
    case 'uvIndex':
      return formatNum(value);
    case 'visibility':
      return formatNum(value);
    case 'windSpeed':
    case 'windGust':
      return formatNum(value);
    default:
      return `${value}`;
  }
};

export const getRadarTs = () => {
  const now = dayjs();
  const hours = now.hour();
  let minutes = now.minute();
  const seconds = now.second();
  minutes -= (minutes % 10);
  minutes = minutes % 10 === 0 && seconds < 10 ? minutes -= 10 : minutes;
  const millisecondTs = dayjs()
    .hour(hours)
    .minute(minutes)
    .second(0)
    .millisecond(0)
    .valueOf();
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
  const isOvercast = summary.toLowerCase().includes('overcast');
  const isClear = icon.includes('clear');
  if (isRaining) {
    return summary.toLowerCase().includes('light') || summary.toLowerCase().includes('drizzle') ? 'bg-blue-400' : 'bg-blue-500';
  }
  if (isSnowing) {
    return summary.toLowerCase().includes('light') || summary.toLowerCase().includes('flurries') ? 'bg-purple-400' : 'bg-purple-500';
  }
  if(isOvercast) {
    return 'bg-gray-600';
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
  return 'unknownUvIndexClass';
};
