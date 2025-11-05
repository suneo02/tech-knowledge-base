import type { BubbleProps } from '@ant-design/x'
import { BubbleContentType } from '@ant-design/x/es/bubble/interface'
import { MessageParsedCore } from 'ai-ui'

/**
 * Ant Design 气泡组件角色类型
 * 继承自 Ant Design X 的 BubbleProps，但排除了 content 属性
 *
 * @template T - 气泡内容类型，默认为字符串
 */
export type AntRoleType<T extends BubbleContentType = string> = Partial<Omit<BubbleProps<T>, 'content'>>

/**
 * 聊天角色类型
 * 定义聊天界面中不同角色（如用户、AI等）的样式和行为
 *
 * 包含气泡位置、头像、样式、加载状态渲染等配置
 */
export type RoleTypeCore = AntRoleType<MessageParsedCore['content']>

/**
 * 聊天角色配置集合
 * 以消息角色为键，对应的角色配置为值的记录类型
 *
 * 用于配置不同角色（用户、AI、建议等）在聊天界面中的显示样式
 */
export type RolesTypeCore = Record<MessageParsedCore['role'], RoleTypeCore>
