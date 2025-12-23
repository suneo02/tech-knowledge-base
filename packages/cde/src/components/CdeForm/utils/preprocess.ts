import { convertTreeToOptions, globalAreaTreeCn, industryOfNationalEconomyCfgFour, industryTree } from 'gel-util/config'
import { CDEFormConfigItem, FilterOption, ItemOptionItem } from '../types'
import { FilterType } from '../types/enum'

// --- 辅助函数 ---

/**
 * 检查选项数组是否存在嵌套的子选项。
 * @param options - 待检查的选项数组。
 * @returns 如果存在嵌套子选项则返回 true，否则返回 false。
 */
const hasNestedChildren = (options: any[]): boolean => {
  if (!options) return false
  return options.some((option) => option.itemOption && Array.isArray(option.itemOption) && option.itemOption.length > 0)
}

/**
 * 将后端返回的 itemOption 格式转换为前端 UI 组件可用的 FilterOption 格式。
 * @param itemOptions - 原始的选项数组。
 * @returns 转换后的选项数组。
 */
const transformOptions = (itemOptions: { name: string; value?: any }[]): FilterOption[] => {
  return itemOptions ? itemOptions.map((item) => ({ label: item.name, value: item.value as string })) : []
}

// --- 各种独立的预处理器函数 (策略) ---

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
} as const

/**
 * 根据 itemField 从 allIndustryTrees 中获取对应的产业树数据。
 * @param itemField - The field name to look up.
 * @returns The corresponding industry tree data.
 */
const getIndustryTreeByField = (itemField: string | undefined) => {
  switch (itemField) {
    case 'area_code': // 地区
      return convertTreeToOptions(globalAreaTreeCn)
    case 'industry_code': // 国民经济行业
      return convertTreeToOptions(industryOfNationalEconomyCfgFour)
    case 'strategicNewIndustry': // 战略性新兴产业
      return convertTreeToOptions(industryTree.StrategicEmergingIndustryTree)
    case 'highTechManufacturingIndustry': // 高技术产业（制造业）
      return convertTreeToOptions(industryTree.HighTechManufacturingIndustryTree)
    case 'highTechServiceIndustry': // 高技术产业（服务业）
      return convertTreeToOptions(industryTree.HighTechServiceIndustryTree)
    case 'intellectualPropertyIndustry': // 知识产权（专利）密集型产业
      return convertTreeToOptions(industryTree.IntellectualIndustryTree)
    case 'greenIndustry': // 绿色低碳转型产业
      return convertTreeToOptions(industryTree.GreenIndustryTree)
    case 'agricultureIndustry': // 农业及相关产业
      return convertTreeToOptions(industryTree.AgricultureRelatedIndustryTree)
    case 'agingCareIndustry': // 养老产业
      return convertTreeToOptions(industryTree.AgingCareIndustryTree)
    case 'digitalEconomyIndustry': // 数字经济及其核心产业
      return convertTreeToOptions(industryTree.DigitalIndustryTree)
    case 'industry_wind_code': // wind行业
      return convertTreeToOptions(industryTree.WindIndustryTree)
    case 'track_id': // 来觅赛道
      return convertTreeToOptions(industryTree.RimeTrackIndustryTree)
    default:
      return []
  }
}

