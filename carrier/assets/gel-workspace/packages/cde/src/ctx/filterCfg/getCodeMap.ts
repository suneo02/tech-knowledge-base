import { CDEFilterCategory } from 'gel-api'
import { globalAreaTreeCn, industryOfNationalEconomyCfgFour } from 'gel-util/config'
import { getLocale } from 'gel-util/intl'

/**
 * 生成地区和行业代码到名称的映射
 * 该函数用于将地区和行业的代码转换为对应的名称，支持中英文切换
 * 数据来源包括：
 * 1. 前端配置的地区树 (globalAreaTreeCn)
 * 2. 前端配置的行业树 (globalIndustryOfNationalEconomy4)
 * 3. 后端配置的行业数据 (filterConfig[3].categoryOption)
 *
 * @param filterConfig - 后端返回的筛选配置数据
 * @returns Record<string, string> - 返回代码到名称的映射对象，key为代码，value为名称
 */
export const getCodeMapByBackend = (filterConfig: CDEFilterCategory[]): Record<string, string> => {
  // 初始化映射对象
  let codeMap: Record<string, string> = {}

  /**
   * 递归遍历树形结构，生成代码到名称的映射
   * @param nodes - 树形结构的节点数组
   */
  const iteratorAreaAndIndusty = (
    nodes?: {
      code: string // 地区/行业代码
      name: string // 中文名称
      nameEn?: string // 英文名称（可选）
      node?: {
        // 子节点（可选）
        code: string
        name: string
      }[]
    }[]
  ) => {
    // 如果节点数组存在且不为空，则遍历处理
    nodes &&
      nodes.length &&
      nodes.forEach((node) => {
        // 默认使用中文名称
        codeMap[node.code] = node.name

        // 如果是英文环境且有英文名称，则使用英文名称
        if (getLocale() === 'en-US') {
          if (node.nameEn) {
            codeMap[node.code] = node.nameEn
          }
        }

        // 如果存在子节点，递归处理
        if (node?.node) {
          iteratorAreaAndIndusty(node.node)
        }
      })
  }

  // 处理前端配置的地区树数据
  iteratorAreaAndIndusty(globalAreaTreeCn)

  // 处理前端配置的行业树数据
  iteratorAreaAndIndusty(industryOfNationalEconomyCfgFour)

  // 处理后端配置的行业数据（如果存在）
  if (filterConfig[3]?.categoryOption) {
    iteratorAreaAndIndusty(filterConfig[3].categoryOption)
  }

  return codeMap
}
