import { AIMessageGEL, AntRoleType } from '@/types'
import { AliceLogo } from '../../AliceLogo'

export const RoleAIAvatar: AntRoleType<AIMessageGEL['content']>['avatar'] = {
  icon: <AliceLogo />,
  style: { background: '#fde3cf', width: 40, height: 40 },
  shape: 'square',
}
