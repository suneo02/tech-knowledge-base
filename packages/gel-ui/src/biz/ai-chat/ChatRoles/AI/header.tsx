import { AIHeaderMsg, AntRoleType } from '@/types'
import { RoleAIAvatar } from './avatar'

export const AIHeaderRolePropsMisc: Partial<AntRoleType<AIHeaderMsg['content']>> = {
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
