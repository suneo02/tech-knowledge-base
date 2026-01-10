import { GSTabsEnum } from '@/views/GlobalSearch/types'
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
