import { useFlattenReportConfig } from '@/hooks/flattenReportConfig'
import { useReportConfigByHiddenNodes } from '@/hooks/reportConfigByHiddenNodes'
import { ReportDetailNodeOrNodesJson, ReportDetailSectionJson } from 'gel-types'
import { isEn } from 'gel-util/intl'
import React, { createContext, FC, useContext } from 'react'
import { FlattenedReportConfig } from 'report-util/corpConfigJson'
import { propagateHiddenToChildren } from 'report-util/tree'
import { NodeDataStoreReturn, useNodeDataStore } from '../components/RPPreview/PreviewReportContent/helper'
import { useRPPreviewCtx } from './RPPreview'

type PreviewReportContentCtxType = {
  normalizedHiddenNodes: string[]
  nodeDataStore: Record<string, any>
  nodeDataOverallStore: Record<string, any>
  flattenedReportConfig: FlattenedReportConfig
} & NodeDataStoreReturn

export const PreviewReportContentCtx = createContext<PreviewReportContentCtxType>({
  normalizedHiddenNodes: [],
  flattenedReportConfig: {
    renderOrder: [],
    sectionConfigStore: {},
    tableConfigsStore: {},
    customNodeConfigStore: {},
    rawHtmlNodeConfigStore: {},
  },
  nodeDataStore: {},
  updateData: () => {},
  nodeDataOverallStore: {},
})

export const PreviewReportContentCtxProvider: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { reportConfig, hiddenNodeIds, apiTranslate } = useRPPreviewCtx()

  const reportConfigFiltered = useReportConfigByHiddenNodes(reportConfig, hiddenNodeIds || [])

  const flattenedReportConfig = useFlattenReportConfig(reportConfigFiltered)

  const normalizedHiddenNodes = propagateHiddenToChildren<ReportDetailSectionJson | ReportDetailNodeOrNodesJson>(
    reportConfigFiltered,
    hiddenNodeIds || [],
    {
      getId: (node) => node.key,
      getChildren: (node) => {
        if ('children' in node) {
          return node.children
        }
      },
    }
  )

  const nodeDataStoreReturn = useNodeDataStore(apiTranslate, isEn())

  return (
    <PreviewReportContentCtx.Provider
      value={{
        normalizedHiddenNodes,
        flattenedReportConfig,
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
