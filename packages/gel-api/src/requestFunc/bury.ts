// 功能点埋点，集中发送请求

import { functionCodesMap, OptionsForCode } from '@/bury'
import { AxiosInstance } from 'axios'
import { requestToEntWebWithAxios } from './entWeb'

// 超过20条直接抛弃
export const postPointBuriedWithAxios = <T extends keyof typeof functionCodesMap>(
  axiosInstance: AxiosInstance,
  code: T,
  options: OptionsForCode<T> = {} as OptionsForCode<T>
) => {
  const data = { ...functionCodesMap[code], ...options }

  try {
    const params: { paramName: string; paramValue: unknown }[] = []
    if (data) {
      for (const k in data) {
        if (k !== 'functionCode') {
          params.push({
            paramName: k,
            paramValue: data[k],
          })
        }
      }
    }

    requestToEntWebWithAxios(axiosInstance, 'user-log/add', {
      userLogItems: [
        {
          action: code,
          params,
        },
      ],
    })
  } catch (e) {
    console.error(e)
  }
}
