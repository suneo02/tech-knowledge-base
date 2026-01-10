import { translateToEnglish } from '@/utils/intl'
import { BidItem } from 'gel-types'
import { isEn } from 'gel-util/intl'

/**
 * 处理招投标数据翻译
 * @param data 原始招投标数据列表
 * @returns 翻译后的数据列表
 */
export async function handleBidTranslate(data: BidItem[]): Promise<BidItem[]> {
  try {
    // 清理 highlight 字段
    data.forEach((item) => {
      delete item.highlight
    })

    if (!isEn()) {
      return data
    }

    const enDataRes = await translateToEnglish(data, {
      skipFields: [
        'purchasing_unit',
        'bidWinner',
        'purchasingUnit',
        'participating_unit',
        'bidWinnerList',
        'bid_winner',
        'biddingStage',
        'bidding_type_name',
      ],
    })

    const endata = enDataRes.data

    // 根据 detail_id 精确匹配，避免索引错位
    endata.forEach((translatedItem) => {
      const originalItem = data.find((item) => item.detail_id === translatedItem.detail_id)
      if (originalItem) {
        translatedItem.title_en = translatedItem.title || ''
        translatedItem.title_en = translatedItem.title_en.replace
          ? translatedItem.title_en.replace(/<em>|<\/em>/g, '')
          : translatedItem.title_en
        translatedItem.title = originalItem.title
      }
    })

    return endata
  } catch (error) {
    console.error('Bid translation error:', error)
    return data
  }
}
