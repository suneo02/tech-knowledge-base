import { local } from '@/utils/storage'

export enum EnvType {
  PROD = 'prod',
  TEST = 'test',
  EXP = 'exp',
  SH = 'sh',
  DEV = 'dev',
  DEV2 = 'dev2',
  GKY = 'gky',
  LOCAL_PROXY_PROD = 'local_proxy_prod',
  LOCAL_PROXY_DEV = 'local_proxy_dev',
  DOWNLOAD = 'download',
  NJ = 'nj',
}

export interface EnvConfigItemProps {
  type: EnvType
  name: string
  host: string
  sessionId: string
  proxy: string
}

export const envConfig: EnvConfigItemProps[] = [
  {
    type: EnvType.SH,
    name: '上海主站',
    host: 'https://114.80.154.45',
    sessionId: 'f6770493afc44d5a885b268c167282f1',
    proxy: '/xsh',
  },
  {
    type: EnvType.NJ,
    name: '南京主站',
    host: 'https://180.96.8.44',
    sessionId: 'f6770493afc44d5a885b268c167282f1',
    proxy: '/xnj',
  },
  {
    type: EnvType.PROD,
    name: '主站',
    host: 'https://wx.wind.com.cn',
    sessionId: 'f6770493afc44d5a885b268c167282f1',
    proxy: '/xprod',
  },
  {
    type: EnvType.TEST,
    name: '测试站',
    host: 'https://test.wind.com.cn',
    sessionId: 'd4bf5a91d6e2457eaf15e34de90087a5',
    proxy: '/xtest',
  },

  {
    type: EnvType.EXP,
    name: '体验站',
    host: 'https://gel.wind.com.cn',
    sessionId: 'WIND_EXP_SESSIONID',
    proxy: '/xexp',
  },

  {
    type: EnvType.DEV,
    name: '付成顺8881',
    host: 'http://10.100.5.240',
    sessionId: 'WIND_SH_SESSIONID',
    proxy: '/xdev',
  },
  {
    type: EnvType.DEV2,
    name: '付成顺8880',
    host: 'http://10.100.5.240',
    sessionId: 'WIND_SH_SESSIONID',
    proxy: '/xdev2',
  },
  {
    type: EnvType.GKY,
    name: '耿坤元',
    host: 'http://10.100.4.62',
    sessionId: 'WIND_SH_SESSIONID',
    proxy: '/gky',
  },
  {
    type: EnvType.LOCAL_PROXY_PROD,
    name: '本地代理-主站',
    host: 'http://localhost:3020',
    sessionId: 'WIND_SH_SESSIONID',
    proxy: 'http://localhost:3020/xprod',
  },
  {
    type: EnvType.LOCAL_PROXY_DEV,
    name: '本地代理-开发',
    host: 'http://localhost:3020',
    sessionId: 'WIND_SH_SESSIONID',
    proxy: 'http://localhost:3020/xdev',
  },
  // {
  //   type: EnvType.DOWNLOAD,
  //   name: '下载',
  //   host: 'http://10.100.5.240:62601',
  //   sessionId: 'WIND_SH_SESSIONID',
  //   proxy: '/download',
  // },
]

// 设置会话ID
export const setSessionId = (sessionId: string) => {
  local.set('wsid', sessionId)
}

// 获取主站环境
export const getMainEnv = (): EnvConfigItemProps | Record<string, never> => {
  return local.get('mainEnv') || {}
}
// 获取本地调试环境
export const getDevEnv = (): EnvConfigItemProps | Record<string, never> => {
  return local.get('devEnv') || {}
}

// 获取API基础URL
export const getApiBaseUrl = (): string => {
  const env = getMainEnv()
  return env?.host || 'https://wx.wind.com.cn'
}

// 获取代理前缀
export const getProxyPrefix = (): string => {
  const env = getMainEnv()
  return env?.proxy || '/xprod'
}

// 会话ID键
export const SESSION_ID_KEY = 'wsid'

export const getNewWorkflow = () => {
  return local.get('newWorkflow') !== null ? local.get('newWorkflow') : true
}

export const setNewWorkflow = (newWorkflow: boolean) => {
  local.set('newWorkflow', newWorkflow)
}

// 是否是新的异步流程，测试用，整体切换完去掉
export const NEW_WORKFLOW = getNewWorkflow()

// API基础URL
export const API_BASE_URL = getApiBaseUrl()

export default {
  envConfig,
  setSessionId,
  getMainEnv,
  getDevEnv,
  getApiBaseUrl,
  getProxyPrefix,
  SESSION_ID_KEY,
  API_BASE_URL,
}
