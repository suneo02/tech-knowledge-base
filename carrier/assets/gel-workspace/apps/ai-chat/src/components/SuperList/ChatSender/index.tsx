import { t } from '@/locales/i18n'
import { postPointBuried } from '@/utils/common/bury'
import { DeepThinkO } from '@wind/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import { ChatActions } from 'ai-ui'
import cn from 'classnames'
import { ChatThinkSignal } from 'gel-api'
import { FC, useEffect, useState } from 'react'
import styles from './index.module.less'

interface Props {
  loading?: boolean
  onCancel?: () => void
  sendMessage: (message: string, options?: { think?: ChatThinkSignal['think']; deepSearch?: boolean }) => void
  className?: string
  deepSearch?: boolean
  onDeepSearchChange?: (active: boolean) => void
  focus?: boolean
}
const STRINGS: { PLACEHOLDER: string; DEEP_SEARCH: string; DEEP_ON_TIP: string } = {
  PLACEHOLDER: t('464200', '试试输入一句话，找到目标企业名单'),
  DEEP_SEARCH: t('424256', '深度思考(R1)'),
  DEEP_ON_TIP: t('455045', '深度思考模式不可更改'),
}

const PREFIX = 'deep-search-btn'

export const DeepSearchBtn = ({
  initialValue,
  // onChange,
}: {
  initialValue: boolean
  onChange: (active: boolean) => void
}) => {
  const [active, setActive] = useState<boolean>()
  useEffect(() => {
    setActive(initialValue)
  }, [initialValue])
  const handleClick = () => {
    // setActive(!active)
    // onChange(!active)
    // 给一句话找企业直接写死true
  }
  return (
    <Tooltip title={STRINGS.DEEP_ON_TIP} placement="right">
      <Button
        style={{ borderRadius: 4 }}
        onClick={handleClick}
        className={cn(styles[`${PREFIX}`], { [styles[`${PREFIX}-active`]]: active })}
        size="large"
        // @ts-expect-error wui-icon
        icon={<DeepThinkO />}
      >
        {STRINGS.DEEP_SEARCH}
      </Button>
    </Tooltip>
  )
}

const DEFAULT_MAX_LENGTH = 500
export const SuperListChatSender: FC<Props> = ({
  loading,
  onCancel,
  sendMessage,
  className,
  deepSearch = true,
  onDeepSearchChange,
  focus = false,
}) => {
  const [content, setContent] = useState('')
  const [innerDeepSearch, setInnerDeepSearch] = useState<boolean>(deepSearch ?? true)

  const isControlled = typeof deepSearch === 'boolean' && typeof onDeepSearchChange === 'function'
  const currentDeepSearch = isControlled ? (deepSearch as boolean) : innerDeepSearch
  const handleDeepSearchChange = isControlled ? (onDeepSearchChange as (active: boolean) => void) : setInnerDeepSearch

  const handleContentChange = (next: string) => {
    if (next.length > DEFAULT_MAX_LENGTH) return
    setContent(next)
  }

  useEffect(() => {
    if (typeof deepSearch === 'boolean' && !isControlled) setInnerDeepSearch(deepSearch)
  }, [deepSearch, isControlled])

  return (
    <ChatActions
      isLoading={loading || false}
      content={content}
      handleContentChange={handleContentChange}
      className={className}
      sendMessage={(message) => {
        postPointBuried('922604570279', { click: content })
        return sendMessage(message, { deepSearch: currentDeepSearch })
      }}
      placeholder={STRINGS.PLACEHOLDER}
      onCancel={onCancel || (() => {})}
      renderLeftActions={() => {
        // 给一句话找企业直接写死true
        return <DeepSearchBtn initialValue={true} onChange={handleDeepSearchChange} />
      }}
      focus={focus}
      maxLength={DEFAULT_MAX_LENGTH}
    />
  )
}
