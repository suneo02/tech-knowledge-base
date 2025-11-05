import { TGelEnv, getEnvParams } from '@/utils/env/index.ts'
import { GELService, getGeneralPrefixUrl, handleAppendUrlPath } from '../handle'

export const getWebAIPrefixUrl = ({ env: envParam }: { env: TGelEnv }) => {
  const url = new URL(
    getGeneralPrefixUrl({
      service: GELService.AI,
      envParam: envParam,
    })
  )
  const env = envParam || getEnvParams().env
  // 如果是 dev 模式， port 换成 3080
  if (env === 'local') {
    url.port = '3080'
  }
  return url.toString()
}

/**
 * 获取 WebAI 聊天链接
 * 如果没有 message 就是 新 ai 界面
 * 如果有 message 会在新聊天发送消息
 * @param param0
 * @returns
 */
export const getWebAIChatLink = ({ env: envParam }: { env?: TGelEnv } = {}) => {
  try {
    const env = envParam || getEnvParams().env
    const baseUrl = new URL(getWebAIPrefixUrl({ env }))
    baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)

    baseUrl.hash = 'chat'

    return baseUrl.toString()
  } catch (e) {
    console.error(e)
  }
}
