import axios, { AxiosInstance } from 'axios';
import { API_TIMEOUT, CONTENT_TYPES } from 'gel-api';
import { getApiPrefix } from '../utils';
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request';
import { responseErrorInterceptor, responseInterceptor } from './interceptors/response';

// 创建 axios 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiPrefix(),
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': CONTENT_TYPES.JSON,
    },
  });

  // 注册拦截器
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
  return instance;
};

// 创建 axios 实例
const createAxiosInstanceWithoutIntercepter = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiPrefix(),
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': CONTENT_TYPES.JSON,
    },
  });

  // 注册拦截器
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
  instance.interceptors.response.use(undefined, responseErrorInterceptor);
  return instance;
};
// 创建默认实例
export const axiosInstance = createAxiosInstance();

export const axiosInstanceWithoutIntercepter = createAxiosInstanceWithoutIntercepter();
