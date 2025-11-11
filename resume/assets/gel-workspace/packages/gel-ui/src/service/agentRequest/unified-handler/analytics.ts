/**
 * 分析埋点上报模块
 *
 * 职责：处理聊天相关的埋点数据上报
 * 遵循 TypeScript 规范：单函数 ≤ 50 行、参数 ≤ 5 个、职责单一
 */

import { BuryAction, postPointBuriedWithAxios } from 'gel-api'
import { ChatRunContext } from '../runContext'

/**
 * 上报分析埋点
 * @param context - 聊天运行上下文
 */
export async function reportAnalytics(context: ChatRunContext): Promise<void> {
  const { axiosEntWeb } = context.staticCfg
  const { input } = context

  postPointBuriedWithAxios(axiosEntWeb, BuryAction.NORMAL_ANSWER, {
    isDeepThinking: input.think ? true : false,
  })

  if (input.think) {
    postPointBuriedWithAxios(axiosEntWeb, '922610370003')
  }

  if (input.deepSearch) {
    postPointBuriedWithAxios(axiosEntWeb, '922604570280', { question: input.content })
  }
}
