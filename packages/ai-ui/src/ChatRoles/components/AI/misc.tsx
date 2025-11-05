import { RoleTypeCore } from '../../type'
import { RoleAvatarHidden } from '../misc'

export const creatAIRolePropsMisc = (showAiHeader: boolean): Partial<RoleTypeCore> => {
  return {
    avatar: RoleAvatarHidden,
    placement: 'start',
    style: {
      width: 'fit-content',
      maxWidth: '100%',
      marginInlineEnd: 44,
      transform: showAiHeader ? 'translateY(-12px)' : 'none', // 显示AI头部时，需要进行偏移
      fontSize: 16,
    },
    styles: {
      content: {
        backgroundColor: 'transparent',
        fontSize: 16,
      },
      footer: {
        marginBlockStart: 4,
      },
    },
  }
}
