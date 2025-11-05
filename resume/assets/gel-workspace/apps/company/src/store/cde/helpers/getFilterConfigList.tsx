// 获取筛选项配置
// import * as actionTypes from '@/actions/actionTypes.ts'
import { getFilterItem } from '@/api/configApi.ts'
import global from '@/lib/global.ts'

import { globalAreaTreeCn } from '@/utils/areaTree'
import { industryTree } from '@/utils/config'
import { globalIndustryOfNationalEconomy4 } from '@/utils/industryOfNationalEconomyTree'

export const getFilterConfigList = async (set, get) => {
  const { codeMap } = get()
  const res = await getFilterItem()

  const tree = {
    89: globalAreaTreeCn,
    90: globalIndustryOfNationalEconomy4,
    229: industryTree.WindIndustryTree,
    213: industryTree.StrategicEmergingIndustryTree,
    222: industryTree.HighTechManufacturingIndustryTree,
    223: industryTree.HighTechServiceIndustryTree,
    224: industryTree.IntellectualIndustryTree,
    225: industryTree.GreenIndustryTree,
    226: industryTree.AgricultureRelatedIndustryTree,
    227: industryTree.AgingCareIndustryTree,
    228: industryTree.DigitalIndustryTree,
    141: industryTree.RimeTrackIndustryTree,
  }
  if (res.code === global.SUCCESS) {
    const flattenIndustryNodes = (nodes, targetMap) => {
      if (!Array.isArray(nodes) || nodes.length === 0) {
        return
      }
      nodes.forEach((node) => {
        if (node) targetMap[node.code] = node.name
        if (node && Array.isArray(node.node) && node.node.length > 0) {
          flattenIndustryNodes(node.node, targetMap)
        }
      })
    }

    Object.keys(tree).forEach((key) => {
      const itemMap = {}
      if (Array.isArray(tree[key])) {
        flattenIndustryNodes(tree[key], itemMap)
      }
      codeMap[key] = itemMap
    })
    console.log('🚀 ~ getFilterConfigList ~ codeMap after industryTree processing:', codeMap)
    set({
      filterConfigList: res.data,
      // filterConfigList: res.data,
    })
  }
}
