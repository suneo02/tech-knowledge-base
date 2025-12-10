import { loaclDevManager } from 'gel-ui';
import { getWsidProd } from 'gel-util/env';

export const MODE = import.meta.env.MODE;
const DEV_WSID = import.meta.env.VITE_DEV_WSID || '';

export const API_PREFIX = import.meta.env.VITE_API_PREFIX || '';
export const isDev = MODE === 'development';
export const isStaging = MODE === 'staging';
export const isProd = MODE === 'production';

export const getApiPrefix = () => {
  let apiDevPrefix = loaclDevManager.get('GEL_API_PREFIX_DEV');
  if ((isDev || isStaging) && apiDevPrefix) {
    return apiDevPrefix;
  }
  return API_PREFIX;
};

export const getWsid = () => {
  let wsid = getWsidProd();
  if (wsid) {
    return wsid;
  }
  if (isDev) {
    return DEV_WSID;
  }
  return '';
};
