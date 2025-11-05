import { aliceIcon } from '@/assets/alice'
import { RoleTypeCore } from '../../type'

export const RoleAIAvatar: RoleTypeCore['avatar'] = {
  icon: <img src={aliceIcon} alt="avatar" />,
  style: { background: '#fde3cf', width: 40, height: 40 },
  shape: 'square',
}
