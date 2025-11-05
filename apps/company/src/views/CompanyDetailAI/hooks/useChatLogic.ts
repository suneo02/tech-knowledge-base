// @ts-nocheck
import { useState } from 'react'
import { request, WIND_CHAT_URL, requestStream } from '@/api/request'
import { getLang } from '@/utils/intl'

/**
 * 消息类型接口
 */
export interface Message {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: string
  loading?: boolean
}

/**
 * 聊天逻辑Hook的返回值类型
 */
interface UseChatLogicReturn {
  messages: Message[]
  inputValue: string
  isLoading: boolean
  setInputValue: (value: string) => void
  sendMessage: () => Promise<void>
}

// API响应类型声明
interface ApiResponse<T> {
  result: T
  code: number
  message: string
}

/**
 * 聊天业务逻辑Hook
 * @param entityName 实体名称（如公司名）
 * @param entityType 实体类型
 * @returns 消息列表、输入值、加载状态和相关方法
 */
export const useChatLogic = (
  entityName: string = '小米科技有限责任公司',
  entityType: string = 'company'
): UseChatLogicReturn => {
  const mockMessages: Message[] = [
    {
      id: '1',
      content:
        'Hi，我是您的商业查询助手！企业尽职调查、项目投资分析、穿透关联查询、跟踪行业趋势、研判竞争态势...这些我都在行，欢迎向我提问！',
      type: 'ai',
      timestamp: '2024-03-20 10:00:00',
    },
  ]

  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 发送消息并获取回复
   */
  const sendMessage = async () => {
    if (!inputValue.trim()) return

    // 设置 loading 状态为 true
    setIsLoading(true)

    // 添加用户消息
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date().toLocaleString(),
    }

    // 添加一个空的AI消息，用于实时更新，并添加 loading 状态
    const aiMessageId = (Date.now() + 1).toString()
    const newAiMessage: Message = {
      id: aiMessageId,
      content: '',
      type: 'ai',
      timestamp: new Date().toLocaleString(),
      loading: true, // 设置 loading 状态
    }

    setMessages([...messages, newUserMessage, newAiMessage])
    setInputValue('')

    // 使用固定的测试chatId，如果需要动态创建可以解除下面的注释
    // const res = await request('chat/addChatGroup', {
    //     serverUrl: WIND_CHAT_URL,
    //     noExtra: true,
    //     formType: 'payload',
    //     params: {
    //         rawSentence: inputValue
    //     }
    // })
    // console.log("🚀 ~ addChatGroup ~ res:", res)
    // const { result: {
    //     chatTitle,
    //     chatId
    // } } = res
    const chatId = '84e6b998-db0c-4b41-b6dd-b34f13a18c45'

    try {
      // 意图分析
      const analysisEngineRes = await request('chat/analysisEngine', {
        serverUrl: WIND_CHAT_URL,
        noExtra: true,
        formType: 'payload',
        noHashParams: true,
        params: {
          lang: getLang() === 'en' ? 'en' : 'CHS',
          body: {
            chatId,
            searchword: inputValue,
            agentId: '',
            think: 0, // 0: 不思考 1: 思考
            entityType,
            entityName,
            version: '3', // 添加缺少的version字段
          },
        },
      })

      const {
        result: {
          itResult: { it, rewrite_sentence },
          rawSentenceID,
        },
      } = analysisEngineRes
      console.log('🚀 ~ analysisEngine ~ res:', analysisEngineRes)

      // 数据召回
      const queryReferenceRes = await request('chat/queryReference', {
        serverUrl: WIND_CHAT_URL,
        noExtra: true,
        formType: 'payload',
        noHashParams: true,
        params: {
          lang: getLang() === 'en' ? 'en' : 'CHS',
          body: {
            aigcStreamFlag: '1',
            callGLMType: '3',
            version: 3,
            chatId,
            it,
            rawSentenceID,
            searchword: rewrite_sentence,
          },
        },
      })
      console.log('🚀 ~ queryReference ~ res:', queryReferenceRes)

      // 获取流式数据 - 使用新的流式请求函数
      await requestStream('chat/getResult', {
        serverUrl: WIND_CHAT_URL,
        noExtra: true,
        formType: 'payload',
        noHashParams: true,
        params: {
          rawSentence: rewrite_sentence,
          rawSentenceID,
          agentId: '',
          reAgentId: '',
          think: 0,
          version: 3,
        },
        // 处理流式数据块
        onStreamData: (chunk) => {
          console.log('🚀 ~ 接收到流式数据:', chunk)
          try {
            // 收到第一个数据块时，去除 loading 状态
            setIsLoading(false)

            // 处理 SSE 格式数据 (data: {...})
            const lines = chunk.split('\n').filter((line) => line.trim())

            for (const line of lines) {
              try {
                // 检查是否是 SSE 格式的数据行
                if (line.startsWith('data:')) {
                  // 提取 JSON 部分
                  const jsonStr = line.substring(5).trim()
                  if (!jsonStr) continue

                  const data = JSON.parse(jsonStr)

                  // 检查是否包含有效的内容
                  if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                    const content = data.choices[0].delta.content

                    if (content) {
                      // 更新 AI 消息内容，同时移除 loading 状态
                      setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages]
                        const aiMessageIndex = updatedMessages.findIndex((msg) => msg.id === aiMessageId)
                        if (aiMessageIndex !== -1) {
                          updatedMessages[aiMessageIndex] = {
                            ...updatedMessages[aiMessageIndex],
                            // 累加内容
                            content: updatedMessages[aiMessageIndex].content + content,
                            loading: false, // 收到内容时移除 loading 状态
                          }
                        }
                        return updatedMessages
                      })
                    }
                  }
                }
              } catch (err) {
                console.warn('解析数据行失败:', line, err)
              }
            }
          } catch (error) {
            console.error('处理流数据失败:', error)
            // 发生错误时也移除 loading 状态
            setIsLoading(false)
          }
        },
        // 处理错误
        onError: (error) => {
          console.error('流式请求错误:', error)
          // 可以在这里更新 AI 消息，显示错误状态
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages]
            const aiMessageIndex = updatedMessages.findIndex((msg) => msg.id === aiMessageId)
            if (aiMessageIndex !== -1) {
              updatedMessages[aiMessageIndex] = {
                ...updatedMessages[aiMessageIndex],
                content: updatedMessages[aiMessageIndex].content || '抱歉，获取回复时发生错误',
                loading: false, // 错误时移除 loading 状态
              }
            }
            return updatedMessages
          })
          // 发生错误时也移除 loading 状态
          setIsLoading(false)
        },
        // 流结束回调
        onComplete: () => {
          console.log('流式数据接收完成')
          // 流结束时确保移除 loading 状态
          setIsLoading(false)
          // 确保最后一条消息不显示 loading
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages]
            const aiMessageIndex = updatedMessages.findIndex((msg) => msg.id === aiMessageId)
            if (aiMessageIndex !== -1 && updatedMessages[aiMessageIndex].loading) {
              updatedMessages[aiMessageIndex] = {
                ...updatedMessages[aiMessageIndex],
                loading: false,
              }
            }
            return updatedMessages
          })
        },
      })
    } catch (error) {
      console.error('处理 getResult 流式数据时出错:', error)
      // 发生异常时也要移除 loading 状态
      setIsLoading(false)
    }
  }

  return {
    messages,
    inputValue,
    isLoading,
    setInputValue,
    sendMessage,
  }
}

export default useChatLogic
