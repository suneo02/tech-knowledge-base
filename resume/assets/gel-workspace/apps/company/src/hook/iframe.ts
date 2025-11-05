import { IframeMessageProps } from '@/utils/iframe/index'
import { useEffect, useState } from 'react'

const useIframeCommunication = (iframeRef: React.RefObject<any>) => {
  const [messages, setMessages] = useState<IframeMessageProps>()

  useEffect(() => {
    const handleMessage = (event) => {
      // 这里可以添加安全性检查，例如验证 event.origin
      setMessages(event.data)
    }

    window.addEventListener('message', handleMessage)

    // 清理事件监听器
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const sendMessage = (message) => {
    if (iframeRef?.current) {
      iframeRef.current.contentWindow.postMessage(message, '*') // '*' 可以替换为特定的源
    } else {
      window.parent.postMessage(message, '*')
    }
  }

  return { messages, sendMessage }
}

export default useIframeCommunication
