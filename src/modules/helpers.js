import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChrome,
  faDev,
  faEdge,
  faFirefoxBrowser,
  faGithub,
  faHackerNews,
  faProductHunt,
  faRedditAlien,
} from '@fortawesome/free-brands-svg-icons';
import {
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBolt,
  faCalendar,
  faHourglassHalf,
  faImage,
  faLocationCircle,
  faShareAlt,
  faSync,
  faUser,
  faTint,
  faClock,
  faCode,
  faWifiSlash,
  faMoonStars,
  faCloudRain,
  faCloudSnow,
  faCloudSleet,
  faFog,
  faClouds,
  faCloudsSun,
  faCloudsMoon,
  faCloudHail,
  faHurricane,
  faThunderstorm,
  faTornado,
  faTemperatureHigh,
  faTemperatureLow,
  faSpinner,
  faGlobe,
  faMapMarkerAlt,
  faExclamationTriangle,
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faBan,
  faSignal,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faExternalLinkAlt,
  faCircle,
  faPlusSquare,
  faMinusSquare,
  faGlobeAfrica,
  faSyncAlt,
  faTachometer,
  faAngleUp,
  faChevronCircleUp,
  faDewpoint,
  faHumidity,
  faWind,
  faSunrise,
  faSunset,
  faEye,
  faUmbrella,
  faSun,
  faCloud,
  faThermometerHalf,
  faInfoCircle,
} from '@fortawesome/pro-duotone-svg-icons';
import { register } from 'register-service-worker';
import { resetData } from './local-storage';

export function isDev () {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return true;
  }
  return false;
}

export function apiUrl () {
  if (isDev()) {
    return 'http://localhost:9000';
  }
  return `https://dark-sky.netlify.app/.netlify/functions`;
}

export function handleError(error) {
  console.error(error);
}

export function initServiceWorker () {
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
    faImage,
    faUser,
    faGithub,
    faHackerNews,
    faProductHunt,
    faRedditAlien,
    faBolt,
    faCalendar,
    faHourglassHalf,
    faImage,
    faLocationCircle,
    faShareAlt,
    faSync,
    faUser,
    faTint,
    faClock,
    faCode,
    faWifiSlash,
    faMoonStars,
    faCloudRain,
    faCloudSnow,
    faCloudSleet,
    faFog,
    faClouds,
    faCloudsSun,
    faCloudsMoon,
    faCloudHail,
    faHurricane,
    faThunderstorm,
    faTornado,
    faTemperatureHigh,
    faTemperatureLow,
    faSpinner,
    faGlobe,
    faMapMarkerAlt,
    faExclamationTriangle,
    faArrowAltCircleDown,
    faArrowAltCircleUp,
    faBan,
    faSignal,
    faLongArrowAltDown,
    faLongArrowAltUp,
    faExternalLinkAlt,
    faCircle,
    faPlusSquare,
    faMinusSquare,
    faGlobeAfrica,
    faSyncAlt,
    faTachometer,
    faAngleUp,
    faChevronCircleUp,
    faDewpoint,
    faHumidity,
    faWind,
    faSunrise,
    faSunset,
    faEye,
    faUmbrella,
    faSun,
    faCloud,
    faThermometerHalf,
    faInfoCircle,
    faChrome,
    faDev,
    faEdge,
    faFirefoxBrowser,
    faLocationArrow,
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
}
