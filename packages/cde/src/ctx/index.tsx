import { CDEFilterCategory, CDEMeasureItem } from 'gel-api'
import React from 'react'
import { CDEFilterCfgProvider } from './filterCfg'
import { MeasuresProvider } from './MeasuresContext'

export * from './filterCfg'
export * from './MeasuresContext'

interface CDEProviderProps {
  children: React.ReactNode
  measuresDefault: CDEMeasureItem[]
  filterCfgDefault?: CDEFilterCategory[]
}

/**
 * 提供 CDE 全量 上下文
 *
 * 这个provider 只有在 stories 中使用
 * @param props
 * @returns
 */
export const CDEProvider: React.FC<CDEProviderProps> = ({ children, measuresDefault, filterCfgDefault }) => {
  return (
    <CDEFilterCfgProvider filterCfgDefault={filterCfgDefault}>
      <MeasuresProvider measuresDefault={measuresDefault}>{children}</MeasuresProvider>
    </CDEFilterCfgProvider>
  )
}
