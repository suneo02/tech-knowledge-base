import { AntRoleType, UserMessageGEL } from 'gel-ui'
import { HoverCopyButton } from './HoverCopyButton'

export const CLASSNAME_USER_ROLE = 'user-role'

export const UserRole: AntRoleType<UserMessageGEL['content']> = {
  className: CLASSNAME_USER_ROLE,
  placement: 'end',
  style: {
    marginBlockStart: 4,
    marginBlockEnd: 12,
  },
  messageRender: (content) => {
    console.log('🚀 UserRole ~ content:', content)

    return (
      <HoverCopyButton style={{ position: 'initial' }} content={content}>
        {/*  用于占位父元素padding 触发复制按钮 */}
        <div
          style={{
            position: 'absolute',
            right: '-12px',
            top: '-8px ',
            bottom: '-8px ',
            left: '-12px',
            cursor: 'pointer',
          }}
        ></div>
        <div>{content}</div>
      </HoverCopyButton>
    )
  },
  styles: {
    content: {
      marginBlock: 12,
      marginInlineStart: 24,
      paddingBlock: 8,
      paddingInline: 12,
      minHeight: 32,
      borderRadius: 8,
    },
  },
}
