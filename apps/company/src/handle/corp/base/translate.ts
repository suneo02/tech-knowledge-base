import { translateByAlice } from '@/api/translate'
import { ApiResponse } from '@/api/types.ts'
import { translateData, translateToEnglish } from '@/utils/intl'
import { CorpCardInfo } from 'gel-types'
import { isEn } from 'gel-util/intl'
import { detectChinese, detectEnglish } from 'gel-util/misc'
import { cloneDeep } from 'lodash'

const handeleCorpNameInZhCn = async (data: CorpCardInfo): Promise<CorpCardInfo> => {
  try {
    const originalName = data.corp_name
    let dataTrans: CorpCardInfo = cloneDeep(data)

    // 如果原始名称不存在，则直接返回
    if (!originalName) {
      return dataTrans
    }
    // 如果原始名称是中文，则不需要翻译，清除翻译字段
    if (detectChinese(originalName)) {
      dataTrans.corpNameTrans = undefined
      dataTrans.corpNameAITransFlag = undefined
      return dataTrans
    }
    // 如果后端提供了翻译名称，则直接使用
    if (data.corpNameTrans) {
      return dataTrans
    }

    // 如果后端翻译名称不存在，则进行 AI 翻译
    const res = (
      await translateData(originalName, {
        sourceLocale: 'en-US',
        targetLocale: 'zh-CN',
      })
    ).data
    dataTrans.corpNameTrans = res
    dataTrans.corpNameAITransFlag = true
    return dataTrans
  } catch (e) {
    console.error(e)
    return data
  }
}

const handleCorpNameInEn = async (data: CorpCardInfo): Promise<CorpCardInfo> => {
  try {
    let dataTrans: CorpCardInfo = {
      ...data,
    }
    if (!data.corp_name) {
      return dataTrans
    }
    // 如果是英文名，则不需要翻译，清除翻译字段
    if (detectEnglish(data.corp_name)) {
      dataTrans.corpNameTrans = undefined
      dataTrans.corpNameAITransFlag = undefined
      return dataTrans
    }
    // 如果后端提供了翻译名称，则直接使用
    if (data.corpNameTrans) {
      dataTrans.corpNameTrans = data.corpNameTrans
      return dataTrans
    }
    // 如果后端没有提供翻译，则进行 AI 翻译
    const { data: translateRes } = await translateByAlice({
      transText: data.corp_name,
    })
    if (translateRes?.code === 1000) {
      const translateContent = translateRes.response?.content
      dataTrans.corpNameTrans = translateContent
      dataTrans.corpNameAITransFlag = true
    }
    return dataTrans
  } catch (e) {
    console.error(e)
    return data
  }
}

export const translateCorpBaseInfo = async (data: CorpCardInfo): Promise<CorpCardInfo> => {
  try {
    if (isEn()) {
      let dataTrans = await handleCorpNameInEn(data)
      // 并行处理其他翻译
      return (
        await translateToEnglish(dataTrans, {
          skipFields: ['corp_name', 'eng_name', 'corpNameTrans', 'corpNameAITransFlag'],
        })
      ).data
    } else {
      return await handeleCorpNameInZhCn(data)
    }
  } catch (e) {
    console.error(e)
    return data
  }
}

export const translateCorpBaseInfoData = async (res: ApiResponse<CorpCardInfo>): Promise<ApiResponse<CorpCardInfo>> => {
  if (res.Data) {
    res.Data = await translateCorpBaseInfo(res.Data)
    res.data = res.Data
  }
  return res
}
