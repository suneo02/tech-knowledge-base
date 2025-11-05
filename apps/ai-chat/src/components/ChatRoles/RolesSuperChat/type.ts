import { MessageParsedSuper } from 'ai-ui'
import { AntRoleType } from '../type'

/**
 * 超级聊天角色类型
 */
export type RoleTypeSuper = AntRoleType<MessageParsedSuper['content']>

export type RolesTypeSuper = Record<MessageParsedSuper['role'], RoleTypeSuper>
