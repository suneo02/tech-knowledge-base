import { Bubble } from '@ant-design/x'
import { Virtualizer } from '@tanstack/react-virtual'
import { RolesTypeCore } from 'ai-ui'
import cn from 'classnames'
import React, { memo } from 'react'
import styles from '../../ChatMessageCore.module.less'
import { PresetQuestions } from '../PresetQuestions'

interface VirtualBubbleListProps {
  chatContainerRef: React.RefObject<HTMLDivElement>
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  groupedBubbleItemsWithKeys: Array<{ key: string; items: any[] }>
  roles: RolesTypeCore
  shouldShowPresetQuestions: boolean
  presetQuestionsPosition: 'welcome' | 'after-history'
  handlePresetQuestionClick: (question: string) => void
  handleScroll: () => void
}

/**
 * VirtualBubbleList - 虚拟滚动消息列表组件
 *
 * 职责：
 * 1. 渲染虚拟滚动的消息列表
 * 2. 在最后一组消息后显示预设问句
 * 3. 处理滚动事件
 *
 * @see {@link file:../../hooks/useVirtualChat.ts} - 虚拟滚动 Hook
 */
export const VirtualBubbleList: React.FC<VirtualBubbleListProps> = memo(
  ({
    chatContainerRef,
    rowVirtualizer,
    groupedBubbleItemsWithKeys,
    roles,
    shouldShowPresetQuestions,
    presetQuestionsPosition,
    handlePresetQuestionClick,
    handleScroll,
  }) => {
    // Snapshot virtual rows once per render to avoid accessing the virtualizer twice during mapping.
    const virtualItems = rowVirtualizer.getVirtualItems()
    // 当虚拟列表为空（例如仅显示默认欢迎消息时），预设问句需要在列表外单独渲染。
    const hasNoGroups = groupedBubbleItemsWithKeys.length === 0

    return (
      <div
        ref={chatContainerRef}
        className={cn(styles.chatContainer, styles.chatContainerTop)}
        onScroll={handleScroll}
        data-uc-id="ppA6_LQuAN"
        data-uc-ct="div"
      >
        <div>
          {virtualItems.map((virtualRow) => {
            // 每个 virtualRow 对应一个消息分组，分组内包含用户与 AI 的成对消息。
            const groupData = groupedBubbleItemsWithKeys[virtualRow.index]
            const isLastGroup = virtualRow.index === groupedBubbleItemsWithKeys.length - 1

            return (
              <div
                key={groupData.key}
                data-index={virtualRow.index}
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width: '100%',
                }}
              >
                <Bubble.List
                  className={cn(styles.bubbleListContainer, 'bubble-list-container')}
                  items={groupData.items}
                  roles={roles}
                />
                {/* 在最后一组消息后显示预设问句 */}
                {isLastGroup && shouldShowPresetQuestions && (
                  <PresetQuestions position={presetQuestionsPosition} onSend={handlePresetQuestionClick} />
                )}
              </div>
            )
          })}
          {/* 分组数据为空时（无虚拟项）仍需展示预设问句，例如欢迎场景 */}
          {hasNoGroups && shouldShowPresetQuestions && (
            <PresetQuestions position={presetQuestionsPosition} onSend={handlePresetQuestionClick} />
          )}
        </div>
      </div>
    )
  }
)

VirtualBubbleList.displayName = 'VirtualBubbleList'
