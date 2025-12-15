import React from 'react'

export interface ISearchOptionItem {
  label: React.ReactNode
  labelId?: string | number
  value: string | number
  count?: number
  key: string

  [key: string]: any
}

export type ISearchCustomId =
  // 招投标产品词
  | 'bidProductWord'
  // 招投标本公司筛选框
  | 'bidCompanySelf'
  | string

export interface ISearchOptionCfg {
  /**
   * @author suneo
   * 如果是 2024-11 之后模块 可能有这个字段，用于表格中数据和聚合分离
   */
  api?: string

  type?: 'cascader' | 'select' | 'search' | string
  key: string
  mode?: 'multiple' | 'new' | string
  customId?: ISearchCustomId

  default?: string
  defaultId?: string
  placeholder?: string
  placeholderId?: string

  options?: ISearchOptionItem[]
  aggsKey?: string
  aggsParams?: {
    label: string
    value: string
    count: string
  }

  [key: string]: any
}
