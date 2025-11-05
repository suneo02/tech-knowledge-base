import { getLanBackend, NEW_WORKFLOW } from '@/util'
import { AxiosInstance } from 'axios'
import { AgentIdentifiers, QueryReferenceRequest, requestToChatWithAxios } from 'gel-api'

/**
 * 数据召回
 * @param params 查询参数
 * @param signal 中止信号
 * @returns 查询结果与相关数据
 */
export const handleDataRetrieval = async (
  axiosInstance: AxiosInstance,
  params: Pick<QueryReferenceRequest['body'], 'rawSentence' | 'rawSentenceID' | 'searchword' | 'chatId' | 'it'> &
    AgentIdentifiers,
  signal?: AbortSignal,
  clientType?: 'superlist'
) => {
  try {
    if (!params.chatId || !params.rawSentenceID) {
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
          version: NEW_WORKFLOW ? 1 : 3,
          clientType,
        },
        lang: getLanBackend(),
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
