import { getWsid } from '@/utils/env'
import { usedInClient } from '@/utils/env/misc'
import axios from 'axios'

interface TranslateParams {
  transText: string
  targetLang?: string
}

interface TranslateResponse {
  code: number
  response?: {
    content: string
  }
}

/**
 * 通过 Alice 大模型翻译至英文，每次只能翻译一个字符串，好处是智能识别源语言，如日语、韩语等
 * @param data 翻译参数
 * @returns Promise<AxiosResponse<TranslateResponse>>
 */
export const translateByAlice = async (data: TranslateParams) => {
  const baseUrl = `/SmartReaderChatService/api/doc/v2/translate`

  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(!usedInClient() && {
        'wind.sessionid': getWsid(),
      }),
    },
  })

  return instance.post<TranslateResponse>(baseUrl, data)
}
