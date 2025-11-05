import { ChatTypeEnum, GelData, QueryReferenceSuggest, RefTableData, SessionCompleteResponse } from 'gel-api'
import { BaseMessageFields } from './common'
import { AIMessageStatus } from './parsed'

export type MessageRawCore = BaseMessageFields & {
  /**
   * 聊天会话ID，用于标识消息所属的会话
   * 好像获取不到，没有维护好，谨慎使用
   */
  chatId?: string
  content?: string // 用户输入的内容 或者 ai 的回答
  reasonContent?: string // ai 的推理内容
  questionStatus?: string // 问答状态 -2 默认  -1 手动取消 0 失败 1 回答正确
  entity?: SessionCompleteResponse[] // 实体信息
  gelData?: GelData[] // 图表数据
  subQuestion?: string[] // 问句拆解
  error?: string // 错误信息
  // 一些引用资料
  refBase?: QueryReferenceSuggest[]
  // 一些引用表格数据
  refTable?: RefTableData[] // 表格信息
  chartType?: ChatTypeEnum // 图表类型
  questionGuide?: string[] // 问答引导
  role: 'user' | 'ai' // 消息角色
  // 消息状态 pending 正在处理，receiving 正在接收， stream_finish 流式输出完成， finish 处理完成
  status?: AIMessageStatus
}
