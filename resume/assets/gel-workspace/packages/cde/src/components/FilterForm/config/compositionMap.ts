import {
  convertIndustryTreeToOptions,
  globalAreaTreeCn,
  industryOfNationalEconomyCfgFour,
  industryTree,
} from 'gel-util/config'
import { FilterConfigItem } from '../types'

const logicalKeywordFilterConfig = {
  composition: [
    {
      componentKey: 'logic',
      itemType: 'select',
      width: 120,
      // 这里可以定义默认的 props
      options: [
        { label: '不含', value: 'notAny' },
        { label: '含任一', value: 'any' },
        { label: '含所有', value: 'all' },
      ],
      defaultValue: 'any',
    },
    {
      componentKey: 'value',
      itemType: 'tagsInput', // 我们需要一个基础的标签输入组件
    },
  ],
}

/**
 * 根据 itemField 从 allIndustryTrees 中获取对应的产业树数据。
 * @param itemField - The field name to look up.
 * @returns The corresponding industry tree data.
 */
const getIndustryTreeByField = (itemField: string | undefined) => {
  switch (itemField) {
    case 'area_code': // 地区
      return convertIndustryTreeToOptions(globalAreaTreeCn)
    case 'industry_code': // 国民经济行业
      return convertIndustryTreeToOptions(industryOfNationalEconomyCfgFour)
    case 'strategicNewIndustry': // 战略性新兴产业
      return convertIndustryTreeToOptions(industryTree.StrategicEmergingIndustryTree)
    case 'highTechManufacturingIndustry': // 高技术产业（制造业）
      return convertIndustryTreeToOptions(industryTree.HighTechManufacturingIndustryTree)
    case 'highTechServiceIndustry': // 高技术产业（服务业）
      return convertIndustryTreeToOptions(industryTree.HighTechServiceIndustryTree)
    case 'intellectualPropertyIndustry': // 知识产权（专利）密集型产业
      return convertIndustryTreeToOptions(industryTree.IntellectualIndustryTree)
    case 'greenIndustry': // 绿色低碳转型产业
      return convertIndustryTreeToOptions(industryTree.GreenIndustryTree)
    case 'agricultureIndustry': // 农业及相关产业
      return convertIndustryTreeToOptions(industryTree.AgricultureRelatedIndustryTree)
    case 'agingCareIndustry': // 养老产业
      return convertIndustryTreeToOptions(industryTree.AgingCareIndustryTree)
    case 'digitalEconomyIndustry': // 数字经济及其核心产业
      return convertIndustryTreeToOptions(industryTree.DigitalIndustryTree)
    case 'industry_wind_code': // wind行业
      return convertIndustryTreeToOptions(industryTree.WindIndustryTree)
    case 'track_id': // 来觅赛道
      return convertIndustryTreeToOptions(industryTree.RimeTrackIndustryTree)
    default:
      return []
  }
}

/**
 * 根据筛选器配置项(item)动态生成其组合配置。
 * 这是一个 "配置工厂" 函数，替代了原先静态的 map。
 * @param item - 完整的筛选器配置项。
 * @returns 返回一个适用于该项的组合配置，如果不是组合组件则返回 undefined。
 */
export const getCompositionConfig = (item: FilterConfigItem): Partial<FilterConfigItem> | undefined => {
  switch (item.itemType) {
    case '1':
    case 'logicalKeywordFilter':
      // @ts-expect-error ttt
      return logicalKeywordFilterConfig
    case '0':
    case '10':
    case 'confidenceTagFilter': {
      const composition: any[] = []

      // 动态添加置信度选择器
      if (item.extraOptions && (item.extraOptions as any[]).length > 0) {
        composition.push({
          componentKey: 'confidence',
          itemType: 'select',
          width: 120,
          placeholder: '请选择置信度',
          options: item.extraOptions,
          defaultValue: item.confidence,
        })
      }
      if (item.itemField === 'area_code') {
        composition.push({
          open: true,
        })
      }

      // 动态构建级联选择器
      composition.push({
        componentKey: 'value',
        itemType: 'cascader',
        span: 24,
        options: getIndustryTreeByField(item.itemField as string), // 动态获取 options
        showSearch: true,
        multiple: true,
        maxTagCount: 'responsive',
        matchInputWidth: true,
        expandTrigger: 'hover',
      })

      return { composition }
    }

    default:
      return undefined
  }
}
