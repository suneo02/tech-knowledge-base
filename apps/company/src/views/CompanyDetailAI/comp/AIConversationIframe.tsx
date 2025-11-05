import React, { useEffect, useRef } from 'react'
import { wftCommon } from '@/utils/utils'
import { GELService } from '@/handle/link/handle/prefixUrl'
import { getGeneralPrefixUrl } from '@/handle/link/handle/prefixUrl'

const origin = wftCommon.isDevDebugger()
  ? 'http://10.100.244.68:3080/'
  : getGeneralPrefixUrl({ service: GELService.AI })

/**
 * 公司详情页AI对话iframe
 *
 * @param entityName
 * @returns
 */
export const AIConversationIframe = ({ entityName }: { entityName: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const blacklist = ['react-devtools-bridge', 'react-devtools-content-script']
      // 忽略来自React开发者工具的消息
      if (event.data && blacklist.includes(event.data.source)) {
        return
      }
      console.log('🚀 ~ handleMessage ~ event:', event)
      // 检查是否是聊天状态变化消息
      if (event.data && event.data.type === 'CHAT_STATUS_CHANGE') {
        const isChating = event.data.payload.isChating
        console.log('AI聊天状态:', isChating ? '回答中' : '空闲')

        // 验证消息来源是否是我们的iframe
        const chatIframe = iframeRef.current
        if (chatIframe && event.source === chatIframe.contentWindow) {
          // 根据状态变化更新UI
          if (isChating) {
            // AI开始回答
            console.log('AI开始回答问题')
          } else {
            // AI回答结束
            console.log('AI回答结束')
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src={`${origin}#/embed-chat?initialMsg=&entityType=company&entityName=${entityName}`}
      width="100%"
      height="100%"
      frameBorder="0"
    ></iframe>
  )
}
