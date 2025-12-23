import { DeleteO, EditO } from '@wind/icons'
import { Button, Checkbox } from '@wind/wind-ui'
import { ConversationTimeGroup, ConversationTimeGroupMap } from 'gel-ui'
import { highlightText, smartTextTruncate, stripMarkdownAndTraces } from 'gel-util/common'
import React from 'react'
import styles from './HistoryItem.module.less'

// 回答智能分词最大长度
const MAX_ANSWERS_LENGTH = 120

interface HistoryItemProps {
  item: {
    id: number
    groupId: string
    title?: string
    answers?: string
    updateTime?: string
    group?: ConversationTimeGroup
    index?: number
  }
  searchKeyword: string
  shouldShowGroupTitle: boolean
  isSelectionMode: boolean
  selectedHistoryIds: string[]
  hoveredItemId: string | null
  onHistoryClick: (groupId: string, index?: number) => void
  onSelectItem: (groupId: string) => void
  onSingleDelete: (groupId: string) => void
  onRename: (groupId: string, currentTitle: string) => void
  onHoverChange: (groupId: string | null) => void
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  searchKeyword,
  shouldShowGroupTitle,
  isSelectionMode,
  selectedHistoryIds,
  hoveredItemId,
  onHistoryClick,
  onSelectItem,
  onSingleDelete,
  onRename,
  onHoverChange,
}) => {
  // 判断是否为今天，决定时间格式
  let dateStr = ''
  if (item.group === ConversationTimeGroupMap.TODAY) {
    dateStr = item.updateTime?.split(' ')[1] || ''
  } else {
    dateStr = item.updateTime?.split(' ')[0] || ''
  }

  return (
    <React.Fragment>
      {/* 如果搜索关键词为空，则显示分组标题 */}
      {shouldShowGroupTitle && item.group && !searchKeyword && (
        <div className={styles['history-group-title']}>
          <span className={styles['history-group-text']}>{item.group}</span>
        </div>
      )}
      <div
        className={styles['history-item-wrapper']}
        onMouseEnter={() => onHoverChange(item.groupId)}
        onMouseLeave={() => onHoverChange(null)}
      >
        <div
          className={`${styles['history-item-checkbox']} ${isSelectionMode || hoveredItemId === item.groupId || selectedHistoryIds.includes(item.groupId) ? styles['history-item-checkbox--visible'] : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onSelectItem(item.groupId)
          }}
        >
          <Checkbox
            checked={selectedHistoryIds.includes(item.groupId)}
            onChange={() => {}} // 由上层div的onClick处理
          />
        </div>
        <div
          className={styles['history-item']}
          onClick={isSelectionMode ? () => onSelectItem(item.groupId) : () => onHistoryClick(item.groupId, item.index)}
          role={isSelectionMode ? 'checkbox' : undefined}
          aria-checked={isSelectionMode ? selectedHistoryIds.includes(item.groupId) : undefined}
        >
          <div className={styles['history-item-content']}>
            <div className={styles['history-item-header']}>
              <div className={styles['history-item-title-wrapper']}>
                <h3 className={styles['history-item-title']}>
                  <span>{highlightText(item.title || '', searchKeyword)}</span>
                  <span className={styles['history-item-title-actions']}>
                    <EditO
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                      className={styles['history-item-edit']}
                      onClick={(e) => {
                        e.stopPropagation()
                        onRename(item.groupId, item.title || '')
                      }}
                    />
                  </span>
                </h3>
              </div>
              <div className={styles['history-item-date']}>{dateStr}</div>
            </div>
            {item.answers && (
              <p className={styles['history-item-text']} title={item.answers}>
                {highlightText(
                  smartTextTruncate(stripMarkdownAndTraces(item.answers), searchKeyword, MAX_ANSWERS_LENGTH),
                  searchKeyword
                )}
              </p>
            )}
          </div>
        </div>
        <div className={styles['history-item-actions']}>
          <Button
            type="text"
            icon={<DeleteO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />}
            onClick={() => onSingleDelete(item.groupId)}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
