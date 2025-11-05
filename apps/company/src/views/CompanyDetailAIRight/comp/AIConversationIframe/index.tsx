import { GELService, getGeneralPrefixUrl, getUrlByLinkModule, LinksModule } from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import React, { memo, useEffect, useRef } from 'react'

const origindev = 'http://10.100.244.21:3080'
const roomId = 'a803bd93-eb59-4c73-bd99-703885aab65b' // 调试用
// const origindev = 'http://10.100.244.64:3000/'
const origin = wftCommon.isDevDebugger() ? origindev : getGeneralPrefixUrl({ service: GELService.AI })

// AI对话iframe组件
export const AIConversationIframe = memo(({ entityName }: { entityName: string }) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    const handleMessage = (event) => {
      const blacklist = ['react-devtools-bridge', 'react-devtools-content-script']
      // 忽略来自React开发者工具的消息
      if (event.data && blacklist.includes(event.data.source)) {
        return
      }
      console.log('🚀 ~ handleMessage ~ event:', event)
      // 检查是否是聊天状态变化消息
      if (!event.data || !event.data.type) return

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
      } else if (event.data && event.data.type === 'LINK_CLICKED') {
        const { companyCode, href } = event.data || {}
        console.log('链接信息companyCode：', companyCode, 'href：', href)
        window.open(getUrlByLinkModule(LinksModule.COMPANY, { id: companyCode }))
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
})

AIConversationIframe.displayName = 'AIConversationIframe'
