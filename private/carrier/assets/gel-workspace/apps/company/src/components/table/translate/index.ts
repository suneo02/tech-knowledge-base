import { ICfgDetailTableJson } from '@/types/configDetail/table'
import { translateToEnglish } from '@/utils/intl'
import { zh2enPromise } from '@/utils/intl/zh2enFlattened'
import { isEn } from 'gel-util/intl'

export async function handleTranslateCfgDetailTable<T extends any[]>(
  tableData: T,
  cfg: ICfgDetailTableJson
): Promise<T> {
  try {
    if (isEn()) {
      if (cfg.skipTransFieldsInKeyMode) {
        return await translateToEnglish(tableData, {
          skipFields: cfg.skipTransFieldsInKeyMode,
        }).then((res) => res.data)
      } else {
        const endData = await zh2enPromise(tableData)

        if (!endData) {
          console.error(`translated data is null \t ${JSON.stringify(endData)}`)
        }
        if (!Array.isArray(endData)) {
          console.error(`translated table data is not an array \t ${JSON.stringify(endData)}`)
        } else {
          return endData as T
        }
      }
    }
    return tableData
  } catch (error) {
    console.error(error)
    return tableData
  }
}
