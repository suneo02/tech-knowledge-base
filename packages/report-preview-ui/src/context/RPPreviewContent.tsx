import { useProcessReportConfig } from '@/hooks/processReportConfig'
import { useReportConfigByHiddenNodes } from '@/hooks/reportConfigByHiddenNodes'
import { ReportDetailNodeJson, ReportDetailSectionJson, ReportDetailTableJson } from 'gel-types'
import { isEn } from 'gel-util/intl'
import React, { createContext, FC, useContext } from 'react'
import { ProcessedInitializationData } from 'report-util/corpConfigJson'
import { propagateHiddenToChildren } from 'report-util/tree'
import { NodeDataStoreReturn, useNodeDataStore } from '../components/RPPreview/PreviewReportContent/helper'
import { useRPPreviewCtx } from './RPPreview'

type PreviewReportContentCtxType = {
  normalizedHiddenNodes: string[]
  nodeDataStore: Record<string, any>
  nodeDataOverallStore: Record<string, any>
} & ProcessedInitializationData &
  NodeDataStoreReturn

export const PreviewReportContentCtx = createContext<PreviewReportContentCtxType>({
  normalizedHiddenNodes: [],
  renderOrder: [],
  sectionConfigStore: {},
  tableConfigsStore: {},
  customNodeConfigStore: {},
  nodeDataStore: {},
  updateData: () => {},
  nodeDataOverallStore: {},
})

export const PreviewReportContentCtxProvider: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { reportConfig, hiddenNodeIds, apiTranslate } = useRPPreviewCtx()

  const reportConfigFiltered = useReportConfigByHiddenNodes(reportConfig, hiddenNodeIds || [])

  const configProcessedRes = useProcessReportConfig(reportConfigFiltered)

  const normalizedHiddenNodes = propagateHiddenToChildren<
    ReportDetailSectionJson | ReportDetailNodeJson | ReportDetailTableJson
  >(reportConfigFiltered, hiddenNodeIds || [], {
    getId: (node) => node.key,
    getChildren: (node) => {
      if ('children' in node) {
        return node.children
      }
    },
  })

  const nodeDataStoreReturn = useNodeDataStore(apiTranslate, isEn())

  return (
    <PreviewReportContentCtx.Provider
      value={{
        normalizedHiddenNodes,
        ...configProcessedRes,
        ...nodeDataStoreReturn,
      }}
    >
      {children}
    </PreviewReportContentCtx.Provider>
  )
}

export const usePreviewReportContentCtx = () => {
  return useContext(PreviewReportContentCtx)
}
