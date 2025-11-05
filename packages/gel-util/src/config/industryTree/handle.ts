import { industryOfNationalEconomyCfg } from './industryTree'
import { IndustryTreeNode } from './type'
import digitalIndustryTree from './digital.json'

// 将oldcode转换成新code，并保留n级
export const translateIndustryCode = (arr: IndustryTreeNode[], level = 3): IndustryTreeNode[] => {
  if (!arr?.length) return []
  return arr.map((i) => {
    let obj = {
      ...i,
      code: i.oldCode || i.code,
    }
    if (i.node) {
      obj.node = i.level === level ? undefined : translateIndustryCode(i.node, level)
    }
    return obj
  })
} // 国民经济行业3级树 老code

export const industryOfNationalEconomyCfgTwo = translateIndustryCode(industryOfNationalEconomyCfg, 2)

export const industryOfNationalEconomyCfgThree = translateIndustryCode(industryOfNationalEconomyCfg) // 国民经济行业4级树 老code

export const industryOfNationalEconomyCfgFour = translateIndustryCode(industryOfNationalEconomyCfg, 4)

/**
 * @deprecated 这种方法非常不好，应该根据 配置获取path
 */
export const getIndustryCodeAncestors = (code: string) => {
  const codeArr = []

  if (code === '0000') {
    // 全部
    codeArr.push('0000')
  } else {
    code.length >= 4 && codeArr.push(code.substring(0, 4))
    code.length >= 6 && codeArr.push(code.substring(0, 6))
    code.length >= 8 && codeArr.push(code.substring(0, 8))
    code.length >= 10 && codeArr.push(code.substring(0, 10))
  }
  return codeArr
}

/**
 * 将json tree 转换成 antd options
 * @param arr
 * @returns
 */
export const convertIndustryTreeToOptions = (
  arr: IndustryTreeNode[]
): { label: string; value: string; children?: any[] }[] => {
  if (!arr?.length) return []
  return arr.map((i) => {
    const obj: { label: string; value: string; children?: any[] } = {
      label: i.name,
      value: i.code,
    }
    if (i.node?.length) {
      obj.children = convertIndustryTreeToOptions(i.node)
    }
    return obj
  })
}

export const digitalOptions = convertIndustryTreeToOptions(digitalIndustryTree as any[])
