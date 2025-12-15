import {
  ApiPaths,
  createChatRequestWithAxios,
  createSuperlistRequestWithAxios,
  createWFCRequestWithAxios,
  SUPERLIST_API_PATH,
  WFC_API_PATH,
  WIND_ENT_CHAT_PATH,
} from 'gel-api'
import { axiosInstance } from './axios'

/**
 * 创建API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createChatRequest<P extends keyof ApiPaths[typeof WIND_ENT_CHAT_PATH]>(api: P) {
  return createChatRequestWithAxios(axiosInstance, api)
}

/**
 * 创建Superlist API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createSuperlistRequest<P extends keyof ApiPaths[typeof SUPERLIST_API_PATH]>(api: P) {
  return createSuperlistRequestWithAxios(axiosInstance, api)
}

/**
 * 创建WFC API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createWFCRequest<P extends keyof ApiPaths[typeof WFC_API_PATH]>(api: P) {
  return createWFCRequestWithAxios(axiosInstance, api)
}
