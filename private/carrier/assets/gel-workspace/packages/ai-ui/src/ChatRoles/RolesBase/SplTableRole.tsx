import { AntRoleType, SplTableMessage } from 'gel-ui'
import { RoleAvatarHidden } from '../components/misc'
/**
 * @deprecated 超级名单表格角色，暂时不使用
 */
export const SplTableRole: AntRoleType<SplTableMessage['content']> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  messageRender: (content) => {
    console.log('🚀 SplTableRole ~ content:', content)

    if (!Array.isArray(content)) {
      console.error('SplTableRole content is not an array', content)
      return null
    }

    // 渲染多个表格
    return null
  },
  styles: {
    content: {
      width: '100%',
      marginInlineEnd: 44,
    },
  },
}
