/* eslint-disable no-console */
import Bugsnag from '@bugsnag/js';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import withReactContent from 'sweetalert2-react-content';

import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { initDarkMode, isDarkModeEnabled } from './theme';
import { initAppSettings } from './settings';

const MySwal = withReactContent(Swal);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const isLocal = () => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return true;
  }

  return false;
};

export const isDev = () => {
  if (isLocal() || window.location.hostname !== 'skydark.app') {
    return true;
  }

  return false;
};

export const metricToImperial = {
  cToF: (value) => value * 1.8 + 32,
  mToMi: (value) => value / 1609.344,
  kmToMi: (value) => value / 1.609344,
  mmToIn: (value) => value / 25.4,
};

const defaultModalConfig = {
  showCloseButton: true,
  showConfirmButton: false,
  allowOutsideClick: true,
  background: isDarkModeEnabled() ? 'rgb(24, 24, 27)' : 'rgb(228 228 231)',
  color: isDarkModeEnabled() ? 'rgb(244 244 245)' : 'rgb(24 24 27)',
  backdrop: true,
  position: 'top',
  heightAuto: true,
  width: '28rem',
  showClass: {
    popup: 'swal2-show',
    backdrop: 'swal2-backdrop-show',
    icon: 'swal2-icon-show',
  },
  hideClass: {
    popup: 'swal2-hide',
    backdrop: 'swal2-backdrop-hide',
    icon: 'swal2-icon-hide',
  },
};

const defaultToastConfig = {
  icon: 'info',
  showConfirmButton: false,
  toast: true,
  position: 'top',
  allowEscapeKey: false,
  background: isDarkModeEnabled() ? 'rgb(39 39 42)' : 'rgb(228 228 231)',
  color: isDarkModeEnabled() ? 'rgb(244 244 245)' : 'rgb(24 24 27)',
};

export const openModalWithComponent = (componentToShow, config = null) => {
  let modalConfig = defaultModalConfig;

  if (config) {
    modalConfig = { ...defaultModalConfig, ...config };
  }

  MySwal.fire({
    ...modalConfig,
    html: componentToShow,
  });
};

export const openModalWithMarkup = (markupToShow, config = null) => {
  let modalConfig = defaultModalConfig;

  if (config) {
    modalConfig = { ...defaultModalConfig, ...config };
  }

  Swal.fire({
    ...modalConfig,
    html: markupToShow,
  });
};

export const openToastWithContent = (config) => {
  Swal.fire({
    ...config,
    ...defaultToastConfig,
  });
};

export const apiUrl = () => {
  let urlToReturn = `${window.location.protocol}//${window.location.hostname}/api`;

  if (
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1')
  ) {
    urlToReturn = `${window.location.protocol}//${window.location.hostname}:8788/api`;
    urlToReturn = 'https://dev.skydark.app/api';
  }
  // console.log(urlToReturn);

  return urlToReturn;
};

export const handleError = (error) => {
  if (isDev()) {
    console.error(error);
  } else {
    Bugsnag.notify(error);
  }
};

export const titleCaseToSentenceCase = (words) =>
  words
    .split('')
    // eslint-disable-next-line no-confusing-arrow
    .map((character, index) =>
      index > 0 && /[A-Z]/.test(character)
        ? ` ${character.toLowerCase()}`
        : character,
    )
    .join('');

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable no-undef */
export const initLeafletImages = (leafletRef) => {
  delete leafletRef.Icon.Default.prototype._getIconUrl;
  leafletRef.Icon.Default.mergeOptions({
    iconRetinaUrl: 'images/leaflet/marker-icon-2x.png',
    iconUrl: 'images/leaflet/marker-icon.png',
    shadowUrl: 'images/leaflet/marker-shadow.png',
  });
};
/* eslint-enable no-underscore-dangle */
/* eslint-enable no-param-reassign */
/* eslint-enable global-require */
/* eslint-enable no-undef */

