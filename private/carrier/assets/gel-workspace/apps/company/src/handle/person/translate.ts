import { translateToEnglish } from '@/utils/intl'
import type { PersonItem } from 'gel-types'
import { isEn } from 'gel-util/intl'

export async function handlePersonTranslate(data: PersonItem[]): Promise<PersonItem[]> {
  try {
    if (isEn()) {
      const endDataResult = await translateToEnglish(data, {
        skipFields: ['companyName'],
      })
      const endData = endDataResult.data
      // 根据 personId 精确匹配，避免索引错位
      endData.forEach((translatedItem) => {
        const originalItem = data.find((item) => item.personId === translatedItem.personId)
        if (originalItem) {
          translatedItem.personName_en = translatedItem.personName || ''
          translatedItem.personName_en = translatedItem.personName_en.replace
            ? translatedItem.personName_en.replace(/<em>|<\/em>/g, '')
            : translatedItem.personName_en
          translatedItem.personName = originalItem.personName
        }
      })
      return endData
    }
    return data
  } catch (error) {
    console.error(error)
    return data
  }
}
