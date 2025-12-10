import { AntRoleType, RolesTypeCore } from '../ai-chat'
import { QuestionGuideMessage, SmartTableMessage } from './message'

export type RolesTypeSuper = RolesTypeCore & {
  questionGuide: AntRoleType<QuestionGuideMessage['content']>
  smartTable: AntRoleType<SmartTableMessage['content']>
}
