import type { BubbleProps } from '@ant-design/x'
import { BubbleContentType } from '@ant-design/x/es/bubble/interface'
import {
  AIHeaderMsg,
  AIMessageGEL,
  ChartMessage,
  SubQuestionMessage,
  SuggestionMessage,
  UserMessageGEL,
} from './message'
import { AIFooterMsg, FileMessage, SimpleChartMessage, SplTableMessage } from './message/parsed'

/**
 * Ant Design 气泡组件角色类型
 * 继承自 Ant Design X 的 BubbleProps，但排除了 content 属性
 *
 * @template T - 气泡内容类型，默认为字符串
 */
export type AntRoleType<T extends BubbleContentType = string> = Partial<Omit<BubbleProps<T>, 'content'>>

/**
 * 聊天角色配置集合
 * 以消息角色为键，对应的角色配置为值的记录类型
 *
 * 用于配置不同角色（用户、AI、建议等）在聊天界面中的显示样式
 */
export type RolesTypeCore = {
  user: AntRoleType<UserMessageGEL['content']>
  ai: AntRoleType<AIMessageGEL['content']>
  aiHeader: AntRoleType<AIHeaderMsg['content']>
  suggestion: AntRoleType<SuggestionMessage['content']>
  file: AntRoleType<FileMessage['content']>
  chart: AntRoleType<ChartMessage['content']>
  subQuestion: AntRoleType<SubQuestionMessage['content']>
  simpleChart: AntRoleType<SimpleChartMessage['content']>
  splTable: AntRoleType<SplTableMessage['content']>
  aiFooter?: AntRoleType<AIFooterMsg['content']>
}

/**
 * 聊天角色配置集合
 * 以消息角色为键，对应的角色配置为值的记录类型
 *
 * 用于配置不同角色（用户、AI、建议等）在聊天界面中的显示样式
 */
export type RolesTypeBase = RolesTypeCore
