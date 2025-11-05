import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Spin } from '@wind/wind-ui'
import { useMenuContext } from '@/components/layout/SideMenuLayout/context'
// import { MenuParams } from '@/components/layout/SideMenuLayout/types'
import useIframeCommunication from '@/hook/iframe'
import { handleIframeMessage, IframeMessageProps } from '@/utils/iframe/index'
import { LinksModule } from '@/handle/link'
import { hashParams } from '@/utils/links'

const PREFIX = 'side-menu-layout'

interface IframeComponentProps {
  baseUrl: string
  // params?: MenuParams
  style?: React.CSSProperties
  className?: string
  iframeProps?: any
  id?: string
  module?: LinksModule
  messageOnChange: (res: IframeMessageProps) => void
}

const IframeComponent: React.FC<IframeComponentProps> = ({
  module,
  baseUrl,
  // params = {},
  style,
  className,
  iframeProps,
  id,
  messageOnChange,
}) => {
  const { menuCache, activeItem } = useMenuContext()
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const iframeRef = useRef(null)
  const { messages, sendMessage } = useIframeCommunication(iframeRef)
  const { getAllParams } = hashParams()
  const url = useMemo(() => {
    const _url = new URL(baseUrl)
    new URLSearchParams(getAllParams()).forEach((value, key) => {
      _url.searchParams.set(key, value)
    })
    return _url.toString()
  }, [baseUrl])

  useEffect(() => {
    console.log('🚀 ~ menuCache:', menuCache)
    if (!id || activeItem?.key === id)
      sendMessage({
        module,
        action: 'update',
        payload: {
          ...menuCache?.[activeItem.key]?.params,
        },
      })
  }, [id, activeItem, menuCache])

  useEffect(() => {
    console.log('收到的iframe消息', messages)
    // 收到的消息
    if (messages?.module === module && (!id || activeItem?.key === id)) {
      if (messageOnChange) {
        messageOnChange?.({ module, ...messages })
        return
      }
      handleIframeMessage(messages)
    }
  }, [messages])

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <iframe
        {...iframeProps}
        style={style}
        className={className}
        src={url}
        onLoad={() => {
          setIframeStatus('success')
        }}
        onError={() => {
          setIframeStatus('error')
        }}
        ref={iframeRef}
      />
      {iframeStatus === 'loading' && (
        <div className={`${PREFIX}-loading`}>
          <Spin />
        </div>
      )}
      {iframeStatus === 'error' && <div className={`${PREFIX}-error`}>加载失败</div>}
    </div>
  )
}

export default IframeComponent