// eslint-disable-next-line no-promise-executor-return
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatTemp = (temp) => `${Math.round(temp)}${String.fromCharCode(176)}`;
const formatPercent = (num) => `${Math.round(num * 100)}%`;
const formatNum = (num) => Number(Math.round(num));
const formatDecimal = (num, places = 2) => Number(num.toFixed(places));

export const formatCondition = (value, condition) => {
  switch (condition) {
    case 'temperature':
    case 'temperatureApparent':
    case 'temperatureDewPoint':
      return formatTemp(metricToImperial.cToF(value));
    case 'precipitationChance':
    case 'humidity':
    case 'cloudCover':
      return formatPercent(value);
    case 'precipitationIntensity':
      return `${formatDecimal(metricToImperial.mmToIn(value))}`;
    case 'pressure':
      return `${formatNum(value)}`;
    case 'sunrise':
    case 'sunset':
      return `${dayjs(value).format('h:mm A')}`;
    case 'uvIndex':
      return `${formatNum(value)}`;
    case 'visibility':
      return `${formatNum(metricToImperial.mToMi(value))}`;
    case 'windSpeed':
    case 'windGust':
      return `${formatNum(metricToImperial.kmToMi(value))}`;
    default:
      return `${value}`;
  }
};

export const getRadarTs = () => {
  const now = dayjs();
  const hours = now.hour();
  let minutes = now.minute();
  const seconds = now.second();

  minutes -= minutes % 10;
  minutes = minutes % 10 === 0 && seconds < 15 ? (minutes -= 10) : minutes;

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
  const { cloudCover } = data;
  let { conditionCode } = data;

  conditionCode = conditionCode.toLowerCase();
  const clouds = Math.round(cloudCover * 100);
  // const summaryNormalized = summary.toLowerCase();
  const isCloudy = () => conditionCode.includes('cloudy');
  const isHazy = () => conditionCode.includes('haze');
  const isRaining = () =>
    conditionCode.includes('rain') ||
    conditionCode.includes('storm') ||
    conditionCode.includes('shower') ||
    conditionCode.includes('drizzle');
  const isSnowing = () =>
    conditionCode.includes('snow') ||
    conditionCode.includes('sleet') ||
    conditionCode.includes('blizzard') ||
    conditionCode.includes('flurries') ||
    conditionCode.includes('Wintry');
  const isLight = () => conditionCode.includes('light');
  const isHeavy = () => conditionCode.includes('heavy');
  const isDrizzle = () => conditionCode.includes('drizzle');
  const isFlurries = () => conditionCode.includes('flurries');
  const isClear = () => conditionCode.includes('clear');
  const hasMostly = () => conditionCode.includes('mostly');
  const hasPartly = () => conditionCode.includes('partly');

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

  if (isCloudy() && hasMostly()) {
    return 'bg-gray-600';
  }

  if (isCloudy()) {
    return hasPartly() ? 'bg-gray-400' : 'bg-gray-500';
  }

  if (isHazy()) {
    return 'bg-gray-300';
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

export const formatSummary = (
  currentHourData,
  allHourlyData,
  index,
  startIndex,
) => {
  let summary = '';

  if (index === startIndex) {
    summary = currentHourData.conditionCode;

    return summary;
  }

  summary =
    index >= 2 &&
    currentHourData.conditionCode === allHourlyData[index - 2].conditionCode
      ? ''
      : currentHourData.conditionCode;

  return titleCaseToSentenceCase(summary);
};

export const getUvIndexClasses = (uvIndex) => {
  if (uvIndex <= 2) {
    return 'bubble green';
  }

  if (uvIndex <= 5) {
    return 'bubble yellow';
  }

  if (uvIndex <= 7) {
    return 'bubble orange';
  }

  if (uvIndex <= 10) {
    return 'bubble red';
  }

  if (uvIndex >= 11) {
    return 'bubble purple';
  }

  return 'bubble unknownUvIndexClass';
};

export const initSkyDark = () => {
  dayjs.tz.setDefault('America/New_York');

  if (isDev()) {
    const { title } = window.document;

    window.document.title = `DEV ${title}`;
  }

  initAppSettings();
  initDarkMode();
};
