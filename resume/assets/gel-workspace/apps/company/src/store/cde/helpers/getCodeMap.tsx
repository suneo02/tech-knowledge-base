import { globalAreaTreeCn } from '@/utils/areaTree.tsx'
import { globalIndustryOfNationalEconomy4 } from '@/utils/industryOfNationalEconomyTree.tsx'

export const getCodeMap = (filterConfig) => {
  const codeMap = {}
  const iteratorAreaAndIndusty = (nodes) => {
    nodes &&
      nodes.length &&
      nodes.forEach((node) => {
        codeMap[node.code] = node.name
        if (window.en_access_config) {
          if (node.nameEn) {
            codeMap[node.code] = node.nameEn
          }
        }
        if (node?.node) {
          iteratorAreaAndIndusty(node.node)
        }
      })
  }
  // iteratorAreaAndIndusty(filterConfig[1].categoryOption)
  // iteratorAreaAndIndusty(filterConfig[2].categoryOption)

  // 改读取前端配置
  iteratorAreaAndIndusty(globalAreaTreeCn)
  iteratorAreaAndIndusty(globalIndustryOfNationalEconomy4)

  if (filterConfig[3] && filterConfig[3].categoryOption) {
    iteratorAreaAndIndusty(filterConfig[3].categoryOption)
  }
  return codeMap
}
