import { requestToWFCSecureWithAxios } from 'gel-api'
import { isEn } from 'gel-util/intl'
import { translateComplexHtmlData } from 'report-util/url'
import { axiosInstance } from '../axios'

export function apiTranslate<T>(data: T): Promise<T | undefined> {
  if (!isEn() || !data) {
    return Promise.resolve(data)
  }

  return new Promise((resolve) => {
    translateComplexHtmlData(
      data,
      (params, apiCallback) => {
        requestToWFCSecureWithAxios(
          axiosInstance,
          {
            cmd: 'apitranslates',
            s: Math.random().toString(),
          },
          {
            transText: JSON.stringify(params),
            sourceLang: 1,
            targetLang: 2,
            source: 'gel',
          }
        )
          .then((res) => {
            if (res.Data && 'translateResult' in res.Data) {
              const translateResult = (res.Data as { translateResult: Record<string, string> }).translateResult
              apiCallback(translateResult)
            } else {
              apiCallback({})
            }
          })
          .catch(() => {
            apiCallback({})
          })
      },
      (result) => {
        resolve(result)
      }
    )
  })
}
