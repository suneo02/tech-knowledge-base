import { getWsid } from '@/utils/env'

export const postStreamRequest = async (url: string, data: any, processEventCb: any, abortSignal?: AbortSignal) => {
  const sessionid = getWsid()

  // 使用fetch处理SSE
  const headers = new Headers({
    Accept: 'text/event-stream',
    'Content-Type': 'application/json',
    'wind.sessionid': sessionid,
    // userId: '6535663',
  })

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    signal: abortSignal,
  })
    .then((response) => {
      // 确保响应是成功的
      if (response.status !== 200) {
        throw new Error('Connection failed')
      }

      // 创建一个读取器来读取流
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      function read() {
        reader
          .read()
          .then(({ value, done }) => {
            // 解码并处理数据
            const text = decoder.decode(value, { stream: true })
            // 这里你应该有一个解析SSE事件的函数
            processEventCb(text)
            if (done) {
              // 流结束
              return
            }
            // 继续读取
            read()
          })
          .catch((error) => {
            console.error('Error reading stream:', error)
          })
      }

      read()
    })
    .catch((error) => {
      // 注意：终止请求会抛出一个名为AbortError的DOMException
      if (error.name === 'AbortError') {
        console.log('Fetch请求已被终止')
        processEventCb('ABORT')
        return
      }
      console.error('Fetch error:', error)
    })
}

export function parseSSEEvent(rawString) {
  const lines = rawString.split('\n')
  const result = { event: '', data: {} }

  for (const line of lines) {
    if (line.startsWith('event:')) {
      result.event = line.replace('event:', '').trim()
    } else if (line.startsWith('data:')) {
      const dataStr = line.replace('data:', '').trim()
      try {
        result.data = JSON.parse(dataStr)
      } catch (e) {
        // 尝试修复常见的格式问题
        try {
          const fixedStr = dataStr
          // .replaceAll(/\\n|\\t/g, '')
          // .replaceAll(/\n|\t/g, '')
          // .replaceAll(/\\/g, '')
          result.data = JSON.parse(fixedStr)
        } catch {
          // 依然失败，保留原始字符串
          result.data = { raw: dataStr }
        }
      }
    }
  }

  return result
}
