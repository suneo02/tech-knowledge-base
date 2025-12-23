/**
 * 企业详情页右侧AI面板组件
 *
 * 提供企业相关的智能问答功能，支持企业上下文感知的对话交互
 * 包含AI面板控制、虚拟滚动对话、预设问题等功能
 *
 * @see ../../docs/CorpDetail/layout-right.md - 右侧AI面板设计文档
 * @see ../../docs/CorpDetail/design.md - 整体架构设计文档
 */

import { ChatRoomProvider, ConversationsBaseProvider, EmbedModeProvider, PresetQuestionBaseProvider } from 'ai-ui'

import icon_alice from '@/assets/icons/icon-alice-40.png'
import { WIcon } from '@/components/common/Icon'
import { CloseO, RatiohalfO, RatioonethirdO } from '@wind/icons'
import { t } from 'gel-util/intl'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { PREFIX } from '.'
import styles from './index.module.less'
// 延迟加载 ChatMessageBase
const ChatMessageBaseLazy = lazy(() =>
  import('./comp/ChatMessageCore').then((mod) => ({ default: mod.ChatMessageBase }))
)

import { entWebAxiosInstance } from '@/api/entWeb'
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import { Button } from '@wind/wind-ui'
import { postPointBuriedWithAxios } from 'gel-api'
import { getGapCompatTransformer, needsBrowserCompat } from 'gel-ui'

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
  // 控制ChatMessageBase延迟加载
  const [shouldLoadChat, setShouldLoadChat] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShouldLoadChat(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
              postPointBuriedWithAxios(entWebAxiosInstance, '922610370037', {
                format: '25%',
              })
              setIsDefault(true)
            }}
            style={{ transform: 'rotate(180deg)' }}
            icon={
              <WIcon
                active={isDefault}
                icon={
                  <RatioonethirdO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="Vpf8adChaT"
                    data-uc-ct="ratioonethirdo"
                  />
                }
                data-uc-id="JiB9oKoFbX"
                data-uc-ct="wicon"
              />
            }
            type="text"
            size="small"
            data-uc-id="TWEjrxFegB"
            data-uc-ct="button"
          ></Button>
          <Button
            onClick={() => {
              onWidthChange('50%')
              postPointBuriedWithAxios(entWebAxiosInstance, '922610370037', {
                format: '50%',
              })
              setIsDefault(false)
            }}
            style={{ transform: 'rotate(180deg)' }}
            icon={
              <WIcon
                active={!isDefault}
                icon={
                  <RatiohalfO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="l_aZC0bACk"
                    data-uc-ct="ratiohalfo"
                  />
                }
                data-uc-id="CbFeWqRyhX1"
                data-uc-ct="wicon"
              />
            }
            type="text"
            size="small"
            data-uc-id="rCWwLs334J"
            data-uc-ct="button"
          ></Button>
          <Button
            onClick={() => {
              postPointBuriedWithAxios(entWebAxiosInstance, '922610370036')
              onShowRight(false)
            }}
            style={{ justifySelf: 'flex-start' }}
            icon={
              <CloseO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="81bgjpGPLd"
                data-uc-ct="closeo"
              />
            }
            type="text"
            size="small"
            data-uc-id="fJ6_9sI1A4"
            data-uc-ct="button"
          ></Button>
        </div>
      </div>
      {shouldLoadChat ? (
        <Suspense fallback={<div className={styles[`${PREFIX}-right-loading`]}></div>}>
          <ChatMessageBaseLazy entityType={entityType} entityName={entityName} />
        </Suspense>
      ) : (
        <div className={styles[`${PREFIX}-right-loading`]}>{/* <Spin /> */}</div>
      )}
    </div>
  )
}
/**
 * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
 * 将 gap 属性替换为 margin
 */
const gapCompatTransformer = getGapCompatTransformer()
const isLegacyBrowser = needsBrowserCompat()
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
