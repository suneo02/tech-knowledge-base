import { QueryReferenceSuggestType } from '@/chat'

// 为特定功能点定义额外的必需参数（只有需要额外参数的功能点才在这里定义）
export type ExtraOptionsMap = {
  '922610370002': {
    isDeepThinking: boolean
  }
  '922610370004': {
    question: string // 用户问句
    answer: string // 回答内容
    intention: string // 意图
    feedbackType: string // 反馈类型
    detailedFeedback: string // 详细反馈
  }
  '922610370005': {
    question: string // 用户问句
    answer: string // 回答内容
    intention: string // 意图
    feedbackType: string // 反馈类型
    detailedFeedback: string // 详细反馈
  }
  '922610370007': {
    id: string // 卡片ID
  }
  '922610370008': {
    id: string // 卡片ID
  }
  '922610370009': {
    id: string // 卡片ID
  }
  '922610370010': {
    id: string // 卡片ID
  }
  '922610370011': {
    id: string // 卡片ID
  }
  '922610370012': {
    type: string // 图谱类型
  }
  '922610370013': {
    id: string // 集团系类型
  }
  '922610370014': {
    id: string // 卡片ID
  }
  '922610370015': {
    type: QueryReferenceSuggestType // 参考资料类型
  }
}
