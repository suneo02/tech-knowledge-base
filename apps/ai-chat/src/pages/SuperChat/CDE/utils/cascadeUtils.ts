import { convertTreeToOptions, globalAreaTreeCn, industryOfNationalEconomyCfgFour, industryTree } from 'gel-util/config'

export interface TreeOption {
  value: string | number
  label: string
  children?: TreeOption[]
}

export const getIndustryTreeByField = (itemField: string | undefined): TreeOption[] => {
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

export const flattenTree = (nodes: TreeOption[]): Omit<TreeOption, 'children'>[] => {
  const flattened: Omit<TreeOption, 'children'>[] = []
  const stack: TreeOption[] = [...nodes]

  while (stack.length > 0) {
    const node = stack.pop()
    if (!node) continue

    const { children, ...rest } = node
    flattened.push(rest)

    if (children) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
  return flattened
}
