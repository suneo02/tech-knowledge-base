import { CorpTag, CorpTagModule } from 'gel-api'
import { TagColors } from './type'

export const getPublicSentimentTagColorAndType = (
  emotion: string | undefined,
  level: number | undefined
): { color: TagColors } => {
  switch (emotion) {
    case '负面':
      switch (level) {
        case 3: {
          return {
            color: 'color-6',
          }
        }
        case 4: {
          return {
            color: 'color-2',
          }
        }
        case 5: {
          return {
            color: 'color-4',
          }
        }
      }
      break
    case '中性':
      return {
        color: 'color-9',
      }
    default:
  }
  return {
    color: 'color-3',
  }
}

/**
 * 根据标签模块来拆分标签
 * @param tags 标签列表
 * @returns 拆分后的标签列表 排序顺序为：CORP -> INDUSTRY -> LIST -> PRODUCTION
 */
export const splitTags2ArrByModule = (tags: CorpTag[]): CorpTag[][] => {
  const corpTagList: CorpTag[] = []
  const industryTagList: CorpTag[] = []
  const listTagList: CorpTag[] = []
  const productionTagList: CorpTag[] = []
  const riskTagList: CorpTag[] = []

  tags.forEach((item) => {
    if (item.module === 'CORP') {
      corpTagList.push(item)
    } else if (item.module === 'INDUSTRY') {
      industryTagList.push(item)
    } else if (item.module === 'LIST') {
      listTagList.push(item)
    } else if (item.module === 'PRODUCTION') {
      productionTagList.push(item)
    } else if (item.module === 'RISK') {
      riskTagList.push(item)
    } else {
      console.error('unknown tag module', item)
    }
  })
  return [corpTagList, industryTagList, listTagList, riskTagList, productionTagList]
}

/**
 * 根据模块拆分标签
 * @param tags 标签列表
 * @returns 拆分后的标签 map
 */
export function splitTags2MapByModule<T extends CorpTag>(tags: T[]): Record<CorpTagModule, T[]> {
  const corpTagList: T[] = []
  const industryTagList: T[] = []
  const listTagList: T[] = []
  const productionTagList: T[] = []
  const riskTagList: T[] = []

  tags.forEach((item) => {
    if (item.module === 'CORP') {
      corpTagList.push(item)
    } else if (item.module === 'INDUSTRY') {
      industryTagList.push(item)
    } else if (item.module === 'LIST') {
      listTagList.push(item)
    } else if (item.module === 'PRODUCTION') {
      productionTagList.push(item)
    } else if (item.module === 'RISK') {
      riskTagList.push(item)
    } else {
      console.error('unknown tag module', item)
    }
  })
  return {
    CORP: corpTagList,
    INDUSTRY: industryTagList,
    LIST: listTagList,
    PRODUCTION: productionTagList,
    RISK: riskTagList,
  }
}
