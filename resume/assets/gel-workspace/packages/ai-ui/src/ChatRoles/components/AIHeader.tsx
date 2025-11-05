import { RoleTypeCore } from '../type'
import { RoleAIAvatar } from './AI/avatar'

export const AIHeaderRolePropsMisc: Partial<RoleTypeCore> = {
  placement: 'start',
  avatar: RoleAIAvatar,
  style: {
    width: 'fit-content',
    marginInlineEnd: 44,
    lineHeight: 24,
    fontSize: 16,
  },
  styles: {
    content: {
      lineHeight: 24,
      backgroundColor: 'transparent',
      fontSize: 16,
    },
  },
}
