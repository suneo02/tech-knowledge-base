import { MessageParsedBase } from '@/types/message'
import { AntRoleType } from '../type'

/**
 * 聊天角色类型
 * 定义聊天界面中不同角色（如用户、AI等）的样式和行为
 *
 * 包含气泡位置、头像、样式、加载状态渲染等配置
 */
export type RoleTypeBase = AntRoleType<MessageParsedBase['content']>

/**
 * 聊天角色配置集合
 * 以消息角色为键，对应的角色配置为值的记录类型
 *
 * 用于配置不同角色（用户、AI、建议等）在聊天界面中的显示样式
 */
export type RolesTypeBase = Record<MessageParsedBase['role'], RoleTypeBase>
