import { RoleTypeCore } from '../../type'
import { RoleAvatarHidden } from '../misc'
import styles from './style/suggestion.module.less'

export const SuggestionRolePropsMisc: Partial<RoleTypeCore> = {
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
