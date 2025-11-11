import { TGelEnv, getEnvParams } from '@/utils/env/index.ts'
import { INNER_LINK_ENUM } from '@/views/RelatedLinks/constant'
import {
  CHAT_PARAM_KEYS,
  COMMON_PARAM_KEYS,
  EIsSeparate,
  ENoSearch,
  GELService,
  INNER_LINK_PARAM_KEYS,
  INNER_LINK_PARAM_VALUE_ENUM,
} from 'gel-util/link'
import { getGeneralPrefixUrl, handleAppendUrlPath } from '../handle'

// 常量定义
const WEB_AI_CONSTANTS = {
  // 环境相关
  LOCAL_ENV: 'local',
  LOCAL_PORT: '3080',

  // URL 路径相关
  CHAT_PATH: 'chat',
  SUPER_LIST_PATH: 'super', // 一句话找企业
  SUPER_CREDITS_PATH: 'credits', // 我的积分
  SUPER_LIST_CHAT_PATH: 'super/chat', // 一句话找企业-聊天
  DOWNLOAD_PATH: 'super/my-file', // 下载
} as const

export const getWebAIPrefixUrl = ({ env: envParam }: { env: TGelEnv }) => {
  const url = new URL(
    getGeneralPrefixUrl({
      service: GELService.AI,
      envParam: envParam,
    })
  )
  const env = envParam || getEnvParams().env
  // 如果是 local 环境，端口换成 3080
  if (env === WEB_AI_CONSTANTS.LOCAL_ENV) {
    url.port = WEB_AI_CONSTANTS.LOCAL_PORT
  }
  return url.toString()
}

export const getWebAIPrefixUrlWithIframe = ({ env: envParam }: { env: TGelEnv }) => {
  const url = new URL(
    getGeneralPrefixUrl({
      service: GELService.Company,
      envParam: envParam,
    })
  )
  return url.toString()
}

/**
 * 统一的 WebAI super 链接生成器
 * 支持 subPath: 'super' | 'super/chat' | 'super/download' | 'credits' | 'chat'
 * 通过 params 传递额外查询参数
 */
export const getWebAISuperLink = ({
  env: envParam,
  subPath,
  chatId,
  type,
  initialMsg,
  initialDeepthink,
  params = {},
}: {
  env?: TGelEnv
  subPath?: string
  chatId?: string
  type?: string
  initialMsg?: string
  initialDeepthink?: string
  params?: Record<string, string | number>
} = {}) => {
  console.log('🚀 ~ getWebAISuperLink ~ initialMsg:', initialMsg)
  try {
    const env = envParam || getEnvParams().env
    const baseUrl = new URL(getWebAIPrefixUrl({ env }))
    baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
    console.log('🚀 ~ getWebAISuperLink ~ subPath:', subPath)
    const normalizedSubPath = (() => {
      if (!subPath) return WEB_AI_CONSTANTS.SUPER_LIST_PATH
      if (subPath === 'credits') return WEB_AI_CONSTANTS.SUPER_CREDITS_PATH
      if (subPath === 'chat') return WEB_AI_CONSTANTS.CHAT_PATH
      if (subPath === 'super') return WEB_AI_CONSTANTS.SUPER_LIST_PATH
      if (subPath === 'super/chat') return WEB_AI_CONSTANTS.SUPER_LIST_CHAT_PATH
      if (subPath === 'my-file' || subPath === 'super/my-file') return WEB_AI_CONSTANTS.DOWNLOAD_PATH
      return subPath
    })()

    const hashParams = new URLSearchParams()
    if (initialMsg) hashParams.set(CHAT_PARAM_KEYS.INITIAL_MSG, initialMsg)
    if (initialDeepthink) hashParams.set(CHAT_PARAM_KEYS.INITIAL_DEEPTHINK, initialDeepthink)
    if (type) hashParams.set('type', type)
    Object.entries(params).forEach(([k, v]) => hashParams.set(k, String(v)))

    if (normalizedSubPath === WEB_AI_CONSTANTS.SUPER_LIST_CHAT_PATH && chatId) {
      hashParams.set('id', chatId)
      baseUrl.hash = hashParams.toString()
        ? `${WEB_AI_CONSTANTS.SUPER_LIST_CHAT_PATH}/${chatId}?${hashParams.toString()}`
        : `${WEB_AI_CONSTANTS.SUPER_LIST_CHAT_PATH}/${chatId}`
    } else {
      baseUrl.hash = hashParams.toString() ? `${normalizedSubPath}?${hashParams.toString()}` : normalizedSubPath
    }

    return baseUrl.toString()
  } catch (e) {
    console.error(e)
  }
}

