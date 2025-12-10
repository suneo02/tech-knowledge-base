import { useState, useCallback, useRef, useEffect } from 'react'
import axios from '@/api'
import { message as Message } from '@wind/wind-ui'
import md5 from 'js-md5'
import { t } from 'gel-util/intl'

// 定义类型
interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  id: string
  data?: string[]
  error?: boolean
  extraInfo?: string
}

const mockAli = [
  {
    code: 0,
    msg: '查询成功',
    data: {
      queryId: 'fed170ca-c389-480c-a25f-305a22e34da0',
      success: 0,
      info: ['正在识别您的问题中涉及到的实体数据'],
      data: [],
    },
    errorPaths: null,
    systemTime: 1743579529013,
    traceId: '',
    cost: 0,
  },
  {
    code: 0,
    msg: '查询成功',
    data: {
      queryId: 'fed170ca-c389-480c-a25f-305a22e34da0',
      success: 0,
      info: ['正在识别您的问题中涉及到的实体数据', '正在识别您的问题中涉及到的分类数据'],
      data: [],
    },
    errorPaths: null,
    systemTime: 1743579547921,
    traceId: '',
    cost: 0,
  },
  {
    code: 0,
    msg: '查询成功',
    data: {
      queryId: 'fed170ca-c389-480c-a25f-305a22e34da0',
      success: 1,
      info: ['正在识别您的问题中涉及到的实体数据', '正在识别您的问题中涉及到的分类数据', '正在为您检索数据库'],
      data: [
        {
          注册资本: 10.0,
          企业编码: '1047934153',
        },
      ],
    },
    errorPaths: null,
    systemTime: 1743579547921,
    traceId: '',
    cost: 0,
  },
]

const mockApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = Math.floor(Math.random() * mockAli.length)
      resolve(mockAli[index])
    }, 1000)
  })
}

