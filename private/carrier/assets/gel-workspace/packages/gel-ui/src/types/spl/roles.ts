import { AntRoleType, RolesTypeCore } from '../ai-chat'
import { SmartTableMessage } from './message'

export type RolesTypeSuper = RolesTypeCore & {
  smartTable: AntRoleType<SmartTableMessage['content']>
}