/**
 * 统一的 WebAI 链接生成器（iframe 版，经过 InnerLinks 入口）
 * 通过 target=INNER_LINK_ENUM + path 指定子路径
 * @param target 链接类型，INNER_LINK_ENUM 枚举类型
 * @param subPath 子路径
 * @param chatId 聊天id
 * @param type 类型
 * @param initialMsg 初始消息
 * @param initialDeepthink 初始深度思考
 * @param params 参数
 */
export const getWebAILinkWithIframe = ({
  env: envParam,
  subPath,
  chatId,
  type,
  initialMsg,
  initialDeepthink,
  params = {},
  target = INNER_LINK_ENUM.SUPER,
}: {
  env?: TGelEnv
  subPath?: string
  chatId?: string
  type?: string
  initialMsg?: string
  initialDeepthink?: string
  params?: Record<string, string | number>
  target?: (typeof INNER_LINK_ENUM)[keyof typeof INNER_LINK_ENUM]
} = {}) => {
  try {
    const env = envParam || getEnvParams().env
    const baseUrl = new URL(getWebAIPrefixUrlWithIframe({ env }))
    baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)

    baseUrl.searchParams.set(INNER_LINK_PARAM_KEYS.TARGET, target)
    baseUrl.searchParams.set(COMMON_PARAM_KEYS.NOSEARCH, ENoSearch.True.toString())
    baseUrl.searchParams.set(COMMON_PARAM_KEYS.ISSEPARATE, EIsSeparate.True.toString())

    if (subPath) baseUrl.searchParams.set('path', subPath)
    if (chatId) baseUrl.searchParams.set('id', chatId)
    if (type) baseUrl.searchParams.set('type', type)
    if (initialMsg) baseUrl.searchParams.set(CHAT_PARAM_KEYS.INITIAL_MSG, initialMsg)
    if (initialDeepthink) baseUrl.searchParams.set(CHAT_PARAM_KEYS.INITIAL_DEEPTHINK, initialDeepthink)
    Object.entries(params).forEach(([k, v]) => baseUrl.searchParams.set(k, String(v)))

    baseUrl.hash = INNER_LINK_PARAM_VALUE_ENUM.INNER_LINK

    return baseUrl.toString()
  } catch (e) {
    console.error(e)
  }
}

/**
 * 获取  AIChat聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
export const getWebAIChatLink = ({
  env: envParam,
  initialMsg,
  initialDeepthink,
}: { env?: TGelEnv; initialMsg?: string; initialDeepthink?: string } = {}) => {
  return getWebAISuperLink({ env: envParam, subPath: 'chat', initialMsg, initialDeepthink })
}

/**
 * 获取 iframe 嵌套的 ai-chat 聊天链接 包含header头
 * @param param0
 * @returns
 */
export const getWebAIChatLinkWithIframe = ({
  env: envParam,
  initialMsg,
  initialDeepthink,
}: { env?: TGelEnv; initialMsg?: string; initialDeepthink?: string } = {}) => {
  return getWebAILinkWithIframe({
    env: envParam,
    subPath: 'chat',
    initialMsg,
    initialDeepthink,
    target: INNER_LINK_ENUM.AI_CHAT,
  })
}

export const getWebAISuperListLink = ({ env: envParam }: { env?: TGelEnv } = {}) => {
  return getWebAISuperLink({ env: envParam, subPath: 'super' })
}

export const getWebAISuperListLinkWithIframe = ({ env: envParam }: { env?: TGelEnv } = {}) => {
  return getWebAILinkWithIframe({ env: envParam, subPath: 'super' })
}

export const getWebAISuperCreditsLink = ({ env: envParam }: { env?: TGelEnv } = {}) => {
  return getWebAISuperLink({ env: envParam, subPath: 'credits' })
}

export const getWebAISuperCreditsLinkWithIframe = ({ env: envParam }: { env?: TGelEnv } = {}) => {
  return getWebAILinkWithIframe({ env: envParam, subPath: 'credits' })
}

/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
export const getWebAISuperListChatLink = ({
  env: envParam,
  chatId,
  type,
}: { env?: TGelEnv; chatId?: string; type?: string } = {}) => {
  return getWebAISuperLink({ env: envParam, subPath: 'super/chat', chatId, type })
}

/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
export const getWebAISuperListChatLinkWithIframe = ({
  env: envParam,
  chatId,
}: { env?: TGelEnv; chatId?: string } = {}) => {
  return getWebAILinkWithIframe({ env: envParam, subPath: 'super/chat', chatId })
}

/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
export const getWebAIDownloadLink = ({
  env: envParam,
  chatId,
  type,
}: { env?: TGelEnv; chatId?: string; type?: string } = {}) => {
  return getWebAISuperLink({ env: envParam, subPath: 'super/download', chatId, type })
}

/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
export const getWebAIDownloadLinkWithIframe = ({ env: envParam, chatId }: { env?: TGelEnv; chatId?: string } = {}) => {
  return getWebAILinkWithIframe({ env: envParam, subPath: 'super/download', chatId })
}