export const useChatMessages = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInterrupted, setIsInterrupted] = useState(false)
  const [data, setData] = useState([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isInterruptedRef = useRef(false)

  useEffect(() => {
    isInterruptedRef.current = isInterrupted
  }, [isInterrupted])

  // 获取请求id
  const getQueryId = (question: string, queryId?: string, isInterrupted?: boolean) => {
    // return mockApi()
    // return fetch('http://10.100.4.159:8899/agent/query', {
    //   //TODO
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     msg: question,
    //     model: 2,
    //     queryId: queryId,
    //     interrupt: isInterrupted ? 1 : 0,
    //   }),
    // }).then((res) => {
    //   return res.json()
    // })
    return axios
      .request({
        url: '/wind.ent.chat/api/cdeAgent/query/' + queryId,
        method: 'POST',
        formType: 'payload',
        data: {
          msg: question,
          model: 2,
          queryId: queryId,
          productId: 'CDE',
          interrupt: isInterrupted ? 1 : 0,
        },
      })
      .then((res) => {
        if (res?.Data?.code == 0) {
          return res.Data
        }
      })
  }

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // 获取响应
  const getResponse = useCallback(async (question: string, queryId: string) => {
    let response: any
    do {
      response = await getQueryId(question, queryId, isInterruptedRef.current)
      const { data } = response
      let info = data.info || [] // 使用逻辑或运算符
      // 更新最新的AI消息
      setChatMessages((prevMessages) => {
        const otherMessages = prevMessages.filter((msg) => msg.id !== queryId)
        return [
          ...otherMessages,
          {
            role: 'ai',
            content: info.length > 0 ? info[info.length - 1] : '',
            id: queryId,
            extraInfo: data.extraInfo,
          },
        ]
      })
      // 如果成功，返回结果
      if (data.success === 1) {
        return response
      }
      // 等待一秒后继续请求
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } while (!isInterruptedRef.current)
  }, [])

  // 发送消息
  const sendMessage = useCallback(
    async (question: string) => {
      const userMessage: ChatMessage = {
        role: 'user',
        content: question,
        id: Date.now().toString(),
      }
      setChatMessages((prevMessages) => {
        return [...prevMessages, userMessage]
      })
      setIsLoading(true)
      setData([])
      let queryId = md5(question + new Date().getTime())
      getResponse(question, queryId)
        .then((res: any) => {
          const { data } = res
          if (data.success === 1) {
            const { data: list = [], info } = data
            let sqlDesc = info
              .filter((item) => item.includes('desc'))
              .map((item) => item.split('desc:')[1]?.trim())
              .filter(Boolean)
              .join('')
            if (list && list.length > 0) {
              sqlDesc = sqlDesc
                ? sqlDesc
                : t('455041', '根据您的需求，已为您查询出结果，如有其他需求，随时告诉我们哦！')
              const dataTemp: any = [
                ...new Set(
                  list
                    .filter((item) => item['e_info_code'] || item['企业编码'])
                    .map((item) => item['e_info_code'] || item['企业编码'])
                ),
              ]
              setChatMessages((prevMessages) => {
                const otherMessages = prevMessages.filter((msg) => msg.id !== queryId)
                return [
                  ...otherMessages,
                  {
                    role: 'ai',
                    content: sqlDesc,
                    data: dataTemp,
                    id: queryId,
                    extraInfo: data.extraInfo,
                  },
                ]
              })
              // dataTemp
              setData(dataTemp)
            } else {
              setChatMessages((prevMessages) => {
                const otherMessages = prevMessages.filter((msg) => msg.id !== queryId)
                return [
                  ...otherMessages,
                  {
                    role: 'ai',
                    content: sqlDesc
                      ? sqlDesc
                      : t(
                          '455057',
                          '抱歉，根据你的需求未查找到相关企业信息。请尝试使用不同的关键词或者提供更准确的企业名称进行查询。'
                        ),
                    data: [],
                    id: queryId,
                  },
                ]
              })
            }
          }
        })
        .catch((e) => {
          setIsLoading(false)
          if (!isInterruptedRef.current) {
            setChatMessages((prevMessages) => {
              const otherMessages = prevMessages.filter((msg) => msg.id !== queryId)
              return [
                ...otherMessages,
                {
                  role: 'ai',
                  content: t('455042', '抱歉，系统发生错误，请重试'),
                  error: true,
                  id: queryId,
                },
              ]
            })
          }
        })
        .finally(() => {
          setIsInterrupted(false)
          setIsLoading(false)
        })
    },
    [getResponse]
  )

  // 清空对话
  const handleClearChat = useCallback(() => {
    setChatMessages([])
  }, [])

  // 提交表单
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (isLoading) return
      if (!inputValue.trim()) return
      sendMessage(inputValue)
      setInputValue('')
    },
    [inputValue, sendMessage, isLoading]
  )

  // 复制消息内容
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => Message.success(t('421466', '已复制')))
      .catch(() => Message.error(t('455058', '复制失败')))
  }, [])

  // 重新提问
  const handleRetry = useCallback(
    (messageId: string) => {
      const userIndex = chatMessages.findIndex((m) => m.id === messageId) - 1
      if (userIndex >= 0) {
        sendMessage(chatMessages[userIndex].content)
      }
    },
    [chatMessages, sendMessage]
  )

  const stopAnswer = (queryId) => {
    setIsInterrupted(true)
    setIsLoading(false)
    getQueryId('', queryId, true)
    setChatMessages((prevMessages) => {
      const otherMessages = prevMessages.filter((msg) => msg.id !== queryId)
      return [
        ...otherMessages,
        {
          role: 'ai',
          content: t('455059', '已停止回答。如有需要，请随时重新提问'),
          id: queryId,
        },
      ]
    })
  }

  return {
    data,
    chatMessages,
    inputValue,
    isLoading,
    messagesEndRef,
    stopAnswer,
    setInputValue,
    scrollToBottom,
    sendMessage,
    handleClearChat,
    handleSubmit,
    setIsInterrupted,
    handleCopyMessage,
    handleRetry,
  }
}