const processConfidenceTagFilter = (item: CDEFormConfigItem): CDEFormConfigItem => {
  const composition: any[] = []

  // 动态添加置信度选择器
  if (item.extraOptions && (item.extraOptions as any[]).length > 0) {
    composition.push({
      componentKey: 'confidence',
      itemType: 'select',
      width: 130,
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

  return { ...item, composition }
}

/**
 * 处理复选框类型的筛选器 (itemType: '3')。
 * 根据配置动态决定渲染为树形、带数字范围或普通的复选框组。
 * @param item - 原始的筛选器配置。
 * @returns 经过预处理后的配置。
 */
const processCheckboxItems = (item: CDEFormConfigItem): CDEFormConfigItem => {
  const itemOptions = (item.itemOption as ItemOptionItem[]) || []

  if (hasNestedChildren(itemOptions)) {
    /**
     * 递归地将嵌套选项转换为树形结构。
     * @param options - 当前层级的选项。
     * @returns 树形结构的 FilterOption 数组。
     */
    const transformToTree = (options: ItemOptionItem[]): FilterOption[] => {
      return options.map((option) => {
        const hasChildren = option.itemOption && option.itemOption.length > 0
        return {
          label: option.name,
          value: (hasChildren ? option.name : option.value) as string,
          children: hasChildren ? transformToTree(option.itemOption!) : [],
        }
      })
    }
    return { ...item, itemType: 'treeCheckbox', options: transformToTree(itemOptions) }
  }

  if (item.logicOption === 'range') {
    return {
      ...item,
      itemType: 'checkboxGroupWithNumberRange',
      options: transformOptions(itemOptions),
      value: item.value,
    }
  }

  return {
    ...item,
    itemType: 'checkboxGroup',
    options: transformOptions(itemOptions),
  }
}

/**
 * 处理单选框类型的筛选器 (itemType: '4' 和 '5')。
 * 根据配置决定渲染为带日期范围或普通的单选框组。
 * @param item - 原始的筛选器配置。
 * @returns 经过预处理后的配置。
 */
const processRadioItems = (item: CDEFormConfigItem): CDEFormConfigItem => {
  const base = {
    ...item,
    options: transformOptions(item.itemOption || []),
  }

  if (item.logicOption === 'range') {
    return { ...base, itemType: 'radioWithDateRange' }
  }

  return { ...base, itemType: 'radioGroup' }
}

// --- 预处理器映射表 ---

/**
 * 存储后端 itemType 到对应预处理函数的映射关系。
 * 这是策略模式的核心，用于动态选择处理逻辑。
 */
const itemPreprocessors: Partial<Record<string, (item: CDEFormConfigItem) => CDEFormConfigItem>> = {
  /**
   * @itemType FilterType.CASCADER_WITH_CONFIDENCE ('0')
   * @description 处理级联选择器类型的筛选器，通常用于地区、行业等层级选择。
   *              会根据配置动态添加置信度选择器。
   */
  [FilterType.CASCADER_WITH_CONFIDENCE]: processConfidenceTagFilter,

  /**
   * @itemType FilterType.LOGICAL_KEYWORD ('1')
   * @description 处理逻辑关键词筛选器，组合了"包含/不包含"逻辑和标签输入。
   */
  [FilterType.LOGICAL_KEYWORD]: (item) => ({ ...item, composition: [...logicalKeywordFilterConfig.composition] }),

  /**
   * @itemType FilterType.TAGS_INPUT ('2')
   * @description 处理普通的标签输入筛选器，用于输入多个关键词。
   */
  [FilterType.TAGS_INPUT]: (item) => ({ ...item, itemType: 'tagsInput' }),

  /**
   * @itemType FilterType.CHECKBOX ('3')
   * @description 处理复选框类型的筛选器，会根据数据结构自动渲染为树形、带数字范围或普通复选框。
   */
  [FilterType.CHECKBOX]: processCheckboxItems,

  /**
   * @itemType FilterType.RADIO ('4')
   * @description 处理单选框类型的筛选器，会根据配置决定是否渲染为带日期范围的组件。
   */
  [FilterType.RADIO]: processRadioItems,

  /**
   * @itemType FilterType.RADIO_ALT ('5')
   * @description 与 '4' 类似，同样处理单选框类型的筛选器。
   */
  [FilterType.RADIO_ALT]: processRadioItems,

  /**
   * @itemType FilterType.NUMBER_RANGE ('6')
   * @description 处理数字范围输入筛选器。
   */
  [FilterType.NUMBER_RANGE]: (item) => ({ ...item, itemType: 'numberRange' }),

  /**
   * @itemType FilterType.SEARCH ('9')
   * @description 处理带搜索功能的普通输入框。
   */
  [FilterType.SEARCH]: (item) => ({ ...item, itemType: 'search' }),

  /**
   * @itemType FilterType.CASCADER_WITH_CONFIDENCE_ALT ('10')
   * @description 与 '0' 类似，处理带置信度的级联选择器。
   */
  [FilterType.CASCADER_WITH_CONFIDENCE_ALT]: processConfidenceTagFilter,

  /**
   * @itemType FilterType.LOGIC_WITH_SEARCHABLE_TAGS ('91')
   * @description 处理一种特殊的组合筛选器，带有"包含/不包含"逻辑和可搜索的标签列表。
   */
  [FilterType.LOGIC_WITH_SEARCHABLE_TAGS]: (item) => ({ ...item, itemType: 'logicWithSearchableTags' }),

  /**
   * @itemType FilterType.LOGICAL_KEYWORD_FILTER ('logicalKeywordFilter') (自定义类型)
   * @description 与 '1' 相同，作为备用key，处理逻辑关键词筛选器。
   */
  [FilterType.LOGICAL_KEYWORD_FILTER]: (item) => ({
    ...item,
    composition: [...logicalKeywordFilterConfig.composition],
  }),

  /**
   * @itemType FilterType.CONFIDENCE_TAG_FILTER ('confidenceTagFilter') (自定义类型)
   * @description 与 '0' 和 '10' 相同，作为备用key，处理带置信度的级联选择器。
   */
  [FilterType.CONFIDENCE_TAG_FILTER]: processConfidenceTagFilter,
}

// --- 主预处理函数 ---

/**
 * 根据筛选器配置的 itemType，动态选择并应用相应的预处理逻辑。
 * @param itemConfig - 从后端接收的原始筛选器配置。
 * @returns 经过预处理后，可以直接用于前端渲染的配置。
 */
export const preprocessFilterItem = (itemConfig: CDEFormConfigItem): CDEFormConfigItem => {
  const preprocessor = itemPreprocessors[itemConfig.itemType]
  if (preprocessor) {
    return preprocessor(itemConfig)
  }
  // 如果没有找到对应的预处理器，则返回原始配置
  return itemConfig
}
