import { getLanBackend } from '@/utils'
import { AxiosInstance } from 'axios'
import { AgentIdentifiers, ChatClientType, QueryReferencePayload, requestToChatWithAxios } from 'gel-api'

export type DataRetrievalOptions = {
  params: Pick<
    QueryReferencePayload['body'],
    'rawSentence' | 'rawSentenceID' | 'searchword' | 'chatId' | 'it' | 'agentParam' | 'fileIds' | 'refFileIds'
  > &
    AgentIdentifiers
  signal?: AbortSignal
  clientType?: ChatClientType
  splVersion?: number
}
/**
 * 数据召回
 * @param params 查询参数
 * @param signal 中止信号
 * @returns 查询结果与相关数据
 */
export const handleDataRetrieval = async (axiosInstance: AxiosInstance, options: DataRetrievalOptions) => {
  const { params, signal, clientType, splVersion } = options
  try {
    if (!params.rawSentenceID) {
      throw new Error('缺少必要参数')
    }

    return await requestToChatWithAxios(
      axiosInstance,
      'chat/queryReference',
      {
        body: {
          ...params,
          callGLMType: '3',
          aigcStreamFlag: '1',
          transLang: getLanBackend(),
          version: 1,
          clientType,
          splVersion,
        },
        lang: getLanBackend(),
        source: 3,
      },
      {
        signal: signal,
      }
    )
  } catch (error) {
    console.error('数据召回失败:', error)
    throw error
  }
}
