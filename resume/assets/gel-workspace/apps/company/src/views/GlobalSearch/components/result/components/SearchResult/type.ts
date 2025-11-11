import { GSTabsEnum } from '@/views/GlobalSearch/types'
import { CorpTag } from 'gel-api/*'
import React from 'react'

export enum OrgTypeEnum {
  HK = 'HK', // 香港公司
  IIP = 'IIP', // 个体工商户
  CO = 'CO', // 公司
  GOV = 'GOV', // 机关
  SOE = 'SOE', // 事业单位
  NGO = 'NGO', // 社会团体
  PE = 'PE', // 合伙企业
  FPC = 'FPC', // 农民专业合作社法人
  SPE = 'SPE', // 个人独资企业
  OE = 'OE', // 其他企业（内资非法人企业、内资非公司企业分支机构、内资分公司、外商投资企业分支机构、合伙企业分支机构、个人独资企业分支机构、外国<地区>企业在中国境内从事生产经营活动）
  FCP = 'FCP', // 农民专业合作社分支机构
  DEFAULT = '00', // 其他默认
}

/**
 * 搜索结果 item 的类型
 */
export interface SearchResultItem {
  /** 是否开启了ai翻译 */
  aiTransFlag?: boolean
  /** 中文地区 */
  areaCn?: string
  /** 法人名称 */
  artificialPersonName?: string
  /** 法人id */
  artificialPersonId?: string
  /** 法人类型 company或者person */
  artificialPersonType?: 'company' | 'person'
  /** 企业id */
  corpId: string
  /** 企业名称 */
  corpName: string
  /** 企业英文名称 */
  corpNameEng?: string
  /**
   * @deprecated 企业标签
   * 企业标签
   */
  corporationTags3?: string[]
  /** 企业标签 */
  tags: CorpTag[]
  /** 境内运营实体 */
  domesticEntity?: string
  /** 境内运营实体id  */
  domesticEntityId?: string
  /** 成立日期 */
  establishDate?: string
  /** 高亮信息 */
  highlight?: {
    label: string
    value: string
    isDisplayedInList: number // 0 不要展示， 1 要展示
  }[]
  /** 行业名称 */
  industryName?: string
  /** 是否收藏 */
  isCollect?: boolean
  /** 企业logo */
  logo?: string
  /** 机构类型 */
  orgType?: OrgTypeEnum
  /** 省份 */
  province?: string
  /** 注册地址 */
  registerAddress?: string
  /** 注册资本 */
  registerCapital?: string
  /** 注册资本单位 */
  capitalUnit?: string
  /** 状态 */
  statusAfter?: string
}

/**
 * BaseInfoItem 的 props
 */
export interface BaseInfoItemProps<T extends Record<string, any>> extends Omit<TextProps<T>, 'type'> {
  /** 子组件 */
  children?: React.ReactNode
  /** 额外的内容 */
  extraContent?: React.ReactNode
  /** label */
  label?: string
  /** TextProps 渲染类型 */
  renderType?: TextProps<T>['type']
  /** gstabs类型 */
  type?: GSTabsEnum
  /** 是否显示 */
  showCondition?: (item: T, type?: GSTabsEnum) => boolean
  /** 是否常显示 */
  show?: boolean
}

/**
 * TextProps
 */
export interface TextProps<T extends Record<string, any>> {
  /** 字段名 */
  field: keyof T
  /** links 跳转地址 */
  href?: string
  /** item */
  item: T
  /** 渲染类型 */
  type?: 'currency' | 'date' | 'links' | number
  /** 单位 */
  unit?: string
}
