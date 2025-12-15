import { AntRoleType, RoleAvatarHidden, SuggestionMessage } from 'gel-ui'
import styles from './style/suggestion.module.less'

export const SuggestionRolePropsMisc: Partial<AntRoleType<SuggestionMessage['content']>> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  style: {
    lineHeight: 40,
  },
  styles: {
    content: {
      fontSize: 16,
    },
  },
  className: styles.refRole,
}
