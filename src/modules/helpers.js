import Bugsnag from '@bugsnag/js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChrome, faDev, faEdge, faFirefoxBrowser, faGithub, faHackerNews, faProductHunt, faRedditAlien,
} from '@fortawesome/free-brands-svg-icons';
import {
  faExclamationCircle,
} from '@fortawesome/pro-regular-svg-icons';
import {
  faLocation,
} from '@fortawesome/pro-light-svg-icons';
import {
  faLocationArrow as faLocationArrowSolid, faCog as faCogSolid, faInfoCircle as faInfoCircleSolid,
  faMap as faMapSolid, faGlobeStand as faGlobeStandSolid,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faBolt, faCalendar, faHourglassHalf, faImage, faLocationCircle, faShareAlt, faSync, faUser, faTint, faClock, faCode,
  faWifiSlash, faMoonStars, faCloudRain, faCloudSnow, faCloudSleet, faFog, faClouds, faCloudsSun, faCloudsMoon,
  faCloudHail, faHurricane, faThunderstorm, faTornado, faTemperatureHigh, faTemperatureLow, faSpinner, faGlobe,
  faMapMarkerAlt, faExclamationTriangle, faArrowAltCircleDown, faArrowAltCircleUp, faBan, faSignal, faLongArrowAltDown,
  faLongArrowAltUp, faExternalLinkAlt, faCircle, faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt, faTachometer,
  faAngleUp, faInfoCircle, faChevronCircleUp, faDewpoint, faHumidity, faWind, faSunrise, faSunset, faEye, faUmbrella,
  faSun, faCloud, faThermometerHalf, faHouseDay, faGlobeStand, faRadar, faRaindrops, faThermometerFull, faWindTurbine,
  faTachometerAlt, faCog, faLocationArrow, faMap, faPlay, faStop, faPause, faForward, faFastForward,
} from '@fortawesome/pro-duotone-svg-icons';
import cogoToast from 'cogo-toast';
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

export const initLeafletImages = (leafletRef) => {
  // eslint-disable-next-line no-underscore-dangle
  delete leafletRef.Icon.Default.prototype._getIconUrl;
  /* eslint-disable global-require */
  leafletRef.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  /* eslint-enable global-require */
};

export const isDarkModeEnabled = () => {
  const hasSystemDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // const appTheme = getData('theme') || null;
  // if (appTheme === 'dark' || (!appTheme && hasSystemDarkModeEnabled)) {
  //   return true;
  // }
  // return false;
  return hasSystemDarkModeEnabled;
};

export const toggleDarkMode = () => {
  const htmlEl = document.querySelector('html');
  if (isDarkModeEnabled()) {
    htmlEl.classList.add('dark');
    // setData('theme', 'dark');
  } else {
    // clearData('theme');
    // setData('theme', 'light');
    htmlEl.classList.remove('dark');
  }
};

export const initDarkMode = () => {
  const htmlEl = document.querySelector('html');
  if (isDarkModeEnabled()) {
    htmlEl.classList.add('dark');
    // setData('theme', 'dark');
  } else {
    // clearData('theme');
    // setData('theme', 'light');
    htmlEl.classList.remove('dark');
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    // console.log("window.matchMedia('(prefers-color-scheme: dark)').matches: ", event.matches);
    window.location.reload();
  });
};

