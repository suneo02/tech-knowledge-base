import { CHAT_CONSTANTS } from '../types'

/**
 * 更新加载状态的辅助函数
 * @param setLoadingText 设置加载文本的函数
 * @param step 当前步骤
 */
export const updateLoadingState = (
  setLoadingText: (text: string) => void,
  step: 'CREATE' | 'ANALYSIS' | 'RETRIEVAL'
) => {
  setLoadingText(CHAT_CONSTANTS.LOADING_TEXT[step])
}
