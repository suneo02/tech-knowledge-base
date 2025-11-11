import { ConversationTimeGroup } from 'gel-ui'
import React from 'react'
import { HistoryItem } from './HistoryItem'

interface HistoryItemListProps {
  groupedHistoryItems: Array<{
    id: number
    groupId: string
    title?: string
    answers?: string
    updateTime?: string
    group?: ConversationTimeGroup
    index?: number
  }>
  searchKeyword: string
  isSelectionMode: boolean
  selectedHistoryIds: string[]
  hoveredItemId: string | null
  onHistoryClick: (groupId: string, index?: number) => void
  onSelectItem: (groupId: string) => void
  onSingleDelete: (groupId: string) => void
  onRename: (groupId: string, currentTitle: string) => void
  onHoverChange: (groupId: string | null) => void
}

export const HistoryItemList: React.FC<HistoryItemListProps> = ({
  groupedHistoryItems,
  searchKeyword,
  isSelectionMode,
  selectedHistoryIds,
  hoveredItemId,
  onHistoryClick,
  onSelectItem,
  onSingleDelete,
  onRename,
  onHoverChange,
}) => {
  let currentGroup: ConversationTimeGroup | null = null

  return (
    <>
      {groupedHistoryItems.map((item, index) => {
        const shouldShowGroupTitle = item.group !== currentGroup
        if (shouldShowGroupTitle) {
          currentGroup = item.group || null
        }

        return (
          <HistoryItem
            key={`${item.groupId}-${index}`}
            item={item}
            searchKeyword={searchKeyword}
            shouldShowGroupTitle={shouldShowGroupTitle}
            isSelectionMode={isSelectionMode}
            selectedHistoryIds={selectedHistoryIds}
            hoveredItemId={hoveredItemId}
            onHistoryClick={(groupId, index) => {
              onHistoryClick(groupId, index)
            }}
            onSelectItem={onSelectItem}
            onSingleDelete={onSingleDelete}
            onRename={onRename}
            onHoverChange={onHoverChange}
          />
        )
      })}
    </>
  )
}
