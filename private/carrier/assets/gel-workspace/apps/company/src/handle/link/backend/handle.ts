import { isNil } from 'lodash'
import { EBackendModuleMap } from './config.ts'
import { LinksModule } from '@/handle/link'

/**
 * 根据后端的整个对象 及 id 来得到该id 的类型
 * @param row
 * @param nameKey name 字段的 key
 * @param typeKey
 */
export const parseApiFieldModule = (
  row: Record<string, any>,
  nameKey: string,
  typeKey?: string
): LinksModule | undefined => {
  try {
    if (isNil(row) || isNil(nameKey)) {
      return null
    }
    let typeKeyParsed = typeKey
    if (isNil(typeKey)) {
      // 如果没有给 type key
      typeKeyParsed = `${nameKey}Type`
    }
    if (typeKeyParsed in row) {
      return EBackendModuleMap[row[typeKeyParsed]]
    } else {
      return null
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
