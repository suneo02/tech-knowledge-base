import { HistoryChatOverview } from '@/assets/icon'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Link, Popover, Typography } from '@wind/wind-ui'
import dayjs from 'dayjs'
import { SuperChatHistoryItem } from 'gel-api'
import React from 'react'
import { RenamePopover } from './RenamePopover.js'
import styles from './style/conversationItem.module.less'

interface ConversationItemProps {
  item: SuperChatHistoryItem
  editingId: string
  onItemClick: (item: SuperChatHistoryItem) => void
  onMenuClick: (key: string, item: SuperChatHistoryItem) => void
  onRename: (item: SuperChatHistoryItem, newName: string) => void
  onEditingChange: (id: string) => void
}

const formatConversationTime = (updateTime: string) => {
  const date = dayjs(updateTime)
  const now = dayjs()
  const lastYear = now.subtract(1, 'year')

  if (date.isSame(now, 'day')) {
    return `今天 ${date.format('HH:mm')}`
  } else if (date.isAfter(lastYear)) {
    return date.format('MM月DD日 HH:mm')
  } else {
    return date.format('YYYY年MM月DD日')
  }
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  item,
  editingId,
  onItemClick,
  onMenuClick,
  onRename,
  onEditingChange,
}) => {
  const menu = (
    <Menu className={styles['menu-dropdown']}>
      <Menu.Item key="rename" icon={<EditOutlined />} onClick={() => onMenuClick('rename', item)}>
        重命名
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => onMenuClick('delete', item)}>
        删除
      </Menu.Item>
    </Menu>
  )
  return (
    <div className={styles['conversation-item']}>
      <div className={styles['conversation-item-content']}>
        <div className={styles['conversation-item-icon']}>
          <HistoryChatOverview />
        </div>
        <div className={styles['conversation-item-info']}>
          {/* @ts-expect-error 类型错误 */}
          <Typography className={styles['conversation-item-title']} ellipsis={{ tooltip: item.conversationName }}>
            {/* @ts-expect-error 类型错误 */}
            <Link onClick={() => onItemClick(item)}>{item.conversationName || '未命名对话'}</Link>
          </Typography>
          {/* @ts-expect-error 类型错误 */}
          <Typography className={styles['conversation-item-time']}>
            {formatConversationTime(item.updateTime)}
          </Typography>
        </div>
      </div>
      <Popover
        visible={editingId === item.conversationId}
        content={<RenamePopover item={item} onRename={onRename} onCancel={() => onEditingChange('')} />}
        trigger="click"
        placement="bottom"
        onVisibleChange={(visible) => !visible && onEditingChange('')}
      >
        <Dropdown overlay={menu} trigger={['click']}>
          <MoreOutlined className={styles['more-icon']} />
        </Dropdown>
      </Popover>
    </div>
  )
}
