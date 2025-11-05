import { Button } from '@wind/wind-ui'
import { ChatRoomProvider, ConversationsBaseProvider, EmbedModeProvider, PresetQuestionBaseProvider } from 'ai-ui'

import icon_alice from '@/assets/icons/icon-alice.png'
import { WIcon } from '@/components/common/Icon'
import { CloseO, RatiohalfO, RatioonethirdO } from '@wind/icons'
import { t } from 'gel-util/intl'
import React, { useState } from 'react'
import { PREFIX } from '.'
import { ChatMessageBase } from './comp/ChatMessageCore'
import styles from './index.module.less'

import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import { isLegacyBrowser } from '@/utils/navigator'
const STRINGS = {
  AI_QUESTION_COMPANY: t('451214', 'AI问企业'),
}

interface RightProps {
  entityName?: string
  entityType?: string
  width: string | null
  onWidthChange: (props: '50%' | '25%') => void
  onShowRight: (props: boolean) => void
  showRight: boolean
}

// 内部组件，用于在 Provider 内部使用 useChatBase
const RightContent: React.FC<RightProps> = ({
  entityName,
  entityType = 'company',
  width,
  onWidthChange,
  showRight,
  onShowRight,
}) => {
  if (!width) return null

  const dynamicStyle: React.CSSProperties = {
    minWidth: '360px',
    flexShrink: 0,
    width: width,
    maxWidth: '1280px',
  }

  const [isDefault, setIsDefault] = useState(true)

  return (
    <div
      id="company-detail-ai-right-container" // 用于其他元素监听宽度是否改变
      className={` ${styles[`${PREFIX}-right`]} ${!showRight ? styles[`${PREFIX}-right-hidden`] : ''}`}
      style={dynamicStyle}
    >
      <div className={styles[`${PREFIX}-right-controls`]}>
        <div className={styles[`${PREFIX}-right-controls-avatar`]}>
          <img src={icon_alice} alt={STRINGS.AI_QUESTION_COMPANY} style={{ width: 32, height: 32 }} />
          <span>{STRINGS.AI_QUESTION_COMPANY}</span>
        </div>
        <div className={styles[`${PREFIX}-right-controls-buttons`]}>
          <Button
            onClick={() => {
              onWidthChange('25%')
              setIsDefault(true)
            }}
            style={{ transform: 'rotate(180deg)' }}
            icon={
              <WIcon
                active={isDefault}
                icon={<RatioonethirdO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              />
            }
            type="text"
            size="small"
          ></Button>
          <Button
            onClick={() => {
              onWidthChange('50%')
              setIsDefault(false)
            }}
            style={{ transform: 'rotate(180deg)' }}
            icon={
              <WIcon
                active={!isDefault}
                icon={<RatiohalfO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              />
            }
            type="text"
            size="small"
          ></Button>
          <Button
            onClick={() => onShowRight(false)}
            style={{ justifySelf: 'flex-start' }}
            icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            type="text"
            size="small"
          ></Button>
        </div>
      </div>
      {/* <AIConversationIframe entityName={'小米科技有限责任公司'} /> */}
      <ChatMessageBase entityType={entityType} entityName={entityName} />
    </div>
  )
}
/**
 * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
 * 将 gap 属性替换为 margin
 */
const gapCompatTransformer: Transformer = {
  // @ts-expect-error 1111
  visit: (cssObj) => {
    // 如果不是旧版浏览器，直接返回原对象
    if (!isLegacyBrowser) {
      return cssObj
    }

    // 创建一个新对象，避免修改原对象
    const newCssObj = { ...cssObj }

    // 处理 gap 属性不兼容问题
    if (newCssObj.gap !== undefined || newCssObj.rowGap !== undefined || newCssObj.columnGap !== undefined) {
      const gapValue = newCssObj.gap || newCssObj.rowGap || newCssObj.columnGap
      delete newCssObj.gap
      delete newCssObj.rowGap
      delete newCssObj.columnGap

      // 根据 flex 方向添加替代样式
      if (newCssObj.flexDirection === 'column' || newCssObj.columnGap) {
        newCssObj['& > *:not(:last-child)'] = {
          marginBottom: gapValue,
        }
      } else {
        newCssObj['& > *:not(:last-child)'] = {
          marginRight: gapValue,
        }
      }
    }

    return newCssObj
  },
}
// 创建一个包装组件来提供所有必要的上下文
const RightWithProviders: React.FC<RightProps> = (props) => {
  return (
    <StyleProvider
      hashPriority={isLegacyBrowser ? 'high' : undefined}
      // @ts-expect-error 兼容83版本样式问题 :where 选择器 和 CSS 逻辑属性降级兼容方案
      transformers={isLegacyBrowser ? [gapCompatTransformer, legacyLogicalPropertiesTransformer] : []}
    >
      <ChatRoomProvider>
        <ConversationsBaseProvider>
          <PresetQuestionBaseProvider>
            <EmbedModeProvider isEmbedMode={true}>
              <RightContent {...props} />
            </EmbedModeProvider>
          </PresetQuestionBaseProvider>
        </ConversationsBaseProvider>
      </ChatRoomProvider>
    </StyleProvider>
  )
}

export const Right = RightWithProviders
