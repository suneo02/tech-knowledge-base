import { Attachments } from '@ant-design/x'
import { Flex, GetProp } from 'antd'
import { AntRoleType, FileMessage } from 'gel-ui'
import { ReactNode } from 'react'
import { RoleAvatarHidden } from './misc'

export const FileRole: AntRoleType<FileMessage['content']> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  messageRender: (content): ReactNode => {
    if (typeof content !== 'string') {
      console.error('content is not a string', content)
      return null
    }
    const items = JSON.parse(content) as GetProp<typeof Attachments.FileCard, 'item'>[]
    return (
      <Flex vertical gap="middle">
        {items.map((item) => (
          <Attachments.FileCard key={item.uid} item={item} />
        ))}
      </Flex>
    )
  },
}
