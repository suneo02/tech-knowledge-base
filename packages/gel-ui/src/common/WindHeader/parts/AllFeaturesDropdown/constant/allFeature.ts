import comprehensiveSearch from './comprehensiveSearch.json'
import specificData from './specificData.json'
import tools from './tools.json'
import kg from './kg.json'
import investmentFinancing from './investmentFinancing.json'
import marketingAcquisition from './marketingAcquisition.json'

import allFeatureMenu from './allFeatureMenu.json'
import type { GenerateUrlInput } from 'gel-util/link'

export const allFeatureMenuList = allFeatureMenu

export type VIPType = 'vip' | 'svip'

export interface AllFeatureItem {
  id: string
  title: string
  titleIntl: string
  url?: GenerateUrlInput
  disabled?: boolean
  iconKey?: string
  permissions?: VIPType[]
  // /** 默认都展示，这里可以配置不在web端、终端、海外显示 */
  // visibility?: {
  //   web?: boolean // 是否不在web端显示
  //   terminal?: boolean // 是否不在终端显示
  //   overseas?: boolean // 是否不在海外显示
  // }
  hideInWeb?: boolean // 是否不在web端显示
  hideInTerminal?: boolean // 是否不在终端显示
  hideInOverseas?: boolean // 是否不在海外显示
  new?: boolean
  hot?: boolean
  moduleId: string
  isDev?: boolean // 是否在开发环境显示
}

export const allFeatureList: AllFeatureItem[] = [
  ...comprehensiveSearch, // 综合查询
  ...specificData, // 专项数据
  ...kg, // 图谱平台
  ...investmentFinancing, // 投资融资
  ...marketingAcquisition, // 营销获取
  ...tools, // 便捷工具
] as AllFeatureItem[]

export const allFeatureListWithMenu = allFeatureMenuList.map((menuItem) => {
  return {
    ...menuItem,
    children: allFeatureList.filter((item) => item.moduleId === menuItem.id),
  }
})
