// 功能点埋点，集中发送请求

import { functionCodesMap, OptionsForCode } from '@/bury'
import { AxiosInstance } from 'axios'
import { requestToEntWebWithAxios } from './entWeb'

/**
 * 页面类型枚举
 */
export enum PageType {
  CHAT = 'chat',
  DETAIL = 'detail',
}

/**
 * 埋点动作类型
 */
export enum BuryAction {
  COPY = 'copy', // 复制
  LIKE = 'like', // 点赞
  DISLIKE = 'dislike', // 点踩
  NORMAL_ANSWER = 'normal_answer', // 普通回答
  DEEP_THINKING_ANSWER = 'deep_thinking_answer', // 深度思考回答
  VIEW_REFERENCE_DETAIL = 'view_reference_detail', // 查看参考资料详情
  VIEW_COMPANY_DETAIL = 'view_company_detail', // 详情页点击企业名称/卡片
  VIEW_PERSON_DETAIL = 'view_person_detail', // 详情页点击人物名称/卡片
}

/**
 * 埋点代码映射
 */
export const BURY_CODE_MAP = {
  // 复制
  [BuryAction.COPY]: {
    [PageType.CHAT]: '922610370006',
    [PageType.DETAIL]: '922610370030',
  },
  // 点赞
  [BuryAction.LIKE]: {
    [PageType.CHAT]: '922610370004',
    [PageType.DETAIL]: '922610370028',
  },
  // 点踩
  [BuryAction.DISLIKE]: {
    [PageType.CHAT]: '922610370005',
    [PageType.DETAIL]: '922610370029',
  },
  // 普通回答
  [BuryAction.NORMAL_ANSWER]: {
    [PageType.CHAT]: '922610370002',
    [PageType.DETAIL]: '922610370027',
  },
  // 深度思考回答
  [BuryAction.DEEP_THINKING_ANSWER]: {
    [PageType.CHAT]: '922610370003',
    [PageType.DETAIL]: '',
  },

  // 查看参考资料详情
  [BuryAction.VIEW_REFERENCE_DETAIL]: {
    [PageType.CHAT]: '922610370015',
    [PageType.DETAIL]: '922610370031',
  },
  // 点击企业名称/卡片
  [BuryAction.VIEW_COMPANY_DETAIL]: {
    [PageType.CHAT]: '922610370007',
    [PageType.DETAIL]: '922610370032',
  },
  // 点击人物名称/卡片
  [BuryAction.VIEW_PERSON_DETAIL]: {
    [PageType.CHAT]: '922610370008',
    [PageType.DETAIL]: '922610370033',
  },
} as const

/**
 * 判断当前页面类型
 */
const detectPageType = (): PageType => {
  const href = window.location.href
  // 根据URL判断页面类型
  if (href.includes('chat')) {
    return PageType.CHAT
  }

  return PageType.DETAIL
}

/**
 * 根据动作和页面类型获取埋点代码
 */
const getBuryCode = (action: BuryAction): string => {
  const pageType = detectPageType()
  return BURY_CODE_MAP[action][pageType]
}

// 超过20条直接抛弃
export const postPointBuriedWithAxios = <T extends keyof typeof functionCodesMap>(
  axiosInstance: AxiosInstance,
  code: T | BuryAction,
  options: OptionsForCode<T> = {} as OptionsForCode<T>
) => {
  // 如果是预定义的埋点动作，则根据页面类型获取对应的代码
  let actualCode: string
  if (Object.values(BuryAction).includes(code as BuryAction)) {
    actualCode = getBuryCode(code as BuryAction)
  } else {
    actualCode = code as string
  }

  const data = { ...functionCodesMap[actualCode as keyof typeof functionCodesMap], ...options }

  try {
    const params: { paramName: string; paramValue: unknown }[] = []
    if (data) {
      for (const k in data) {
        if (k !== 'functionCode') {
          params.push({
            paramName: k,
            paramValue: data[k],
          })
        }
      }
    }

    requestToEntWebWithAxios(axiosInstance, 'user-log/add', {
      userLogItems: [
        {
          action: actualCode,
          params,
        },
      ],
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * 使用示例：
 *
 * // 1. 在对话页和详情页都会自动使用对应的埋点代码
 * postPointBuriedWithAxios(axiosInstance, BuryAction.COPY, {
 *   text: '要复制的内容'
 * })
 *
 * // 2. 在对话页会使用 922610370004，在详情页会使用 922610370029
 * postPointBuriedWithAxios(axiosInstance, BuryAction.LIKE, {
 *   question: '用户问题',
 *   answer: 'AI回答'
 * })
 *
 * // 3. 完成一次普通回答
 * postPointBuriedWithAxios(axiosInstance, BuryAction.NORMAL_ANSWER, {
 *   question: '用户问题',
 *   answer: 'AI回答'
 * })
 *
 * // 4. 完成一次深度思考回答
 * postPointBuriedWithAxios(axiosInstance, BuryAction.DEEP_THINKING_ANSWER, {
 *   question: '用户问题',
 *   answer: 'AI回答',
 *   isDeepThinking: true
 * })
 *
 * // 5. 仍然支持直接使用埋点代码
 * postPointBuriedWithAxios(axiosInstance, '922610370006', {
 *   text: '要复制的内容'
 * })
 *
 * // 6. 页面类型判断逻辑（可以根据需要修改）
 * - 包含 '/companyDetail' 的URL -> 详情页
 * - 其他URL -> 对话页
 */

/**
 * 实际使用示例：
 *
 * // 在AI回答完成时调用
 * const handleAnswerComplete = (question: string, answer: string, isDeepThinking: boolean = false) => {
 *   if (isDeepThinking) {
 *     postPointBuriedWithAxios(axiosInstance, BuryAction.DEEP_THINKING_ANSWER, {
 *       question,
 *       answer,
 *       isDeepThinking: true
 *     })
 *   } else {
 *     postPointBuriedWithAxios(axiosInstance, BuryAction.NORMAL_ANSWER, {
 *       question,
 *       answer
 *     })
 *   }
 * }
 *
 * // 在复制按钮点击时调用
 * const handleCopy = (content: string) => {
 *   postPointBuriedWithAxios(axiosInstance, BuryAction.COPY, {
 *     text: content
 *   })
 * }
 *
 * // 在点赞按钮点击时调用
 * const handleLike = (question: string, answer: string) => {
 *   postPointBuriedWithAxios(axiosInstance, BuryAction.LIKE, {
 *     question,
 *     answer
 *   })
 * }
 */
