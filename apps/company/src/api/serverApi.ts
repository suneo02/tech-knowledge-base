/**
 * 导出文件接口
 */

import { hashParams } from '@/utils/links'
import axios from './index'

export const SERVER_URL = '/Wind.WFC.Enterprise.Web/Enterprise/gel/'
export const ACTION_DOWNLOAD = '/download/createtempfile'
export const DOWNLOAD_FILE_URL = '/download/getfile/downloadfilewithtempfilename' // 下载文件

export const SERVER_URL_OLD = '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx'
export const ACTION_URL_OLD = '?cmd='
/**
 * 获取服务器 API 的请求函数。
 *
 * 此函数用于构造和发送 API 请求到服务器。它接受一个配置对象，该对象包含服务器 URL、动作 URL、HTTP 方法、API 路径、是否排除额外参数、是否匹配旧数据以及请求参数。
 *
 * @param {Object} param0 - 配置对象。
 * @param {string} param0.serverUrl - 服务器的基本 URL，如果未提供，将根据 matchOldData 的值使用默认的旧或新服务器 URL。
 * @param {string} [param0.actionUrl=''] - 动作 URL，它是服务器 URL 的一个后缀，如果未提供，将根据 matchOldData 的值使用默认的旧或新动作 URL。
 * @param {string} [param0.method='post'] - HTTP 请求方法，默认为 'post'。
 * @param {string} param0.api - API 路径，用于构造完整的请求 URL。
 * @param {boolean} [param0.noExtra] - 是否排除额外的 URL 参数，如果为 true，将不会在 URL 后面添加 groupId、companycode 或 id。
 * @param {boolean} [param0.matchOldData] - 是否匹配旧数据，如果为 true，将使用旧的服务器 URL 和动作 URL。
 * @param {Object} [param0.params] - 请求的参数对象，它将与默认参数对象合并。
 * @returns {Promise} 返回一个 Axios 请求的 Promise 对象。
 */
export const getServerApi = ({
  serverUrl,
  actionUrl = '',
  api,
  noExtra,
  matchOldData,
  params,
}: {
  serverUrl?: string
  actionUrl?: string
  api: string
  noExtra?: boolean
  matchOldData?: boolean
  params?: Record<string, any>
}) => {
  const { getAllParams, getParamValue } = hashParams()
  serverUrl = serverUrl || (matchOldData ? SERVER_URL_OLD : SERVER_URL)
  actionUrl = actionUrl || (matchOldData ? ACTION_URL_OLD : '')
  let url = `${serverUrl}${actionUrl}${api}${noExtra || matchOldData ? '' : `/${getParamValue('groupId') || getParamValue('companycode') || getParamValue('id')}`}`
  // 处理url中有两个 / 的问题，但是只敢处理这一处，没有整个 url 都替换
  url = url.replace(/gel\/\/download/g, 'gel/download')
  const data = { ...getAllParams(), ...params }
  return axios.request({
    url,
    method: 'post',
    data,
  })
}

export const getServerApiByConfig = ({
  serverUrl,
  actionUrl = '',
  api,
  noExtra,
  matchOldData,
  params,
  apiExtra,
}: {
  serverUrl?: string
  actionUrl?: string
  api: string
  noExtra?: boolean
  matchOldData?: boolean
  params?: Record<string, any>
  apiExtra?: any
}) => {
  const apiParams = {}
  if (apiExtra) {
    apiExtra?.forEach((par) => {
      if (par.type === 'dynamic') {
        if (par?.apiKey && par?.key) apiParams[par.apiKey] = params?.[par.key]
      } else {
        if (par?.apiKey && par?.value) apiParams[par.apiKey] = par.value
      }
    })
  }
  return getServerApi({ serverUrl, actionUrl, api, noExtra, matchOldData, params: { ...apiParams, ...params } })
}
