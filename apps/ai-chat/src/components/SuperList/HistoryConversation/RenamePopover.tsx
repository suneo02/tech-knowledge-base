import { Button, Input, Space } from 'antd'
import { SuperChatHistoryItem } from 'gel-api'
import React, { useState } from 'react'
import styles from './style/renamePopover.module.less'

interface RenamePopoverProps {
  item: SuperChatHistoryItem
  onRename: (item: SuperChatHistoryItem, newName: string) => void
  onCancel: () => void
}

export const RenamePopover: React.FC<RenamePopoverProps> = ({ item, onRename, onCancel }) => {
  const [newName, setNewName] = useState(item.conversationName || '')

  const handleRename = () => {
    console.log('🚀 ~ handleRename ~ newName:', newName)
    if (newName.trim()) {
      onRename(item, newName.trim())
    }
    onCancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className={styles['rename-popover']}>
      <Input
        autoFocus
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请输入新名称"
      />
      <div className={styles['button-group']}>
        <Space>
          <Button size="small" onClick={onCancel}>
            取消
          </Button>
          <Button size="small" type="primary" onClick={handleRename} disabled={!newName.trim()}>
            确认
          </Button>
        </Space>
      </div>
    </div>
  )
}
