import { wftCommon } from '@/utils/utils'

/**
 * 翻译图谱数据
 * @param data 图谱数据
 * @returns 翻译后的图谱数据
 */
export const translateGraphData = async (data: any) => {
  try {
    const [nodeList, relations] = await Promise.all([
      new Promise((resolve, reject) => {
        wftCommon.zh2en(
          data?.nodeInfo?.list,
          (endata) => resolve(endata),
          null,
          () => reject(new Error('Failed to translate node info'))
        )
      }),
      new Promise((resolve, reject) => {
        wftCommon.zh2en(
          data?.relations,
          (endata) => resolve(endata),
          null,
          () => reject(new Error('Failed to translate relations'))
        )
      }),
    ])

    return {
      ...data,
      nodeInfo: {
        ...data?.nodeInfo,
        list: nodeList,
      },
      relations,
    }
  } catch (error) {
    console.error('Translation failed:', error)
    console.warn('Translation data:', data)
    return data // 翻译失败时返回原始数据
  }
}

export const translateData = async (data: any) => {
  try {
    const [translatedData] = await Promise.all([
      new Promise((resolve, reject) => {
        wftCommon.zh2en(
          data,
          (endata) => resolve(endata),
          null,
          () => reject(new Error('Failed to translate node info'))
        )
      }),
    ])

    return translatedData
  } catch (error) {
    console.error('Translation failed:', error)
    console.warn('Translation data:', data)
    return data // 翻译失败时返回原始数据
  }
}

export const translateRelateGraphData = async (data: any) => {
  try {
    const [children, collection] = await Promise.all([
      new Promise((resolve, reject) => {
        wftCommon.zh2en(
          data?.children,
          (endata) => resolve(endata),
          null,
          () => reject(new Error('Failed to translate node info'))
        )
      }),
      new Promise((resolve, reject) => {
        wftCommon.zh2en(
          data?.collection,
          (endata) => resolve(endata),
          null,
          () => reject(new Error('Failed to translate relations'))
        )
      }),
    ])

    return {
      ...data,
      children,
      collection,
    }
  } catch (error) {
    console.error('Translation failed:', error)
    console.warn('Translation data:', data)
    return data // 翻译失败时返回原始数据
  }
}
