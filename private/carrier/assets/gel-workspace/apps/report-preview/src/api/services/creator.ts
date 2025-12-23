import { ApiPaths, WFC_API_PATH, createWFCRequestWithAxios } from 'gel-api'
import { axiosInstance } from '../axios'

/**
 * 创建WFC API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createWFCRequest<P extends keyof ApiPaths[typeof WFC_API_PATH]>(api: P) {
  return createWFCRequestWithAxios(axiosInstance, api)
}
