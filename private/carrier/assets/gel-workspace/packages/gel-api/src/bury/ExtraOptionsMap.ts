import { RAGType } from '@/chat'

// 为特定功能点定义额外的必需参数（只有需要额外参数的功能点才在这里定义）
export type ExtraOptionsMap = {
  '922610370002': {
    isDeepThinking: boolean
  }
  // 对话页点赞
  '922610370004': {
    question: string // 用户问句
    answer: string // 回答内容
    intention: string // 意图
    feedbackType: string // 反馈类型
    detailedFeedback: string // 详细反馈
  }
  // 对话页点踩
  '922610370005': {
    question: string // 用户问句
    answer: string // 回答内容
    intention: string // 意图
    feedbackType: string // 反馈类型
    detailedFeedback: string // 详细反馈
  }
  // 对话页复制
  '922610370006': {
    text: string // 复制内容
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
  // 对话页查看参考资料详情
  '922610370015': {
    type: RAGType // 参考资料类型
  }

  // 详情页点赞
  '9226103700298': {
    question: string // 用户问句
    answer: string // 回答内容
    intention: string // 意图
    feedbackType: string // 反馈类型
    detailedFeedback: string // 详细反馈
  }
  // 详情页点踩
  '922610370029': {
    question: string // 用户问句
    answer: string // 回答内容
    intention: string // 意图
    feedbackType: string // 反馈类型
    detailedFeedback: string // 详细反馈
  }
  // 详情页复制
  '922610370030': {
    text: string // 复制内容
  }
  // 详情页查看参考资料详情
  '922610370031': {
    type: RAGType // 参考资料类型
  }
  // 详情页点击企业名称/卡片
  '922610370032': {
    id: string // 企业ID
  }
  // 详情页点击人物名称/卡片
  '922610370033': {
    id: string // 人物ID
  }
  // 详情页调整AI对话宽度
  '922610370037': {
    format: '25%' | '50%' // 格式
  }
}
