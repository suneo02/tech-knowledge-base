import { translateComplexHtmlData } from '@/utils/intl'
import { isEn } from 'gel-util/intl'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { wftCommon } from '../../utils/utils'

/**
 *
 * @param {Array|Object|undefined} data
 * @param ifNeedTranslate 是否翻译
 * @param ifComplexHtml 是否是 html 标记翻译
 * @returns {[unknown,boolean,boolean]}
 */
export const useTranslateService = <T>(
  data: T,
  ifNeedTranslate = true,
  ifComplexHtml = false
): [T, boolean, boolean] => {
  const [dataTranslated, setDataTranslated] = useState(null)
  const [ifTranslated, setIfTranslated] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleDataChange = async () => {
    if (!isEn() || !ifNeedTranslate || !data) {
      return
    }

    const onTransSuccess = (endData) => {
      if (!endData) {
        console.error(`🚀 ~ translated data is null \t ${JSON.stringify(endData)}`)
      } else {
        setDataTranslated(endData)
        setIfTranslated(true)
      }
      setLoading(false)
    }
    try {
      setIfTranslated(false)
      setLoading(true)
      if (ifComplexHtml) {
        const endData = await translateComplexHtmlData(data)
        onTransSuccess(endData)
      } else if (Array.isArray(data)) {
        wftCommon.zh2en(cloneDeep(data), onTransSuccess, null, console.error)
      } else {
        wftCommon.translateService(cloneDeep(data), onTransSuccess)
      }
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    handleDataChange()
  }, [data])

  const dataIntl = useMemo(() => {
    // 如果是中文访问 或者数据还没翻译好 或者不需要翻译
    if (!isEn() || !ifTranslated || !ifNeedTranslate) {
      return data
    } else {
      return dataTranslated
    }
  }, [data, dataTranslated, ifTranslated])

  return [dataIntl, ifTranslated, loading]
}
