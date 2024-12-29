import { getData, setData } from './local-storage.js';

export const defaultAppSettings = {
  // system|light|dark|sunrise-sunset
  theme: 'system',
  // 10|15|20|25|30|45|60
  cacheTtl: '10',
  // same-as-theme|dark|light|color|street|street-gray|black-white|black-white-gray|watercolor
  mapStyle: 'same-as-theme',
  // auto|us|si|uk2|ca
  weatherUnits: 'auto',
};

export const initAppSettings = () => {
  const hasAppSettings = getData('appSettings') || null;

  if (!hasAppSettings) {
    setData('appSettings', defaultAppSettings);
  }
};

export default defaultAppSettings;
