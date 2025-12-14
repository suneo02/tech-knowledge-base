import aiServices from '@/config/ai-services.json'

export const createChatRequest = (messages: ChatRequest['messages'], service: LLMService): LLMServiceMessage => ({
  role: messages[messages.length - 1].role,
  content: messages[messages.length - 1].content || '',
  ...(service.params || {}),
})

export const getAIServiceConfig = (serviceName: (typeof aiServices)[number]['name']) => {
  const service = aiServices.find((service) => service.name === serviceName)!

  const baseURL = import.meta.env.DEV
    ? `/${new URL(service.baseUrl).hostname}` // 只使用主机名作为代理路径
    : service.baseUrl // 使用简单的代理路径

  return {
    baseURL: `${baseURL}/v1/chat/completions`,
    model: service.model,
    dangerouslyApiKey: service.apiKey,
    createRequest: (messages: ChatRequest['messages']) => createChatRequest(messages, service),
  }
}

// 使用示例:
// const config = getAIServiceConfig('silicon')
// const [agent] = useXAgent(config)
//
// agent.request(
//   config.createRequest([{ role: 'user', content: 'Hello' }]),
//   { onSuccess, onError, onUpdate }
// )
