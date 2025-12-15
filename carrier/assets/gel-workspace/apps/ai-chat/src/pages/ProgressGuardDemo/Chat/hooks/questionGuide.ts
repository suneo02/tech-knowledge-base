import { requestToSuperlist } from '@/api'
import { ApiCodeForWfc } from 'gel-api'

/**
 * 获取超级列表的问答引导
 * @param rawSentence 原始句子
 * @param text ai 回答
 * @returns 问答引导列表
 */
export const fetchSuperQuestionGuide = async (rawSentence: string, text: string) => {
  const res = await requestToSuperlist('chat/questionGuide', {
    rawSentence,
    text,
  })
  if (res.ErrorCode === ApiCodeForWfc.SUCCESS && res.Data && res.Data.list) {
    return res.Data.list
  }
}