export const initServiceWorker = () => {
  register('/service-worker.js', {
    updated() {
      // console.log(registration);
      cogoToast.info('Latest updates to Sky Dark installed - click this message to reload', {
        hideAfter: 0,
        heading: 'Sky Dark Updated',
        bar: { color: '#60a5fa' },
        // renderIcon: () => (
        //   // <FontAwesomeIcon />
        // ),
        onClick: () => {
          resetData();
          window.location.href = isDev() ? 'http://localhost:3000/' : 'https://skydark.app/';
          // window.location.reload(true);
        },
      });
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
    faExclamationCircle, faRadar, faRaindrops, faThermometerFull, faWindTurbine, faTachometerAlt, faCog,
    faInfoCircleSolid, faCogSolid, faLocationArrowSolid, faMap, faMapSolid, faGlobeStandSolid, faPlay, faStop,
    faPause, faForward, faFastForward, faLocation,
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
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': 'dodgerblue', '--fa-secondary-opacity': '.75' },
    },
    snow: {
      icon: 'cloud-snow',
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': isDarkModeEnabled() ? 'white' : 'gainsboro', '--fa-secondary-opacity': '1' },
    },
    sleet: {
      icon: 'cloud-sleet',
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': isDarkModeEnabled() ? 'white' : 'gainsboro', '--fa-secondary-opacity': '.9' },
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
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': 'darkgray', '--fa-secondary-opacity': '.75' },
    },
    'partly-cloudy-day': {
      icon: 'clouds-sun',
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': 'gold', '--fa-secondary-opacity': '.75' },
    },
    'partly-cloudy-night': {
      icon: 'clouds-moon',
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': 'plum', '--fa-secondary-opacity': '1' },
    },
    hail: {
      icon: 'cloud-hail',
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': isDarkModeEnabled() ? 'white' : 'gainsboro', '--fa-secondary-opacity': '.9' },
    },
    hurricane: {
      icon: 'hurricane',
      iconStyles: { '--fa-primary-color': 'black', '--fa-secondary-color': 'crimson', '--fa-secondary-opacity': '.9' },
    },
    thunderstorm: {
      icon: 'thunderstorm',
      iconStyles: { '--fa-primary-color': 'silver', '--fa-secondary-color': 'yellow', '--fa-secondary-opacity': '.8' },
    },
    tornado: {
      icon: 'tornado',
      iconStyles: { '--fa-primary-color': 'skyblue', '--fa-secondary-color': 'silver', '--fa-secondary-opacity': '.75' },
    },
  };
  return iconMap[icon];
};

const formatTemp = (temp) => `${Math.round(temp)}${String.fromCharCode(176)}`;
const formatPercent = (num) => `${Math.round(num * 100)}%`;
const formatNum = (num) => Number(Math.round(num));
const formatDecimal = (num, places = 2) => Number(num.toFixed(places));

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
      return `${formatDecimal(value)}`;
    case 'pressure':
      return `${formatNum(value)}`;
    case 'sunriseTime':
    case 'sunsetTime':
      return `${dayjs.unix(value).format('h:mm A')}`;
    case 'uvIndex':
      return `${formatNum(value)}`;
    case 'visibility':
      return `${formatNum(value)}`;
    case 'windSpeed':
    case 'windGust':
      return `${formatNum(value)}`;
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
  const summaryNormalized = summary.toLowerCase();
  const isCloudy = () => icon.includes('cloudy') || clouds >= 40;
  const isRaining = () => (icon.includes('rain') || icon.includes('thunderstorm') || icon.includes('hail'));
  const isSnowing = () => (icon.includes('snow') || icon.includes('sleet'));
  const isLight = () => summaryNormalized.includes('light');
  const isHeavy = () => summaryNormalized.includes('heavy');
  const isDrizzle = () => summaryNormalized.includes('drizzle');
  const isFlurries = () => summaryNormalized.includes('flurries');
  const isOvercast = () => summaryNormalized.includes('overcast');
  const isClear = () => icon.includes('clear');
  const hasMostly = () => icon.includes('mostly') || summaryNormalized.includes('mostly');

  if (isRaining()) {
    if (isHeavy()) {
      return 'bg-blue-600';
    }
    return isLight() || isDrizzle() ? 'bg-blue-400' : 'bg-blue-500';
  }
  if (isSnowing()) {
    if (isHeavy()) {
      return 'bg-purple-600';
    }
    return isLight() || isFlurries() ? 'bg-purple-400' : 'bg-purple-500';
  }
  if (isOvercast()) {
    return 'bg-gray-600';
  }
  if (isCloudy()) {
    return hasMostly() || clouds >= 60 ? 'bg-gray-500' : 'bg-gray-400';
  }
  if (isClear()) {
    return 'bg-white';
  }
  // handle windy and other non-standard conditins using cloud conditions
  if (clouds < 20) {
    return 'bg-white';
  }
  if (clouds >= 20 && clouds < 60) {
    return 'bg-gray-400';
  }
  if (clouds >= 60 && clouds < 80) {
    return 'bg-gray-500';
  }
  if (clouds >= 80) {
    return 'bg-gray-600';
  }
  // console.log(icon);
};

export const formatSummary = (currentHourData, allHourlyData, index, startIndex) => {
  let summary = '';
  if (index === startIndex) {
    summary = currentHourData.summary.replace('Possible ', '');
    return summary;
  }
  summary = index >= 2 && currentHourData.summary.replace('Possible ', '') === allHourlyData[index - 2].summary.replace('Possible ', '') ? '' : currentHourData.summary;
  summary = summary.replace('Possible ', '');
  return summary;
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

export const isCacheExpired = (lastUpdated, cacheDurationInMinutes) => {
  try {
    const nextUpdateTime = dayjs(lastUpdated).add(cacheDurationInMinutes, 'minute');
    if (dayjs().isAfter(nextUpdateTime)) {
      return true;
    }
  } catch (error) {
    handleError(error);
    return true;
  }
  return false;
};
